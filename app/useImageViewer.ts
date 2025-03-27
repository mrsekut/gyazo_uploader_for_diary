import { useState, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom, updateItemAtom } from '@/features/item/atom';
import { uploadMultipleToGyazo } from '@/app/gyazo';
import { useSelection } from './useSelection';

export const useImageViewer = () => {
  const [files] = useAtom(itemsAtom);
  const { selectedIndexes, handleSelect } = useSelection();
  const [uploading, setUploading] = useState(false);
  const addImage = useSetAtom(addItemAtom);
  const updateImage = useSetAtom(updateItemAtom);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          addImage({
            file,
            previewUrl: reader.result as string,
            index: files.length,
            gyazoUrl: null,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleUpload = useCallback(async () => {
    setUploading(true);
    try {
      const filesToUpload = selectedIndexes.map(index => files[index]);
      const results: { url: string }[] = await uploadMultipleToGyazo(
        filesToUpload.map(f => f.file),
      );

      results.forEach((result, index) => {
        const itemIndex = selectedIndexes[index];
        updateImage(itemIndex, {
          ...files[itemIndex],
          gyazoUrl: result.url || null,
        });
      });
    } finally {
      setUploading(false);
    }
  }, [files, selectedIndexes]);

  const copyUrls = useCallback(() => {
    const urls = selectedIndexes
      .map(index => files[index])
      .filter(f => f.gyazoUrl)
      .map(f => f.gyazoUrl)
      .join('\n');

    navigator.clipboard.writeText(urls);
  }, [files, selectedIndexes]);

  return {
    files,
    selectedIndexes,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    copyUrls,
  };
};
