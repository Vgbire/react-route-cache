import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Customer from './views/Customer';
import User from './views/User';
import Tenant from './views/Tenant';
import Management from './views/Management';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/customer" />,
      },
      {
        path: 'customer',
        element: <Customer />,
        handle: {
          name: '客户',
        },
      },
      {
        path: 'user',
        element: <User />,
        handle: {
          name: '用户',
          cache: false,
        },
      },
      {
        path: 'tenant',
        element: <Tenant />,
        handle: {
          name: '租户',
        },
      },
      {
        path: 'management',
        element: <Management />,
        handle: {
          name: '管理',
        },
      },
    ],
  },
]);
