# 머지영화제 게시판 (Firebase) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 제6회(Y2K 테마) 머지영화제에 자유·리뷰·공지 3종 게시판을 Firebase로 붙인다. 로직/데이터 훅은 회차 무관 공용, UI만 6회가 소유.

**Architecture:** Firebase Auth(구글 로그인) + Firestore(단일 `posts` 컬렉션 + `comments` 서브컬렉션). 데이터 계층은 `features/auth`·`features/board` 훅으로 headless하게 공용화하고, 6회 Y2K UI는 `pages/6th/board`가 그 훅을 조립해 소유한다. 관리자는 Firestore `admins/{uid}` 문서 존재로 판별(이메일 비노출).

**Tech Stack:** React 19, Vite 8, TypeScript 6, react-router-dom v6, firebase v11, Tailwind(FSD 레이어 구조), framer-motion(기존 XpWindow 재사용).

**검증 방식:** 이 repo는 test runner가 없다. 각 태스크는 (1) `npm run build`(tsc 타입체크) (2) `npm run lint` 통과로 게이트하고, 최종 Task 7에서 브라우저 preview E2E로 실제 동작을 확인한다. Firestore 호출은 순수 단위 테스트 대상이 아니므로 테스트 인프라를 새로 도입하지 않는다(YAGNI). 설계 스펙: `docs/superpowers/specs/2026-07-14-board-firebase-design.md`.

---

## File Structure

생성:
- `src/shared/lib/firebase.ts` — Firebase app/auth/db 초기화 단일 출처
- `.env.example` — 필요한 env 키 목록(값 비움)
- `src/entities/post/model/types.ts` — `BoardType`, `Post`, `Comment`
- `src/entities/post/index.ts` — 배럴
- `src/shared/config/board.ts` — `BOARDS` 상수, `isBoardType`
- `src/features/auth/model/useAuth.ts` — 구글 로그인/아웃 + isAdmin
- `src/features/auth/index.ts` — 배럴
- `src/features/board/model/toPost.ts` — Firestore 스냅샷 → `Post` 변환
- `src/features/board/model/usePosts.ts` — 게시판별 목록(실시간)
- `src/features/board/model/usePost.ts` — 상세 1건(실시간)
- `src/features/board/model/postMutations.ts` — create/update/delete
- `src/features/board/model/useComments.ts` — 댓글 목록 + add/delete
- `src/features/board/index.ts` — 배럴
- `src/pages/6th/board/ui/AuthBar.tsx` — 로그인/유저 표시
- `src/pages/6th/board/ui/BoardList.tsx` — 목록 + 글쓰기 버튼
- `src/pages/6th/board/ui/PostForm.tsx` — 작성/수정 폼
- `src/pages/6th/board/ui/PostView.tsx` — 상세 + 댓글
- `src/pages/6th/board/BoardPage.tsx` — 전체 페이지 조립

수정:
- `src/vite-env.d.ts` — env 타입 선언
- `src/app/routers/AppRouter.tsx` — `/6th/board` 라우트 추가
- `src/pages/6th/config.ts` — `IconArt`에 `'board'` 추가, `desktopIcons`에 게시판 아이콘
- `src/pages/6th/ui/DesktopIcon.tsx` — `'board'` 아트 글리프

---

## Task 1: Firebase 초기화 + 환경변수

**Files:**
- Create: `src/shared/lib/firebase.ts`
- Create: `.env.example`
- Modify: `src/vite-env.d.ts`

- [ ] **Step 1: firebase 패키지 설치**

```bash
npm install firebase
```

Expected: `package.json` dependencies에 `firebase` 추가.

- [ ] **Step 2: `.gitignore`에 `.env`가 있는지 확인 (없으면 추가)**

```bash
grep -q "^\.env$" .gitignore || printf "\n.env\n" >> .gitignore
grep -n "env" .gitignore
```

Expected: `.env`가 무시 목록에 있음. (`.env.example`은 커밋 대상이므로 무시하면 안 됨 — `.env`만 정확히 매칭)

- [ ] **Step 3: env 타입 선언**

`src/vite-env.d.ts` 전체를 다음으로 교체:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 4: Firebase 초기화 모듈**

