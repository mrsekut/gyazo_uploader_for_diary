import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom } from '@/features/item/atom';
import {
  autoUploadAtom,
  calculateItemPriorityAtom,
} from '@/features/item/upload/atom';
import exifr from 'exifr';

export const useImageViewer = () => {
  const [items] = useAtom(itemsAtom);
  const addImage = useSetAtom(addItemAtom);
  const autoUpload = useSetAtom(autoUploadAtom);
  const calculatePriority = useSetAtom(calculateItemPriorityAtom);

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
              const item = {
                file,
                gyazoUrl: null,
                gyazoImageId: null,
                captureDate: new Date(captureDate).getTime(),
                status: 'uploading' as const,
              };
              const id = addImage(item);
              // Calculate priority based on group and start auto upload
              const priority = calculatePriority(id);
              autoUpload({ id, priority });
            })
            .catch(() => {
              const item = {
                file,
                gyazoUrl: null,
                gyazoImageId: null,
                captureDate: file.lastModified,
                status: 'uploading' as const,
              };
              const id = addImage(item);
              const priority = calculatePriority(id);
              autoUpload({ id, priority });
            });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return {
    items,
    handleFileChange,
  };
};
