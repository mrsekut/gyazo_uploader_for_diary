// Core types for upload functionality

export type UploadRequest = {
  id: string;
  file: File;
};

export type UploadResult = {
  id: string;
  imageId: string;
  permalinkUrl: string;
  thumbUrl: string;
  url: string;
};

export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

export type UploadError = {
  id: string;
  error: Error;
};
