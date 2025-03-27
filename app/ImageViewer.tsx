'use client';
import { useState, useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ImagePreview } from '../features/item/ImagePreview';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { itemsAtom, addItemAtom, updateItemAtom } from '../features/item/atom';
import { uploadMultipleToGyazo } from './gyazo';
import { selectedIndexAtom } from '@/features/item/select';

export const ImageViewer = () => {
  const [files] = useAtom(itemsAtom);
  const [selectedIndexes, setSelectedIndexes] = useAtom(selectedIndexAtom);
  const [uploading, setUploading] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );
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

  const handleSelect = (
    fileName: string,
    selected: boolean,
    isShiftKey: boolean,
    index: number,
  ) => {
    if (isShiftKey && lastSelectedIndex !== null) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const newSelectedIndexes = new Set(selectedIndexes);
      for (let i = start; i <= end; i++) {
        newSelectedIndexes.add(i);
      }
      setSelectedIndexes(Array.from(newSelectedIndexes));
    } else {
      // Single selection
      setSelectedIndexes(
        selected
          ? [...selectedIndexes, index]
          : selectedIndexes.filter(i => i !== index),
      );
    }
    setLastSelectedIndex(index);
  };

  const handleUpload = useCallback(async () => {
    setUploading(true);
    try {
      const filesToUpload = selectedIndexes.map(index => files[index]);
      const results = await uploadMultipleToGyazo(
        filesToUpload.map(f => f.file),
      );
      console.log(results);

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

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <div className="flex gap-2">
          <Input
            type="file"
            multiple
            accept="image/*,.heic,.heif"
            onChange={handleFileChange}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={selectedIndexes.length === 0 || uploading}
          variant="outline"
        >
          {uploading ? 'Uploading...' : 'Upload to Gyazo'}
        </Button>
        <Button
          onClick={copyUrls}
          disabled={selectedIndexes.length === 0}
          variant="outline"
        >
          Copy URLs
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {files
          .sort((a, b) => b.file.lastModified - a.file.lastModified)
          .map((item, index, arr) => {
            const currentTime = new Date(item.file.lastModified).getTime();
            const prevTime =
              index > 0
                ? new Date(arr[index - 1].file.lastModified).getTime()
                : null;
            const timeDiff = prevTime
              ? Math.abs(currentTime - prevTime)
              : Infinity;
            const isCloseInTime = timeDiff < 5 * 60 * 1000; // 5 minutes

            return (
              <div
                key={item.file.name}
                className={isCloseInTime ? 'mb-1' : 'mb-4'}
              >
                <ImagePreview
                  file={item.file}
                  selected={selectedIndexes.includes(index)}
                  onSelect={(selected, isShiftKey) =>
                    handleSelect(item.file.name, selected, isShiftKey, index)
                  }
                  gyazoUrl={item.gyazoUrl}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
