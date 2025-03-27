import { ImagePreview } from '@/features/item/ImagePreview';
import { ImageItem } from '@/features/item/atom';

type Props = {
  items: ImageItem[][];
  selectedIndexes: number[];
  handleSelect: (index: number, isShiftKey: boolean) => void;
};

export const ItemList = ({ items, selectedIndexes, handleSelect }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      {items.map((group, index) => (
        <div key={index} className="flex flex-row gap-2 flex-wrap">
          {group.map(item => (
            <ImagePreview
              key={item.file.name}
              file={item.file}
              selected={selectedIndexes.includes(item.index)}
              onSelect={(_selected, isShiftKey) =>
                handleSelect(item.index, isShiftKey)
              }
              gyazoUrl={item.gyazoUrl}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
