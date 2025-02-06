import React, { CSSProperties, FC, useState } from 'react';
import { useEffect, useRef, ReactNode } from 'react';
import { Component } from '../component';
import { useKeepAliveScopeContext } from './context';

type KeepAliveItems = {
  key: string;
  children: ReactNode;
};

interface KeepAliveProps {
  activeKey?: string;
  include?: string[];
  exclude?: string[];
  max?: number;
  items?: KeepAliveItems[];
  style?: CSSProperties;
  className?: string;
  styles?: {
    wrapper?: CSSProperties;
    content?: CSSProperties;
  };
  [key: string]: any;
}

export const KeepAlive: FC<KeepAliveProps> = ({
  activeKey,
  max = Number.MAX_SAFE_INTEGER,
  items,
  exclude,
  include,
  style,
  className,
  styles,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [caches, setCaches] = useState<KeepAliveItems[]>([]);
  const [noCacheNode, setNoCacheNode] = useState<ReactNode>();
  useEffect(() => {
    let cacheList = caches;
    // 添加
    const cacheRoute = cacheList.find((item) => item.key === activeKey);
    const newCache = items.find((item) => item.key === activeKey);
    if (!cacheRoute) {
      cacheList.push(newCache);
      // 缓存超过上限的
      if (cacheList.length > max) {
        cacheList.shift();
      }
    }
    if (exclude || include) {
      cacheList = cacheList.filter(({ key }) => {
        if (exclude?.length && exclude.includes(key)) {
          return false;
        }
        if (include?.length) {
          return include.includes(key);
        }
        return true;
      });
    }
    if (!cacheList.find((item) => item.key === activeKey) && newCache) {
      containerRef.current.replaceChildren();
      setNoCacheNode(newCache.children);
    } else {
      setNoCacheNode(null);
    }
    setCaches([...cacheList]);
  }, [activeKey, max, items, exclude, include]);

  const { setActive, deactivateds, setDeactivateds } = useKeepAliveScopeContext();
  useEffect(() => {
    // 调用deactivateds方法
    setActive?.((prevKey: string) => {
      if (deactivateds[prevKey]?.length) {
        deactivateds[prevKey].forEach((item) => {
          item();
        });
        delete deactivateds[prevKey];
        setDeactivateds?.({ ...deactivateds });
      }
      return activeKey;
    });
  }, [activeKey]);

  return (
    <>
      <div ref={containerRef} style={{ ...style, ...styles?.wrapper }} className={className} {...rest} />
      {caches.map(({ key, children }) => {
        return (
          <Component key={key} name={key} show={key === activeKey} to={containerRef} style={styles?.content}>
            {children}
          </Component>
        );
      })}
      {noCacheNode}
    </>
  );
};
