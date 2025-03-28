import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  itemsAtom,
  addItemAtom,
  updateGyaoUrlAtom,
  itemIdsAtom,
  itemAtom,
} from '@/features/item/atom';
import exifr from 'exifr';
import { uploadMultipleToGyazo } from '@/app/gyazo';
import { useSelection } from './useSelection';
import { selectedIdsAtom } from './select';
import { loadingAtom } from './Image';

// TODO:
export const useImageViewer = () => {
  const [items] = useAtom(itemsAtom);
  const { selectedIds, handleSelect, handleGroupSelect, handleResetSelection } =
    useSelection();
  const addImage = useSetAtom(addItemAtom);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          exifr
            .parse(file)
            .then(exif => {
              const captureDate =
                exif?.DateTimeOriginal || exif?.CreateDate || file.lastModified;
              addImage({
                file,
                previewUrl: reader.result as string,
                gyazoUrl: null,
                captureDate: new Date(captureDate).getTime(),
              });
            })
            .catch(() => {
              addImage({
                file,
                previewUrl: reader.result as string,
                gyazoUrl: null,
                captureDate: file.lastModified,
              });
            });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpload = useSetAtom(uploadAtom);
  const uploading = useAtomValue(uploadingAtom);

  return {
    items,
    selectedIds,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    handleGroupSelect,
    handleResetSelection,
  };
};

// TODO:
const uploadingAtom = atom(false);

const uploadAtom = atom(null, async (get, set) => {
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
    set(uploadingAtom, false);
  }
});
