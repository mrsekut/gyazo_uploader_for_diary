'use client';
import { useImageViewer } from '@/app/useImageViewer';
import { ImagePreview } from '@/features/item/ImagePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ImageViewer = () => {
  const {
    files,
    selectedIndexes,
    uploading,
    handleFileChange,
    handleUpload,
    handleSelect,
    copyUrls,
  } = useImageViewer();

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <Input
          type="file"
          className="flex gap-2"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleUpload}
          disabled={selectedIndexes.length === 0 || uploading}
          variant="outline"
        >
          {uploading ? 'Uploading...' : 'Upload to Gyazo'}
        </Button>
        <Button
          onClick={copyUrls}
          disabled={selectedIndexes.length === 0}
          variant="outline"
        >
          Copy URLs
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {files
          .sort((a, b) => b.file.lastModified - a.file.lastModified)
          .map((item, index, arr) => {
            const currentTime = new Date(item.file.lastModified).getTime();
            const prevTime =
              index > 0
                ? new Date(arr[index - 1].file.lastModified).getTime()
                : null;
            const timeDiff = prevTime
              ? Math.abs(currentTime - prevTime)
              : Infinity;
            const isCloseInTime = timeDiff < 5 * 60 * 1000; // 5 minutes

            return (
              <div
                key={item.file.name}
                className={isCloseInTime ? 'mb-1' : 'mb-4'}
              >
                <ImagePreview
                  file={item.file}
                  selected={selectedIndexes.includes(index)}
                  onSelect={(selected, isShiftKey) =>
                    handleSelect(index, isShiftKey)
                  }
                  gyazoUrl={item.gyazoUrl}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
