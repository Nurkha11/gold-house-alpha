import { PropertyPhoto } from '@/data/ownerTypes';

export type PhotoStorageAdapter = {
  uploadPhoto(
    photo: PropertyPhoto,
    onProgress?: (progress: number) => void,
  ): Promise<{
    remoteUrl: string;
  }>;
  deletePhoto?(remoteUrl: string): Promise<void>;
};

export const LocalPhotoStorageAdapter: PhotoStorageAdapter = {
  async uploadPhoto() {
    throw new Error('Remote photo storage is not connected yet.');
  },
};
