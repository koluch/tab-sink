import { useEffect, useState } from 'preact/hooks';

import StorageValue = browser.storage.StorageValue;
import StorageChange = browser.storage.StorageChange;
// import { Subscribable, Subscription } from "light-observable";
// import { createSubject } from "light-observable/observable";

export type Updater<T> = Partial<T> | ((oldState: T) => T);

// export interface Store<T> extends Subscribable<T> {
//   setState: (updater: Updater<T>) => void;
//   getState: () => T;
// }

export function useStoredValue<T>(
  key: string,
  initial: T,
  serialize: (value: T) => StorageValue,
  deserialize: (object: StorageValue) => T,
): [T, (cb: (state: T) => T) => Promise<void>] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    browser.storage.local.get([key]).then((data) => {
      const item: StorageValue | null = data[key];
      if (item != null) {
        try {
          const parsed = deserialize(item);
          setValue(parsed);
        } catch (e) {
          console.error('Unable to parse last storage value');
        }
      }
    });
  });

  useEffect(() => {
    const listener = (changeData: { [key: string]: StorageChange }) => {
      if (key in changeData) {
        const newValue = changeData[key].newValue;
        setValue(newValue);
      }
    };
    browser.storage.onChanged.addListener(listener);
    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  }, []);

  return [
    value,
    async (cb: (state: T) => T): Promise<void> => {
      const data = await browser.storage.local.get([key]);
      const item: StorageValue | null = data[key];
      if (item != null) {
        try {
          const parsed = deserialize(item);
          await browser.storage.local.set({
            [key]: serialize(cb(parsed)),
          });
          return;
        } catch (e) {
          console.error('Unable to parse last storage value');
        }
      }
    },
  ];
}
