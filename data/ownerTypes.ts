export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'needs_shooting'
  | 'approved'
  | 'published'
  | 'rejected';

export type Owner = {
  id: string;
  name: string;
  phone: string;
};

export type MediaFile = {
  id: string;
  type: 'photo' | 'video';
  category: 'apartment' | 'yard' | 'entrance' | 'view' | 'owner';
  name: string;
  uri?: string;
};

export type PropertySubmission = {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
  address: {
    city: string;
    district: string;
    complexName: string;
    street: string;
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
    elevator: string;
    parking: string;
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
