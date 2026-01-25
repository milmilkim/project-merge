import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { isOpenAtom } from '@/shared/model/menu';

const menus = [
  { name: '홈', path: '/' },
  { name: '머지영화제 소개', path: '/about' },
  { name: '4회 머지영화제', path: '/event' },
  { name: '상영작', path: '/film' },
  { name: '티켓', path: '/ticket' },
];

export const Menu = () => {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  const close = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setIsOpen(false);
    },
    [setIsOpen]
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          onClick={close}
          className='w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-25 z-50'>
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
            className='w-4/5 sm:w-2/5 h-auto bg-opacity-90 bg-background fixed border-solid border-4 border-point rounded-2xl p-3'>
            <nav
              className=' text-primary text-2xl flex justify-center'
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
                      <Link to={menu.path || '/'}>{menu.name}</Link>
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
