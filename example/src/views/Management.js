import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useActivated, useDeactivated } from 'react-route-cache';

export default function Management() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useActivated(() => {
    console.log('管理页面进来了');
  });

  useDeactivated(() => {
    console.log('管理页面离开了');
  });

  return (
    <Spin spinning={loading}>
      <div>管理页面 - 首次加载有Loading，切换无Loading</div>
    </Spin>
  );
}
