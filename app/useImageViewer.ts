import { useState, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { itemsAtom, addItemAtom, updateItemAtom } from '@/features/item/atom';
import { uploadMultipleToGyazo } from '@/app/gyazo';
import { useSelection } from './useSelection';

export const useImageViewer = () => {
  const [files] = useAtom(itemsAtom);
  const { selectedIds, handleSelect } = useSelection();
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
      const filesToUpload = files.filter(file => selectedIds.includes(file.id));
      const results: { url: string }[] = await uploadMultipleToGyazo(
        filesToUpload.map(f => f.file),
      );

      results.forEach((result, index) => {
        const fileId = filesToUpload[index].id;
        updateImage(fileId, {
          gyazoUrl: result.url || null,
        });
      });
    } finally {
      setUploading(false);
    }
  }, [files, selectedIds]);

  const copyUrls = useCallback(() => {
    const urls = files
      .filter(file => selectedIds.includes(file.id) && file.gyazoUrl)
      .map(file => file.gyazoUrl)
      .join('\n');

    navigator.clipboard.writeText(urls);
  }, [files, selectedIds]);

  return {
    files,
    selectedIds,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    copyUrls,
  };
};
