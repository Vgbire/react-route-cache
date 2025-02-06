import { useEffect, useId } from 'react';
import { useLocation } from 'react-router-dom';
import { LifeCircle } from '../../types';
import { useKeepAliveContext } from '..';

export const useRouterActivated = (callback: LifeCircle, deps: any[] = []) => {
  const { activateds, setActivateds, deactivateds, setDeactivateds } = useKeepAliveContext();
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
    // 执行callback
    const deactivated = callback();
    if (deactivated) {
      if (!deactivateds[pathname]) {
        deactivateds[pathname] = [];
      }
      deactivateds[pathname].push(deactivated);
      setDeactivateds({ ...deactivateds });
    }
    return () => {
      delete activateds[pathname];
      setActivateds({ ...activateds });
    };
  }, [...deps]);
};
