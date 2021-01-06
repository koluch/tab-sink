import { h } from 'preact';
import cn from 'clsx';

import s from './Button.module.scss';

interface Props {
  isPrimary?: boolean;
  children: string;
  onClick: () => void;
}

export default function Button(props: Props): preact.JSX.Element {
  const { isPrimary = false, children, onClick } = props;

  return (
    <button onClick={onClick} className={cn(s.root, isPrimary && s.isPrimary)}>
      {children}
    </button>
  );
}
