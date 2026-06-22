import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * 호러물 느낌의 글리치 텍스트.
 * RGB 색수차 분리 + 미세 흔들림 + 깜빡임으로 '의도된 손상'처럼 보이게 한다.
 * (인코딩 깨짐이 아니라 연출임을 분명히 하기 위함)
 */
export const GlitchText = ({ children, className = '' }: Props) => (
  <motion.span
    className={`inline-block ${className}`}
    animate={{
      x: [0, -1, 1, -1, 0.5, 0],
      opacity: [1, 0.78, 1, 0.6, 1, 0.9],
      textShadow: [
        '1px 0 #ff2d2d, -1px 0 #19e3d6',
        '-1.5px 0 #ff2d2d, 1.5px 0 #19e3d6',
        '1px 0 #ff2d2d, -1px 0 #19e3d6',
        '0 0 #ff2d2d, 0 0 #19e3d6',
        '1.5px 0 #ff2d2d, -1.5px 0 #19e3d6',
        '1px 0 #ff2d2d, -1px 0 #19e3d6',
      ],
    }}
    transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}>
    {children}
  </motion.span>
);
