import { atom } from 'jotai';
import heic2any from 'heic2any';
import { atomFamily } from 'jotai/utils';
import { ImageId, itemAtom } from './atom';

type Stauts =
  | { type: 'loading' }
  | { type: 'loaded'; url: string } // preview or gyazo
  | { type: 'none'; url: null };

export const previewUrlAtom = atomFamily((_id: ImageId) =>
  atom<Stauts>({ type: 'loading' }),
);

export const setPreviewUrl = atomFamily((id: ImageId) =>
  atom(null, async (get, set) => {
    const item = get(itemAtom(id));
    set(previewUrlAtom(id), { type: 'loading' });

    try {
      if (isHeic(item.file)) {
        const url = await convertHeicToJpeg(item.file);
        set(previewUrlAtom(id), { type: 'loaded', url });
      } else {
        const url = URL.createObjectURL(item.file);
        set(previewUrlAtom(id), { type: 'loaded', url });
      }
    } catch (error) {
      console.error('Image processing failed:', error);
      set(previewUrlAtom(id), { type: 'none', url: null });
    }
  }),
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
