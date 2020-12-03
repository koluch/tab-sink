browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    url:"/static/index.html"
  });
});

browser.history.onVisited.addListener((historyItem) => {
  if (historyItem.url === browser.extension.getURL(myPage)) {
    browser.history.deleteUrl({url: historyItem.url});
  }
})
