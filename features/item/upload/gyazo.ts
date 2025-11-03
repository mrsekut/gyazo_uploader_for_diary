'use server';
import { ImageId } from '@/features/item/atom';
import { GYAZO_CONFIG } from './config';
import type { UploadResult } from './types';

type GyazoUploadResponse = {
  imageId: ImageId;
  image_id: string;
  permalink_url: string;
  thumb_url: string;
  url: string;
};

/**
 * Upload a single file to Gyazo
 * Server Action that can be called from client or used with uploader.ts
 */
export const uploadToGyazo = async (
  id: string,
  file: File,
): Promise<UploadResult> => {
  const response = await uploadToGyazoLegacy(id, file);
  return {
    id,
    imageId: response.image_id,
    permalinkUrl: response.permalink_url,
    thumbUrl: response.thumb_url,
    url: response.url,
  };
};

const uploadToGyazoLegacy = async (
  imageId: ImageId,
  file: File,
): Promise<GyazoUploadResponse> => {
  if (!GYAZO_CONFIG.ACCESS_TOKEN) {
    throw new Error(
      'Gyazo access token is not configured. Please set GYAZO_ACCESS_TOKEN in your environment variables.',
    );
  }

  const formData = new FormData();
  formData.append('access_token', GYAZO_CONFIG.ACCESS_TOKEN);
  formData.append('imagedata', file);

  const response = await fetch(GYAZO_CONFIG.UPLOAD_URL, {
    method: 'POST',
    body: formData,
    mode: 'cors',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gyazo upload failed: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    ...result,
    imageId,
  };
};
