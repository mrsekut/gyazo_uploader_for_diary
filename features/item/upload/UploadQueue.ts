// Upload queue manager with priority and concurrency control

import type { UploadRequest, UploadResult } from './types';

type UploadFunction = (id: string, file: File) => Promise<UploadResult>;

type QueueItem = {
  request: UploadRequest;
  priority: number;
  onProgress?: (status: 'uploading' | 'uploaded' | 'failed') => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
};

export class UploadQueue {
  private queue: QueueItem[] = [];
  private activeUploads = new Set<string>();
  private readonly concurrency: number;
  private readonly uploadFn: UploadFunction;

  constructor(uploadFn: UploadFunction, concurrency: number = 3) {
    this.uploadFn = uploadFn;
    this.concurrency = concurrency;
  }

  /**
   * Add an upload task to the queue
   * @param request - Upload request with id and file
   * @param priority - Priority number (lower = higher priority)
   * @param callbacks - Progress, completion, and error callbacks
   */
  enqueue(
    request: UploadRequest,
    priority: number = 0,
    callbacks?: {
      onProgress?: (status: 'uploading' | 'uploaded' | 'failed') => void;
      onComplete?: (result: UploadResult) => void;
      onError?: (error: Error) => void;
    },
  ): void {
    const item: QueueItem = {
      request,
      priority,
      ...callbacks,
    };

    this.queue.push(item);
    this.sortQueue();
    this.processQueue();
  }

  /**
   * Sort queue by priority (lower number = higher priority)
   */
  private sortQueue(): void {
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Process queue with concurrency control
   */
  private async processQueue(): Promise<void> {
    while (
      this.queue.length > 0 &&
      this.activeUploads.size < this.concurrency
    ) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeUploads.add(item.request.id);
      this.uploadItem(item).finally(() => {
        this.activeUploads.delete(item.request.id);
        this.processQueue(); // Continue processing after completion
      });
    }
  }

  /**
   * Upload a single item
   */
  private async uploadItem(item: QueueItem): Promise<void> {
    const { request, onProgress, onComplete, onError } = item;

    try {
      onProgress?.('uploading');
      const result = await this.uploadFn(request.id, request.file);
      onProgress?.('uploaded');
      onComplete?.(result);
    } catch (error) {
      onProgress?.('failed');
      onError?.(error as Error);
    }
  }

  /**
   * Get current queue status
   */
  getStatus(): {
    queueLength: number;
    activeUploads: number;
  } {
    return {
      queueLength: this.queue.length,
      activeUploads: this.activeUploads.size,
    };
  }

  /**
   * Clear the queue (does not stop active uploads)
   */
  clear(): void {
    this.queue = [];
  }
}
