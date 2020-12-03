import { h } from 'preact';

import { TabItem } from '../types';

import { BumpIcon, CrossIcon } from './icons';

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
    <div title={tab.url} className="tab-body">
      <div className="tab-controls">
        <div onClick={onBump}>
          <BumpIcon color="var(--color-gray-2)" />
        </div>
        <div onClick={onClose}>
          <CrossIcon color="var(--color-gray-2)" />
        </div>
      </div>
      <img className="tab-favicon" src={favicon || ''} />
      <div className="tab-title" onClick={onOpen}>
        {tab.title}
      </div>
    </div>
  );
}
