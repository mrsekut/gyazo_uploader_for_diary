import { atom } from 'jotai';
import { itemIdsAtom, itemAtom } from '@/features/item/atom';
import { uploadMultipleToGyazo } from '@/features/item/upload/gyazo';
import { selectedIdsAtom } from '../select';

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
      set(itemAtom(result.imageId), item => ({
        ...item,
        gyazoUrl: result.permalink_url,
      }));
      // set(loadingAtom(result.imageId), false);
    });
  } finally {
    set(uploadingAtom, false);
  }
});
