import { Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { KeepAlive, useActivated, useDeactivated } from '@Vgbire/react-keep-alive';
import { KeepAliveDemo1 } from './keep-alive-demo/keep-alive-demo1';
import { KeepAliveDemo2 } from './keep-alive-demo/keep-alive-demo2';
import { KeepAliveDemo3 } from './keep-alive-demo/keep-alive-demo3';

export default function Customer() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useActivated(() => {
    console.log('客户页面进来了');
    return () => {
      console.log('activated返回的方法会在Deactivated的时候执行');
    };
  }, []);

  useDeactivated(() => {
    console.log('客户页面离开了');
  }, []);

  const [activeKey, setActiveKey] = useState('1');
  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };

  return (
    <Spin spinning={loading}>
      <div>客户页面 - 首次加载有Loading，切换无Loading</div>
      <h3>KeepAlive Example</h3>
      <Tabs
        onChange={onChange}
        activeKey={activeKey}
        items={[
          { label: 'Tab 1', key: '1' },
          { label: 'Tab 2', key: '2' },
          { label: 'Tab 3', key: '3' },
        ]}
      />
      <KeepAlive
        activeKey={activeKey}
        exclude={['1']}
        items={[
          { key: '1', children: <KeepAliveDemo1 /> },
          { key: '2', children: <KeepAliveDemo2 /> },
          { key: '3', children: <KeepAliveDemo3 /> },
        ]}
      />
    </Spin>
  );
}
