import { useEffect, useState } from 'preact/hooks';

import StorageValue = browser.storage.StorageValue;

export type Value = StorageValue;

export type ValueChange = {
  oldValue?: any;
  newValue?: any;
};

export type ValueChangeMap = { [field: string]: ValueChange };

interface StoreListener<V> {
  (newValue: V): void;
}

export interface Store<T> {
  initial: T;
  set(cb: (state: T) => T): Promise<void>;
  get(): Promise<T>;
  subscribe(listener: StoreListener<T>): () => void;
}

export function createStore<T>(
  key: string,
  initial: T,
  serialize: (value: T) => Value,
  deserialize: (object: Value) => T,
): Store<T> {
  const get = async () => {
    const data = await browser.storage.local.get([key]);
    const item: Value | null = data[key];
    if (item != null) {
      try {
        return deserialize(item);
      } catch (e) {
        throw new Error(`Unable to parse last storage value. ${e.message}`);
      }
    }
    return initial;
  };
  const set = async (cb: (state: T) => T) => {
    let parsed: T = initial;
    try {
      const data = await browser.storage.local.get([key]);
      const item: Value | null = data[key];
      parsed = item != null ? deserialize(item) : initial;
    } catch (e) {
      console.error('Unable to parse last storage value');
    }
    await browser.storage.local.set({
      [key]: serialize(cb(parsed)),
    });
  };
  const subscribe = (listener: StoreListener<T>): (() => void) => {
    const storageListener = (changeData: ValueChangeMap) => {
      if (key in changeData) {
        const newValue = changeData[key].newValue;
        listener(newValue);
      }
    };
    (async () => {
      listener(await get());
    })();

    browser.storage.onChanged.addListener(storageListener);
    return () => {
      browser.storage.onChanged.removeListener(storageListener);
    };
  };
  return {
    initial,
    set,
    get,
    subscribe,
  };
}

export function useStoreValue<T>(store: Store<T>): [T, (cb: (state: T) => T) => Promise<void>] {
  const [value, setValue] = useState<T>(store.initial);
  useEffect(() => {
    return store.subscribe(setValue);
  }, [store]);
  return [
    value,
    async (cb: (state: T) => T): Promise<void> => {
      return store.set(cb);
    },
  ];
}
