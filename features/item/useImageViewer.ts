import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom } from '@/features/item/atom';
import { autoUploadAtom } from '@/features/item/upload/atom';
import exifr from 'exifr';

// TODO: ai
export const useImageViewer = () => {
  const [items] = useAtom(itemsAtom);
  const addImage = useSetAtom(addItemAtom);
  const autoUpload = useSetAtom(autoUploadAtom);

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
              // Start auto upload immediately after adding
              autoUpload(id);
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
              autoUpload(id);
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
