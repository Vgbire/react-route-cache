import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { changeVersion } from '@vgbire/react-keep-alive';
changeVersion(6);
export default function App() {
  return <RouterProvider router={router} />;
}
