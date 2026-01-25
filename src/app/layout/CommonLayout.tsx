import { Outlet } from 'react-router-dom';
import Stars from '@/widgets/Stars';
import Footer from '@/widgets/Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const CommonLayout = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className='w-screen min-h-screen'>
      <Stars />
      <Outlet />
      <Footer />
    </div>
  );
};