`src/shared/lib/firebase.ts`:

```ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/** Firebase 초기화 단일 출처. 키는 .env(VITE_ 접두사)에서 주입. */
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
```

- [ ] **Step 5: env 예시 파일**

`.env.example`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 6: 타입체크**

Run: `npm run build`
Expected: PASS (BoardPage 등 미구현이지만 이 파일들만으론 타입 에러 없음). 만약 미사용 export 경고가 lint에서 뜨면 다음 태스크에서 소비되므로 무시.

- [ ] **Step 7: 커밋**

```bash
git add src/shared/lib/firebase.ts src/vite-env.d.ts .env.example .gitignore package.json package-lock.json
git commit -m "feat(board): Firebase 초기화 및 환경변수 설정"
```

---

## Task 2: 도메인 타입 + 게시판 상수

**Files:**
- Create: `src/entities/post/model/types.ts`
- Create: `src/entities/post/index.ts`
- Create: `src/shared/config/board.ts`

- [ ] **Step 1: Post/Comment 타입**

`src/entities/post/model/types.ts`:

```ts
export type BoardType = 'free' | 'review' | 'notice';

export interface Post {
  id: string;
  board: BoardType;
  title: string;
  content: string;
  authorUid: string;
  authorName: string;
  /** epoch millis. serverTimestamp 반영 전(pending) 스냅샷에서는 null. */
  createdAt: number | null;
  updatedAt: number | null;
}

export interface Comment {
  id: string;
  content: string;
  authorUid: string;
  authorName: string;
  createdAt: number | null;
}
```

- [ ] **Step 2: entities 배럴**

`src/entities/post/index.ts`:

```ts
export type { BoardType, Post, Comment } from './model/types';
```

- [ ] **Step 3: 게시판 상수 (기존 shared/config/editions.ts 패턴 따름 — shared/config가 entities 타입을 import하는 것은 이 repo 기존 관행)**

`src/shared/config/board.ts`:

```ts
import type { BoardType } from '@/entities/post';

/** 게시판 종류 단일 출처. 탭 렌더 순서도 이 배열을 따른다. */
export const BOARDS: ReadonlyArray<{ type: BoardType; label: string }> = [
  { type: 'free', label: '자유게시판' },
  { type: 'review', label: '리뷰게시판' },
  { type: 'notice', label: '공지게시판' },
];

const BOARD_TYPES = BOARDS.map((b) => b.type);

export function isBoardType(v: string): v is BoardType {
  return (BOARD_TYPES as string[]).includes(v);
}
```

- [ ] **Step 4: 타입체크**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/entities/post src/shared/config/board.ts
git commit -m "feat(board): Post/Comment 타입과 게시판 상수 정의"
```

---

## Task 3: 인증 훅 (구글 로그인 + isAdmin)

**Files:**
- Create: `src/features/auth/model/useAuth.ts`
- Create: `src/features/auth/index.ts`

- [ ] **Step 1: useAuth 훅**

`src/features/auth/model/useAuth.ts`:

```ts
import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * 구글 로그인 세션 + 관리자 여부.
 * isAdmin은 admins/{uid} 문서 존재로 판별(이메일 비노출). 실제 권한 강제는 Firestore Rules.
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, 'admins', u.uid));
          setIsAdmin(snap.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  const signIn = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };
  const signOut = async () => {
    await fbSignOut(auth);
  };

  return { user, loading, isAdmin, signIn, signOut };
}
```

- [ ] **Step 2: 배럴**

`src/features/auth/index.ts`:

```ts
export { useAuth } from './model/useAuth';
export type { AuthState } from './model/useAuth';
```

- [ ] **Step 3: 타입체크**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: 커밋**

```bash
git add src/features/auth
git commit -m "feat(auth): 구글 로그인 및 관리자 판별 useAuth 훅"
```

---

## Task 4: 게시판 데이터 훅 (목록·상세·mutation·댓글)

**Files:**
- Create: `src/features/board/model/toPost.ts`
- Create: `src/features/board/model/usePosts.ts`
- Create: `src/features/board/model/usePost.ts`
- Create: `src/features/board/model/postMutations.ts`
- Create: `src/features/board/model/useComments.ts`
- Create: `src/features/board/index.ts`

- [ ] **Step 1: 스냅샷 → Post 변환 헬퍼**

`src/features/board/model/toPost.ts`:

```ts
import type { DocumentSnapshot } from 'firebase/firestore';
import type { Post } from '@/entities/post';

