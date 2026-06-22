import Gem from '@/shared/assets/images/gem.gif';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
}

export const Home = ({ isOpen, onOpen }: Props) => {
  return (
    <div
      onClick={onOpen}
      className='relative w-full h-[100dvh] flex flex-col items-center justify-center cursor-default text-ed5-text'>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}>
        <motion.img
          src={Gem}
          alt='머지 보석'
          className='w-44 lg:w-60 drop-shadow-[0_8px_30px_rgba(123,63,242,0.35)]'
          animate={{ y: [0, -14, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </motion.div>
      <h1 className='font-bold text-3xl lg:text-4xl mt-6'>제5회 머지영화제</h1>
      <p className='mt-2 text-ed5-primary'>이상한 영화 몰아보기</p>
      {!isOpen && (
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            type: 'keyframes',
          }}
          className='absolute bottom-24 text-ed5-point cursor-pointer'>
          Click to continue...
        </motion.span>
      )}
    </div>
  );
};
