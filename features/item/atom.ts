import { atom } from 'jotai';
import { nanoid } from 'nanoid';
import { atomFamily } from 'jotai/utils';
import { nonNullableAtom } from '@/utils/nonNullableAtom';

export type ImageId = string;

export type ImageItem = {
  id: ImageId;
  file: File;
  gyazoUrl: string | null;
  captureDate: number;
};

export const itemIdsAtom = atom<ImageId[]>([]);

export const itemAtom = atomFamily((id: ImageId) =>
  nonNullableAtom(_itemAtom(id), `itemAtom(${id})`),
);
const _itemAtom = atomFamily((_id: ImageId) => atom<ImageItem | null>(null));

// items
export const itemsAtom = atom(get => {
  const ids = get(itemIdsAtom);
  return ids.map(id => get(itemAtom(id)));
});

export const addItemAtom = atom(
  null,
  (_get, set, item: Omit<ImageItem, 'id'>) => {
    const id = nanoid();
    set(itemIdsAtom, ids => [...ids, id]);
    set(itemAtom(id), { ...item, id });
  },
);
