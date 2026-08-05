import { PropertyLocation, ResidentialComplexSuggestion } from '@/data/locationTypes';
import type { BalconyType } from '@/data/balconyTypes';
import type { ElevatorCount } from '@/data/elevatorTypes';
import type { ParkingType } from '@/data/parkingTypes';

export type SubmissionStatus =
  | 'draft'
  | 'pending_moderation'
  | 'submitted'
  | 'sent'
  | 'reviewing'
  | 'needs_shooting'
  | 'approved'
  | 'published'
  | 'changes_requested'
  | 'rejected';

export type Owner = {
  id: string;
  name: string;
  phone: string;
};

export type PropertyPhotoCategory = 'apartment' | 'yard' | 'entrance' | 'view';
export type PropertyVideoCategory = 'apartment' | 'yard' | 'entrance' | 'owner';

export type PropertyPhoto = {
  id: string;
  type: 'photo';
  category: PropertyPhotoCategory;
  name: string;
  uri?: string;
  localUri: string;
  remoteUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number | null;
  width: number | null;
  height: number | null;
  order: number;
  isCover: boolean;
  uploadStatus: 'local' | 'uploading' | 'uploaded' | 'error';
  uploadProgress: number;
  errorMessage: string | null;
  duplicateKey?: string;
  createdAt: string;
};

export type PropertyVideo = {
  id: string;
  type: 'video';
  category: PropertyVideoCategory;
  name: string;
  uri?: string;
  localUri: string;
  remoteUrl: string | null;
  fileName: string;
  mimeType: string;
  fileSize: number | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  thumbnailUri: string | null;
  uploadStatus: 'local' | 'uploading' | 'uploaded' | 'error';
  uploadProgress: number;
  errorMessage: string | null;
  duplicateKey?: string;
  createdAt: string;
};

export type MediaFile = PropertyPhoto | PropertyVideo;

export type PropertySubmission = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  status: SubmissionStatus;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
  address: {
    city: string;
    district: string;
    complexName: string;
    street: string;
    location?: PropertyLocation;
    residentialComplexId?: string;
    newResidentialComplex?: ResidentialComplexSuggestion | null;
  };
  characteristics: {
    rooms: string;
    totalArea: string;
    livingArea: string;
    kitchenArea: string;
    floor: string;
    totalFloors: string;
    year: string;
    buildingMaterial: string;
    ceilingHeight: string;
    bathroom: string;
    balcony: string;
    balconyType?: BalconyType;
    elevator: string;
    elevatorCount?: ElevatorCount;
    hasFreightElevator?: boolean | null;
    parking: string;
    parkingType?: ParkingType;
    hasPrivateParkingSpace?: boolean | null;
    parkingSpaceIncludedInPrice?: boolean | null;
  };
  priceTerms: {
    price: string;
    bargain: string;
    mortgage: string;
    documents: string;
    encumbrance: string;
  };
  condition: {
    renovation: string;
    repairComment: string;
    furniture: string;
    appliances: string;
    remains: string;
  };
  ownerDescription: {
    likes: string;
    minuses: string;
    fitFor: string;
    sellingReason: string;
  };
  media: MediaFile[];
};
