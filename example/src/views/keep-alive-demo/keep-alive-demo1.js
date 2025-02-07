import React, { useEffect } from 'react';
import { useKeepAliveEffect } from '@vgbire/react-keep-alive';

export const KeepAliveDemo1 = () => {
  useEffect(() => {
    console.log('KeepAlive Demo1');
  }, []);
  useKeepAliveEffect(() => {
    console.log('KeepAlive Demo1 激活了');
    return () => {
      console.log('KeepAlive Demo1 失活了');
    };
  });
  return <div>KeepAlive Demo1</div>;
};
