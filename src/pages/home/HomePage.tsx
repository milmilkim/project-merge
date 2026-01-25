import { Header, LogoAnimation, Ship, Menu } from '@/pages/home/ui';

import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { isOpenAtom } from '@/pages/home/model/menuAtom';

export const HomePage = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const openMenu = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className='w-full flex flex-col cursor-default'
        style={{ height: window.innerHeight }}
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
            className='text-point m-auto cursor-pointer'>
            Click to continue...
          </motion.span>
        )}

        <Menu />
      </div>
    </>
  );
};
