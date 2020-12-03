import BrowserTab = browser.tabs.Tab;

export type Tab = BrowserTab;

export async function getTabs(): Promise<Tab[]> {
  return await browser.tabs.query({ currentWindow: true });
}

export async function closeTabs(ids: number[]): Promise<void> {
  await browser.tabs.remove(ids);
}

export type Theme = 'LIGHT' | 'DARK';
export function getTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
}
