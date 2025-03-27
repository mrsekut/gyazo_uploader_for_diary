import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import heic2any from 'heic2any';

type Props = {
  file: File;
  width: number;
  height: number;
};

export const Image = ({ file, width, height }: Props) => {
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
  if (!previewUrl) return null;

  return (
    <NextImage
      src={previewUrl}
      alt={file.name}
      width={width}
      height={height}
      className="w-full h-full object-contain"
      unoptimized
    />
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
