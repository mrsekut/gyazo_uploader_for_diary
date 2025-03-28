import { atom } from 'jotai';
import { updateGyaoUrlAtom, itemIdsAtom, itemAtom } from '@/features/item/atom';
import { uploadMultipleToGyazo } from '@/features/item/upload/gyazo';
import { selectedIdsAtom } from '../select';
import { loadingAtom } from '../Image';

export const uploadingAtom = atom(false);
export const uploadAtom = atom(null, async (get, set) => {
  set(uploadingAtom, true);

  try {
    const itemIds = get(itemIdsAtom);

    const selectedIds = get(selectedIdsAtom);
    const idsToUpload = itemIds.filter(id => selectedIds.includes(id));
    const items = idsToUpload.map(id => get(itemAtom(id)));
    const results = await uploadMultipleToGyazo(items);

    results.forEach(result => {
      set(updateGyaoUrlAtom, result.imageId, {
        previewUrl: `https://i.gyazo.com/thumb/3024/${result.image_id}-heic.jpg`,
        gyazoUrl: result.permalink_url,
      });
      set(loadingAtom(result.imageId), false);
    });
  } finally {
    set(uploadingAtom, false); // TODO:
  }
});
