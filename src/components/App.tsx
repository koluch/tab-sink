import { h } from 'preact';
import { useEffect } from 'preact/hooks';

import { TabItem } from '../types';
import { useStoredValue } from '../services/store';
import { closeTabs, getTabs } from '../services/browser';

import Tab from './Tab';

function download(filename: string, text: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

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
      const tabs1 = await getTabs();
      const newTabs: TabItem[] = tabs1
        .filter((x) => {
          if (x.pinned) {
            return false;
          }
          const { url } = x;
          if (url == null) {
            return false;
          }
          if (url.startsWith('about:')) {
            return false;
          }
          if (url.startsWith('moz-extension:') && x.active) {
            return false;
          }
          return true;
        })
        .map((x, i) => ({
          id: x.id != null ? x.id : i,
          url: x.url || '#',
          title: x.title || 'no title',
        }));
      await setTabs((state) => [...newTabs.reverse(), ...state]);
      await closeTabs(newTabs.map(({ id }) => id));
    }
    doit().catch((e) => console.error(e));
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        <button
          onClick={() => {
            download('tab-sink-export.json', JSON.stringify(tabs, null, 2));
          }}
        >
          Export as JSON
        </button>
        <button
          onClick={() => {
            const jsonText = window.prompt('JSON:');
            if (jsonText != null) {
              try {
                const json = JSON.parse(jsonText);
                setTabs((state) => [...json, ...state]);
              } catch (e) {
                console.error(`Unable to parse tabs JSON`);
              }
            }
          }}
        >
          Import from JSON
        </button>
      </div>
      <div className="app-tabs">
        {tabs.length === 0 && <div>No tabs yet</div>}
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            onBump={() => {
              setTabs((state) => [tab, ...state.filter(({ id }) => id !== tab.id)]);
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
  );
}
