export interface Tab {
  id: number;
  url?: string;
  pinned: boolean;
  active: boolean;
  title?: string;
}

export type Theme = 'LIGHT' | 'DARK';

export interface BrowserApi {
  getTabs(): Promise<Tab[]>;
  findExtensionTab(): Promise<Tab | null>;
  openExtensionTab(): void;
  activateTab(id: number): Promise<void>;
  closeTabs(ids: number[]): Promise<void>;
  openTab(url: string): Promise<void>;
  getTheme(): Theme;
}

async function queryTabs(params: {
  currentWindow?: boolean;
  url?: string | string[];
}): Promise<Tab[]> {
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

const EXTENSION_PAGE_URL = '/page.html'; // todo: use config?

const BROWSER_API: BrowserApi = {
  async getTabs(): Promise<Tab[]> {
    return await queryTabs({ currentWindow: true });
  },

  async findExtensionTab(): Promise<Tab | null> {
    const extenstionPageUrl = browser.extension.getURL(EXTENSION_PAGE_URL);
    const existedTabs = await queryTabs({ url: extenstionPageUrl });
    if (existedTabs.length > 0) {
      return existedTabs[0];
    }
    return null;
  },

  async openExtensionTab() {
    await this.openTab(EXTENSION_PAGE_URL);
  },

  async activateTab(id: number): Promise<void> {
    await browser.tabs.update(id, { active: true });
  },

  async closeTabs(ids: number[]): Promise<void> {
    await browser.tabs.remove(ids);
  },

  async openTab(url: string): Promise<void> {
    await browser.tabs.create({
      url,
    });
  },

  getTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
  },
};

export default BROWSER_API;
