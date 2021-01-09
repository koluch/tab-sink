import * as t from 'io-ts';

export const TabItemCodec = t.interface(
  {
    id: t.string,
    url: t.string,
    title: t.string,
  },
  'TabItem',
);

export const TabListCodec = t.array(TabItemCodec);

export type TabItem = t.TypeOf<typeof TabItemCodec>;
