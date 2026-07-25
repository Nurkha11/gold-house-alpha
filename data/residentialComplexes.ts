import { AddressSuggestion, PropertyLocation, ResidentialComplex, ResidentialComplexSuggestion, almatyCenter } from '@/data/locationTypes';

export const residentialComplexes: ResidentialComplex[] = [
  { id: 'rc-4you', name: '4YOU', aliases: ['4 you', 'four you', 'фор ю'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2059, longitude: 76.9028, addressHint: 'ул. Розыбакиева, рядом с Тимирязева' },
  { id: 'rc-riviera', name: 'Riviera', aliases: ['ривьера'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2108, longitude: 76.9154, addressHint: 'Бостандыкский район, рядом с Аль-Фараби' },
  { id: 'rc-estet', name: 'Estet', aliases: ['эстет'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2194, longitude: 76.8962, addressHint: 'Бостандыкский район, современный жилой квартал' },
  { id: 'rc-afd-plaza', name: 'AFD PLAZA', aliases: ['afd', 'afd plaza', 'афд плаза'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2265, longitude: 76.9343, addressHint: 'проспект Аль-Фараби, деловая часть района' },
  { id: 'rc-abay130', name: 'Abay130', aliases: ['abay 130', 'абая 130'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.238, longitude: 76.885, addressHint: 'проспект Абая, 130' },
  { id: 'rc-akvarel', name: 'Акварель', aliases: ['akvarel'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2218, longitude: 76.8787, addressHint: 'Бостандыкский район, рядом с городской инфраструктурой' },
  { id: 'rc-simfoniya', name: 'Симфония', aliases: ['simfoniya', 'symphony'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.2169, longitude: 76.8878, addressHint: 'Бостандыкский район, современный ЖК' },
  { id: 'rc-4hills', name: '4Hills', aliases: ['4 hills', 'фор хиллс'], city: 'Алматы', district: 'Бостандыкский', latitude: 43.1997, longitude: 76.8754, addressHint: 'Бостандыкский район, малоэтажный формат' },
  { id: 'rc-ulytau-park', name: 'Ulytau Park', aliases: ['ulytau', 'улытау парк'], city: 'Алматы', district: 'Наурызбайский', latitude: 43.2207, longitude: 76.7997, addressHint: 'Наурызбайский район, микрорайон Шугыла' },
  { id: 'rc-alatau-plus', name: 'Alatau Plus', aliases: ['алатау плюс'], city: 'Алматы', district: 'Наурызбайский', latitude: 43.2223, longitude: 76.8144, addressHint: 'Наурызбайский район, рядом с проспектом Райымбека' },
  { id: 'rc-alem-city', name: 'Алем Сити', aliases: ['alem city', 'alem siti'], city: 'Алматы', district: 'Наурызбайский', latitude: 43.2145, longitude: 76.7939, addressHint: 'Наурызбайский район, западная часть города' },
  { id: 'rc-alma-city-4', name: 'Алма Сити 4', aliases: ['alma city 4', 'alma siti 4'], city: 'Алматы', district: 'Наурызбайский', latitude: 43.2099, longitude: 76.7808, addressHint: 'Наурызбайский район, Алма Сити' },
];

export function normalizeComplexName(value: string) {
  return value
    .toLowerCase()
    .replace(/жк|жилой комплекс|residence|resident|плаза/g, '')
    .replace(/[^a-zа-яё0-9]/gi, '')
    .trim();
}

export function findResidentialComplexes(query: string, district?: string | null) {
  const normalizedQuery = normalizeComplexName(query);

  if (!normalizedQuery) {
    return [];
  }

  return residentialComplexes
    .filter((complex) => !district || complex.district === district)
    .filter((complex) => {
      const names = [complex.name, ...complex.aliases].map(normalizeComplexName);
      return names.some((name) => name.includes(normalizedQuery) || normalizedQuery.includes(name));
    })
    .slice(0, 6);
}

export function distanceMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadius = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findDuplicateComplexIds(name: string, latitude?: number, longitude?: number) {
  const byName = findResidentialComplexes(name).map((complex) => complex.id);

  if (latitude === undefined || longitude === undefined) {
    return byName;
  }

  const nearby = residentialComplexes
    .filter((complex) => distanceMeters({ latitude, longitude }, complex) < 350)
    .map((complex) => complex.id);

  return Array.from(new Set([...byName, ...nearby]));
}

export function inferDistrictFromAddress(address: string) {
  const normalized = address.toLowerCase();
  if (normalized.includes('бостандык') || normalized.includes('аль-фараби') || normalized.includes('розыбакиева') || normalized.includes('тимирязева')) return 'Бостандыкский';
  if (normalized.includes('наурызбай') || normalized.includes('шугыла') || normalized.includes('алма сити') || normalized.includes('улытау')) return 'Наурызбайский';
  if (normalized.includes('медеу') || normalized.includes('достык')) return 'Медеуский';
  if (normalized.includes('алмалы') || normalized.includes('абая')) return 'Алмалинский';
  return null;
}

export function createLocation(input: Partial<PropertyLocation> & { fullAddress: string; latitude?: number; longitude?: number }): PropertyLocation {
  const district = input.district ?? inferDistrictFromAddress(input.fullAddress);

  return {
    country: 'Казахстан',
    city: input.city ?? 'Алматы',
    district,
    microdistrict: input.microdistrict ?? null,
    street: input.street ?? input.fullAddress,
    houseNumber: input.houseNumber ?? null,
    fullAddress: input.fullAddress,
    latitude: input.latitude ?? almatyCenter.latitude,
    longitude: input.longitude ?? almatyCenter.longitude,
    yandexObjectId: input.yandexObjectId ?? null,
    source: input.source ?? 'manual',
    locationConfirmed: input.locationConfirmed ?? false,
    districtSource: input.districtSource ?? (district ? 'manual' : 'manual'),
    publicLocationPrecision: 'approximate',
    locationWarnings: input.locationWarnings ?? [],
  };
}

export const mockAddressSuggestions: AddressSuggestion[] = [
  { id: 'addr-4you', title: 'ЖК 4YOU', subtitle: 'Алматы, Бостандыкский район, ул. Розыбакиева', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, ЖК 4YOU, ул. Розыбакиева', district: 'Бостандыкский', latitude: 43.2059, longitude: 76.9028, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-4you' }) },
  { id: 'addr-estet', title: 'ЖК Estet', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, ЖК Estet', district: 'Бостандыкский', latitude: 43.2194, longitude: 76.8962, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-estet' }) },
  { id: 'addr-riviera', title: 'ЖК Riviera', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, ЖК Riviera', district: 'Бостандыкский', latitude: 43.2108, longitude: 76.9154, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-riviera' }) },
  { id: 'addr-afd', title: 'AFD PLAZA', subtitle: 'Алматы, Бостандыкский район, Аль-Фараби', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, AFD PLAZA, проспект Аль-Фараби', district: 'Бостандыкский', latitude: 43.2265, longitude: 76.9343, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-afd' }) },
  { id: 'addr-ulytau', title: 'Ulytau Park', subtitle: 'Алматы, Наурызбайский район, Шугыла', location: createLocation({ fullAddress: 'Алматы, Наурызбайский район, ЖК Ulytau Park, микрорайон Шугыла', district: 'Наурызбайский', latitude: 43.2207, longitude: 76.7997, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-ulytau' }) },
  { id: 'addr-alatau', title: 'Alatau Plus', subtitle: 'Алматы, Наурызбайский район', location: createLocation({ fullAddress: 'Алматы, Наурызбайский район, ЖК Alatau Plus', district: 'Наурызбайский', latitude: 43.2223, longitude: 76.8144, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-alatau' }) },
  { id: 'addr-alem', title: 'Алем Сити', subtitle: 'Алматы, Наурызбайский район', location: createLocation({ fullAddress: 'Алматы, Наурызбайский район, ЖК Алем Сити', district: 'Наурызбайский', latitude: 43.2145, longitude: 76.7939, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-alem' }) },
  { id: 'addr-alma', title: 'Алма Сити 4', subtitle: 'Алматы, Наурызбайский район', location: createLocation({ fullAddress: 'Алматы, Наурызбайский район, ЖК Алма Сити 4', district: 'Наурызбайский', latitude: 43.2099, longitude: 76.7808, source: 'yandex', districtSource: 'yandex', yandexObjectId: 'mock-alma' }) },
  { id: 'addr-dostyk-bostandyk', title: 'проспект Достык', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, проспект Достык', district: 'Бостандыкский', latitude: 43.2302, longitude: 76.9568, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-dostyk-bostandyk' }) },
  { id: 'addr-al-farabi', title: 'проспект Аль-Фараби', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, проспект Аль-Фараби', district: 'Бостандыкский', latitude: 43.2182, longitude: 76.9278, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-al-farabi' }) },
  { id: 'addr-timiryazeva', title: 'улица Тимирязева', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, улица Тимирязева', district: 'Бостандыкский', latitude: 43.2247, longitude: 76.9011, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-timiryazeva' }) },
  { id: 'addr-rozybakieva', title: 'улица Розыбакиева', subtitle: 'Алматы, Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, улица Розыбакиева', district: 'Бостандыкский', latitude: 43.2199, longitude: 76.8919, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-rozybakieva' }) },
  { id: 'addr-abay', title: 'проспект Абая', subtitle: 'Алматы, Алмалинский / Бостандыкский район', location: createLocation({ fullAddress: 'Алматы, Бостандыкский район, проспект Абая', district: 'Бостандыкский', latitude: 43.238, longitude: 76.885, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-abay' }) },
  { id: 'addr-shugyla', title: 'микрорайон Шугыла', subtitle: 'Алматы, Наурызбайский район', location: createLocation({ fullAddress: 'Алматы, Наурызбайский район, микрорайон Шугыла', district: 'Наурызбайский', latitude: 43.2191, longitude: 76.7948, source: 'manual', districtSource: 'manual', yandexObjectId: 'mock-shugyla' }) },
];

export function searchMockAddresses(query: string) {
  const normalized = query.toLowerCase().trim();

  if (normalized.length < 3) {
    return [];
  }

  return mockAddressSuggestions.filter((suggestion) => {
    const haystack = `${suggestion.title} ${suggestion.subtitle} ${suggestion.location.fullAddress}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function buildLocationWarnings(params: {
  location?: PropertyLocation;
  selectedDistrict?: string;
  selectedComplex?: ResidentialComplex | null;
  newComplex?: ResidentialComplexSuggestion | null;
}) {
  const warnings: string[] = [];
  const { location, selectedDistrict, selectedComplex, newComplex } = params;

  if (!location) {
    return warnings;
  }

  if (location.source === 'manual') {
    warnings.push('Адрес указан вручную: администратору нужно проверить геолокацию.');
  }

  if (location.district && selectedDistrict && location.district !== selectedDistrict) {
    warnings.push(`Район из адреса (${location.district}) отличается от выбранного района (${selectedDistrict}).`);
  }

  if (selectedComplex) {
    const distance = distanceMeters(location, selectedComplex);
    if (distance > 800) {
      warnings.push(`Метка находится примерно в ${Math.round(distance)} м от выбранного ЖК ${selectedComplex.name}.`);
    }
  }

  if (newComplex?.duplicateComplexIds.length) {
    warnings.push('Новый ЖК похож на существующий объект. Проверьте дубликаты перед публикацией.');
  }

  return warnings;
}