/** Firestore 문서 스냅샷을 앱 도메인 Post로 변환. Timestamp는 millis로. */
export function toPost(d: DocumentSnapshot): Post {
  const data = d.data() ?? {};
  return {
    id: d.id,
    board: data.board,
    title: data.title ?? '',
    content: data.content ?? '',
    authorUid: data.authorUid ?? '',
    authorName: data.authorName ?? '익명',
    createdAt: data.createdAt?.toMillis?.() ?? null,
    updatedAt: data.updatedAt?.toMillis?.() ?? null,
  };
}
```

- [ ] **Step 2: 목록 훅(실시간)**

`src/features/board/model/usePosts.ts`:

```ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { BoardType, Post } from '@/entities/post';
import { toPost } from './toPost';

/** 게시판별 글 목록. onSnapshot 실시간 구독 → 작성/삭제 후 수동 refetch 불필요. */
export function usePosts(board: BoardType) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const q = query(
      collection(db, 'posts'),
      where('board', '==', board),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map(toPost));
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
  }, [board]);

  return { posts, loading, error };
}
```

- [ ] **Step 3: 상세 훅(실시간)**

`src/features/board/model/usePost.ts`:

```ts
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/lib/firebase';
import type { Post } from '@/entities/post';
import { toPost } from './toPost';

/** 글 1건 실시간 구독. id가 null이면 구독하지 않는다. */
export function usePost(id: string | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    return onSnapshot(doc(db, 'posts', id), (snap) => {
      setPost(snap.exists() ? toPost(snap) : null);
      setLoading(false);
    });
  }, [id]);

  return { post, loading };
}
```

- [ ] **Step 4: 글 mutation (create/update/delete)**

`src/features/board/model/postMutations.ts`:

```ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';
import type { BoardType } from '@/entities/post';

/** 새 글 작성. 생성된 문서의 id를 반환. 로그인 필수(rules에서도 강제). */
export async function createPost(input: {
  board: BoardType;
  title: string;
  content: string;
}): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  const ref = await addDoc(collection(db, 'posts'), {
    board: input.board,
    title: input.title.trim(),
    content: input.content.trim(),
    authorUid: u.uid,
    authorName: u.displayName ?? '익명',
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
  return ref.id;
}

export function updatePost(id: string, patch: { title: string; content: string }) {
  return updateDoc(doc(db, 'posts', id), {
    title: patch.title.trim(),
    content: patch.content.trim(),
    updatedAt: serverTimestamp(),
  });
}

export function deletePost(id: string) {
  return deleteDoc(doc(db, 'posts', id));
}
```

- [ ] **Step 5: 댓글 훅 + mutation**

`src/features/board/model/useComments.ts`:

```ts
import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/shared/lib/firebase';
import type { Comment } from '@/entities/post';

/** 특정 글의 댓글 목록(오래된 순, 실시간). postId가 null이면 빈 배열. */
export function useComments(postId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      return;
    }
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc'),
    );
    return onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            content: data.content ?? '',
            authorUid: data.authorUid ?? '',
            authorName: data.authorName ?? '익명',
            createdAt: data.createdAt?.toMillis?.() ?? null,
          };
        }),
      );
    });
  }, [postId]);

  return comments;
}

export function addComment(postId: string, content: string) {
  const u = auth.currentUser;
  if (!u) throw new Error('로그인이 필요합니다.');
  return addDoc(collection(db, 'posts', postId, 'comments'), {
    content: content.trim(),
    authorUid: u.uid,
    authorName: u.displayName ?? '익명',
    createdAt: serverTimestamp(),
  });
}

