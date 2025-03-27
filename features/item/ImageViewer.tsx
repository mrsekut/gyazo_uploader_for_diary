'use client';
import { useImageViewer } from '@/features/item/useImageViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemList } from '@/features/item/ItemList';

export const ImageViewer = () => {
  const {
    files,
    selectedIds,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    handleGroupSelect,
    copyUrls,
  } = useImageViewer();

  const imageItems = files.map(f => ({
    ...f,
    lastModified: f.file.lastModified,
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <Input
          type="file"
          className="flex gap-2"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleUpload}
          disabled={selectedIds.length === 0 || uploading}
          variant="outline"
        >
          {uploading ? 'Uploading...' : 'Upload to Gyazo'}
        </Button>
        <Button
          onClick={copyUrls}
          disabled={selectedIds.length === 0}
          variant="outline"
        >
          Copy URLs
        </Button>
      </div>

      <ItemList
        items={groupByTime(imageItems, 5)}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        handleGroupSelect={handleGroupSelect}
      />
    </div>
  );
};

const groupByTime = <T extends { lastModified: number }>(
  item: T[],
  minute: number,
): T[][] => {
  const ms = minute * 60 * 1000;

  return item
    .sort((a, b) => b.lastModified - a.lastModified)
    .reduce((acc: T[][], file) => {
      if (acc.length === 0) return [[file]];

      const lastGroup = acc.at(-1);
      if (lastGroup == null) return acc;

      const lastItem = lastGroup.at(-1);
      if (lastItem == null) return acc;

      const diff = Math.abs(file.lastModified - lastItem.lastModified);

      if (diff > ms) return [...acc, [file]];
      return [...acc.slice(0, -1), [...lastGroup, file]];
    }, []);
};
