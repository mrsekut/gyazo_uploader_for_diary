// Pure upload functions - framework agnostic

import type { UploadRequest, UploadResult, UploadError } from './types';

export type UploadFunction = (id: string, file: File) => Promise<UploadResult>;

/**
 * Upload multiple files using the provided upload function
 * @param requests - Array of upload requests
 * @param uploadFn - Function to perform single file upload
 * @returns Promise resolving to array of upload results
 */
export async function uploadFiles(
  requests: UploadRequest[],
  uploadFn: UploadFunction,
): Promise<UploadResult[]> {
  return Promise.all(requests.map(req => uploadFn(req.id, req.file)));
}

/**
 * Upload files sequentially (one at a time)
 * @param requests - Array of upload requests
 * @param uploadFn - Function to perform single file upload
 * @returns Promise resolving to array of upload results
 */
export async function uploadFilesSequentially(
  requests: UploadRequest[],
  uploadFn: UploadFunction,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const req of requests) {
    const result = await uploadFn(req.id, req.file);
    results.push(result);
  }

  return results;
}

/**
 * Upload files with progress tracking
 * @param requests - Array of upload requests
 * @param uploadFn - Function to perform single file upload
 * @param onProgress - Callback for progress updates
 * @param onError - Callback for error handling
 * @returns Promise resolving to array of successful upload results
 */
export async function uploadFilesWithProgress(
  requests: UploadRequest[],
  uploadFn: UploadFunction,
  onProgress?: (
    id: string,
    status: 'uploading' | 'uploaded' | 'failed',
  ) => void,
  onError?: (error: UploadError) => void,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  const uploadPromises = requests.map(async req => {
    try {
      onProgress?.(req.id, 'uploading');
      const result = await uploadFn(req.id, req.file);
      onProgress?.(req.id, 'uploaded');
      return result;
    } catch (error) {
      onProgress?.(req.id, 'failed');
      onError?.({ id: req.id, error: error as Error });
      throw error;
    }
  });

  const settled = await Promise.allSettled(uploadPromises);

  settled.forEach(result => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    }
  });

  return results;
}
