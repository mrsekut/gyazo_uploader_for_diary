import NextImage from 'next/image';
import { ImageItem } from './atom';
import { Loader, AlertCircle } from 'lucide-react';

type Props = {
  item: ImageItem;
};

export const Image = ({ item }: Props) => {
  // Show loading state while uploading
  if (item.status === 'uploading') {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show error state if upload failed
  if (item.status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-red-500">
        <AlertCircle className="w-8 h-8" />
        <span className="text-xs">{item.error || 'Upload failed'}</span>
      </div>
    );
  }

  // Show Gyazo image if uploaded
  if (item.status === 'uploaded' && item.gyazoImageId) {
    return (
      <NextImage
        src={`https://i.gyazo.com/thumb/3024/${item.gyazoImageId}-heic.jpg`}
        alt={item.file.name}
        fill
        className="w-full h-full object-contain"
        unoptimized
      />
    );
  }

  // Fallback
  return null;
};
