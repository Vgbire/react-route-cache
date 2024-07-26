import { useLocation, useNavigate } from 'react-router-dom';
import { useKeepAliveContext } from '../context';

export const useKeepAlive = () => {
  const navigator = useNavigate();
  const { pathname } = useLocation();

  const { active, setActive, tabs, setTabs } = useKeepAliveContext();

  const close = (key?: string, url?: string) => {
    const tabKey = key || pathname;
    const index = tabs.findIndex((item) => item.key === tabKey);
    if (index !== -1 && tabs.length > 1) {
      tabs.splice(index, 1);
      setTabs([...tabs]);
      if (active === tabKey) {
        navigator(url || tabs[0].key);
      }
    }
  };

  const closeNavigator = (url: string) => {
    close(undefined, url);
  };

  const closeAll = () => {
    setTabs([tabs.find((item) => item.key === active)]);
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
