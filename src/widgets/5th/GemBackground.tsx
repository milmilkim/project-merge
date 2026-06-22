import { motion } from 'framer-motion';

/** 5회 아이시 홀로그래픽 배경 — 파스텔 블루~퍼블 그라데이션이 천천히 흐른다. */
export const GemBackground = () => {
  return (
    <motion.div
      className='fixed inset-0 -z-10'
      style={{
        background:
          'linear-gradient(135deg, #bdeaff 0%, #c9b8ff 35%, #e0c3ff 70%, #bdeaff 100%)',
        backgroundSize: '300% 300%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
    />
  );
};
