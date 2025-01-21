import React, { useEffect } from 'react';

export const KeepAliveDemo1 = () => {
  useEffect(() => {
    console.log('KeepAlive Demo1');
  }, []);
  return <div>KeepAlive Demo1</div>;
};
