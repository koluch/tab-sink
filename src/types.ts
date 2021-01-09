import * as t from 'io-ts';
import { withFallback } from 'io-ts-types/lib/withFallback';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';

const DateWithDefault = withFallback(DateFromISOString, new Date(0), 'ISODate (optional)');

export const TabItemCodec = t.interface({
  id: t.string,
  url: t.string,
  title: t.string,
  addedAt: DateWithDefault,
  updatedAt: DateWithDefault,
});

export const TabListCodec = t.array(TabItemCodec);

export type TabItem = t.TypeOf<typeof TabItemCodec>;

export type TabList = t.TypeOf<typeof TabListCodec>;
