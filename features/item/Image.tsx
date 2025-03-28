import NextImage from 'next/image';
import { ImageItem } from './atom';
import { useAtomValue, useSetAtom } from 'jotai';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { setPreviewUrl, previewUrlAtom } from './previewUrlAtom';

type Props = {
  item: ImageItem;
};

export const Image = ({ item }: Props) => {
  const previewUrl = useAtomValue(previewUrlAtom(item.id));

  const convert = useSetAtom(setPreviewUrl(item.id));
  useEffect(() => {
    convert();
  }, [convert]);

  if (previewUrl.type === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (previewUrl.type === 'none') {
    return null;
  }

  return (
    <NextImage
      src={previewUrl.url}
      alt={item.file.name}
      fill
      className="w-full h-full object-contain"
      unoptimized
    />
  );
};
