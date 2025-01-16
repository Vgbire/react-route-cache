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
      />
      <div style={{ flex: 1 }}>
        <KeepAliveScope cacheMaxRemove>
          <RouterTabs />
          <KeepAlive style={{ padding: 20 }} max={3} size="small">
            {outlet}
          </KeepAlive>
        </KeepAliveScope>
      </div>
    </Flex>
  );
}
