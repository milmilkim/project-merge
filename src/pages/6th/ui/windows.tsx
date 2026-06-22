import type { ReactNode } from 'react';
import { BusySpinner } from './RetroIcons';

/**
 * 데스크탑 창 콘텐츠 모음.
 * 아이콘별 본문을 각각 독립 컴포넌트로 정의하고, 레지스트리(WINDOW_CONTENT)로
 * Desktop에 내려준다(상태 분기 X). 정식 사이트 전환 시 이 컴포넌트들을 실제
 * 페이지로 교체하면 된다.
 */

/** XP 메모장/도움말 셸 — 메뉴바 + 본문 */
const Notepad = ({ children }: { children: ReactNode }) => (
  <div className='w-[min(86vw,320px)]'>
    <div className='flex gap-[14px] border-b border-[#c4c0b2] bg-ed6-silver px-[10px] py-1 font-os text-[11px] text-[#333]'>
      <span>파일</span>
      <span>편집</span>
      <span>서식</span>
      <span>도움말</span>
    </div>
    <div
      className='font-galmuri14 m-2 border border-[#9a9a9a] bg-white p-3 text-[14px] leading-[1.7] text-[#222]'
      style={{ boxShadow: 'inset 1px 1px 0 #cfcabd' }}>
      {children}
    </div>
  </div>
);

const Point = ({ children }: { children: ReactNode }) => (
  <b className='text-ed6-lunaBlue'>{children}</b>
);

const Pending = ({ label }: { label: string }) => (
  <span className='mt-1 flex items-center gap-2 text-[#666]'>
    <BusySpinner size={13} /> {label}
  </span>
);

/** 소개.txt — 머지영화제 소개 + 연혁(4회 톤) */
export const AboutWindow = () => (
  <Notepad>
    <Point>머지영화제</Point>는 2018년부터 '릴리스의 신도들'이 주최하는,
    다양한 장르와 형식의 드라마·애니메이션·영화를 한데 모아 선보이는 자체
    영화제입니다.
    <br />
    <br />
    이름 그대로 서로 다른 취향을 <Point>'MERGE'</Point>하여, 하나의 흐름 속에서
    다양성을 축하합니다.
    <br />
    <br />
    <Point>— 연혁 —</Point>
    <ul className='mt-1 space-y-[2px]'>
      <li>2018.12.26 · 머지영화제</li>
      <li>2019.06.27 · 2회 : 사도의 습격</li>
      <li>2020.12.20 · 3회 머지영화제</li>
      <li>2023.09.28 · 4회 : REBIRTH N REVERSE</li>
      <li>2024.12.27 · 5회 : 이상한 영화 몰아보기</li>
      <li className='text-ed6-lunaBlue'>2026 · 6회 머지영화제 (준비중)</li>
    </ul>
  </Notepad>
);

/** 행사정보.hlp — 일시·장소 안내(미정) */
export const EventWindow = () => (
  <Notepad>
    <Point>행사정보</Point>
    <br />
    <br />
    일시 · 장소가 확정되는 대로 이곳에 공지됩니다.
    <br />
    <br />
    <Pending label='정보 수신 대기중…' />
  </Notepad>
);

/** 상영작.exe — 라인업 준비중 */
export const FilmsWindow = () => (
  <Notepad>
    <Point>상영작</Point>
    <br />
    <br />
    올해의 라인업을 큐레이션하는 중입니다. 공개되면 알림으로 가장 먼저
    전해드릴게요.
    <br />
    <br />
    <Pending label='라인업 큐레이션 진행중…' />
  </Notepad>
);

/** 티켓팅 — 준비중(비활성) */
export const TicketWindow = () => (
  <Notepad>
    <Point>티켓팅</Point>
    <br />
    <br />
    예매는 아직 열리지 않았어요. 상영작 공개 후 오픈 예정입니다.
    <br />
    <br />
    <Pending label='예매 오픈 준비중…' />
  </Notepad>
);

export interface WindowDef {
  title: string;
  Content: () => JSX.Element;
}

/** 아이콘 id → 창(타이틀 + 콘텐츠 컴포넌트) 레지스트리 */
export const WINDOW_CONTENT: Record<string, WindowDef> = {
  about: { title: '소개.txt — 메모장', Content: AboutWindow },
  event: { title: '행사정보.hlp — 도움말', Content: EventWindow },
  films: { title: '상영작.exe', Content: FilmsWindow },
  ticket: { title: '티켓팅', Content: TicketWindow },
};
