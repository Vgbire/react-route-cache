import React, { useContext, useState, createContext, ReactNode, useEffect, FC } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { TabsItem, CachesItem, LifeCircle } from '../types';

type LifeCircles = { [key: string]: Array<LifeCircle> };

interface KeepAliveContext {
  activateds: LifeCircles;
  setActivateds?: (activateds: LifeCircles) => void;
  deactivateds: LifeCircles;
  setDeactivateds?: (deactivateds: LifeCircles) => void;
  active?: string;
  setActive?: (active: string) => void;
  tabs?: TabsItem[];
  setTabs?: (tabs: TabsItem[]) => void;
  caches?: CachesItem[];
  setCaches?: (caches: CachesItem[]) => void;
  nameKey?: string;
  cacheMaxRemove?: boolean;
}

const KeepAliveContext = createContext<KeepAliveContext>({ activateds: {}, deactivateds: {} });

KeepAliveContext.displayName = 'KeepAliveContext';

interface KeepAliveScopeProps {
  mode?: 'path' | 'search';
  nameKey?: string;
  cacheMaxRemove: boolean;
  children: ReactNode;
}
export const KeepAliveScope: FC<KeepAliveScopeProps> = ({
  mode = 'path',
  nameKey = 'name',
  cacheMaxRemove,
  children,
}) => {
  const { pathname, search } = useLocation();
  const matches: any = useMatches();

  const [activateds, setActivateds] = useState({});
  const [deactivateds, setDeactivateds] = useState({});
  const [active, setActive] = useState('');
  const [tabs, setTabs] = useState<TabsItem[]>([]);
  const [caches, setCaches] = useState<CachesItem[]>([]);

  const dispatchActivateds = () => {
    const key = mode === 'path' ? pathname : pathname + search;

    // 调用activateds
    if (activateds[key]?.length) {
      activateds[key].forEach((item) => {
        const deactivated = item();
        if (deactivated) {
          deactivated.__shouldRemove = true;
          if (!deactivateds[key]) {
            deactivateds[key] = [];
          }
          deactivateds[key].push(deactivated);
          setDeactivateds({ ...deactivateds });
        }
      });
    }
  };

  useEffect(() => {
    const key = mode === 'path' ? pathname : pathname + search;
    // 调用deactivateds方法
    setActive((active) => {
      if (deactivateds[active]?.length) {
        deactivateds[active] = deactivateds[active].filter((item) => {
          item();
          return !item.__shouldRemove;
        });
        setDeactivateds({ ...deactivateds });
      }
      return key;
    });

    dispatchActivateds();

    const label = matches[matches.length - 1].handle?.[nameKey];
    const existTab = tabs.find((item) => item.key === key);
    if (!existTab && label) {
      setTabs([
        ...tabs,
        {
          key: key,
          label,
        },
      ]);
    }
  }, [pathname, search, mode]);

  useEffect(() => {
    const key = mode === 'path' ? pathname : pathname + search;

    dispatchActivateds();
  }, [activateds]);

  return (
    <KeepAliveContext.Provider
      value={{
        activateds,
        setActivateds,
        deactivateds,
        setDeactivateds,
        active,
        setActive,
        tabs,
        setTabs,
        caches,
        setCaches,
        nameKey,
        cacheMaxRemove,
      }}
    >
      {children}
    </KeepAliveContext.Provider>
  );
};

export const useKeepAliveContext = () => {
  const context = useContext(KeepAliveContext);

  if (!context) {
    throw new Error('useKeepAlive必须在KeepAliveContext中使用');
  }

  return context;
};
