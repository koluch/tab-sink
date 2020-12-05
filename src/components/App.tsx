import { h } from 'preact';

import { TabItem } from '../types';
import { useStoredValue } from '../services/store';

import Tab from './Tab';

import StorageValue = browser.storage.StorageValue;

function download(filename: string, text: string): void {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function App(): preact.JSX.Element {
  const [tabs, setTabs] = useStoredValue<TabItem[]>(
    'tabs',
    [],
    (x) => (x as unknown) as StorageValue,
    (x) => (x as unknown) as TabItem[],
  );

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
