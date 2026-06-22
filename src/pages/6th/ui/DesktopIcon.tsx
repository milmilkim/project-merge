import type { DesktopIconDef, IconArt } from '../config';

interface Props {
  def: DesktopIconDef;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (def: DesktopIconDef) => void;
}

/**
 * 바탕화면 아이콘. CSS 아트 글리프 + 픽셀 라벨.
 * 1번 클릭 = 선택(하이라이트), 선택된 상태에서 다시 클릭 = 실행. (모바일 친화)
 */
export const DesktopIcon = ({ def, selected, onSelect, onOpen }: Props) => {
  const handleClick = () => {
    if (selected) onOpen(def);
    else onSelect(def.id);
  };

  return (
    <button
      onClick={handleClick}
      className='flex w-[92px] flex-col items-center gap-[5px] border border-dotted px-1 py-[7px] text-center focus:outline-none'
      style={{
        borderColor: selected ? 'rgba(255,255,255,.85)' : 'transparent',
        background: selected ? 'rgba(11,82,214,.42)' : 'transparent',
        opacity: def.disabled ? 0.62 : 1,
      }}>
      <IconArtGlyph art={def.art} />
      <span
        className='font-galmuri11 text-[11px] leading-[1.25] text-white'
        style={{
          textShadow: selected ? 'none' : '1px 1px 2px #000',
          background: selected ? '#0b52d6' : 'transparent',
          padding: selected ? '1px 3px' : 0,
        }}
        dangerouslySetInnerHTML={{ __html: labelHtml(def) }}
      />
    </button>
  );
};

/** 라벨 줄바꿈(바로가기/준비중) 처리 */
function labelHtml(def: DesktopIconDef): string {
  if (def.art === 'ticket')
    return '티켓팅<br><span style="color:#ffe08a;">(준비중)</span>';
  return def.label.replace(' 바로가기', '<br>바로가기');
}

const IconArtGlyph = ({ art }: { art: IconArt }) => {
  switch (art) {
    case 'monitor': // 상영작.exe — 실버 모니터
      return (
        <span
          className='relative block h-[30px] w-9 rounded-[2px] border-2 border-[#6b6b6b] bg-ed6-silver'
          style={{ boxShadow: '1px 1px 0 rgba(0,0,0,.35)' }}>
          <span
            className='block h-2 border-b border-[#6b6b6b]'
            style={{ background: 'linear-gradient(180deg,#3f8cf3,#0a52d6)' }}
          />
          <span
            className='absolute left-[5px] right-[5px] top-[14px] h-[2px] bg-[#9a9a9a]'
            style={{ boxShadow: '0 5px 0 #9a9a9a' }}
          />
        </span>
      );
    case 'txt': // 소개.txt — 모서리 접힌 문서
      return (
        <span
          className='relative block h-9 w-[30px] border border-[#8a8a8a] bg-white'
          style={{ boxShadow: '1px 1px 0 rgba(0,0,0,.3)' }}>
          <span
            className='absolute right-0 top-0 h-[9px] w-[9px] bg-[#cfcfcf]'
            style={{ clipPath: 'polygon(0 0,100% 100%,0 100%)' }}
          />
          <span
            className='absolute left-[5px] right-[5px] top-2 h-[2px] bg-[#1453c8]'
            style={{ boxShadow: '0 5px 0 #9aa,0 10px 0 #9aa,0 15px 0 #9aa,0 20px 0 #9aa' }}
          />
        </span>
      );
    case 'help': // 행사정보.hlp — 파란 원 + ?
      return (
        <span
          className='flex h-[30px] w-[30px] items-center justify-center rounded-full font-os text-[18px] font-bold text-white'
          style={{
            background: 'linear-gradient(180deg,#5ea0f5,#0b52d6)',
            boxShadow: '1px 1px 0 rgba(0,0,0,.3)',
          }}>
          ?
        </span>
      );
    case 'ticket': // 티켓팅 — 노란 티켓(천공선)
      return (
        <span
          className='relative block h-[26px] w-[38px] rounded-[3px] border border-[#9a7414]'
          style={{
            background: 'linear-gradient(180deg,#ffd24a,#e8a82c)',
            boxShadow: '1px 1px 0 rgba(0,0,0,.3)',
            filter: 'grayscale(.4)',
          }}>
          <span
            className='absolute -bottom-[3px] -top-[3px] left-1/2 -ml-px w-[2px]'
            style={{
              background:
                'repeating-linear-gradient(180deg,#9a7414 0 3px,transparent 3px 6px)',
            }}
          />
        </span>
      );
    case 'ed4': // 제4회 — 우주 미니 스크린 + 바로가기 뱃지
      return (
        <span
          className='relative block h-7 w-[34px] overflow-hidden rounded-[2px] border border-black'
          style={{
            background: 'linear-gradient(180deg,#0a0b26,#1a1c44)',
            boxShadow: '1px 1px 0 rgba(0,0,0,.3)',
          }}>
          <span
            className='absolute left-[6px] top-[5px] h-[2px] w-[2px] bg-[#D2FD50]'
            style={{ boxShadow: '8px 4px 0 #fff,16px 1px 0 #8589FE,12px 9px 0 #fff,4px 12px 0 #D2FD50' }}
          />
          <ShortcutBadge />
        </span>
      );
    case 'ed5': // 제5회 — 홀로그래픽 미니 스크린 + 바로가기 뱃지
      return (
        <span
          className='relative block h-7 w-[34px] overflow-hidden rounded-[2px] border border-[#5a4b8b]'
          style={{
            background: 'linear-gradient(180deg,#bdeaff,#7fd0f5)',
            boxShadow: '1px 1px 0 rgba(0,0,0,.3)',
          }}>
          <span
            className='absolute left-[11px] top-[7px] h-0 w-0'
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '10px solid #7b3ff2',
            }}
          />
          <ShortcutBadge />
        </span>
      );
  }
};

/** 바로가기 화살표 뱃지(시안 링크 아이콘) */
const ShortcutBadge = () => (
  <span className='absolute bottom-px left-[2px] flex h-[11px] w-[11px] items-center justify-center border border-[#888] bg-white text-[8px] text-ed6-lunaBlue'>
    ↰
  </span>
);
