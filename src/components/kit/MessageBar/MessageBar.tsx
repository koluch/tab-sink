import { h } from 'preact';
import cn from 'clsx';

import s from './MessageBar.module.scss';
import InfoSvg from './info.svg';
import SuccessSvg from './success.svg';
import WarningSvg from './warning.svg';
import ErrorSvg from './error.svg';

type Type = 'GENERIC' | 'SUCCESS' | 'WARNING' | 'ERROR';

const TYPE_TO_ICON: { [key in Type]: string } = {
  GENERIC: InfoSvg,
  SUCCESS: SuccessSvg,
  WARNING: WarningSvg,
  ERROR: ErrorSvg,
};

interface Props {
  type?: Type;
  children: string;
}

export default function MessageBar(props: Props): preact.JSX.Element {
  const { type = 'GENERIC', children } = props;

  return (
    <div className={cn(s.root, s[`type-${type}`])}>
      <img
        className={s.icon}
        alt="Message type icon"
        role="presentation"
        aria-hidden={true}
        src={TYPE_TO_ICON[type]}
      />
      <div className={s.message}>{children}</div>
    </div>
  );
}
