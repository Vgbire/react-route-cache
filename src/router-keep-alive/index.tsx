import React, { useContext, useState, createContext, ReactNode, useEffect, FC, CSSProperties } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { TabsItem, CachesItem, LifeCircle } from '../types';
import { RouterTabs } from './router-tabs';
import { RouterCache } from './router-cache';

type LifeCircles = { [key: string]: Array<LifeCircle> };

interface RouterKeepAliveContext {
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
  theme?: 'light' | 'dark';
  size?: 'small' | 'middle' | 'large';
  max?: number;
}

const RouterKeepAliveContext = createContext<RouterKeepAliveContext>({ activateds: {}, deactivateds: {} });

RouterKeepAliveContext.displayName = 'RouterKeepAlive';

interface RouterKeepAliveProps {
  mode?: 'path' | 'search';
  nameKey?: string;
  cacheMaxRemove?: boolean;
  theme?: 'light' | 'dark';
  size?: 'small' | 'middle' | 'large';
  max?: number;
  custom?: boolean;
  bodyStyles?: {
    wrapper?: CSSProperties;
    content?: CSSProperties;
  };
  children: ReactNode;
}
export const RouterKeepAlive: FC<RouterKeepAliveProps> = ({
  mode = 'path',
  nameKey = 'name',
  cacheMaxRemove,
  theme = 'light',
  size = 'middle',
  max = 10,
  custom,
  bodyStyles,
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
        deactivateds[active].forEach((item) => {
          item();
        });
        delete deactivateds[active];
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

  return (
    <RouterKeepAliveContext.Provider
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
        theme,
        size,
        max,
      }}
    >
      {custom ? (
        children
      ) : (
        <>
          <RouterTabs />
          <RouterCache styles={bodyStyles}>{children}</RouterCache>
        </>
      )}
    </RouterKeepAliveContext.Provider>
  );
};

export const useKeepAliveContext = () => {
  const context = useContext(RouterKeepAliveContext);

  if (!context) {
    throw new Error('useKeepAliveContext 必须在 RouterKeepAliveContext 中使用');
  }

  return context;
};
