import { motion } from 'framer-motion';
import { EditionSwitcher } from '@/widgets';

export default function Edition6() {
  return (
    <div className='relative w-full min-h-screen bg-black text-white'>
      <EditionSwitcher />
      <div className='flex flex-col items-center justify-center min-h-screen text-center px-6'>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='font-pyeongchang font-bold text-3xl lg:text-5xl'>
          제6회 머지영화제
        </motion.h1>
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className='mt-6 tracking-[0.4em] text-lg'>
          COMING SOON
        </motion.p>
      </div>
    </div>
  );
}
