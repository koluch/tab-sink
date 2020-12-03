const ICONS = {
  DARK: 'static/logo_dark.svg',
  LIGHT: 'static/logo_light.svg',
};

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';

browser.browserAction.setIcon({ path: ICONS[theme] });
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    url: '/static/index.html',
  });
});

browser.history.onVisited.addListener((historyItem) => {
  if (historyItem.url === browser.extension.getURL(myPage)) {
    browser.history.deleteUrl({ url: historyItem.url });
  }
});
