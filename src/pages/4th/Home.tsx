import { Header, LogoAnimation, Ship } from './ui';

import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { isOpenAtom } from '@/shared/model/menu';

export const Home = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const openMenu = () => {
    setIsOpen(true);
  };

  return (
    <div
      className='w-full h-[100dvh] flex flex-col cursor-default'
      onClick={openMenu}>
      <Header />

      <Ship />
      <LogoAnimation />
      {!isOpen && (
        <motion.span
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            type: 'keyframes',
          }}
          className='text-ed4-point m-auto cursor-pointer'>
          Click to continue...
        </motion.span>
      )}
    </div>
  );
};
