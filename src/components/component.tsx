import React, { useEffect, ReactNode, RefObject, useState, FC } from 'react';
import { createPortal } from 'react-dom';

interface ComponentProps {
  show: boolean;
  to: RefObject<HTMLDivElement>;
  children?: ReactNode;
}

export const Component: FC<ComponentProps> = ({ show, children, to }) => {
  const [div] = useState(() => document.createElement('div'));

  useEffect(() => {
    if (show) {
      to.current?.replaceChildren(div);
    }
  }, [show, to, div]);

  return createPortal(children, div);
};
