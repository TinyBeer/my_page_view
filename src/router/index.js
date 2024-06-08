import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '../page/error';
import Login from '../page/login';
import Game from '../page/game';
import Nav from '../page/nav';
import Memo from '../page/memo';
import Cinema from '../page/cinema';
import Video from '../page/cinema/video';
import Upload from '../page/cinema/upload';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <Nav />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/nav',
    element: <Nav />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/game',
    element: <Game />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/memo',
    element: <Memo />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/cinema',
    element: <Cinema />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Video />,
      },
      {
        path: '/cinema/video',
        element: <Video />,
      },
      {
        path: '/cinema/upload',
        element: <Upload />,
      },
    ],
  },
]);

export default router;
