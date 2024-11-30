import React, { useEffect, ReactNode, RefObject, useState, FC } from 'react';
import { createPortal } from 'react-dom';

interface ComponentProps {
  name: string;
  show: boolean;
  to: RefObject<HTMLDivElement>;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export const Component: FC<ComponentProps> = ({ name, show, children, to, style }) => {
  const [div] = useState(() => document.createElement('div'));

  useEffect(() => {
    // 清空原来的style内联样式
    div.style.cssText = '';
    Object.keys(style || {}).forEach((key) => {
      div.style[key] = style[key];
    });
  }, [style]);

  useEffect(() => {
    if (show) {
      to.current?.replaceChildren(div);
    }
  }, [show]);

  return createPortal(children, div, name);
};
