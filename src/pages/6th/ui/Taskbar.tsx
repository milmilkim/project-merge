import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { editions } from '@/shared/config/editions';
import { EDITION_NAMES, EDITION6_GLITCH } from '../config';
import { GlitchText } from './GlitchText';
import { TASKBAR, START_GREEN, ACCENT } from './styles';

interface MinimizedItem {
  id: string;
  title: string;
}

interface Props {
  /** 개막일까지 남은 일수. null이면 D-??? */
  days: number | null;
  minimized: MinimizedItem[];
  onRestore: (id: string) => void;
  /** 시작메뉴 우측 항목 → 해당 창 열기 */
  onOpen: (id: string) => void;
}

/** 시작메뉴 우측 메뉴 항목 */
const MENU_ITEMS = [
  { id: 'about', label: '소개' },
  { id: 'films', label: '상영작' },
  { id: 'ticket', label: '티켓팅' },
  { id: 'event', label: '행사정보' },
];

/**
 * 하단 작업표시줄 + 시작 메뉴(회차 스왑 + 메뉴).
 * editions 레지스트리를 직접 읽어 단일 출처를 유지한다.
 */
export const Taskbar = ({ days, minimized, onRestore, onOpen }: Props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className='absolute inset-x-0 bottom-0 z-[70]'>
      <AnimatePresence>
        {open && (
          <>
            <div className='fixed inset-0 z-[69]' onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom left' }}
              className='absolute bottom-[42px] left-1 z-[71] w-[270px] overflow-hidden rounded-t-[8px] rounded-b-[6px] border border-ed6-silverBorder shadow-[0_10px_24px_rgba(0,0,0,.3)]'>
              {/* 헤더 */}
              <div
                className='flex items-center gap-[9px] px-3 py-[10px]'
                style={{ background: 'linear-gradient(180deg,#1f8be8,#0b52d6)' }}>
                <span
                  className='h-[30px] w-[30px] rounded-[5px]'
                  style={{
                    background: `radial-gradient(circle at 35% 30%,${ACCENT},#0b88d6)`,
                    boxShadow: `0 0 8px ${ACCENT}`,
                  }}
                />
                <span
                  className='font-os text-[13px] font-bold text-white'
                  style={{ textShadow: '1px 1px 2px rgba(0,0,40,.5)' }}>
                  방문자 — 머지영화제
                </span>
              </div>

              {/* 2단 */}
              <div className='flex bg-white'>
                {/* 좌: 회차 스왑 */}
                <div className='flex-1 p-[6px]'>
                  {editions.map((e) => {
                    const current = e.no === 6;
                    return (
                      <button
                        key={e.slug}
                        onClick={() => {
                          setOpen(false);
                          if (!current) navigate(`/${e.slug}`);
                        }}
                        className='flex w-full items-center gap-2 rounded-[3px] px-[6px] py-[7px] text-left'
                        style={
                          current
                            ? {
                                background:
                                  'linear-gradient(180deg,#2e7bef,#0b52d6)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3)',
                              }
                            : undefined
                        }>
                        <EditionMini no={e.no} />
                        <span className='min-w-0 flex-1'>
                          <span
                            className={`font-galmuri11 block text-[11px] leading-tight ${
                              current ? 'text-white' : 'text-[#222]'
                            }`}>
                            제{e.no}회
                            {current && <b style={{ color: ACCENT }}> · 현재</b>}
                          </span>
                          {current ? (
                            <GlitchText className='font-galmuri11 block text-[11px] leading-tight text-white/80'>
                              {EDITION6_GLITCH}
                            </GlitchText>
                          ) : (
                            <span className='font-galmuri11 block truncate text-[11px] leading-tight text-[#888]'>
                              {EDITION_NAMES[e.no]}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 우: 메뉴(동작) */}
                <div
                  className='w-[104px] p-2'
                  style={{ background: 'linear-gradient(180deg,#e9f0fb,#d4e2f6)' }}>
                  {MENU_ITEMS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setOpen(false);
                        onOpen(m.id);
                      }}
                      className='font-galmuri11 block w-full rounded-[3px] px-1 py-[6px] text-left text-[11px] text-[#0b3a8a] hover:bg-ed6-lunaBlue2/20'>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 푸터 */}
              <div
                className='flex justify-end gap-[14px] px-3 py-[7px]'
                style={{ background: 'linear-gradient(180deg,#1f8be8,#0b52d6)' }}>
                <span className='flex items-center gap-[5px] font-os text-[11px] text-white'>
                  <span className='h-[14px] w-[14px] rounded-[3px] border-[1.5px] border-white' />
                  로그오프
                </span>
                <span className='flex items-center gap-[5px] font-os text-[11px] text-white'>
                  <span className='h-[14px] w-[14px] rounded-full border-[1.5px] border-white bg-[#e03a13]' />
                  종료
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 작업표시줄 바 */}
      <div
        className='flex h-[42px] items-center border-t border-[#5fa8ff]'
        style={{ background: TASKBAR }}>
        <button
          onClick={() => setOpen((o) => !o)}
          className='flex h-full shrink-0 items-center rounded-r-[14px] py-0 pl-[18px] pr-[22px] active:brightness-95'
          style={{
            background: START_GREEN,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)',
          }}>
          <span
            className='font-os text-[16px] font-bold italic text-white'
            style={{ textShadow: '1px 1px 2px rgba(0,40,0,.6)' }}>
            시작
          </span>
        </button>

        <span
          className='mx-[8px] h-6 w-px shrink-0 bg-black/25'
          style={{ boxShadow: '1px 0 0 rgba(255,255,255,.2)' }}
        />

        {/* 열린 작업(=최소화된 창 복원) */}
        <div className='flex min-w-0 flex-1 items-center gap-2 pr-2'>
          {minimized.map((m) => (
            <button
              key={m.id}
              onClick={() => onRestore(m.id)}
              className='flex h-7 min-w-0 max-w-[200px] flex-1 items-center gap-[7px] rounded-[4px] border border-white/35 px-[10px]'
              style={{
                background: 'linear-gradient(180deg,#2e7bef,#1257cc)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.4)',
              }}>
              <span
                className='h-[13px] w-[13px] shrink-0 rounded-[2px]'
                style={{ background: ACCENT, boxShadow: `0 0 5px ${ACCENT}` }}
              />
              <span
                className='truncate font-os text-[12px] text-white'
                style={{ textShadow: '1px 1px 1px rgba(0,0,40,.5)' }}>
                {m.title}
              </span>
            </button>
          ))}
        </div>

        {/* 트레이 — D-??? 카운트다운 */}
        <div
          className='flex h-full shrink-0 items-center border-l border-[#5fa8ff] px-[14px]'
          style={{ background: 'linear-gradient(180deg,#1f6fe6,#0e51c9)' }}>
          <span className='flex flex-col items-center leading-tight text-white'>
            <span className='font-galmuri11 text-[11px]'>
              D-{days === null ? '???' : days}
            </span>
            <span className='font-galmuri9 text-[9px]' style={{ color: ACCENT }}>
              COUNTDOWN
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

/** 시작메뉴 회차 미니 스크린 */
const EditionMini = ({ no }: { no: number }) => {
  if (no === 4)
    return (
      <span
        className='relative block h-5 w-6 shrink-0 overflow-hidden rounded-[2px]'
        style={{ background: 'linear-gradient(180deg,#0a0b26,#1a1c44)' }}>
        <span
          className='absolute left-1 top-1 h-[2px] w-[2px] bg-[#D2FD50]'
          style={{ boxShadow: '7px 3px 0 #fff,12px 8px 0 #8589FE' }}
        />
      </span>
    );
  if (no === 5)
    return (
      <span
        className='relative block h-5 w-6 shrink-0 overflow-hidden rounded-[2px]'
        style={{ background: 'linear-gradient(180deg,#bdeaff,#7fd0f5)' }}>
        <span
          className='absolute left-2 top-[5px] h-0 w-0'
          style={{
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderBottom: '7px solid #7b3ff2',
          }}
        />
      </span>
    );
  return (
    <span
      className='relative block h-5 w-6 shrink-0 rounded-[2px]'
      style={{ background: 'linear-gradient(180deg,#7ec850,#15a8e6)' }}>
      <span
        className='absolute inset-0'
        style={{
          background:
            'repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 1px,transparent 1px 2px)',
        }}
      />
    </span>
  );
};
