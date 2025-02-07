import { useEffect, useId } from 'react';
import { LifeCircle } from '../../types';
import { useKeepAliveScopeContext } from '../context';

export const useKeepAliveEffect = (callback: LifeCircle, deps: any[] = []) => {
  const { active, activateds, setActivateds } = useKeepAliveScopeContext();

  const id = useId();
  useEffect(() => {
    callback.id = id;
    if (!activateds[active]) {
      activateds[active] = [];
    }
    const index = activateds[active].findIndex((item) => item.id === id);
    if (index !== -1) {
      activateds[active].splice(index, 1);
    }
    activateds[active].push(callback);
    setActivateds?.({ ...activateds });
    return () => {
      delete activateds[active];
      setActivateds?.({ ...activateds });
    };
  }, [...deps]);
};
