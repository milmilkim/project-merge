/**
 * 6회 티저 시안에서 반복되는 그라데이션/클립패스 모음.
 * 시안(제6회 머지영화제 티저.dc.html)의 인라인 스타일을 그대로 옮긴 값들이라
 * 토큰화하기 애매한 정밀 그라데이션은 여기서 단일 출처로 관리한다.
 */
export const ACCENT = '#19e3d6';

/** XP 타이틀바(루나 블루) */
export const TITLEBAR =
  'linear-gradient(180deg,#0997ff 0%,#0856e6 9%,#0b52d6 46%,#1564ea 58%,#0a4fda 92%,#003bc4 100%)';

/** 작업표시줄 바 */
export const TASKBAR =
  'linear-gradient(180deg,#3f8cf3 0,#2074e8 4%,#1b66dd 9%,#1f6ce2 88%,#0e50c9 100%)';

/** 시작 버튼(green) */
export const START_GREEN =
  'linear-gradient(180deg,#5bbd3f 0,#46a82c 44%,#37971f 56%,#2c8417 100%)';

/** Bliss 하늘(포스터라이즈드 밴딩) */
export const SKY =
  'linear-gradient(180deg,#15a8e6 0 15%,#33bdf0 15% 32%,#5ccff6 32% 50%,#8adffb 50% 64%,#b6ecff 64% 70%)';

/** Bliss 언덕(밴딩) */
export const HILL =
  'linear-gradient(180deg,#7ec850 0 22%,#5fb33f 22% 48%,#479a2f 48% 74%,#367f25 74% 100%)';

/** 계단형 언덕 실루엣 */
export const HILL_CLIP =
  'polygon(0 64%,9% 64%,9% 58%,20% 58%,20% 52%,32% 52%,32% 46%,46% 46%,46% 42%,60% 42%,60% 46%,72% 46%,72% 52%,84% 52%,84% 60%,93% 60%,93% 66%,100% 66%,100% 100%,0 100%)';

/** 저해상 디더 그리드 */
export const DITHER =
  'repeating-linear-gradient(0deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px)';

/** CRT 스캔라인 */
export const SCANLINES =
  'repeating-linear-gradient(0deg,rgba(0,0,0,.16) 0 1px,transparent 1px 3px)';

/** 마퀴 로딩바 청크 패턴 */
export const MARQUEE =
  'repeating-linear-gradient(90deg,#1f7be8 0 18px,transparent 18px 30px)';
