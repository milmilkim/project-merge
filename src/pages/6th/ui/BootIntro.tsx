import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SCANLINES, ACCENT } from './styles';

interface Props {
  onDone: () => void;
}

type Phase = 'post' | 'logo' | 'welcome';

/** BIOS POST 라인(시안 그대로) */
const POST_LINES: { html: string }[] = [
  { html: 'MERGE BIOS v6.00 — (C) 2026 MERGE OS' },
  { html: 'Energy Star compliant&nbsp;&nbsp;&nbsp;◆' },
  { html: '<i></i>' },
  { html: 'Main Memory&nbsp;: 6144K&nbsp;OK' },
  { html: 'Detecting Films . . . . . . . . . OK' },
  {
    html: 'Detecting Venue . . . . . . . . . <span style="color:#ffd24a;">TBA</span>',
  },
  { html: `Festival Edition&nbsp;: <span style="color:${ACCENT};">#6</span>` },
  { html: '<i></i>' },
  { html: '<span style="color:#cfe;">제 6 회 &nbsp; 머 지 영 화 제</span>' },
];

/**
 * 부팅 인트로: BIOS POST → MERGE OS 6 로고+로딩 → 환영합니다 → 데스크탑.
 * framer-motion으로 시퀀스를 구성하고 끝나면 onDone을 호출한다.
 */
export const BootIntro = ({ onDone }: Props) => {
  const [phase, setPhase] = useState<Phase>('post');
  const [lines, setLines] = useState(0);

  // POST 라인 순차 노출
  useEffect(() => {
    if (phase !== 'post') return;
    if (lines >= POST_LINES.length) {
      const t = setTimeout(() => setPhase('logo'), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLines((n) => n + 1), 150);
    return () => clearTimeout(t);
  }, [phase, lines]);

  // 로고 → 환영 → 종료
  useEffect(() => {
    if (phase === 'logo') {
      const t = setTimeout(() => setPhase('welcome'), 1400);
      return () => clearTimeout(t);
    }
    if (phase === 'welcome') {
      const t = setTimeout(onDone, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div
      className='theme-6th fixed inset-0 z-[200] flex items-center justify-center bg-black'
      onClick={phase === 'welcome' ? onDone : undefined}>
      <Scanlines />
      <AnimatePresence mode='wait'>
        {phase === 'post' && <PostScreen key='post' lines={lines} />}
        {phase === 'logo' && <LogoScreen key='logo' />}
        {phase === 'welcome' && <WelcomeScreen key='welcome' />}
      </AnimatePresence>
    </div>
  );
};

const Scanlines = () => (
  <div
    className='pointer-events-none absolute inset-0 z-[2]'
    style={{ background: SCANLINES }}
  />
);

const PostScreen = ({ lines }: { lines: number }) => (
  <motion.div
    exit={{ opacity: 0 }}
    className='absolute inset-0 flex items-center justify-center'
    style={{ background: '#04140c' }}>
    <div
      className='font-galmuri11 w-[min(92vw,560px)] px-4 text-[11px] leading-[1.8] text-[#37e89a]'
      style={{ textShadow: '0 0 6px rgba(55,232,154,.6)' }}>
      {POST_LINES.slice(0, lines).map((l, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: l.html || '&nbsp;' }} />
      ))}
      {lines >= POST_LINES.length && (
        <div className='mt-3 text-[#9fdcb8]'>
          Press <b className='text-white'>DEL</b> to enter SETUP{' '}
          <Cursor color='#37e89a' />
        </div>
      )}
    </div>
  </motion.div>
);

const LogoScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='absolute inset-0 flex flex-col items-center justify-center'
    style={{ background: 'radial-gradient(circle at 50% 38%,#0a2a6e,#04102e 70%)' }}>
    <div
      className='merge-title text-[14px] tracking-[3px]'
      style={{ color: ACCENT, textShadow: `0 0 10px ${ACCENT}` }}>
      MERGE OS 6
    </div>
    <div
      className='merge-title my-2 text-center text-[28px] leading-[1.1] text-white'
      style={{ textShadow: '0 0 14px rgba(120,180,255,.5)' }}>
      제6회
      <br />
      머지영화제
    </div>
    <div className='mt-[18px] h-[13px] w-[170px] overflow-hidden rounded-[7px] border border-[rgba(120,160,255,.4)] bg-white/10 p-[2px]'>
      <motion.div
        className='h-full w-[60px] rounded-[5px]'
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg,#2f8bff 0 12px,transparent 12px 20px)',
          backgroundSize: '32px 100%',
        }}
        animate={{ x: [0, 110, 0] }}
        transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
      />
    </div>
    <div className='font-galmuri11 mt-3 text-[11px] text-[#9fc0ff]'>시작하는 중…</div>
  </motion.div>
);

const WelcomeScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className='absolute inset-0 flex items-center justify-center'
    style={{ background: 'linear-gradient(120deg,#0b52d6,#1f8be8 50%,#0b52d6)' }}>
    <div className='relative flex w-full max-w-[640px] items-center'>
      {/* 좌 */}
      <div className='flex-1 pr-6 text-right'>
        <span
          className='font-galmuri11 text-[22px] text-white'
          style={{ textShadow: '1px 1px 3px rgba(0,0,40,.5)' }}>
          환영합니다
        </span>
      </div>
      {/* 분할선 */}
      <div className='h-[120px] w-px bg-white/35' />
      {/* 우 */}
      <div className='flex flex-1 items-center gap-3 pl-6'>
        <span
          className='h-11 w-11 rounded-full'
          style={{
            background: `radial-gradient(circle at 35% 30%,${ACCENT},#0b88d6)`,
            boxShadow: `0 0 16px ${ACCENT}`,
          }}
        />
        <span className='font-galmuri11 text-[11px] leading-[1.6] text-white'>
          방문자
          <br />
          <span className='text-[11px] text-[#cfe6ff]'>로그인 중…</span>
        </span>
      </div>
    </div>
    <div className='font-galmuri11 absolute inset-x-0 bottom-[14px] text-center text-[11px] text-white/80'>
      제6회 머지영화제 · MERGE OS 6
    </div>
  </motion.div>
);

const Cursor = ({ color }: { color: string }) => (
  <motion.span
    className='inline-block h-[13px] w-2 align-[-2px]'
    style={{ background: color }}
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ duration: 1, times: [0, 0.49, 0.5, 1], ease: 'linear', repeat: Infinity }}
  />
);
