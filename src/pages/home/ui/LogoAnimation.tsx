import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const textVariants = {
  enter: {
    y: 50,
  },
  center: {
    y: 0,
  },
  exit: {
    y: -50,
  },
};

const texts = ['취향을', '감동을', '세계를'];

export const LogoAnimation = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2000); // 2초마다 텍스트 교체

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='w-full flex justify-center font-pyeongchang text-[32px]'>
      <div className='relative overflow-hidden w-[100px] h-10 text-primary'>
        <AnimatePresence>
          <motion.div
            className='absolute top-0 left-0'
            key={index}
            variants={textVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}>
            {texts[index]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='font-pyeongchang font-bold text-point'>MERGE</div>
    </div>
  );
};