import { ImageItem } from '@/features/item/atom';
import { ItemGroup } from './ItemGroup';

type Props = {
  items: ImageItem[][];
};

export const ItemList = ({ items }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      {items.map((group, index) => (
        <ItemGroup key={index} group={group} />
      ))}
    </div>
  );
};
