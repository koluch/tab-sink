import { h } from 'preact';
import cn from 'clsx';

import s from './Button.module.scss';

export interface Props {
  isPrimary?: boolean;
  isDisabled?: boolean;
  children: string;
  onClick: () => void;
}

export default function Button(props: Props): preact.JSX.Element {
  const { isPrimary = false, isDisabled = false, children, onClick } = props;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(s.root, isPrimary && s.isPrimary)}
    >
      {children}
    </button>
  );
}
