import { nanoid } from 'nanoid';

import browserApi from './services/browser';
import { TabItem } from './types';
import { createStore } from './services/store';

import StorageValue = browser.storage.StorageValue;
import HistoryItem = browser.history.HistoryItem;

const ICONS = {
  DARK: 'static/logo_dark.svg',
  LIGHT: 'static/logo_light.svg',
};

const theme = browserApi.getTheme();

const store = createStore<TabItem[]>(
  'tabs',
  [],
  (x) => (x as unknown) as StorageValue,
  (x) => (x as unknown) as TabItem[],
);

browser.browserAction.setIcon({ path: ICONS[theme] });
browser.browserAction.onClicked.addListener(() => {
  (async function () {
    // Collect open tabs and save them in store
    const browserTabs = (await browserApi.getTabs()).filter((x) => {
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
    const now = new Date();
    const newTabItems: TabItem[] = browserTabs
      .map((x) => ({
        id: nanoid(),
        url: x.url || '#',
        title: x.title || 'no title',
        addedAt: now,
        updatedAt: now,
      }))
      .reverse();

    await store.set((state) => [...newTabItems, ...state]);

    // Close tabs
    if (process.env.NODE_ENV !== 'development') {
      await browserApi.closeTabs(browserTabs.map(({ id }) => id as number));
    }

    // Open extension tab
    const existedTab = await browserApi.findExtensionTab();
    if (existedTab) {
      await browserApi.activateTab(existedTab.id);
    } else {
      await browserApi.openExtensionTab();
    }
  })();
});

browser.history.onVisited.addListener((historyItem: HistoryItem) => {
  if (historyItem.url == browser.extension.getURL('static/template.html')) {
    browser.history.deleteUrl({ url: historyItem.url });
  }
});
