import { ComponentChildren, h, Fragment } from 'preact';
import { createPortal } from 'preact/compat';
import cn from 'clsx';

import s from './Overlay.module.scss';

interface Props {
  isShown: boolean;
  children: ComponentChildren;
  onClose: () => void;
}

export default function Overlay(props: Props): preact.JSX.Element {
  const { isShown, children, onClose } = props;

  if (!isShown) {
    return <></>;
  }

  const container = document.body;

  return createPortal(
    <div className={cn(s.root)} onClick={onClose} aria-modal={true} role="dialog">
      <div tabIndex={0}></div>
      {children}
      <div tabIndex={0}></div>
    </div>,
    container,
  );
}
