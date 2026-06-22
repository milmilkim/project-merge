import { motion } from "framer-motion";
import Poster from '@/shared/assets/images/poster.jpg'
export const TicketCard = () => {
  return (
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
  );
};
