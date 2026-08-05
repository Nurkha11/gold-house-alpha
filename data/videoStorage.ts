import { PropertyVideo } from '@/data/ownerTypes';

export type VideoUploadResult = {
  remoteUrl: string;
  thumbnailUri: string | null;
};

export interface VideoStorageAdapter {
  uploadVideo(video: PropertyVideo): Promise<VideoUploadResult>;
  deleteVideo?(video: PropertyVideo): Promise<void>;
}

export class LocalVideoStorageAdapter implements VideoStorageAdapter {
  async uploadVideo(): Promise<VideoUploadResult> {
    throw new Error('Remote video storage is not connected yet.');
  }
}

export const videoStorageAdapter: VideoStorageAdapter = new LocalVideoStorageAdapter();
