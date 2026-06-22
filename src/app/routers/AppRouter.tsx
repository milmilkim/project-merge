import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy, type ReactNode } from 'react';
import { LATEST } from '@/shared/config/editions';

// 회차 단위 코드 스플리팅 — 해당 회차 진입 시에만 청크 로드
const Edition4 = lazy(() => import('@/pages/4th/Edition4'));
const Edition5 = lazy(() => import('@/pages/5th/Edition5'));
const Edition6 = lazy(() => import('@/pages/6th/Edition6'));

const withSuspense = (node: ReactNode) => (
  <Suspense
    fallback={
      <div className='w-screen h-screen flex items-center justify-center bg-black text-white'>
        LOADING..
      </div>
    }>
    {node}
  </Suspense>
);

export const AppRouter = createBrowserRouter([
  { path: '/', element: <Navigate to={`/${LATEST}`} replace /> },
  { path: '/4th/*', element: withSuspense(<Edition4 />) },
  { path: '/5th/*', element: withSuspense(<Edition5 />) },
  { path: '/6th/*', element: withSuspense(<Edition6 />) },
  { path: '*', element: <Navigate to={`/${LATEST}`} replace /> },
]);
