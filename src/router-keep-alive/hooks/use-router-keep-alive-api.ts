import { useLocation, useNavigate } from 'react-router-dom';
import { useKeepAliveContext } from '..';
import { useCallback } from 'react';

export const useRouterKeepAliveApi = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { active, setActive, tabs, setTabs, activateds, setActivateds, deactivateds, setDeactivateds } =
    useKeepAliveContext();

  const clearLifeCycle = useCallback(
    (key) => {
      delete activateds[key];
      setActivateds({ ...activateds });
      delete deactivateds[key];
      setDeactivateds({ ...deactivateds });
    },
    [active, activateds, deactivateds],
  );

  const close = (key?: string) => {
    const tabKey = key || pathname;
    const index = tabs.findIndex((item) => item.key === tabKey);
    if (index !== -1 && tabs.length > 1) {
      tabs.splice(index, 1);
      setTabs([...tabs]);
      if (active === tabKey) {
        navigator(tabs[0].key);
      }
      // 关闭缓存同时要清除生命周期
      clearLifeCycle(tabKey);
    }
  };

  const closeNavigator = (url: string) => {
    const index = tabs.findIndex((item) => item.key === pathname);
    if (index !== -1) {
      tabs.splice(index, 1);
      setTabs([...tabs]);
      navigator(url);
      // 关闭缓存同时要清除生命周期
      clearLifeCycle(pathname);
    }
  };

  const closeAll = () => {
    setTabs([tabs.find((item) => item.key === active)]);
    tabs.forEach((item) => {
      if (item.key !== active) {
        clearLifeCycle(item.key);
      }
    });
  };

  return {
    active,
    tabs,
    setTabs,
    setActive,
    close,
    closeNavigator,
    closeAll,
  };
};
