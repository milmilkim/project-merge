import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Stars } from '@/widgets/4th/Stars';
import { Menu } from '@/widgets/4th/Menu';
import { MenuTrigger } from '@/widgets/4th/MenuTrigger';
import { Footer, EditionSwitcher } from '@/widgets';
import { useScrollToTop } from '@/shared/lib';
import { Home } from './Home';
import { About } from './About';
import { Event } from './Event';
import { Film } from './Film';
import { Ticket } from './Ticket';

export default function Edition4() {
  useScrollToTop();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === '/4th' || pathname === '/4th/';

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className='theme-4th w-full min-h-screen bg-ed4-bg text-ed4-text'>
      <Stars />
      <Menu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <EditionSwitcher />
      {!isHome && <MenuTrigger onOpen={() => setIsOpen(true)} />}
      <Routes>
        <Route
          index
          element={<Home isOpen={isOpen} onOpen={() => setIsOpen(true)} />}
        />
        <Route path='about' element={<About />} />
        <Route path='event' element={<Event />} />
        <Route path='film' element={<Film />} />
        <Route path='ticket' element={<Ticket />} />
      </Routes>
      {!isHome && <Footer />}
    </div>
  );
}
