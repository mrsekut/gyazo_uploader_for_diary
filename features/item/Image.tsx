import NextImage from 'next/image';
import { ImageId, ImageItem, previewUrlAtom } from './atom';
import { atomFamily } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import { Loader } from 'lucide-react';

type Props = {
  item: ImageItem;
};

// TODO: deprecated
export const loadingAtom = atomFamily((_id: ImageId) => atom(false));

export const Image = ({ item }: Props) => {
  const { file, id } = item;

  const [, setPreviewUrl] = useAtom(previewUrlAtom);
  setPreviewUrl({ file, itemId: id });

  if (!item.previewUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <NextImage
      src={item.previewUrl}
      alt={file.name}
      fill
      className="w-full h-full object-contain"
      unoptimized
    />
  );
};
