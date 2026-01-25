import { Outlet, useLocation } from 'react-router-dom';
import { Stars, Footer, Menu, MenuTrigger } from '@/widgets';
import { useScrollToTop } from '@/shared/lib';

export const CommonLayout = () => {
  const { pathname } = useLocation();
  useScrollToTop();

  const isHome = pathname === '/';

  return (
    <div className='w-screen min-h-screen'>
      <Stars />
      <Menu />
      {!isHome && <MenuTrigger />}
      <Outlet />
      <Footer />
    </div>
  );
};
