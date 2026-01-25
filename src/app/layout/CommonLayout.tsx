import { Outlet } from 'react-router-dom';
import { Stars, Footer } from '@/widgets';
import { useScrollToTop } from '@/shared/lib';

export const CommonLayout = () => {
  useScrollToTop();

  return (
    <div className='w-screen min-h-screen'>
      <Stars />
      <Outlet />
      <Footer />
    </div>
  );
};
