import React, { useContext, useState, createContext, ReactNode, useEffect, FC } from 'react';
import { LifeCircle } from '../../types';

type LifeCircles = { [key: string]: Array<LifeCircle> };

interface KeepAliveScopeContext {
  active?: string;
  setActive?: (active: string | ((preKey: string) => string)) => void;
  activateds: LifeCircles;
  setActivateds?: (activateds: LifeCircles) => void;
  deactivateds: LifeCircles;
  setDeactivateds?: (deactivateds: LifeCircles) => void;
}

const KeepAliveScopeContext = createContext<KeepAliveScopeContext>({ activateds: {}, deactivateds: {} });

KeepAliveScopeContext.displayName = 'KeepAliveScope';

interface RouterKeepAliveProps {
  children: ReactNode;
}
export const KeepAliveScope: FC<RouterKeepAliveProps> = ({ children }) => {
  const [active, setActive] = useState('');
  const [activateds, setActivateds] = useState({});
  const [deactivateds, setDeactivateds] = useState({});

  useEffect(() => {
    // 调用activateds
    if (activateds[active]?.length) {
      activateds[active].forEach((item) => {
        const deactivated = item();
        if (deactivated) {
          if (!deactivateds[active]) {
            deactivateds[active] = [];
          }
          deactivateds[active].push(deactivated);
          setDeactivateds({ ...deactivateds });
        }
      });
    }
  }, [active]);

  return (
    <KeepAliveScopeContext.Provider
      value={{
        active,
        setActive,
        activateds,
        setActivateds,
        deactivateds,
        setDeactivateds,
      }}
    >
      {children}
    </KeepAliveScopeContext.Provider>
  );
};

export const useKeepAliveScopeContext = () => {
  const context = useContext(KeepAliveScopeContext);

  if (!context) {
    throw new Error('useKeepAliveScopeContext 必须在 KeepAliveScope 中使用');
  }

  return context;
};
