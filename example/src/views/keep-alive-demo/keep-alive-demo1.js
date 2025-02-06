import React, { useEffect } from 'react';
import { useActivated } from '@vgbire/react-keep-alive';

export const KeepAliveDemo1 = () => {
  useEffect(() => {
    console.log('KeepAlive Demo1');
  }, []);
  useActivated(() => {
    console.log('KeepAlive Demo1 激活了');
    return () => {
      console.log('KeepAlive Demo1 失活了');
    };
  });
  return <div>KeepAlive Demo1</div>;
};
