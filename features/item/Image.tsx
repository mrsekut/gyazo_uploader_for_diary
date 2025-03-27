import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import heic2any from 'heic2any';
import { Loader } from 'lucide-react';

type Props = {
  file: File;
};

export const Image = ({ file }: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processFile = async () => {
      if (isHeic(file)) {
        try {
          setLoading(true);
          const url = await convertHeicToJpeg(file);
          setPreviewUrl(url);
        } catch (error) {
          console.error('HEIC conversion failed:', error);
        } finally {
          setLoading(false);
        }
      } else {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    };

    processFile();
  }, [file]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  if (!previewUrl) return null;

  return (
    <NextImage
      src={previewUrl}
      alt={file.name}
      fill
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
