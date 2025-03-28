import { atom } from 'jotai';
import { itemAtom } from '@/features/item/atom';
import { uploadMultipleToGyazo } from '@/features/item/upload/gyazo';
import { previewUrlAtom } from '../previewUrlAtom';

export const uploadingAtom = atom(false);
export const uploadAtom = atom(null, async (get, set, ids: string[]) => {
  set(uploadingAtom, true);

  try {
    const items = ids.map(id => get(itemAtom(id)));
    const results = await uploadMultipleToGyazo(items);

    results.forEach(result => {
      set(itemAtom(result.imageId), item => ({
        ...item,
        gyazoUrl: result.permalink_url,
      }));
      set(previewUrlAtom(result.imageId), {
        type: 'loaded',
        url: `https://i.gyazo.com/thumb/3024/${result.image_id}-heic.jpg`,
      });
    });
  } finally {
    set(uploadingAtom, false);
  }
});
