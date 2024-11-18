import './styles.css';
import { Menu } from 'antd';
import { useNavigate, useOutlet } from 'react-router-dom';
import { Flex } from 'antd';
import { KeepAlive, KeepAliveScope, RouterTabs } from 'react-route-cache';

export default function Layout() {
  const navigate = useNavigate();
  const outlet = useOutlet();

  const items = [
    {
      key: 'customer',
      label: '客户',
      url: '/customer',
    },
    {
      key: 'user',
      label: '用户',
      url: '/user',
    },
    {
      key: 'tenant',
      label: '租户',
      url: '/tenant',
    },
    {
      key: 'management',
      label: '管理',
      url: '/management',
    },
  ];
  return (
    <Flex>
      <Menu
        onClick={({ item }) => {
          navigate(item.props.url);
        }}
        style={{ width: 100, height: '100vh' }}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
        theme="dark"
      />
      <div style={{ flex: 1 }}>
        <KeepAliveScope>
          <RouterTabs theme="dark" size="small" />
          <RouterTabs theme="dark" size="middle" />
          <RouterTabs theme="dark" size="large" />
          <KeepAlive styles={{ wrapper: { padding: 20 } }}>{outlet}</KeepAlive>
        </KeepAliveScope>
      </div>
    </Flex>
  );
}
