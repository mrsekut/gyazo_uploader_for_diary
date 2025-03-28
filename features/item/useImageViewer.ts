import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom } from '@/features/item/atom';
import exifr from 'exifr';
import { useSelection } from './useSelection';

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

  return {
    items,
    selectedIds,
    handleFileChange,
    handleSelect,
    handleGroupSelect,
    handleResetSelection,
  };
};
