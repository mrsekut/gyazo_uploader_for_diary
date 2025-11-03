import { atom } from 'jotai';
import { itemAtom, itemsAtom } from '@/features/item/atom';
import { uploadToGyazo } from '@/features/item/upload/gyazo';
import { UploadQueue } from './UploadQueue';
import { groupByTime, calculateGroupPriority } from '../grouping';

// Create a singleton upload queue instance with 3 concurrent uploads
const uploadQueue = new UploadQueue(uploadToGyazo, 3);

// Auto upload atom - automatically uploads file on add with priority queue
export const autoUploadAtom = atom(
  null,
  (get, set, payload: { id: string; priority?: number }) => {
    const { id, priority = 0 } = payload;
    const item = get(itemAtom(id));

    // Set status to uploading
    set(itemAtom(id), { ...item, status: 'uploading' });

    // Enqueue with priority
    uploadQueue.enqueue({ id: item.id, file: item.file }, priority, {
      onProgress: status => {
        set(itemAtom(id), currentItem => ({
          ...currentItem,
          status,
        }));
      },
      onComplete: result => {
        set(itemAtom(id), currentItem => ({
          ...currentItem,
          status: 'uploaded',
          gyazoUrl: result.permalinkUrl,
          gyazoImageId: result.imageId,
        }));
      },
      onError: error => {
        set(itemAtom(id), currentItem => ({
          ...currentItem,
          status: 'failed',
          error: error.message || 'Upload failed',
        }));
      },
    });
  },
);

// Calculate priority for an item based on its group
export const calculateItemPriorityAtom = atom(null, (get, _set, id: string) => {
  const allItems = get(itemsAtom);
  const groups = groupByTime(allItems, 5);
  const priorityMap = calculateGroupPriority(groups);
  return priorityMap.get(id) ?? 999; // Default to low priority if not found
});
