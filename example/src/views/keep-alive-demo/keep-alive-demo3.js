import React, { useEffect } from 'react';

export const KeepAliveDemo3 = () => {
  useEffect(() => {
    console.log('KeepAlive Demo3');
  }, []);
  return <div>KeepAlive Demo3</div>;
};
