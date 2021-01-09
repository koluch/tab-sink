import { isLeft } from 'fp-ts/Either';
import { PathReporter } from 'io-ts/PathReporter';

import { createStore, Store, Value } from './services/store';
import { TabItem, TabListCodec } from './types';

export default function (): Store<TabItem[]> {
  return createStore<TabItem[]>(
    'tabs',
    [],
    (x) => (x as unknown) as Value,
    (x) => {
      try {
        const decoded = TabListCodec.decode(x as unknown);
        if (isLeft(decoded)) {
          throw new Error(PathReporter.report(decoded).join('; '));
        }
        return decoded.right;
      } catch (e) {
        console.error(`Unable to parse stored tab list. ${e.message}`);
        return [];
      }
    },
  );
}
