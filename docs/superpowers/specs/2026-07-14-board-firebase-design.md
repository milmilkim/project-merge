# 머지영화제 게시판 (Firebase) 설계

- 날짜: 2026-07-14
- 대상 회차: 제6회 (Y2K 레트로 컴퓨팅 테마)
- 목표: 최소 기능 게시판을 Firebase로 구현. 코어(로직·데이터)는 회차 무관 공용, 디자인(UI)은 회차 위젯이 소유. 다음 회차에서 훅 재사용.

## 범위

포함:
- 게시판 3종: 자유 / 리뷰 / 공지
- 글: 목록 · 상세 · 작성 · 수정 · 삭제
- 댓글: 목록 · 작성 · 삭제
- 인증: Firebase Google 로그인 1종
- 권한: 공지 작성/수정/삭제는 관리자(Firestore `admins` 컬렉션에 등록된 계정)만
- CMS 없음 — 운영은 Firebase 콘솔에서 직접

제외 (YAGNI, 필요 시 후속):
- 별점, 좋아요, 페이지네이션(글 많아지면 `limit`+커서), 프로필 편집, 이미지 업로드(Storage)

## 아키텍처 (FSD)

코어는 커먼, 디자인은 6회 소유. 재사용 경계 = "데이터/로직 훅은 공용, UI는 회차 페이지가 소유".

```
shared/lib/firebase.ts          Firebase 초기화 (app·auth·db) 단일 출처
shared/config/board.ts          게시판 종류 상수 (BOARDS 등)

entities/post/model/types.ts    Post · Comment · BoardType 타입
entities/post/index.ts          공개 배럴

features/auth/model/useAuth.ts  구글 로그인/아웃, user, isAdmin
features/auth/index.ts

features/board/model/usePosts.ts        게시판별 목록 (실시간 onSnapshot)
features/board/model/usePost.ts         상세 1건
features/board/model/usePostMutations.ts 작성·수정·삭제
features/board/model/useComments.ts     댓글 목록·작성·삭제
features/board/index.ts

pages/6th/board/BoardPage.tsx   /6th/board 전체 페이지 (Y2K 테마)
pages/6th/board/ui/*            목록·상세·폼·댓글 Y2K UI 컴포넌트
```

다음 회차: `features/*`·`entities/*` 훅/타입 그대로 재사용, `pages/{n}th/board/ui`만 새 테마로 구현.

## 데이터 모델 (Firestore)

단일 `posts` 컬렉션 + `board` 필드로 게시판 구분. 댓글은 서브컬렉션.

```
posts/{postId}
  board:       'free' | 'review' | 'notice'
  title:       string
  content:     string
  authorUid:   string
  authorName:  string       // 작성 시점 displayName 스냅샷
  createdAt:   Timestamp    // serverTimestamp()
  updatedAt:   Timestamp | null

posts/{postId}/comments/{commentId}
  content:     string
  authorUid:   string
  authorName:  string
  createdAt:   Timestamp
```

- 목록 쿼리: `query(collection(db,'posts'), where('board','==',type), orderBy('createdAt','desc'))`
- 실시간: `onSnapshot`으로 구독 → 작성/삭제 후 수동 refetch 불필요. 언마운트 시 unsubscribe.
- 복합 인덱스(`board` + `createdAt`)가 필요하면 콘솔이 에러 링크를 주므로 클릭 한 번으로 생성.

## 인증 & 권한

- Firebase Auth, Google provider 1개, `signInWithPopup(auth, new GoogleAuthProvider())`.
- `useAuth()` 반환: `{ user, loading, isAdmin, signIn, signOut }`.
  - `onAuthStateChanged`로 세션 유지, 초기 `loading=true`.
  - `isAdmin`: 로그인 시 `getDoc(doc(db,'admins',user.uid))` 존재 여부로 판별. 이메일을 코드/설정 어디에도 두지 않는다.
- 관리자 목록은 Firestore `admins/{uid}` 문서로만 존재 → 저장소·환경변수에 개인정보 노출 없음. 관리자 추가는 콘솔에서 해당 uid로 빈 문서 하나 생성.

클라이언트 판별은 UX용일 뿐 — 실제 강제는 Firestore Rules에서 한다.

## 보안 규칙 (Firestore Rules)

