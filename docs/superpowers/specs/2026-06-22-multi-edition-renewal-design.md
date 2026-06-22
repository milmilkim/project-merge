# 머지영화제 멀티회차 리뉴얼 설계

작성일: 2026-06-22

## 배경

머지영화제는 매년 개최되는 자체 영화제다. `main` 브랜치는 FSD 아키텍처로 정리됐지만 4회 단일 회차만 담고 있고, `dev` 브랜치는 회차별 폴더 구조(`components/4th`, `5th`)를 시도했으나 FSD를 버린 채 5회 작업 중 홀딩됐다.

이번 작업의 목표:

1. **멀티회차 지원** — 4회/5회/6회를 한 사이트에서 운영하고, 회차마다 완전히 다른 디자인 컨셉을 가질 수 있게 한다.
2. **회차 스왑 GNB** — 어느 페이지에서든 회차를 전환할 수 있는 공통 네비게이션.
3. **5회 완성** — 홀로그래픽 디자인 컨셉으로 5회 영화제 페이지를 구축한다.
4. **6회 준비** — 'COMING SOON' 티저만 두고 루트(/)를 6회로 설정한다.

`main`의 FSD를 베이스로 유지하되, 회차마다 새 디자인 컨셉을 독립적으로 얹을 수 있는 구조로 확장한다.

## 핵심 결정사항

| 항목 | 결정 |
|------|------|
| 베이스 | `main`의 FSD 아키텍처 유지 |
| 회차 분리 | 페이지·배경 위젯·스타일 토큰은 회차별로, GNB·라우팅·shared는 공통 |
| 코드 스플리팅 | 회차 단위 `React.lazy` 다이나믹 임포트 (회차 청크 분리) |
| 스타일 | 회차별 색·폰트 토큰을 tailwind 네임스페이스로 분리, 진짜 공통만 공유 |
| 라우팅 | `/` → `LATEST`(6회) redirect, `/4th` `/5th` `/6th` prefix |
| GNB | `edition-switcher` 드롭다운 (회차 무관 공통 컴포넌트 1개) |
| 4회 | 기존 main 페이지/위젯을 회차 구조로 이전, 디자인 그대로 |
| 5회 | 아이시 홀로그래픽 테마, `gem.gif` 메인, 신규 구축 |
| 6회 | 'COMING SOON' 티저 1장, LATEST=6회 |

## 1. 폴더 구조

```
src/
  app/
    routers/        # 회차 prefix 라우팅 + / → LATEST redirect, React.lazy 회차 청크
    layout/         # 회차 셸(공통 레이아웃 + edition-switcher 마운트)
  pages/
    4th/  home about film event ticket   # 기존 main 페이지 이전 (우주선/별 테마)
    5th/  home about film event ticket   # 신규 (홀로그래픽 테마)
    6th/  coming-soon                    # 티저 1장
  widgets/
    edition-switcher/   # ★공통 회차 드롭다운 GNB
    4th/  menu footer stars             # 4회 전용 배경/메뉴
    5th/  menu footer gem-bg            # 5회 전용 (돌아가는 보석)
  entities/
    edition/   # 회차 메타 타입 + 회차별 메타데이터 (번호/제목/부제/장소/films 참조)
    film/      # Film 타입 + 회차별 films 데이터
  shared/
    config/editions.ts   # 회차 목록 + LATEST 상수
    ui/ lib/
```

**확장성 원칙**: 새 회차 추가 = `pages/{n}th/` + `widgets/{n}th/` + `entities`에 회차 메타/films 한 묶음 + `editions.ts`에 한 줄. 공통 GNB·라우팅·레이아웃 셸은 건드리지 않는다.

## 2. 라우팅 & 코드 스플리팅

- `app/routers`에서 회차별 라우트 그룹을 `React.lazy()`로 감싼다. `/5th/*` 진입 시 5회 청크만 로드되고 4회 코드는 받지 않는다.
- `/` 는 `editions.ts`의 `LATEST`(현재 6회) 홈으로 redirect. LATEST는 수동 업데이트.
- 회차 prefix: `/4th`, `/4th/about`, `/4th/film`, `/4th/event`, `/4th/ticket` … 5회 동일. 6회는 `/6th`(coming-soon)만.
- `<Suspense>` fallback은 기존 `Loading` 컴포넌트 재사용.

## 3. 회차 스왑 GNB (edition-switcher)

- 화면 상단 구석에 `6회 ▾` 형태 드롭다운. 펼치면 회차 목록(`editions.ts` 기반), 선택 시 이동.
- 이동 규칙: **같은 하위 경로가 대상 회차에 있으면 그 경로로, 없으면 대상 회차 홈으로.** (예: `/5th/film`에서 4회 선택 → `/4th/film`. 6회 선택 → 6회는 coming-soon뿐이라 `/6th`.)
- 회차마다 디자인이 달라도 GNB는 공통 컴포넌트 1개. 위치/기본 스타일만 공통으로 두고, 색은 현재 회차 토큰을 따르게 한다(셸 레벨에서 주입).

