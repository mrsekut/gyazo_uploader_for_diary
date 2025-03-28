import { ImagePreview } from '@/features/item/ImagePreview';
import { ImageItem } from '@/features/item/atom';
import { Button } from '@/components/ui/button';
import { useCopyUrls } from './useCopyUrls';
import { useSetAtom } from 'jotai';
import { uploadAtom } from './upload/atom';
import { useState } from 'react';

type Props = {
  group: ImageItem[];
};

export const ItemGroup = ({ group }: Props) => {
  const { copyUrls, copied } = useCopyUrls();
  const onUpload = useSetAtom(uploadAtom);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    setUploading(true);
    try {
      await onUpload(group.map(item => item.id));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyUrls(group.map(item => item.id))}
        >
          {copied ? 'Copied!' : 'Copy URLs'}
        </Button>
      </div>
      <div className="flex flex-row gap-2 flex-wrap p-2">
        {group.map(item => (
          <ImagePreview key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
