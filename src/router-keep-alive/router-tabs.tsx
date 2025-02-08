import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from '@src/router-verison';
import { CloseCircleOutlined, LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Divider, Flex, Modal } from 'antd';
import '../index.scss';
import { useKeepAliveContext } from '.';
import i18n from '../i18n';
import { useRouterApi } from './hooks/use-router-api';

export const RouterTabs: FC = () => {
  const { tabs, active, theme, size } = useKeepAliveContext();
  // 主题style
  const styles = {
    itemBg: theme === 'dark' ? '#001628' : '#fafafa',
    itemActiveBg: theme === 'dark' ? '#1677ff' : '#fff',
    itemColor: theme === 'dark' ? '#ffffffa6' : '#999',
    itemHoverColor: theme === 'dark' ? '#fff' : '#4096ff',
    itemActiveColor: theme === 'dark' ? '#fff' : '#1677ff',
    iconBg: theme === 'dark' ? '#042c4d' : '#fff',
    iconColor: theme === 'dark' ? '#ffffffa6' : '#999',
    hoverIconColor: theme === 'dark' ? '#fff' : '#000',
  };
  // 尺寸style
  const sizeStyle = {
    fontSize: size === 'large' ? '16px' : '14px',
    padding: size === 'small' ? '6px 16px' : '8px 16px',
  };
  const { close, closeAll } = useRouterApi();

  const navigate = useNavigate();
  const [left, setLeft] = useState(0);
  const tabsOuterRef = useRef<any>();
  const tabsInnerRef = useRef<any>();
  const [leftDisabled, setLeftDisabled] = useState(false);
  const [rightDisabled, setRightDisabled] = useState(false);
  const windowSize = useSize(document.querySelector('body'));
  const [routerTabs, setRouterTabs] = useState([]);

  useEffect(() => {
    setRouterTabs(
      tabs.map((item) => ({
        ...item,
        iconColor: styles.iconColor,
        itemColor: item.key === active ? styles.itemActiveColor : styles.itemColor,
      })),
    );
  }, [tabs, theme, active]);

  useEffect(() => {
    const { offsetWidth, scrollWidth } = tabsOuterRef.current;
    setRightDisabled(left <= offsetWidth - scrollWidth);
    setLeftDisabled(left >= 0);
    if (offsetWidth === scrollWidth) {
      setLeft(0);
    }
  }, [tabs, left, windowSize]);

  const prev = (offset?: number) => {
    if (leftDisabled) return;
    let cur = 0;
    if (offset) {
      cur = left + offset;
    } else {
      const children = tabsInnerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const tab = children[i];
        if (cur >= left + tabsOuterRef.current.offsetWidth) {
          cur -= tab.offsetWidth;
        } else {
          break;
        }
      }
      cur = cur - 3;
    }
    if (cur > 0) {
      cur = 0;
    }
    setLeft(cur);
  };

  const next = (offset?: number) => {
    if (rightDisabled) return;
    let cur = 0;
    if (offset) {
      setLeft(left - offset);
    } else {
      const children = tabsInnerRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const tab = children[i];
        if (cur - tab.offsetWidth > left - tabsOuterRef.current.offsetWidth) {
          cur -= tab.offsetWidth;
        } else {
          break;
        }
      }
      setLeft(cur - 3);
    }
  };

  const stop = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const preventHTMLScroll = (prevent: boolean) => {
    const body = document.querySelector('body');
    if (prevent) {
      if (!leftDisabled || !rightDisabled) {
        body.addEventListener('wheel', stop, { passive: false });
      }
    } else {
      body.removeEventListener('wheel', stop);
    }
  };

  return (
    <Flex className="router-tab-box" style={{ background: styles.itemBg }}>
      <LeftOutlined
        className="router-tab-icon"
        style={{ cursor: leftDisabled ? 'not-allowed' : 'pointer', color: styles.iconColor, background: styles.iconBg }}
        onClick={() => {
          prev();
        }}
      />
      <div
        ref={tabsOuterRef}
        onWheel={(e: any) => {
          const deltaY = e.deltaY;
          const offset = Math.abs(deltaY);
          deltaY > 0 ? next(offset) : prev(offset);
        }}
        onMouseEnter={() => {
          preventHTMLScroll(true);
        }}
        onMouseLeave={() => {
          preventHTMLScroll(false);
        }}
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={tabsInnerRef}
          style={{
            whiteSpace: 'nowrap',
            position: 'relative',
            display: 'inline-block',
            transition: 'left .5s ease',
            left,
          }}
        >
          {/* 动画有关闭 BUG */}
          {/* <TransitionGroup className="tab-list"> */}
          {/* 如果没有label不应该显示tab */}
          {routerTabs.map((item, index) => {
            return (
              // <CSSTransition timeout={300} classNames="fade" key={item.key}>
              <div style={{ display: 'inline-block' }} key={item.key}>
                {index !== 0 && <Divider type="vertical" className="tab-item-divider" />}
                <div
                  className="tab-item"
                  onClick={() => {
                    navigate(item.key);
                  }}
                  style={{
                    backgroundColor: item.key === active ? styles.itemActiveBg : styles.itemBg,
                    padding: sizeStyle.padding,
                    fontSize: sizeStyle.fontSize,
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e: any) => {
                    setRouterTabs(
                      routerTabs.map((tab) => {
                        if (tab.key === active) {
                          return tab;
                        } else {
                          return {
                            ...tab,
                            itemColor: tab.key === item.key ? styles.itemHoverColor : styles.itemColor,
                          };
                        }
                      }),
                    );
                  }}
                  onMouseLeave={(e: any) => {
                    setRouterTabs(
                      routerTabs.map((tab) => {
                        if (tab.key === active) {
                          return tab;
                        } else {
                          return { ...tab, itemColor: styles.itemColor };
                        }
                      }),
                    );
                  }}
                >
                  <span className="tab-item-label" style={{ color: item.itemColor }}>
                    {item.label}
                  </span>
                  {routerTabs.length > 1 && (
                    <CloseOutlined
                      className="tab-item-icon"
                      style={{ color: item.iconColor }}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        close(item.key);
                      }}
                      onMouseEnter={(e: any) => {
                        setRouterTabs(
                          routerTabs.map((tab) => ({
                            ...tab,
                            iconColor: tab.key === item.key ? styles.hoverIconColor : styles.iconColor,
                          })),
                        );
                      }}
                      onMouseLeave={(e: any) => {
                        setRouterTabs(routerTabs.map((tab) => ({ ...tab, iconColor: styles.iconColor })));
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {/* </TransitionGroup> */}
        </div>
      </div>
      <RightOutlined
        className="router-tab-icon"
        style={{
          cursor: rightDisabled ? 'not-allowed' : 'pointer',
          color: styles.iconColor,
          background: styles.iconBg,
        }}
        onClick={() => {
          next();
        }}
      />
      {routerTabs.length > 1 && (
        <CloseCircleOutlined
          style={{
            flexBasis: 20,
            padding: '0 8px',
            background: styles.iconBg,
            color: styles.iconColor,
            zIndex: 2,
          }}
          onClick={() => {
            Modal.confirm({
              title: i18n.t('closeAllTabTip'),
              content: i18n.t('closeAllTabContent'),
              cancelText: i18n.t('cancel'),
              okText: i18n.t('confirm'),
              onOk() {
                closeAll();
              },
            });
          }}
        />
      )}
    </Flex>
  );
};
RouterTabs.displayName = 'RouterTabs';
