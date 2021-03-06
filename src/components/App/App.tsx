import { h, Fragment } from 'preact';
import cn from 'clsx';
import { useState } from 'preact/hooks';

import { TabItem } from '../../types';
import { useStoreValue } from '../../services/store';
import Tab from '../Tab/Tab';
import Button from '../kit/Button/Button';
import tabStore from '../../tabStore';

import s from './App.module.scss';
import ExportDialog from './ExportDialog/ExportDialog';
import ImportDialog from './ImportDialog/ImportDialog';

const STORE = tabStore();

export default function App(): preact.JSX.Element {
  const [tabs, setTabs] = useStoreValue<TabItem[]>(STORE);

  const [isExportDialogShown, setExportDialogShown] = useState(false);
  const [isImportDialogShown, setImportDialogShown] = useState(false);

  return (
    <>
      <ExportDialog
        tabs={tabs}
        isShown={isExportDialogShown}
        onClose={() => {
          setExportDialogShown(false);
        }}
      />
      <ImportDialog
        isShown={isImportDialogShown}
        onReplace={(imported) => {
          setTabs(() => imported);
        }}
        onAdd={(imported) => {
          setTabs((oldTabs) => [...imported, ...oldTabs]);
        }}
        onClose={() => {
          setImportDialogShown(false);
        }}
      />
      <div className={cn(s.root)}>
        <div className={s.header}>
          <Button
            onClick={() => {
              setExportDialogShown(true);
            }}
          >
            Export as JSON
          </Button>
          <Button
            onClick={() => {
              setImportDialogShown(true);
            }}
          >
            Import from JSON
          </Button>
        </div>
        <div className={s.tabs}>
          {tabs.length === 0 && <div>No tabs yet</div>}
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              tab={tab}
              onBump={() => {
                setTabs((state) => [
                  {
                    ...tab,
                    updatedAt: new Date(),
                  },
                  ...state.filter(({ id }) => id !== tab.id),
                ]);
              }}
              onClose={() => setTabs((state) => state.filter((x) => x.id !== tab.id))}
              onOpen={() => {
                browser.tabs
                  .create({
                    url: tab.url,
                  })
                  .then(() => {
                    return setTabs((state) => state.filter((x) => x.id !== tab.id));
                  });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
