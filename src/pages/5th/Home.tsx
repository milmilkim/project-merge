import Gem from '@/shared/assets/images/gem.gif';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { isOpenAtom } from '@/shared/model/menu';
import { getEdition } from '@/shared/config/editions';

export const Home = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const edition = getEdition('5th');

  return (
    <div
      onClick={() => setIsOpen(true)}
      className='w-full h-[100dvh] flex flex-col items-center justify-center cursor-default text-ed5-text'>
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
      <h1 className='font-bold text-3xl lg:text-4xl mt-6'>
        {edition?.title}
      </h1>
      <p className='mt-2 text-ed5-primary'>{edition?.subtitle}</p>
      {!isOpen && (
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            type: 'keyframes',
          }}
          className='text-ed5-point mt-12 cursor-pointer'>
          Click to continue...
        </motion.span>
      )}
    </div>
  );
};
