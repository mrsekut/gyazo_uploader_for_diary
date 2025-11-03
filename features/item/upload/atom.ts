import { atom } from 'jotai';
import { itemAtom } from '@/features/item/atom';
import { uploadToGyazo } from '@/features/item/upload/gyazo';
import { uploadFiles } from '@/features/item/upload/uploader';
import { previewUrlAtom } from '../previewUrlAtom';

export const uploadAtom = atom(null, async (get, set, ids: string[]) => {
  try {
    const items = ids.map(id => get(itemAtom(id)));

    // Use the new uploader with uploadToGyazo as the upload function
    const requests = items.map(item => ({ id: item.id, file: item.file }));
    const results = await uploadFiles(requests, uploadToGyazo);

    results.forEach(result => {
      set(itemAtom(result.id), item => ({
        ...item,
        gyazoUrl: result.permalinkUrl,
      }));
      set(previewUrlAtom(result.id), {
        type: 'loaded',
        url: `https://i.gyazo.com/thumb/3024/${result.imageId}-heic.jpg`,
        isBlobUrl: false, // Gyazo URL, not a blob URL
      });
    });
  } finally {
    //
  }
});
