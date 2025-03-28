'use client';
import { useImageViewer } from '@/features/item/useImageViewer';
import { Input } from '@/components/ui/input';
import { ItemList } from '@/features/item/ItemList';

export const ImageViewer = () => {
  const { items, handleFileChange } = useImageViewer();

  return (
    <div className="p-4 space-y-4">
      <Input
        type="file"
        className="flex gap-2 m-4"
        multiple
        accept="image/*,.heic,.heif"
        onChange={handleFileChange}
      />

      <ItemList items={groupByTime(items, 5)} />
    </div>
  );
};

const groupByTime = <T extends { captureDate: number; file: File }>(
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
