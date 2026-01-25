import Logo from '@/shared/assets/images/logo.png';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileTap={{
        scale: 1.2,
      }}>
      <div className='w-full items-center justify-center mt-24 md:mt-0 '>
        <img
          src={Logo}
          className='h-auto w-full lg:w-2/5 m-auto'
          alt='머지 영화제 로고'
        />
      </div>
    </motion.div>
  );
};
