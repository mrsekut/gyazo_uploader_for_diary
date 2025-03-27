import { useState, useEffect } from 'react';
import Image from 'next/image';
import heic2any from 'heic2any';
import { Card } from '../components/ui/card';

type Props = {
  file: File;
  onSelect?: (selected: boolean, isShiftKey: boolean) => void;
  selected?: boolean;
  index?: number;
  lastSelectedIndex?: number | null;
  gyazoUrl: string | null;
};

// TODO: style
export const ImagePreview = ({
  file,
  onSelect,
  selected,
  index,
  lastSelectedIndex,
  gyazoUrl,
}: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const processFile = async () => {
      if (isHeic(file)) {
        try {
          const url = await convertHeicToJpeg(file);
          setPreviewUrl(url);
        } catch (error) {
          console.error('HEIC conversion failed:', error);
        }
      } else {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    };

    processFile();
  }, [file]);

  return (
    <Card
      className={`p-2 ${
        selected
          ? 'ring-2 ring-blue-500'
          : index != null &&
            lastSelectedIndex != null &&
            ((index >= lastSelectedIndex && index <= lastSelectedIndex) ||
              (index <= lastSelectedIndex && index >= lastSelectedIndex))
          ? 'bg-blue-50'
          : ''
      } cursor-pointer`}
      onClick={e => {
        if (onSelect) {
          onSelect(!selected, e.shiftKey);
        }
      }}
    >
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt={file.name}
              width={96}
              height={96}
              className="w-full h-full object-contain"
              unoptimized
            />
          )}
        </div>

        <div className="flex-grow flex flex-col justify-between h-24">
          <div>
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-gray-500 text-xs">
              {new Date(file.lastModified).toLocaleString()}
            </p>
            {gyazoUrl && (
              <p className="text-blue-500 text-xs truncate">
                <a href={gyazoUrl} target="_blank" rel="noopener noreferrer">
                  {gyazoUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

const convertHeicToJpeg = async (file: File) => {
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.8,
  });

  return URL.createObjectURL(convertedBlob as Blob);
};

const isHeic = (file: File) =>
  file.type === 'image/heic' ||
  file.type === 'image/heif' ||
  file.name.toLowerCase().endsWith('.heic') ||
  file.name.toLowerCase().endsWith('.heif');
