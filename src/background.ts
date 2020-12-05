import { nanoid } from 'nanoid';

import { closeTabs, getTabs } from './services/browser';
import { TabItem } from './types';
import { createStore } from './services/store';

import StorageValue = browser.storage.StorageValue;
import HistoryItem = browser.history.HistoryItem;

const ICONS = {
  DARK: 'static/logo_dark.svg',
  LIGHT: 'static/logo_light.svg',
};

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';

const store = createStore<TabItem[]>(
  'tabs',
  [],
  (x) => (x as unknown) as StorageValue,
  (x) => (x as unknown) as TabItem[],
);

browser.browserAction.setIcon({ path: ICONS[theme] });
browser.browserAction.onClicked.addListener(() => {
  (async function () {
    const browserTabs = (await getTabs()).filter((x) => {
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
    });
    const newTabItems: TabItem[] = browserTabs
      .map((x) => ({
        id: nanoid(),
        url: x.url || '#',
        title: x.title || 'no title',
      }))
      .reverse();
    await store.set((state) => [...newTabItems, ...state]);
    await closeTabs(browserTabs.map(({ id }) => id as number));

    await browser.tabs.create({
      url: '/static/index.html',
    });
  })();
});

browser.history.onVisited.addListener((historyItem: HistoryItem) => {
  if (historyItem.url == browser.extension.getURL('static/index.html')) {
    browser.history.deleteUrl({ url: historyItem.url });
  }
});
