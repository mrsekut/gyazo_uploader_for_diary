import { atom } from 'jotai';
import { nanoid } from 'nanoid';

export type ImageId = string;

export type ImageItem = {
  id: ImageId;
  file: File;
  previewUrl: string;
  gyazoUrl: string | null;
  captureDate: number;
};

export const itemsAtom = atom<ImageItem[]>([]);

export const addItemAtom = atom(
  null,
  (get, set, item: Omit<ImageItem, 'id'>) => {
    const items = get(itemsAtom);
    set(itemsAtom, [...items, { ...item, id: nanoid() }]);
  },
);

export const updateItemAtom = atom(
  null,
  (get, set, id: string, update: Partial<ImageItem>) => {
    const items = get(itemsAtom);
    set(
      itemsAtom,
      items.map(item => (item.id === id ? { ...item, ...update } : item)),
    );
  },
);
