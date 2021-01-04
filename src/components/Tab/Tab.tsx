import { h } from 'preact';

import { TabItem } from '../../types';
import { BumpIcon, CrossIcon } from '../icons';

import s from './Tab.module.scss';

interface Props {
  tab: TabItem;
  onBump: () => void;
  onOpen: () => void;
  onClose: () => void;
}

export default function Tab(props: Props): preact.JSX.Element {
  const { tab, onBump, onOpen, onClose } = props;

  const favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${tab.url}`;

  return (
    <div title={tab.url} className={s.body}>
      <div className={s.controls}>
        <div onClick={onBump}>
          <BumpIcon color="var(--color-gray-2)" />
        </div>
        <div onClick={onClose}>
          <CrossIcon color="var(--color-gray-2)" />
        </div>
      </div>
      <img className={s.favicon} src={favicon || ''} />
      <div className={s.title} onClick={onOpen}>
        {tab.title}
      </div>
    </div>
  );
}
