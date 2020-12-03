import { h } from 'preact';
import { useEffect } from 'preact/hooks';

import { TabItem } from '../types';
import { useStoredValue } from '../services/store';
import { closeTabs, getTabs } from '../services/browser';

import Tab from './Tab';

import StorageValue = browser.storage.StorageValue;

export default function App(): preact.JSX.Element {
  const [tabs, setTabs] = useStoredValue<TabItem[]>(
    'tabs',
    [],
    (x) => (x as unknown) as StorageValue,
    (x) => (x as unknown) as TabItem[],
  );

  useEffect(() => {
    async function doit() {
      const newTabs: TabItem[] = (await getTabs())
        .filter((x) => !x.pinned)
        .map((x, i) => ({
          id: x.id != null ? x.id : i,
          url: x.url || '#',
          title: x.title || 'no title',
        }));

      await setTabs([...newTabs.reverse(), ...tabs]);
      await closeTabs(newTabs.map(({ id }) => id));
    }
    // doit().catch((e) => console.error(e));
  }, []);

  return (
    <div className="app">
      {tabs.map((tab) => (
        <Tab key={tab.id} tab={tab} onClose={() => setTabs(tabs.filter((x) => x.id !== tab.id))} />
      ))}
    </div>
  );
}
