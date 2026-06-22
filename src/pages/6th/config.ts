/**
 * 제6회 머지영화제 티저 — 콘텐츠 데이터 단일 출처.
 * 실제 날짜/상영작/장소가 정해지면 이 파일의 값만 채우면 된다.
 * (라인업 공개 전까지 editions.ts의 6th status는 'coming-soon' 유지)
 */

export const edition6 = {
  no: 6,
  title: '제6회 머지영화제',
  subtitle: 'MERGE FILM FESTIVAL',
  status: 'COMING SOON',

  /** 개막일. 정해지면 'YYYY-MM-DD'. null이면 D-??? 표기 */
  openDate: null as string | null,

  /** 타이틀 윈도우에 표기되는 핵심 정보(전부 미정 플레이스홀더) */
  info: [
    { label: '일시', value: '미정 · COMING SOON' },
    { label: '상영작', value: 'T B A — 큐레이션 진행중' },
    { label: '장소', value: 'T B A' },
  ],
} as const;

/**
 * 바탕화면 아이콘. art = CSS 아트 종류(시안), action: 'soon'=준비중 창, 'link'=회차 이동.
 */
export type IconArt = 'monitor' | 'txt' | 'help' | 'ticket' | 'ed4' | 'ed5';

export interface DesktopIconDef {
  id: string;
  label: string;
  art: IconArt;
  action: 'soon' | 'link';
  href?: string;
  disabled?: boolean;
  /** 부팅 후 처음부터 선택(하이라이트)된 아이콘 */
  active?: boolean;
}

export const desktopIcons: DesktopIconDef[] = [
  { id: 'films', label: '상영작.exe', art: 'monitor', action: 'soon', active: true },
  { id: 'about', label: '소개.txt', art: 'txt', action: 'soon' },
  { id: 'event', label: '행사정보.hlp', art: 'help', action: 'soon' },
  { id: 'ticket', label: '티켓팅', art: 'ticket', action: 'soon', disabled: true },
  { id: 'ed4', label: '제4회 바로가기', art: 'ed4', action: 'link', href: '/4th' },
  { id: 'ed5', label: '제5회 바로가기', art: 'ed5', action: 'link', href: '/5th' },
];

/** CRT 마스코트 '삐삐'의 말풍선 대사(HTML 허용 — <b>/<br> 강조 가능) */
export const mascotMessages = [
  '제6회가 곧 깨어납니다…<br>상영작 라인업 <b style="color:#0b52d6;">곧 공개!</b>',
  '상영작 라인업이 곧 공개됩니다.<br>알림을 켜두세요!',
  '디스크 조각 모음 중…<br><b style="color:#0b52d6;">잠시만</b> 기다려 주세요.',
];

/**
 * 시작메뉴(회차 스왑)에 표기할 회차별 영화제 이름.
 * 6회는 제목 미공개 상태라 깨진 문자(모지바케)로 표기한다.
 * (이름은 6회 시작메뉴의 표시용 라벨이므로 6회 슬라이스가 소유)
 */
export const EDITION_NAMES: Record<number, string> = {
  4: 'REBIRTH N REVERSE',
  5: '이상한 영화 몰아보기',
};

/** 6회는 제목 미공개 — 호러 글리치로 가려진 제목(GlitchText로 연출) */
export const EDITION6_GLITCH = '█ ██████ █';

/** sessionStorage 키 — 부팅 인트로 1회만 노출 */
export const BOOT_FLAG = 'merge6-booted';
