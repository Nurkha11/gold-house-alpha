export type DistrictSource = 'yandex' | 'coordinates' | 'manual';

export type PropertyLocation = {
  country: string;
  city: string;
  district: string | null;
  microdistrict: string | null;
  street: string | null;
  houseNumber: string | null;
  fullAddress: string;
  latitude: number;
  longitude: number;
  yandexObjectId?: string | null;
  source: 'yandex' | 'manual';
  locationConfirmed: boolean;
  districtSource: DistrictSource;
  publicLocationPrecision: 'approximate';
  locationWarnings: string[];
};

export type ResidentialComplex = {
  id: string;
  name: string;
  aliases: string[];
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  addressHint: string;
};

export type ResidentialComplexSuggestion = {
  name: string;
  district: string;
  latitude?: number;
  longitude?: number;
  duplicateComplexIds: string[];
  status: 'draft' | 'pending_admin_review' | 'merged' | 'approved';
};

export type AddressSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  location: PropertyLocation;
};

export const almatyCenter = {
  latitude: 43.238949,
  longitude: 76.889709,
};

export const almatyDistricts = [
  'Бостандыкский',
  'Алмалинский',
  'Медеуский',
  'Ауэзовский',
  'Наурызбайский',
  'Турксибский',
  'Жетысуский',
  'Алатауский',
];

