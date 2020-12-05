export interface Tab {
  id: number;
  url?: string;
  pinned: boolean;
  active: boolean;
  title?: string;
}

export async function queryTabs(params: { currentWindow?: boolean; url?: string | string[] }) {
  return (await browser.tabs.query(params))
    .map((tab: browser.tabs.Tab): Tab | null => {
      if (tab.id == null) {
        return null;
      }
      return {
        id: tab.id,
        url: tab.url,
        pinned: tab.pinned,
        active: tab.active,
        title: tab.title,
      };
    })
    .filter((tab): tab is Tab => tab != null);
}

export async function getTabs(): Promise<Tab[]> {
  return await queryTabs({ currentWindow: true });
}

export async function findExtensionTab(): Promise<Tab | null> {
  const extenstionPageUrl = browser.extension.getURL('static/index.html');
  const existedTabs = await queryTabs({ url: extenstionPageUrl });
  if (existedTabs.length > 0) {
    return existedTabs[0];
  }
  return null;
}

export async function openExtensionTab() {
  await openTab('/static/index.html');
}

export async function activateTab(id: number): Promise<void> {
  await browser.tabs.update(id, { active: true });
}

export async function closeTabs(ids: number[]): Promise<void> {
  await browser.tabs.remove(ids);
}

export async function openTab(url: string): Promise<void> {
  await browser.tabs.create({
    url,
  });
}

export type Theme = 'LIGHT' | 'DARK';
export function getTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
}
