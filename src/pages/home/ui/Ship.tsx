import Image from '@/shared/assets/images/ship.png';
import { motion } from 'framer-motion';

export const Ship = () => {
  return (
    <motion.div
      animate={{
        y: [0, 20, 0],
      }}
     
      transition={{ repeat: Infinity, duration: 2, type: 'tween' }}
      className='absolute w-24  lg:w-48 bottom-10 left-5'>
      <img className='w-full h-full' src={Image} alt='머지 우주선' />
    </motion.div>
  );
};