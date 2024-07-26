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
  cahces?: CachesItem[];
  setCaches?: (cahces: CachesItem[]) => void;
}

const KeepAliveContext = createContext<KeepAliveContext>({ activateds: {}, deactivateds: {} });

KeepAliveContext.displayName = 'KeepAliveContext';

interface KeepAliveScopeProps {
  mode?: 'path' | 'search';
  nameKey?: string;
  children: ReactNode;
}
export const KeepAliveScope: FC<KeepAliveScopeProps> = ({ mode = 'path', nameKey = 'name', children }) => {
  const { pathname, search } = useLocation();
  const matches: any = useMatches();

  const [activateds, setActivateds] = useState({});
  const [deactivateds, setDeactivateds] = useState({});
  const [active, setActive] = useState('');
  const [tabs, setTabs] = useState<TabsItem[]>([]);
  const [cahces, setCaches] = useState<CachesItem[]>([]);

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

    const existTab = tabs.find((item) => item.key === key);
    if (!existTab) {
      setTabs([
        ...tabs,
        {
          key: key,
          label: matches[matches.length - 1].handle?.[nameKey],
        },
      ]);
    }
  }, [pathname, search, mode]);

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
        cahces,
        setCaches,
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
