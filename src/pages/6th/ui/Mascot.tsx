import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { mascotMessages } from '../config';
import { ACCENT } from './styles';

/**
 * CRT 마스코트 '삐삐' + 말풍선 알림. (시안 마스코트/알림 그대로)
 * 클릭: 다음 대사 / 더블클릭: 말풍선 숨김.
 * bob은 위아래로만(흔들림 없음), 대사 교체 시 말풍선은 리마운트하지 않아 덜그덕거리지 않는다.
 */
export const Mascot = () => {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  return (
    <div className='absolute bottom-[58px] right-[18px] z-30 flex flex-col items-end gap-3'>
      {/* 말풍선 — show 토글에만 애니메이션, 대사 교체는 텍스트만 바뀜 */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className='relative w-[236px] rounded-[7px] border border-[#c9b24a] px-[13px] py-[11px]'
            style={{ background: 'linear-gradient(180deg,#fffef2,#fdf4c4)' }}>
            <div className='mb-[5px] flex items-center gap-[7px]'>
              <span
                className='flex h-[15px] w-[15px] items-center justify-center rounded-full text-[11px] font-bold text-white'
                style={{ background: 'radial-gradient(circle at 35% 30%,#7fdcff,#0b88d6)' }}>
                i
              </span>
              <span className='font-os text-[12px] font-bold text-[#5a4a12]'>
                머지 알림
              </span>
            </div>
            <p
              className='font-galmuri11 text-[11px] leading-[1.6] text-[#3a3210]'
              dangerouslySetInnerHTML={{ __html: mascotMessages[idx] }}
            />
            <span
              className='absolute -bottom-[9px] right-[34px] h-4 w-4 rotate-45 border-b border-r border-[#c9b24a]'
              style={{ background: '#fdf4c4' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삐삐 — 위아래로만 둥실(흔들림 없음) */}
      <motion.button
        onClick={() => setIdx((i) => (i + 1) % mascotMessages.length)}
        onDoubleClick={() => setShow((s) => !s)}
        title='삐삐 (클릭: 다음 알림 / 더블클릭: 알림 숨김)'
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.4, ease: 'easeInOut', repeat: Infinity }}
        className='relative block'>
        <span
          className='relative block h-[66px] w-[74px] rounded-[13px] border-[3px] border-[#6f6753]'
          style={{
            background: 'linear-gradient(160deg,#d9d4c4,#b6ad95)',
            boxShadow: '2px 4px 0 rgba(0,0,0,.3)',
          }}>
          <span
            className='absolute -top-[18px] left-[-6px] h-[18px] w-[3px] bg-[#6f6753]'
            style={{ transform: 'rotate(-18deg)' }}>
            <span
              className='absolute -left-[2px] -top-[5px] h-2 w-2 rounded-full'
              style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
            />
          </span>
          <span
            className='absolute flex items-center justify-center gap-[10px] rounded-[5px] bg-[#0c2730]'
            style={{ inset: '9px 10px 17px', boxShadow: 'inset 0 0 12px rgba(0,0,0,.7)' }}>
            <span
              className='h-3 w-[9px] rounded-[2px]'
              style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
            />
            <span
              className='h-3 w-[9px] rounded-[2px]'
              style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
            />
          </span>
          <span className='absolute bottom-1 right-[15px] h-[7px] w-4 rounded-b-[7px] border border-t-0 border-[#3a352a]' />
        </span>
      </motion.button>
      <span className='font-galmuri11 whitespace-nowrap text-[11px] text-white drop-shadow-[1px_1px_2px_#000]'>
        삐삐 · MERGE 도우미
      </span>
    </div>
  );
};
