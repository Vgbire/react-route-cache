import { useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { useKeepAliveContext } from '../context';
import { LifeCircle } from '../types';

export const useActivated = (callback: LifeCircle, deps: any[] = []) => {
  const { activateds, setActivateds } = useKeepAliveContext();
  const { pathname } = useLocation();

  const id = useId();
  useEffect(() => {
    callback.id = id;
    if (!activateds[pathname]) {
      activateds[pathname] = [];
    }
    const index = activateds[pathname].findIndex((item) => item.id === id);
    if (index !== -1) {
      activateds[pathname].splice(index, 1);
    }
    activateds[pathname].push(callback);
    setActivateds({ ...activateds });
    return () => {
      delete activateds[pathname];
      setActivateds({ ...activateds });
    };
  }, [...deps]);
};
