import { atom } from 'jotai';
import { nanoid } from 'nanoid';
import heic2any from 'heic2any';

export type ImageId = string;

export type ImageItem = {
  id: ImageId;
  file: File;
  previewUrl: string | null;
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

const isHeic = (file: File) =>
  file.type === 'image/heic' ||
  file.type === 'image/heif' ||
  file.name.toLowerCase().endsWith('.heic') ||
  file.name.toLowerCase().endsWith('.heif');

const convertHeicToJpeg = async (file: File) => {
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.8,
  });

  return URL.createObjectURL(convertedBlob as Blob);
};

export const previewUrlAtom = atom(
  null,
  async (get, set, { file, itemId }: { file: File; itemId: string }) => {
    let url: string | null = null;

    try {
      if (isHeic(file)) {
        url = await convertHeicToJpeg(file);
      } else {
        url = URL.createObjectURL(file);
      }

      const items = get(itemsAtom);
      set(
        itemsAtom,
        items.map(item =>
          item.id === itemId ? { ...item, previewUrl: url } : item,
        ),
      );
    } catch (error) {
      console.error('Image processing failed:', error);
    }
  },
);
