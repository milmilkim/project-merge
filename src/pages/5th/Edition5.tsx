import { Routes, Route, useLocation } from 'react-router-dom';
import { GemBackground } from '@/widgets/5th/GemBackground';
import { Menu } from '@/widgets/5th/Menu';
import { MenuTrigger } from '@/widgets/5th/MenuTrigger';
import { Footer, EditionSwitcher } from '@/widgets';
import { useScrollToTop } from '@/shared/lib';
import { Home } from './Home';
import { About } from './About';
import { Event } from './Event';
import { Film } from './Film';
import { Ticket } from './Ticket';

export default function Edition5() {
  useScrollToTop();
  const { pathname } = useLocation();
  const isHome = pathname === '/5th' || pathname === '/5th/';

  return (
    <div className='theme-5th w-screen min-h-screen bg-ed5-bg text-ed5-text'>
      <GemBackground />
      <Menu />
      <EditionSwitcher />
      {!isHome && <MenuTrigger />}
      <Routes>
        <Route index element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='event' element={<Event />} />
        <Route path='film' element={<Film />} />
        <Route path='ticket' element={<Ticket />} />
      </Routes>
      {!isHome && <Footer />}
    </div>
  );
}
