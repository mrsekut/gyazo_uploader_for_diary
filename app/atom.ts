import { atom } from "jotai";

export type ImageItem = {
  file: File;
  previewUrl: string;
  selected: boolean;
  gyazoUrl?: string;
  index?: number;
  lastSelectedIndex?: number | null;
};

export const imageItemsAtom = atom<ImageItem[]>([]);

export const selectedImagesAtom = atom((get) =>
  get(imageItemsAtom).filter((item) => item.selected)
);

export const addImageItemAtom = atom(
  null,
  (get, set, item: Omit<ImageItem, "selected">) => {
    const currentItems = get(imageItemsAtom);
    set(imageItemsAtom, [
      ...currentItems,
      {
        ...item,
        selected: false,
      },
    ]);
  }
);

export const updateImageItemAtom = atom(
  null,
  (get, set, index: number, update: Partial<ImageItem>) => {
    const currentItems = get(imageItemsAtom);
    const updatedItems = [...currentItems];
    updatedItems[index] = {
      ...updatedItems[index],
      ...update,
    };
    set(imageItemsAtom, updatedItems);
  }
);

export const removeImageItemAtom = atom(null, (get, set, index: number) => {
  const currentItems = get(imageItemsAtom);
  set(imageItemsAtom, [
    ...currentItems.slice(0, index),
    ...currentItems.slice(index + 1),
  ]);
});
