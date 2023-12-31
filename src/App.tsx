import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import CommonLayout from './components/layout/CommonLayout';

import Home from './pages/Home';
import About from './pages/About';
import Event from './pages/Event';
import Film from './pages/Film';
import Ticket from './pages/Ticket';

const router = createBrowserRouter([
  {
    path: '/',
    element: <CommonLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/event',
        element: <Event />,
      },
      {
        path: '/film',
        element: <Film />,
      },
      {
        path: '/ticket',
        element: <Ticket />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
