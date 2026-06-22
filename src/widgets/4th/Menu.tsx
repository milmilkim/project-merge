import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menus = [
  { name: '홈', path: '/4th' },
  { name: '머지영화제 소개', path: '/4th/about' },
  { name: '4회 머지영화제', path: '/4th/event' },
  { name: '상영작', path: '/4th/film' },
  { name: '티켓', path: '/4th/ticket' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Menu = ({ isOpen, onClose }: Props) => {
  const location = useLocation();

  const close = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          onClick={close}
          className='w-full h-screen fixed top-0 left-0 bg-black bg-opacity-25 z-50'>
          <motion.div
            initial={{
              scale: 0,
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              scale: 1,
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
            }}
            exit={{
              scale: 0,
            }}
            className='w-4/5 sm:w-2/5 h-auto bg-opacity-90 bg-ed4-bg fixed border-solid border-4 border-ed4-point rounded-2xl p-3'>
            <nav
              className=' text-ed4-primary text-2xl flex justify-center'
              onClick={(e) => e.stopPropagation()}>
              <ul className='space-y-1 w-full ml-10'>
                {menus.map((menu, index) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <li
                      key={index}
                      className={`hover:text-white hover:before:content-[">"] focus:text-white ${
                        isActive ? 'text-white' : ''
                      }`}>
                      <Link to={menu.path || '/4th'}>{menu.name}</Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
};
