import { motion } from 'framer-motion';
import { EditionSwitcher } from '@/widgets';
import { getEdition } from '@/shared/config/editions';

export default function Edition6() {
  const edition = getEdition('6th');

  return (
    <div className='w-screen min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6'>
      <EditionSwitcher />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='font-pyeongchang font-bold text-3xl lg:text-5xl'>
        {edition?.title}
      </motion.h1>
      <motion.p
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className='mt-6 tracking-[0.4em] text-lg'>
        COMING SOON
      </motion.p>
    </div>
  );
}
