import { atom } from 'jotai';
import { nanoid } from 'nanoid';
import heic2any from 'heic2any';
import { atomFamily } from 'jotai/utils';
import { nonNullableAtom } from '@/utils/nonNullableAtom';

export type ImageId = string;

export type ImageItem = {
  id: ImageId;
  file: File;
  previewUrl: string | null; // TODO: 不要?
  gyazoUrl: string | null;
  captureDate: number;
};

export const itemIdsAtom = atom<ImageId[]>([]);

export const itemAtom = atomFamily((id: ImageId) =>
  nonNullableAtom(itemAtom_(id), `itemAtom(${id})`),
);
const itemAtom_ = atomFamily((_id: ImageId) => atom<ImageItem | null>(null));

// TODO: name
export const updateGyaoUrlAtom = atom(
  null,
  (
    _get,
    set,
    id: string,
    update: {
      gyazoUrl: string;
      previewUrl: string;
    },
  ) => {
    set(itemAtom(id), item => ({ ...item, ...update }));
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

      // set(
      //   itemsAtom,
      //   items.map(item =>
      //     item.id === itemId ? { ...item, previewUrl: url } : item,
      //   ),
      // );
    } catch (error) {
      console.error('Image processing failed:', error);
    }
  },
);

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
