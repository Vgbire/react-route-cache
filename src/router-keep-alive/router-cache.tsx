import React, { CSSProperties, FC } from 'react';
import { useEffect, useRef, ReactNode } from 'react';
import { Component } from '../component';
import { useMatches } from 'react-router-dom';
import { useKeepAliveContext } from '.';
import { useRouterApi } from './hooks/use-router-api';
interface RouterCacheProps {
  include?: Array<string>;
  exclude?: Array<string>;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  styles?: {
    wrapper?: CSSProperties;
    content?: CSSProperties;
  };
  [key: string]: any;
}

export const RouterCache: FC<RouterCacheProps> = ({
  children,
  exclude,
  include,
  style,
  className,
  styles,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active, tabs, caches, setCaches, nameKey, max, cacheMaxRemove } = useKeepAliveContext();
  const { close } = useRouterApi();
  const matches: any = useMatches();
  // 必须要有name属性才可以缓存，cache设置为false才不缓存
  const handle = matches[matches.length - 1].handle;
  const cache = handle?.[nameKey] && (handle?.cache ?? true);

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
      if (cacheList.length > max) {
        const remove = cacheList.shift();
        if (cacheMaxRemove) {
          close(remove?.name);
        }
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
      {cache && <div ref={containerRef} style={{ ...style, ...styles?.wrapper }} className={className} {...rest} />}
      {!cache && children}
      {caches.map(({ name, ele }) => {
        return (
          <Component key={name} name={name} show={name === active} to={containerRef} style={styles?.content}>
            {ele}
          </Component>
        );
      })}
    </>
  );
};
