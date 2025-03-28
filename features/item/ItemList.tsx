import { ImagePreview } from '@/features/item/ImagePreview';
import { ImageItem } from '@/features/item/atom';
import { Button } from '@/components/ui/button';
import { useCopyUrls } from './useCopyUrls';
import { useAtomValue, useSetAtom } from 'jotai';
import { uploadAtom, uploadingAtom } from './upload/atom';

type Props = {
  items: ImageItem[][];
};

export const ItemList = ({ items }: Props) => {
  const { copyUrls, copied } = useCopyUrls();
  const onUpload = useSetAtom(uploadAtom);
  const uploading = useAtomValue(uploadingAtom);

  return (
    <div className="flex flex-col gap-8">
      {items.map((group, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpload(group.map(item => item.id))}
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
      ))}
    </div>
  );
};