## 4. 회차별 스타일 토큰 (tailwind)

Tailwind는 빌드타임 단일 config이므로 회차별 물리적 config 분리는 하지 않는다(오버엔지니어링). 대신:

- `tailwind.config.js`의 `theme.extend.colors`에 회차 네임스페이스를 둔다: `ed4: { bg, point, primary }`, `ed5: { bg, point, primary, … }`.
- 각 회차 컴포넌트는 자기 네임스페이스 클래스만 사용(`bg-ed5-bg` 등). 회차 간 색이 섞이지 않는다.
- 공통 컴포넌트(셸, GNB)는 공통 토큰을 쓰되, 회차 색이 필요하면 현재 회차 토큰을 CSS 변수로 셸에서 노출해 참조한다.
- 폰트도 회차별로 다르면 같은 방식으로 회차 네임스페이스 폰트 패밀리를 추가한다.

**4회 토큰**: 기존 값 유지 — `bg #0A0B26`, `point #D2FD50`, `primary #8589FE`.
**5회 토큰**: 아이시 홀로그래픽 — 파스텔 블루 베이스(예: `#bdeaff`~`#c9b8ff`~`#e0c3ff` 그라데이션), 홀로그램 펄 포인트, 진주빛. 구체 hex는 구현 단계에서 시안 기준으로 확정.

## 5. 회차 데이터 모델

`entities/edition`:

```ts
type Edition = {
  no: number;            // 4, 5, 6
  slug: string;          // '4th' | '5th' | '6th'
  title: string;         // '제5회 머지영화제'
  subtitle?: string;     // '이상한 영화 몰아보기'
  venue?: { name: string; address: string }; // 카카오맵용
  status: 'published' | 'coming-soon';
  // films는 entities/film의 회차별 데이터로 참조
};
```

`shared/config/editions.ts`: `editions` 배열 + `LATEST`(현재 6) 상수.

## 6. 5회 콘텐츠

- **메타**: 제목 "제5회 머지영화제", 부제 "이상한 영화 몰아보기", 장소 **인터시티서울호텔 / 서울특별시 강서구 마곡동 797-11** (event 페이지 카카오맵).
- **홈**: A안 — 홀로그래픽 풀스크린 배경 + 중앙 `gem.gif`(돌아가는 보석, dev `src/assets/images/gem.gif`에서 가져옴) + "Click to continue" → 메뉴 오픈. 4회 인터랙션 패턴 답습.
- **상영작 5편** (4회와 동일하게 공식 시놉시스 형식):
  1. 경계선 (Gräns / Border, 2018)
  2. 나이트크롤러 (Nightcrawler, 2014)
  3. 퍼니게임 (Funny Games)
  4. 더 페이버릿: 여왕의 여자 (The Favourite, 2018)
  5. 에브리씽 에브리웨어 올 앳 원스 (2022)
  - 시놉시스는 작성자가 공식 시놉시스 초안을 채우고 사용자가 확인한다.
  - **포스터 이미지는 빈 자리(플레이스홀더)로 구축** — 추후 사용자가 `src`에 파일 추가.
- 나머지 페이지(소개/티켓)는 4회 구조를 따르되 5회 테마 적용.

## 7. 6회 콘텐츠

- `/6th` = `pages/6th/coming-soon` 티저 1장 ('COMING SOON'). 디자인 컨셉 미정이라 최소 스타일.
- `editions.ts`에 `status: 'coming-soon'`으로 등록, `LATEST = 6`.

## 8. 4회 마이그레이션

- 현재 main의 `pages/{home,about,event,film,ticket}`, `widgets/{menu,footer,stars}`, 관련 ui를 4회 전용 위치로 이동.
- 기능·디자인 변경 없음, 위치만 회차 구조로. 색은 `ed4-*` 네임스페이스로 치환.
- 4회 메뉴 라벨("4회 머지영화제") 유지.

## 비범위 (YAGNI)

- 회차별 물리적 tailwind config 분리 — 하지 않음.
- 6회 실제 콘텐츠/디자인 — 이번 범위 아님(티저만).
- CMS·관리자 화면 — 데이터는 코드 내 정적 정의 유지.
- 1~3회 아카이빙 — 1회 미아카이브, 2·3회 유실로 범위 외.

## 미해결 / 구현 단계 확인 항목

- 5회 색 토큰 구체 hex 값 (시안 기준 확정).
- 5회 영화 5편 공식 시놉시스 텍스트 (작성 후 사용자 확인).
- 5회 영화 포스터 이미지 (사용자가 추후 제공).
