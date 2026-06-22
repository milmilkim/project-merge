import { motion } from 'framer-motion';
import { ACCENT } from './styles';

/**
 * 시안 UI 컴포넌트 섹션의 커서/인디케이터 아이콘들(전부 CSS 아트).
 * 로딩/대기 표현에 재사용한다.
 */

/** 모래시계 커서 */
export const Hourglass = ({ size = 14 }: { size?: number }) => (
  <span
    className='relative inline-block align-middle'
    style={{ width: size, height: size * 1.3 }}>
    <span
      className='absolute left-0 top-0'
      style={{
        width: size,
        height: size / 2,
        background: '#0b52d6',
        clipPath: 'polygon(0 0,100% 0,50% 100%)',
      }}
    />
    <span
      className='absolute bottom-0 left-0'
      style={{
        width: size,
        height: size / 2,
        background: '#0b52d6',
        clipPath: 'polygon(50% 0,0 100%,100% 100%)',
      }}
    />
    <span
      className='absolute'
      style={{
        top: size * 0.42,
        left: size * 0.36,
        width: size * 0.28,
        height: size * 0.42,
        background: ACCENT,
        boxShadow: `0 0 5px ${ACCENT}`,
      }}
    />
  </span>
);

/** 비지(busy) 스피너 */
export const BusySpinner = ({ size = 16 }: { size?: number }) => (
  <motion.span
    className='inline-block rounded-full border-[3px] border-[#cfcabd] align-middle'
    style={{ width: size, height: size, borderTopColor: '#0b52d6' }}
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
  />
);

/** 링크(바로가기) 화살표 커서 */
export const LinkArrow = ({ size = 13 }: { size?: number }) => (
  <span
    className='inline-block align-middle'
    style={{
      width: 0,
      height: 0,
      borderLeft: `${size}px solid #fff`,
      borderTop: `${size * 0.25}px solid transparent`,
      borderBottom: `${size * 0.7}px solid transparent`,
      filter: 'drop-shadow(1px 1px 0 #000) drop-shadow(-1px 0 0 #000)',
      transform: 'rotate(-20deg)',
    }}
  />
);
