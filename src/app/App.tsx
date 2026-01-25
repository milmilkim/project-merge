import { RouterProvider } from 'react-router-dom';
import { AppRouter } from '@/app/routers/AppRouter';

function App() {
  return (
    <div>
      <RouterProvider router={AppRouter} />
    </div>
  );
}

export default App;
