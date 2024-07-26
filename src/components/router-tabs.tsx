import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloseCircleOutlined, LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Divider, Flex, Modal } from 'antd';
import { useKeepAliveContext } from '../context';
import { useKeepAlive } from '../hooks/use-keep-alive';
// import '../index.scss';

export const RouterTabs: FC = () => {
  const { tabs, active } = useKeepAliveContext();
  const { close, closeAll } = useKeepAlive();

  const navigate = useNavigate();
  const [left, setLeft] = useState(0);
  const tabsOuterRef = useRef<any>();
  const tabsInnerRef = useRef<any>();
  const [leftDisabled, setLeftDisabled] = useState(false);
  const [rightDisabled, setRightDisabled] = useState(false);
  const size = useSize(document.querySelector('body'));
  const [filtetTabs, setFilterTabs] = useState([]);

  useEffect(() => {
    setFilterTabs(tabs.filter((item) => item.label));
  }, [tabs]);

  useEffect(() => {
    const { offsetWidth, scrollWidth } = tabsOuterRef.current;
    setRightDisabled(left <= offsetWidth - scrollWidth);
    setLeftDisabled(left >= 0);
    if (offsetWidth === scrollWidth) {
      setLeft(0);
    }
  }, [tabs, left, size]);

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
    <Flex className="router-tab-box">
      <LeftOutlined
        className="router-tab-icon"
        style={{ cursor: leftDisabled ? 'not-allowed' : 'pointer' }}
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
          {/* 如果没有label不应该显示tab */}
          {filtetTabs.map((item, index) => {
            return (
              <div style={{ display: 'inline-block' }} key={item.key}>
                {index !== 0 && <Divider type="vertical" className="tab-item-divider" />}
                <div
                  className="tab-item"
                  onClick={() => {
                    navigate(item.key);
                  }}
                  style={{
                    backgroundColor: item.key === active && '#fff',
                    paddingRight: filtetTabs.length === 1 && 20,
                  }}
                >
                  <span className="tab-item-label" style={{ color: item.key === active && '#1677ff' }}>
                    {item.label}
                  </span>
                  {filtetTabs.length > 1 && (
                    <CloseOutlined
                      className="tab-item-icon"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        close(item.key);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <RightOutlined
        className="router-tab-icon"
        style={{ cursor: rightDisabled ? 'not-allowed' : 'pointer' }}
        onClick={() => {
          next();
        }}
      />
      <CloseCircleOutlined
        style={{
          flexBasis: 20,
          padding: '0 8px',
          background: '#fff',
          zIndex: 2,
        }}
        onClick={() => {
          Modal.confirm({
            title: '你确定要关闭其他标签吗?',
            content: '关闭的标签页将不会被缓存',
            onOk() {
              closeAll();
            },
          });
        }}
      />
    </Flex>
  );
};
