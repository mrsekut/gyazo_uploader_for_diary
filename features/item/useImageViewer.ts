import { useState, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom, updateItemAtom } from '@/features/item/atom';
import exifr from 'exifr';
import { uploadMultipleToGyazo } from '@/app/gyazo';
import { useSelection } from './useSelection';

// TODO:
export const useImageViewer = () => {
  const [items] = useAtom(itemsAtom);
  const { selectedIds, handleSelect, handleGroupSelect } = useSelection();
  const [uploading, setUploading] = useState(false);
  const addImage = useSetAtom(addItemAtom);
  const updateImage = useSetAtom(updateItemAtom);

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

  const handleUpload = useCallback(async () => {
    setUploading(true);
    try {
      const filesToUpload = items.filter(file => selectedIds.includes(file.id));
      const results = await uploadMultipleToGyazo(
        filesToUpload.map(f => f.file),
      );

      results.forEach((result, index) => {
        const fileId = filesToUpload[index].id;
        updateImage(fileId, {
          gyazoUrl: result.permalink_url || null,
        });
      });
    } finally {
      setUploading(false);
    }
  }, [items, selectedIds]);

  return {
    items,
    selectedIds,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    handleGroupSelect,
  };
};
