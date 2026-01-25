import { CommonLayout } from '@/app/layout';

import { HomePage } from '@/pages/home/HomePage';
import { AboutPage } from '@/pages/about/AboutPage';
import { EventPage } from '@/pages/event/EventPage';
import { FilmPage } from '@/pages/film/FilmPage';
import { TicketPage } from '@/pages/ticket/TicketPage';

import { createBrowserRouter } from 'react-router-dom';

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <CommonLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/event',
        element: <EventPage />,
      },
      {
        path: '/film',
        element: <FilmPage />,
      },
      {
        path: '/ticket',
        element: <TicketPage />,
      },
    ],
  },
]);
