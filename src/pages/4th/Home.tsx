import { Header, LogoAnimation, Ship } from './ui';
import { motion } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
}

export const Home = ({ isOpen, onOpen }: Props) => {
  return (
    <div
      className='w-full h-[100dvh] flex flex-col cursor-default'
      onClick={onOpen}>
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
