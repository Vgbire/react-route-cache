import { useCallback, useEffect, useId } from 'react';
import { useLocation, useMatches } from '@src/router-verison';
import { LifeCircle } from '../../types';
import { useKeepAliveContext } from '..';

export const useRouterEffect = (callback: LifeCircle, deps: any[] = []) => {
  const { activateds, setActivateds, deactivateds, setDeactivateds, nameKey } = useKeepAliveContext();
  const { pathname } = useLocation();

  // 设置为不缓存的，不需要将回调添加到activateds
  const matches: any = useMatches();

  const id = useId();
  const handleEffect = useCallback(() => {
    callback.id = id;
    if (!activateds[pathname]) {
      activateds[pathname] = [];
    }
    const index = activateds[pathname].findIndex((item) => item.id === id);
    if (index !== -1) {
      activateds[pathname].splice(index, 1);
    }
    const handle = matches[matches.length - 1].handle;
    const cache = handle?.[nameKey] && (handle?.cache ?? true);
    if (cache) {
      activateds[pathname].push(callback);
      setActivateds({ ...activateds });
    }
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
  }, [activateds, deactivateds, matches]);

  useEffect(() => {
    handleEffect();
  }, [...deps]);
};
