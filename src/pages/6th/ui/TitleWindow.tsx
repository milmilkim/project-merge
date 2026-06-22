import { motion } from 'framer-motion';
import { edition6 } from '../config';
import { MARQUEE } from './styles';
import { Hourglass } from './RetroIcons';

/**
 * 타이틀 윈도우 본문. (시안 메인 타이틀 윈도우 그대로)
 */
export const TitleWindow = () => {
  return (
    <div className='w-[min(86vw,488px)] px-[26px] pb-6 pt-[22px]'>
      <div className='merge-title text-[14px] tracking-[1px] text-ed6-lunaBlue'>
        {edition6.subtitle}
      </div>
      <div
        className='merge-title mb-[2px] mt-1 text-[28px] leading-[1.06] sm:text-[42px]'
        style={{ textShadow: '2px 2px 0 rgba(11,82,214,.16)' }}>
        제6회
        <br />
        머지영화제
      </div>

      <motion.span
        className='font-galmuri11 mt-2 inline-block text-[22px] tracking-[5px] text-ed6-lunaBlue'
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 1.3,
          times: [0, 0.49, 0.5, 1],
          ease: 'linear',
          repeat: Infinity,
        }}>
        {edition6.status}
      </motion.span>

      <div className='mt-[18px] flex flex-col gap-2'>
        {edition6.info.map((row) => (
          <div
            key={row.label}
            className='font-galmuri11 flex items-center gap-[10px] text-[11px]'>
            <span className='w-[54px] text-[#666]'>{row.label}</span>
            <span
              className='flex-1 border border-[#9a9a9a] bg-white px-[9px] py-[4px] text-[#222]'
              style={{ boxShadow: 'inset 1px 1px 0 #cfcabd' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* 마퀴 로딩바 */}
      <div
        className='mt-[18px] flex h-[19px] items-center border border-[#8a8a8a] bg-white p-[2px]'
        style={{ boxShadow: 'inset 1px 1px 0 #cfcabd' }}>
        <motion.div
          className='h-full flex-1 rounded-[1px]'
          style={{ backgroundImage: MARQUEE, backgroundSize: '42px 100%' }}
          animate={{ backgroundPositionX: ['0px', '42px'] }}
          transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
        />
      </div>
      <div className='font-galmuri11 mt-[6px] flex items-center gap-[6px] text-[11px] text-[#666]'>
        <Hourglass size={12} />
        제6회를 준비하는 중입니다…
      </div>

      {/* 버튼 */}
      <div className='mt-[18px] flex justify-end'>
        <button
          disabled
          className='cursor-not-allowed rounded-[3px] border border-[#b4b0a2] px-4 py-[5px] font-os text-[12px] font-bold text-[#a7a397]'
          style={{ background: 'linear-gradient(180deg,#eceadf,#d6d2c4)' }}>
          자세히 (준비중)
        </button>
      </div>
    </div>
  );
};
