import { useEffect, useId } from 'react';
import { useLocation } from '@src/router-verison';
import { LifeCircle } from '../../types';
import { useKeepAliveContext } from '..';

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
