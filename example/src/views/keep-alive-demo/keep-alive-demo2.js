import React, { useEffect } from 'react';

export const KeepAliveDemo2 = () => {
  useEffect(() => {
    console.log('KeepAlive Demo2');
  }, []);
  return <div>KeepAlive Demo2</div>;
};
