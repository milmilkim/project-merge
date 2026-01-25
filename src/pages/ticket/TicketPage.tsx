import { motion } from 'framer-motion';
import Poster from '@/shared/assets/images/poster.jpg';
export const TicketPage = () => {
  return (
    <div className='px-3 md:px-10 py-10 w-full md:max-w-4xl m-auto'>
      <div className='flex justify-center'>
        <motion.div
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${Poster})`,
          }}
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 1.05 }}
          className={`aspect-[1/2]  w-1/2 md:w-1/4  bg-center bg-cover flex items-center justify-center rounded-lg shadow-md shadow-gray-600`}>
          <span className=' text-2xl font-pyeongchang font-bold px-1 text-indigo-800'>
            NOW PRINTING
          </span>
        </motion.div>
      </div>
      <div className='w-full text-center mt-3 text-point  font-bold'>
        ORIGINAL TICKET <br />
        ￦25,000
      </div>

      <div className='w-full space-y-3 mt-10'>
        <button className='bg-primary uppercase opacity-50 block px-3 m-auto border-t-white border-2 border-l-white border-r-black border-b-black cursor-not-allowed'>
          buy ticket
        </button>
        <div className='text-red-700 font-bold text-xl w-full text-center'>
          SOLD OUT!
        </div>
      </div>
    </div>
  );
};
