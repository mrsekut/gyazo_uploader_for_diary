import { ImagePreview } from '@/features/item/ImagePreview';
import { ImageItem } from '@/features/item/atom';
import { Button } from '@/components/ui/button';
import { useCopyUrls } from './useCopyUrls';

type Props = {
  group: ImageItem[];
};

export const ItemGroup = ({ group }: Props) => {
  const { copyUrls, copied } = useCopyUrls();

  // Calculate group status
  const uploadedCount = group.filter(item => item.status === 'uploaded').length;
  const uploadingCount = group.filter(
    item => item.status === 'uploading',
  ).length;
  const failedCount = group.filter(item => item.status === 'failed').length;
  const totalCount = group.length;
  const allUploaded = uploadedCount === totalCount;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        {allUploaded ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyUrls(group.map(item => item.id))}
          >
            {copied ? 'Copied!' : 'Copy URLs'}
          </Button>
        ) : (
          <div className="text-sm text-gray-500">
            Uploading: {uploadedCount}/{totalCount}
            {failedCount > 0 && (
              <span className="text-red-500 ml-2">({failedCount} failed)</span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 flex-wrap p-2">
        {group.map(item => (
          <ImagePreview key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