export function deleteComment(postId: string, commentId: string) {
  return deleteDoc(doc(db, 'posts', postId, 'comments', commentId));
}
```

- [ ] **Step 6: 배럴**

`src/features/board/index.ts`:

```ts
export { usePosts } from './model/usePosts';
export { usePost } from './model/usePost';
export { createPost, updatePost, deletePost } from './model/postMutations';
export { useComments, addComment, deleteComment } from './model/useComments';
```

- [ ] **Step 7: 타입체크**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 8: 커밋**

```bash
git add src/features/board
git commit -m "feat(board): 목록·상세·댓글·mutation 데이터 훅"
```

---

## Task 5: 6회 게시판 UI 컴포넌트 (Y2K 테마)

기존 ed6 토큰(`bg-ed6-silver`, `text-ed6-lunaBlue`, `border-ed6-silverBorder`, `font-galmuri11`, `font-galmuri14`) 재사용.

**Files:**
- Create: `src/pages/6th/board/ui/AuthBar.tsx`
- Create: `src/pages/6th/board/ui/BoardList.tsx`
- Create: `src/pages/6th/board/ui/PostForm.tsx`
- Create: `src/pages/6th/board/ui/PostView.tsx`

- [ ] **Step 1: 로그인/유저 바**

`src/pages/6th/board/ui/AuthBar.tsx`:

```tsx
import type { AuthState } from '@/features/auth';

/** 상단 우측 로그인 상태 표시. Y2K 버튼 톤. */
export const AuthBar = ({ auth }: { auth: AuthState }) => {
  if (auth.loading) {
    return <div className='text-right font-galmuri11 text-[11px] text-[#666]'>연결 중…</div>;
  }
  return (
    <div className='flex items-center justify-end gap-2 font-galmuri11 text-[11px]'>
      {auth.user ? (
        <>
          <span className='text-ed6-text'>
            {auth.user.displayName ?? '사용자'}
            {auth.isAdmin && <b className='ml-1 text-ed6-lunaBlue'>[관리자]</b>}
          </span>
          <button onClick={() => auth.signOut()} className={btn}>로그아웃</button>
        </>
      ) : (
        <button onClick={() => auth.signIn()} className={btn}>구글 로그인</button>
      )}
    </div>
  );
};

const btn =
  'border border-ed6-silverBorder bg-ed6-silver px-2 py-[3px] text-ed6-lunaBlue active:translate-y-px';
```

- [ ] **Step 2: 목록**

`src/pages/6th/board/ui/BoardList.tsx`:

```tsx
import { usePosts } from '@/features/board';
import type { BoardType } from '@/entities/post';

interface Props {
  board: BoardType;
  canWrite: boolean;
  onOpen: (id: string) => void;
  onCreate: () => void;
}

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleDateString('ko-KR') : '…';