콘솔 → Firestore → 규칙에 붙여넣기. 관리자는 `admins/{uid}` 문서 존재로 판별(이메일·custom claims 미사용, 최소 구성이면서 개인정보 노출 없음).

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() { return request.auth != null; }
    function isAdmin() {
      return signedIn() &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    function isOwner(uid) { return signedIn() && request.auth.uid == uid; }

    // 관리자 명단: 콘솔에서 관리자 uid로 빈 문서 생성. 본인 문서만 읽기 허용, 쓰기는 콘솔에서만.
    match /admins/{uid} {
      allow read: if signedIn() && request.auth.uid == uid;
      allow write: if false;
    }

    match /posts/{postId} {
      allow read: if true;

      allow create: if signedIn()
        && request.resource.data.authorUid == request.auth.uid
        && request.resource.data.board in ['free', 'review', 'notice']
        && (request.resource.data.board != 'notice' || isAdmin());

      allow update, delete: if isOwner(resource.data.authorUid) || isAdmin();

      match /comments/{commentId} {
        allow read: if true;
        allow create: if signedIn()
          && request.resource.data.authorUid == request.auth.uid;
        allow delete: if isOwner(resource.data.authorUid) || isAdmin();
        allow update: if false;  // 댓글 수정 없음
      }
    }
  }
}
```

- 공지 작성은 `isAdmin()`만 통과. 자유·리뷰는 로그인 유저 누구나.
- 수정·삭제는 본인 글 또는 관리자.
- 관리자 추가: 콘솔 Firestore에서 `admins` 컬렉션에 해당 uid를 문서 ID로 하는 빈 문서를 만들면 끝. 코드/규칙 수정 불필요.

## 6회 통합

- `AppRouter`에 `/6th/board` 라우트 추가 (`lazy`, 기존 회차 스플리팅 패턴 그대로).
- `pages/6th/config.ts`의 `desktopIcons`에 `게시판.exe` 항목 추가 → 기존 `action:'link'` 메커니즘 재사용, `href:'/6th/board'`. 새 `IconArt` 값 1개 추가('board').
- `BoardPage`는 `BlissBackground`(재사용) 위에 창 프레임 스타일로 렌더. 구성:
  - 상단: 탭(자유·리뷰·공지) + 우측 로그인/로그아웃, 로그인 시 글쓰기 버튼
  - 본문: 선택 게시판 목록 → 글 클릭 시 상세(모달 또는 라우트 파라미터 `?post=id`)
  - 상세: 본문 + 본인/관리자면 수정·삭제, 댓글 목록·입력
- 라우팅은 페이지 내부 상태 또는 쿼리스트링으로 목록/상세 전환(별도 중첩 라우트 최소화).

## 최소 UX / 에러 처리

- 비로그인: 읽기만. 글쓰기·댓글 시도 시 로그인 유도(버튼).
- 삭제: `confirm()` 확인.
- 로딩 상태(스피너/텍스트), 빈 목록 상태 표기.
- Firestore/Auth 에러는 사용자에게 짧은 메시지 노출(콘솔 로깅 병행).
- 실시간 onSnapshot이므로 낙관적 업데이트 불필요.

## 의존성 / 환경

- 추가 패키지: `firebase` 1개.
- `.env`(Vite `VITE_` 접두사)에 config 키. `firebase.ts`에서 `import.meta.env`로 로드.
- `.gitignore`에 `.env` 확인(키 커밋 금지).

## Firebase 콘솔 세팅 가이드 (구현 시 유저가 수행)

1. https://console.firebase.google.com → 프로젝트 생성
2. Authentication → Sign-in method → Google 사용 설정 (지원 이메일 선택)
3. Firestore Database → 데이터베이스 만들기 → 프로덕션 모드
4. 위 보안 규칙 붙여넣기 → 게시
5. 프로젝트 설정 → 웹 앱 추가(</>) → config 객체 복사 → `.env`에 기입
6. Authentication → Settings → 승인된 도메인에 배포 도메인(vercel) 추가
7. 목록 진입 시 인덱스 에러 링크가 뜨면 클릭해서 복합 인덱스 생성
8. 관리자 지정: 로컬에서 한 번 구글 로그인 → Authentication 탭에서 본인 사용자 UID 복사 → Firestore에 `admins` 컬렉션 만들고 그 UID를 문서 ID로 하는 빈 문서 생성

## 테스트 / 검증

- 헤드리스 훅은 순수 Firestore 호출이라 통합 성격 → 로컬 dev에서 수동 E2E:
  - 로그인 → 자유글 작성 → 목록 갱신 확인 → 수정 → 댓글 → 삭제
  - 비관리자로 공지 작성 시도 → rules 거부 확인 (콘솔에서 admins 문서 삭제 후 재시도)
  - 비로그인으로 읽기 확인
- 순수 로직 최소 점검: `board` 값 유효성/폼 입력 검증 등 순수 함수 부분을 assert로 자체 점검(Firestore 호출부는 수동 E2E로 커버).
