'use client';
import { useImageViewer } from '@/features/item/useImageViewer';
import { useCopyUrls } from '@/features/item/useCopyUrls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemList } from '@/features/item/ItemList';

export const ImageViewer = () => {
  const {
    items,
    selectedIds,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    handleGroupSelect,
  } = useImageViewer();
  const { copyUrls, copied } = useCopyUrls();

  return (
    <div className="p-4 space-y-4">
      <div className="p-4 flex gap-4 sticky top-0 z-50 bg-background pb-4">
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
          {copied ? 'Copied!' : 'Copy URLs'}
        </Button>
      </div>

      <ItemList
        items={groupByTime(items, 5)}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        handleGroupSelect={handleGroupSelect}
      />
    </div>
  );
};

const groupByTime = <T extends { captureDate: number; file: { name: string } }>(
  item: T[],
  minute: number,
): T[][] => {
  const ms = minute * 60 * 1000;

  return item
    .sort((a, b) => {
      const diff = a.captureDate - b.captureDate;
      return diff !== 0 ? diff : a.file.name.localeCompare(b.file.name);
    })
    .reduce((acc: T[][], file) => {
      if (acc.length === 0) return [[file]];

      const lastGroup = acc.at(-1);
      if (lastGroup == null) return acc;

      const lastItem = lastGroup.at(-1);
      if (lastItem == null) return acc;

      const diff = Math.abs(file.captureDate - lastItem.captureDate);

      if (diff > ms) return [...acc, [file]];
      return [...acc.slice(0, -1), [...lastGroup, file]];
    }, []);
};
