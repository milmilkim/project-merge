import type { ReactElement } from 'react';
import { BusySpinner } from './RetroIcons';
import { CoverFlow } from './CoverFlow';
import { SuggestWindow } from './SuggestWindow';
import type { AuthState } from '@/features/auth';

/**
 * 데스크탑 창 콘텐츠 모음.
 * 아이콘별 본문을 각각 독립 컴포넌트로 정의하고, 레지스트리(WINDOW_CONTENT)로
 * Desktop에 내려준다(상태 분기 X). 정식 사이트 전환 시 이 컴포넌트들을 실제
 * 페이지로 교체하면 된다.
 */

import { EditablePage } from './EditablePage';

const Pending = ({ label }: { label: string }) => (
  <span className='mt-1 flex items-center gap-2 text-[#666]'>
    <BusySpinner size={13} /> {label}
  </span>
);

/** 안내 페이지 기본 본문(Firestore pages/{id} 없을 때). 관리자는 창에서 바로 수정한다. */
const ABOUT_DEFAULT = `**머지영화제**는 2018년부터 '릴리스의 신도들'이 주최하는, 다양한 장르와 형식의 드라마·애니메이션·영화를 한데 모아 선보이는 자체 영화제입니다.

이름 그대로 서로 다른 취향을 **'MERGE'**하여, 하나의 흐름 속에서 다양성을 축하합니다.

## — 연혁 —
2018.12.26 · 머지영화제
2019.06.27 · 2회 : 사도의 습격
2020.12.20 · 3회 머지영화제
2023.09.28 · 4회 : REBIRTH N REVERSE
2024.12.27 · 5회 : 이상한 영화 몰아보기
2026 · 6회 머지영화제 (준비중)`;

const EVENT_DEFAULT = `## 행사정보

일시 · 장소가 확정되는 대로 이곳에 공지됩니다.`;

const TICKET_DEFAULT = `## 티켓팅

예매는 아직 열리지 않았습니다. 상영작 공개 후 오픈 예정입니다.`;

/** 소개.txt */
export const AboutWindow = ({ auth }: { auth: AuthState }) => (
  <EditablePage id='about' fallback={ABOUT_DEFAULT} auth={auth} />
);

/** 행사정보.hlp */
export const EventWindow = ({ auth }: { auth: AuthState }) => (
  <EditablePage
    id='event'
    fallback={EVENT_DEFAULT}
    auth={auth}
    footer={<Pending label='정보 수신 대기중…' />}
  />
);

/** 상영작.exe — 커버플로우 라인업 브라우저(포스터 TBD) */
export const FilmsWindow = () => <CoverFlow />;

/** 티켓팅 — 준비중(비활성) */
export const TicketWindow = ({ auth }: { auth: AuthState }) => (
  <EditablePage
    id='ticket'
    fallback={TICKET_DEFAULT}
    auth={auth}
    footer={<Pending label='예매 오픈 준비중…' />}
  />
);

export interface WindowDef {
  title: string;
  /** auth가 필요한 창(추천 폼 등)만 받아 쓰고, 나머지는 무시하면 된다 */
  Content: (props: { auth: AuthState }) => ReactElement;
}

/** 아이콘 id → 창(타이틀 + 콘텐츠 컴포넌트) 레지스트리 */
export const WINDOW_CONTENT: Record<string, WindowDef> = {
  about: { title: '소개.txt — 메모장', Content: AboutWindow },
  event: { title: '행사정보.hlp — 도움말', Content: EventWindow },
  films: { title: '상영작.exe', Content: FilmsWindow },
  ticket: { title: '티켓팅', Content: TicketWindow },
  suggest: { title: '상영작 추천', Content: SuggestWindow },
};
