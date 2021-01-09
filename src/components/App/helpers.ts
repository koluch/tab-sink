import * as t from 'io-ts';

import { TabList, TabListCodec } from '../../types';

export const ImportExportCodec = new t.Type<TabList, string, string>(
  'ImportExport',
  TabListCodec.is,
  (value: string, context) => {
    let json;
    try {
      json = JSON.parse(value);
    } catch (e) {
      return t.failure(value, context, 'Input string should be a valid JSON');
    }
    return TabListCodec.validate(json, context);
  },
  (value: TabList): string => {
    return JSON.stringify(value, null, 2);
  },
);
