import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { ImageId, itemAtom } from './atom';

type Stauts =
  | { type: 'loading' }
  | { type: 'loaded'; url: string; isBlobUrl?: boolean } // preview or gyazo
  | { type: 'none'; url: null };

const _previewUrlAtomFamily = atomFamily((_id: ImageId) =>
  atom<Stauts>({ type: 'loading' }),
);

export const previewUrlAtom = atomFamily((id: ImageId) => {
  const baseAtom = _previewUrlAtomFamily(id);
  return atom(
    (get) => get(baseAtom),
    (get, set, newValue: Stauts) => {
      const current = get(baseAtom);

      // Revoke old blob URL before updating
      if (current.type === 'loaded' && current.isBlobUrl && current.url) {
        URL.revokeObjectURL(current.url);
      }

      set(baseAtom, newValue);
    }
  );
});

export const setPreviewUrl = atomFamily((id: ImageId) =>
  atom(null, async (get, set) => {
    const item = get(itemAtom(id));
    set(previewUrlAtom(id), { type: 'loading' });

    try {
      if (isHeic(item.file)) {
        // HEIC: Skip preview, keep loading state until Gyazo upload
        // Will be replaced with Gyazo URL after upload
        return;
      } else {
        const url = URL.createObjectURL(item.file);
        set(previewUrlAtom(id), { type: 'loaded', url, isBlobUrl: true });
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
