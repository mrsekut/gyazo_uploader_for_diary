import { atom } from 'jotai';
import { itemAtom } from '@/features/item/atom';
import { uploadToGyazo } from '@/features/item/upload/gyazo';
import { uploadFiles } from '@/features/item/upload/uploader';

// Manual upload atom (legacy, for backward compatibility)
// Note: This is no longer needed with auto-upload, but kept for compatibility
export const uploadAtom = atom(null, async (get, set, ids: string[]) => {
  try {
    const items = ids.map(id => get(itemAtom(id)));

    // Use the new uploader with uploadToGyazo as the upload function
    const requests = items.map(item => ({ id: item.id, file: item.file }));
    const results = await uploadFiles(requests, uploadToGyazo);

    results.forEach(result => {
      set(itemAtom(result.id), item => ({
        ...item,
        status: 'uploaded',
        gyazoUrl: result.permalinkUrl,
        gyazoImageId: result.imageId,
      }));
    });
  } finally {
    //
  }
});

// Auto upload atom - automatically uploads file on add
export const autoUploadAtom = atom(null, async (get, set, id: string) => {
  const item = get(itemAtom(id));

  // Set status to uploading
  set(itemAtom(id), { ...item, status: 'uploading' });

  try {
    const result = await uploadToGyazo(id, item.file);

    // Update with success
    set(itemAtom(id), currentItem => ({
      ...currentItem,
      status: 'uploaded',
      gyazoUrl: result.permalinkUrl,
      gyazoImageId: result.imageId,
    }));
  } catch (error) {
    // Update with error
    set(itemAtom(id), currentItem => ({
      ...currentItem,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Upload failed',
    }));
  }
});
