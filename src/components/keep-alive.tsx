import React, { FC } from 'react';
import { useEffect, useRef, ReactNode } from 'react';
import { Component } from './component';
import { useKeepAliveContext } from '../context';

interface KeepAliveProps {
  include?: Array<string>;
  exclude?: Array<string>;
  max?: number;
  children?: ReactNode;
}

export const KeepAlive: FC<KeepAliveProps> = ({ children, exclude, include, max = 10 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active, tabs, cahces, setCaches } = useKeepAliveContext();

  useEffect(() => {
    if (!active) {
      return;
    }
    let cacheList = cahces;
    // 添加
    const cache = cacheList.find((item) => item.name === active);
    if (!cache) {
      cacheList.push({
        name: active,
        ele: children,
      });
      // 缓存超过上限的
      if (cahces.length >= max) {
        cacheList.shift();
      }
    }
    cacheList = cacheList.filter((item) => tabs.some((tab) => tab.key === item.name));
    if (exclude || include) {
      cacheList = cacheList.filter(({ name }) => {
        if (exclude && exclude.includes(name)) {
          return false;
        }
        if (include) {
          return include.includes(name);
        }
        return true;
      });
    }
    setCaches([...cacheList]);
  }, [children, active, exclude, max, include, tabs]);

  return (
    <>
      <div ref={containerRef} />
      {cahces.map(({ name, ele }) => {
        // return <div style={{ display: active === name ? 'block' : 'none' }}>{ele}</div>;
        return (
          <Component key={name} show={name === active} to={containerRef}>
            {ele}
          </Component>
        );
      })}
    </>
  );
};