export const BoardList = ({ board, canWrite, onOpen, onCreate }: Props) => {
  const { posts, loading, error } = usePosts(board);

  return (
    <div className='mt-2'>
      <div className='mb-2 flex justify-end'>
        <button
          onClick={onCreate}
          disabled={!canWrite}
          className='border border-ed6-silverBorder bg-ed6-silver px-3 py-1 font-galmuri11 text-[11px] text-ed6-lunaBlue active:translate-y-px disabled:opacity-50'>
          글쓰기
        </button>
      </div>

      {error && (
        <p className='font-galmuri11 text-[11px] text-red-600'>
          목록을 불러오지 못했어요: {error}
        </p>
      )}
      {loading && <p className='font-galmuri11 text-[11px] text-[#666]'>불러오는 중…</p>}
      {!loading && posts.length === 0 && (
        <p className='py-6 text-center font-galmuri11 text-[12px] text-[#666]'>
          아직 글이 없어요.
        </p>
      )}

      <ul className='divide-y divide-[#c4c0b2] border-y border-[#c4c0b2] bg-white'>
        {posts.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onOpen(p.id)}
              className='flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-[#eef3ff]'>
              <span className='truncate font-galmuri14 text-[14px] text-ed6-text'>
                {p.title}
              </span>
              <span className='shrink-0 font-galmuri11 text-[10px] text-[#888]'>
                {p.authorName} · {fmt(p.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

- [ ] **Step 3: 작성/수정 폼**

`src/pages/6th/board/ui/PostForm.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { createPost, updatePost, usePost } from '@/features/board';
import type { BoardType } from '@/entities/post';

interface Props {
  board: BoardType;
  /** null이면 신규 작성, 값 있으면 해당 글 수정 */
  postId: string | null;
  onDone: (postId: string | null) => void;
  onCancel: () => void;
}

export const PostForm = ({ board, postId, onDone, onCancel }: Props) => {
  const { post } = usePost(postId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  // 수정 모드: 기존 글 로드되면 폼 채우기
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const valid = title.trim() && content.trim();

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    try {
      if (postId) {
        await updatePost(postId, { title, content });
        onDone(postId);
      } else {
        const id = await createPost({ board, title, content });
        onDone(id);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : '저장에 실패했어요.');
      setBusy(false);
    }
  };

  return (
    <div className='mt-2 space-y-2'>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='제목'
        className='w-full border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[14px] text-ed6-text'
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='내용'
        rows={8}
        className='w-full resize-y border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri14 text-[14px] leading-[1.7] text-ed6-text'
      />
      <div className='flex justify-end gap-2 font-galmuri11 text-[11px]'>
        <button onClick={onCancel} className='border border-[#9a9a9a] bg-ed6-silver px-3 py-1 active:translate-y-px'>
          취소
        </button>
        <button
          onClick={submit}
          disabled={!valid || busy}
          className='border border-ed6-silverBorder bg-ed6-silver px-3 py-1 text-ed6-lunaBlue active:translate-y-px disabled:opacity-50'>
          {busy ? '저장 중…' : '저장'}
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: 상세 + 댓글**

`src/pages/6th/board/ui/PostView.tsx`:

```tsx
import { useState } from 'react';
import type { AuthState } from '@/features/auth';
import {
  addComment,
  deleteComment,
  deletePost,
  useComments,
  usePost,
} from '@/features/board';

interface Props {
  postId: string;
  auth: AuthState;
  onBack: () => void;
  onEdit: (id: string) => void;
}

const fmt = (ms: number | null) =>
  ms ? new Date(ms).toLocaleString('ko-KR') : '…';

export const PostView = ({ postId, auth, onBack, onEdit }: Props) => {
  const { post, loading } = usePost(postId);
  const comments = useComments(postId);
  const [text, setText] = useState('');

  if (loading) return <p className='mt-3 font-galmuri11 text-[11px] text-[#666]'>불러오는 중…</p>;
  if (!post) {
    return (
      <div className='mt-3'>
        <p className='font-galmuri11 text-[12px] text-[#666]'>삭제되었거나 없는 글이에요.</p>
        <button onClick={onBack} className={ghostBtn}>목록으로</button>
      </div>
    );
  }

  const uid = auth.user?.uid;
  const canEdit = !!uid && (uid === post.authorUid || auth.isAdmin);

  const remove = async () => {
    if (!confirm('이 글을 삭제할까요?')) return;
    try {
      await deletePost(post.id);
      onBack();
    } catch (e) {
      alert(e instanceof Error ? e.message : '삭제에 실패했어요.');
    }
  };

  const submitComment = async () => {
    if (!text.trim()) return;
    try {
      await addComment(post.id, text);
      setText('');
    } catch (e) {
      alert(e instanceof Error ? e.message : '댓글 저장 실패');
    }
  };

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between'>
        <button onClick={onBack} className={ghostBtn}>← 목록</button>
        {canEdit && (
          <div className='flex gap-2 font-galmuri11 text-[11px]'>
            <button onClick={() => onEdit(post.id)} className={ghostBtn}>수정</button>
            <button onClick={remove} className={ghostBtn}>삭제</button>
          </div>
        )}
      </div>

      <article className='mt-2 border border-[#c4c0b2] bg-white p-3'>
        <h2 className='font-galmuri14 text-[16px] font-bold text-ed6-text'>{post.title}</h2>
        <p className='mt-1 font-galmuri11 text-[10px] text-[#888]'>
          {post.authorName} · {fmt(post.createdAt)}
          {post.updatedAt && ' · (수정됨)'}
        </p>
        <p className='mt-3 whitespace-pre-wrap font-galmuri14 text-[14px] leading-[1.8] text-ed6-text'>
          {post.content}
        </p>
      </article>

      {/* 댓글 */}
      <section className='mt-3'>
        <h3 className='font-galmuri11 text-[11px] text-ed6-lunaBlue'>댓글 {comments.length}</h3>
        <ul className='mt-1 space-y-1'>
          {comments.map((c) => {
            const mine = !!uid && (uid === c.authorUid || auth.isAdmin);
            return (
              <li key={c.id} className='flex items-start justify-between gap-2 border-b border-[#e4e0d2] py-1'>
                <span className='font-galmuri11 text-[12px] text-ed6-text'>
                  <b className='text-[#555]'>{c.authorName}</b> {c.content}
                </span>
                {mine && (
                  <button
                    onClick={() => deleteComment(post.id, c.id)}
                    className='shrink-0 font-galmuri11 text-[10px] text-[#999] hover:text-red-600'>
                    삭제
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {auth.user ? (
          <div className='mt-2 flex gap-1'>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder='댓글 달기'
              className='flex-1 border border-[#9a9a9a] bg-white px-2 py-1 font-galmuri11 text-[12px] text-ed6-text'
            />
            <button onClick={submitComment} className='border border-ed6-silverBorder bg-ed6-silver px-3 font-galmuri11 text-[11px] text-ed6-lunaBlue active:translate-y-px'>
              등록
            </button>
          </div>
        ) : (
          <p className='mt-2 font-galmuri11 text-[10px] text-[#888]'>로그인하면 댓글을 쓸 수 있어요.</p>
        )}
      </section>
    </div>
  );
};

const ghostBtn =
  'border border-[#9a9a9a] bg-ed6-silver px-2 py-[3px] font-galmuri11 text-[11px] text-ed6-lunaBlue active:translate-y-px';
```

- [ ] **Step 5: 타입체크**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: 커밋**

```bash
git add src/pages/6th/board/ui
git commit -m "feat(board): 6회 Y2K 테마 게시판 UI 컴포넌트"
```

---

## Task 6: 페이지 조립 + 라우팅 + 데스크탑 아이콘

**Files:**
- Create: `src/pages/6th/board/BoardPage.tsx`
- Modify: `src/app/routers/AppRouter.tsx`
- Modify: `src/pages/6th/config.ts`
- Modify: `src/pages/6th/ui/DesktopIcon.tsx`

- [ ] **Step 1: BoardPage 조립**

`src/pages/6th/board/BoardPage.tsx`:

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlissBackground } from '../ui/BlissBackground';
import { XpWindow } from '../ui/XpWindow';
import { useAuth } from '@/features/auth';
import { BOARDS } from '@/shared/config/board';
import type { BoardType } from '@/entities/post';
import { AuthBar } from './ui/AuthBar';
import { BoardList } from './ui/BoardList';
import { PostForm } from './ui/PostForm';
import { PostView } from './ui/PostView';

type Mode =
  | { view: 'list' }
  | { view: 'detail'; postId: string }
  | { view: 'create' }
  | { view: 'edit'; postId: string };

/**
 * /6th/board — Y2K 창 프레임 안에서 자유·리뷰·공지 게시판.
 * 목록↔상세↔작성은 페이지 내부 상태로 전환(최소 라우팅).
 */
export default function BoardPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [board, setBoard] = useState<BoardType>('free');
  const [mode, setMode] = useState<Mode>({ view: 'list' });

  // 공지는 관리자만 글쓰기 가능(자유·리뷰는 로그인 유저 누구나)
  const canWrite = !!auth.user && (board !== 'notice' || auth.isAdmin);

  return (
    <div className='theme-6th relative flex min-h-[100dvh] w-full items-start justify-center overflow-auto bg-black p-3 sm:p-6'>
      <BlissBackground />
      <XpWindow
        title='게시판 — 머지 BBS'
        draggable={false}
        onClose={() => navigate('/6th')}
        className='relative z-10 w-full max-w-[720px]'>
        <div className='p-3 sm:p-4'>
          <AuthBar auth={auth} />

          <div className='mt-2 flex gap-1'>
            {BOARDS.map((b) => (
              <button
                key={b.type}
                onClick={() => {
                  setBoard(b.type);
                  setMode({ view: 'list' });
                }}
                className={`border border-ed6-silverBorder px-3 py-1 font-galmuri11 text-[11px] active:translate-y-px ${
                  board === b.type
                    ? 'bg-ed6-lunaBlue text-white'
                    : 'bg-ed6-silver text-ed6-lunaBlue'
                }`}>
                {b.label}
              </button>
            ))}
          </div>

          {mode.view === 'list' && (
            <BoardList
              board={board}
              canWrite={canWrite}
              onOpen={(id) => setMode({ view: 'detail', postId: id })}
              onCreate={() => setMode({ view: 'create' })}
            />
          )}
          {mode.view === 'detail' && (
            <PostView
              postId={mode.postId}
              auth={auth}
              onBack={() => setMode({ view: 'list' })}
              onEdit={(id) => setMode({ view: 'edit', postId: id })}
            />
          )}
          {(mode.view === 'create' || mode.view === 'edit') && (
            <PostForm
              board={board}
              postId={mode.view === 'edit' ? mode.postId : null}
              onDone={(id) =>
                setMode(id ? { view: 'detail', postId: id } : { view: 'list' })
              }
              onCancel={() => setMode({ view: 'list' })}
            />
          )}
        </div>
      </XpWindow>
    </div>
  );
}
```

- [ ] **Step 2: 라우트 추가**

`src/app/routers/AppRouter.tsx` 수정. lazy import 추가(기존 Edition6 옆):

```tsx
const BoardPage = lazy(() => import('@/pages/6th/board/BoardPage'));
```

라우트 배열에서 `/6th/*` 항목 **바로 위**에 board 라우트를 추가(정적 경로 우선 매칭):

```tsx
  // 6회 게시판 — 전체 페이지(데스크탑 아이콘에서 진입)
  { path: '/6th/board', element: withSuspense(<BoardPage />) },
  // 6회는 자체 회차 스왑 UI(작업표시줄)를 가지므로 레이아웃 미적용.
  { path: '/6th/*', element: withSuspense(<Edition6 />) },
```

- [ ] **Step 3: 데스크탑 아이콘 등록**

`src/pages/6th/config.ts`에서 `IconArt` 타입에 `'board'` 추가:

```ts
export type IconArt = 'monitor' | 'txt' | 'help' | 'ticket' | 'ed4' | 'ed5' | 'board';
```

`desktopIcons` 배열에 게시판 아이콘 추가(ticket 다음, ed4 앞):

```ts
  { id: 'board', label: '게시판.exe', art: 'board', action: 'link', href: '/6th/board' },
```

- [ ] **Step 4: 아이콘 글리프**

`src/pages/6th/ui/DesktopIcon.tsx`의 `IconArtGlyph` switch에 `'board'` case 추가(기존 case들과 같은 톤 — 실버 창에 파란 목록 줄):

```tsx
    case 'board': // 게시판.exe — 실버 창 + 파란 목록 줄
      return (
        <span
          className='relative block h-9 w-[32px] rounded-[2px] border border-[#6b6b6b] bg-ed6-silver'
          style={{ boxShadow: '1px 1px 0 rgba(0,0,0,.35)' }}>
          <span
            className='block h-[7px] border-b border-[#6b6b6b]'
            style={{ background: 'linear-gradient(180deg,#3f8cf3,#0a52d6)' }}
          />
          <span
            className='absolute left-[4px] right-[4px] top-[12px] h-[2px] bg-ed6-lunaBlue'
            style={{ boxShadow: '0 5px 0 #9aa,0 10px 0 #9aa' }}
          />
        </span>
      );
```

- [ ] **Step 5: 타입체크 + 린트**

Run: `npm run build && npm run lint`
Expected: PASS. (`IconArtGlyph`가 모든 `IconArt`를 switch로 다루는지 확인 — `'board'` 누락 시 타입 에러.)

- [ ] **Step 6: 커밋**

```bash
git add src/pages/6th/board/BoardPage.tsx src/app/routers/AppRouter.tsx src/pages/6th/config.ts src/pages/6th/ui/DesktopIcon.tsx
git commit -m "feat(board): /6th/board 라우트와 데스크탑 게시판 아이콘 연결"
```

---

## Task 7: 보안 규칙 + Firebase 콘솔 세팅 + E2E 검증

**Files:**
- Create: `firestore.rules` (참조용 — 콘솔에 붙여넣기; 배포 파이프라인 없음)

- [ ] **Step 1: 보안 규칙 파일 (저장소 참조용)**

`firestore.rules`:

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

    // 관리자 명단: 콘솔에서 관리자 uid로 빈 문서 생성. 본인 문서만 읽기, 쓰기는 콘솔에서만.
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
        allow update: if false;
      }
    }
  }
}
```

- [ ] **Step 2: Firebase 콘솔 세팅 (사용자 수행 — 스펙 문서의 가이드 순서대로)**

1. https://console.firebase.google.com 에서 프로젝트 생성
2. Authentication → Sign-in method → Google 사용 설정
3. Firestore Database 생성(프로덕션 모드)
4. `firestore.rules` 내용을 콘솔 규칙에 붙여넣고 게시
5. 프로젝트 설정 → 웹 앱(</>) 추가 → config 값을 로컬 `.env`에 기입(`.env.example` 키에 매칭)
6. 배포 도메인(vercel)을 Authentication 승인된 도메인에 추가

- [ ] **Step 3: 로컬 실행 + 관리자 지정**

Run: dev 서버 실행(preview_start `name` 또는 `npm run dev`), 브라우저에서 `/6th/board` 접속.
- 구글 로그인 1회 → 콘솔 Authentication에서 본인 UID 복사 → Firestore `admins` 컬렉션에 그 UID를 문서 ID로 하는 빈 문서 생성.

- [ ] **Step 4: E2E 시나리오 검증 (브라우저)**

다음을 순서대로 확인(각 단계 실시간 반영 확인):
1. 비로그인 상태로 자유게시판 목록/상세 **읽기** 가능
2. 로그인 → 자유게시판 **글 작성** → 목록에 즉시 나타남
3. 작성한 글 **수정** → (수정됨) 표기
4. 상세에서 **댓글 작성/삭제**
5. 자유게시판에서 **글 삭제** → 목록에서 사라짐
6. 공지게시판: 관리자면 글쓰기 활성, 비관리자면 글쓰기 버튼 비활성
7. (rules 검증) 콘솔에서 admins 문서 삭제 후 공지 작성 시도 → 거부되는지
8. 목록 진입 시 인덱스 에러가 콘솔 링크로 뜨면 클릭해 복합 인덱스 생성 후 재확인

- [ ] **Step 5: 데스크탑 진입 동선 확인**

`/6th` 접속 → 부팅 후 데스크탑에서 `게시판.exe` 아이콘 선택 → 다시 클릭 → `/6th/board`로 이동. 게시판 창 `×` 클릭 → `/6th` 복귀.

- [ ] **Step 6: 커밋**

```bash
git add firestore.rules
git commit -m "feat(board): Firestore 보안 규칙 및 세팅 참조 파일"
```

---

## Self-Review 결과

- **Spec 커버리지:** 3종 게시판(Task 2 BOARDS) · 목록/상세/작성/수정/삭제(Task 4·5) · 댓글(Task 4·5) · 구글 로그인(Task 3) · 공지 관리자 제한(Task 6 canWrite + Task 7 rules) · admins 컬렉션 판별(Task 3·7) · 6회 통합(Task 6) · Firebase 세팅 가이드(Task 7) 모두 태스크 존재. 별점/좋아요/페이지네이션은 스펙에서 명시적 제외.
- **타입 일관성:** `Post`/`Comment`/`BoardType`(Task 2) → 훅(Task 4) → UI(Task 5·6) 전체에서 동일 시그니처 사용. `AuthState`(Task 3)를 `AuthBar`/`PostView`/`BoardPage`가 동일하게 소비. `createPost`는 생성 id(string) 반환 → `PostForm.onDone`이 사용.
- **미해결/구현 시 확인 포인트:** `BlissBackground`가 절대배치로 창을 가리지 않는지(구현 시 `z-10`으로 창을 위에 둠 — Step 1에 반영). 인덱스는 런타임 에러 링크로 생성(Task 7 Step 4-8).
