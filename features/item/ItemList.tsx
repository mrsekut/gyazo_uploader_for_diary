import { ImagePreview } from '@/features/item/ImagePreview';
import { ImageItem } from '@/features/item/atom';

type Props = {
  items: ImageItem[][];
  selectedIds: string[];
  handleSelect: (id: string) => void;
  handleGroupSelect: (ids: string[]) => void;
};

export const ItemList = ({
  items,
  selectedIds,
  handleSelect,
  handleGroupSelect,
}: Props) => {
  return (
    <div className="flex flex-col gap-8">
      {items.map((group, index) => (
        <div
          key={index}
          className="flex flex-row gap-2 flex-wrap cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => handleGroupSelect(group.map(item => item.id))}
        >
          {group.map(item => (
            <ImagePreview
              key={item.id}
              item={item}
              selected={selectedIds.includes(item.id)}
              onSelect={() => handleSelect(item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
