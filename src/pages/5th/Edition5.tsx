import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { GemBackground } from '@/widgets/5th/GemBackground';
import { Menu } from '@/widgets/5th/Menu';
import { MenuTrigger } from '@/widgets/5th/MenuTrigger';
import { Footer } from '@/widgets';
import { useScrollToTop } from '@/shared/lib';
import { Home } from './Home';
import { About } from './About';
import { Event } from './Event';
import { Film } from './Film';

export default function Edition5() {
  useScrollToTop();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === '/5th' || pathname === '/5th/';

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className='theme-5th w-full min-h-screen bg-ed5-bg text-ed5-text'>
      <GemBackground />
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {!isHome && <MenuTrigger onOpen={() => setIsOpen(true)} />}
      <Routes>
        <Route
          index
          element={<Home isOpen={isOpen} onOpen={() => setIsOpen(true)} />}
        />
        <Route path='about' element={<About />} />
        <Route path='event' element={<Event />} />
        <Route path='film' element={<Film />} />
      </Routes>
      {!isHome && <Footer />}
    </div>
  );
}
