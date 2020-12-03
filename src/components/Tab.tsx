import { h } from 'preact';

import { TabItem } from '../types';
import { CrossIcon } from './icons';

interface Props {
  tab: TabItem;
  onClose: () => void;
}

export default function Tab(props: Props): preact.JSX.Element {
  const { tab, onClose } = props;
  return (
    <div title={tab.url} className="tab-body">
      <div className="tab-title">{tab.title}</div>
      <div onClick={onClose}>
        <CrossIcon color="var(--color-gray-2)" />
      </div>
    </div>
  );
}
