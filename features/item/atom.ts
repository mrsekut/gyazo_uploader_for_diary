import { atom } from 'jotai';

export type ImageItem = {
  index: number;
  file: File;
  previewUrl: string;
  gyazoUrl: string | null;
};

export const itemsAtom = atom<ImageItem[]>([]);

export const addItemAtom = atom(
  null,
  (get, set, item: Omit<ImageItem, 'selected'>) => {
    const items = get(itemsAtom);

    set(itemsAtom, [...items, item]);
  },
);

export const updateItemAtom = atom(
  null,
  (get, set, index: number, update: ImageItem) => {
    const items = get(itemsAtom);
    set(
      itemsAtom,
      items.map((item, i) => (i === index ? update : item)),
    );
  },
);
