'use client';
import { useImageViewer } from '@/features/item/useImageViewer';
import { Input } from '@/components/ui/input';
import { ItemList } from '@/features/item/ItemList';
import { groupByTime } from '@/features/item/grouping';

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
