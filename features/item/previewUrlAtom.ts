import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { ImageId, itemAtom } from './atom';

// Conversion queue to process HEIC files one by one
const conversionQueue: Array<() => Promise<void>> = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || conversionQueue.length === 0) return;

  isProcessing = true;
  while (conversionQueue.length > 0) {
    const task = conversionQueue.shift();
    if (task) await task();
  }
  isProcessing = false;
};

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
        // Queue HEIC conversion to process one by one
        conversionQueue.push(async () => {
          try {
            const url = await convertHeicToJpeg(item.file);
            set(previewUrlAtom(id), { type: 'loaded', url });
          } catch (error) {
            console.error('HEIC conversion failed:', error);
            set(previewUrlAtom(id), { type: 'none', url: null });
          }
        });
        processQueue();
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

export const isHeic = (file: File) =>
  file.type === 'image/heic' ||
  file.type === 'image/heif' ||
  file.name.toLowerCase().endsWith('.heic') ||
  file.name.toLowerCase().endsWith('.heif');

const convertHeicToJpeg = async (file: File) => {
  const heic2any = (await import('heic2any')).default;
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.8,
  });

  return URL.createObjectURL(convertedBlob as Blob);
};
