import { useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { useKeepAliveContext } from '../context';
import { LifeCircle } from '../types';

export const useDeactivated = (callback: LifeCircle, deps: any[] = []) => {
  const { deactivateds, setDeactivateds } = useKeepAliveContext();
  const { pathname } = useLocation();

  const id = useId();
  useEffect(() => {
    callback.id = id;
    if (!deactivateds[pathname]) {
      deactivateds[pathname] = [];
    }
    const index = deactivateds[pathname].findIndex((item) => item.id === id);
    if (index !== -1) {
      deactivateds[pathname].splice(index, 1);
    }
    deactivateds[pathname].push(callback);
    setDeactivateds({ ...deactivateds });
    return () => {
      delete deactivateds[pathname];
      setDeactivateds({ ...deactivateds });
    };
  }, [...deps]);
};
