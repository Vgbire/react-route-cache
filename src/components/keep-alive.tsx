import React, { FC, useState } from 'react';
import { useEffect, useRef, ReactNode } from 'react';
import { Component } from './component';
import { useKeepAliveContext } from '../context';
import { useMatches } from 'react-router-dom';

interface KeepAliveProps {
  include?: Array<string>;
  exclude?: Array<string>;
  max?: number;
  children?: ReactNode;
}

export const KeepAlive: FC<KeepAliveProps> = ({ children, exclude, include, max = 10 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active, tabs, caches, setCaches } = useKeepAliveContext();
  const matches: any = useMatches();
  const cache = matches[matches.length - 1].handle?.cache ?? true;

  useEffect(() => {
    if (!active || !cache) {
      return;
    }
    let cacheList = caches;
    // 添加
    const cacheRoute = cacheList.find((item) => item.name === active);
    if (!cacheRoute) {
      cacheList.push({
        name: active,
        ele: children,
      });
      // 缓存超过上限的
      if (caches.length >= max) {
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
      {cache && <div ref={containerRef} />}
      {!cache && children}
      {caches.map(({ name, ele }) => {
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
