import './styles.css';
import { Menu } from 'antd';
import { useNavigate, useOutlet } from 'react-router-dom';
import { Flex } from 'antd';
import { RouterCache, RouterKeepAliveScope, RouterTabs } from '@Vgbire/react-keep-alive';

export default function Layout() {
  const navigate = useNavigate();
  const outlet = useOutlet();

  const items = [
    {
      key: 'customer',
      label: 'KeepAlive',
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
        style={{ width: 120, height: '100vh' }}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
      <div style={{ flex: 1 }}>
        <RouterKeepAliveScope cacheMaxRemove size="large" theme="dark">
          <RouterTabs />
          <RouterCache style={{ padding: 20 }} max={3}>
            {outlet}
          </RouterCache>
        </RouterKeepAliveScope>
      </div>
    </Flex>
  );
}
