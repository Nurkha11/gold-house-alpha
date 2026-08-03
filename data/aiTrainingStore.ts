import { Property } from '@/data/properties';
import { getActiveBuyerSignals, recordBuyerSignal, saveBuyerPreferences } from '@/data/buyerProfileStore';
import { getBuyerProperties } from '@/data/propertyStore';

export type FloorCategory = 'first' | 'middle' | 'last';
export type FloorPreference =
  | 'any'
  | 'first'
  | 'last'
  | 'firstMiddle'
  | 'firstLast'
  | 'middleLast'
  | 'notFirst'
  | 'notLast'
  | 'middle'
  | 'first_only'
  | 'middle_only'
  | 'last_only'
  | 'first_middle'
  | 'first_last'
  | 'middle_last'
  | 'not_first'
  | 'not_last';

export type BuyerPreferences = {
  city: string;
  district?: string;
  selectedDistricts?: string[] | string;
  rooms?: string;
  budgetMin?: number;
  budgetMax?: number;
  selectedFloorCategories?: FloorCategory[] | string;
  floorPreference?: FloorPreference | string;
};

export type TrainingSignalType = 'like' | 'dislike' | 'detail_view' | 'long_detail_view' | 'viewing_request' | 'owner_call' | 'save';

export type TrainingSignal = {
  id: string;
  propertyId: string;
  type: TrainingSignalType;
  createdAt: string;
  durationMs?: number;
};

let preferences: BuyerPreferences = {
  city: 'Алматы',
  district: 'Наурызбайский',
  selectedDistricts: ['Наурызбайский'],
  rooms: '1',
  selectedFloorCategories: ['first', 'middle', 'last'],
};

let signals: TrainingSignal[] = [];

function normalizeDistricts(value?: string[] | string, fallback?: string) {
  const raw = Array.isArray(value) ? value : String(value ?? fallback ?? '').split(',');
  return raw.map((district) => district.trim()).filter(Boolean);
}

export function getSelectedDistricts() {
  return normalizeDistricts(preferences.selectedDistricts, preferences.district);
}

export function districtMatches(property: Property) {
  const selectedDistricts = getSelectedDistricts();
  return !selectedDistricts.length || selectedDistricts.includes(property.district);
}

export function normalizeFloorCategories(value?: string[] | string): FloorCategory[] {
  const legacyMap: Record<string, FloorCategory[]> = {
    any: ['first', 'middle', 'last'],
    first: ['first'],
    first_only: ['first'],
    middle: ['middle'],
    middle_only: ['middle'],
    last: ['last'],
    last_only: ['last'],
    firstMiddle: ['first', 'middle'],
    first_middle: ['first', 'middle'],
    firstLast: ['first', 'last'],
    first_last: ['first', 'last'],
    middleLast: ['middle', 'last'],
    middle_last: ['middle', 'last'],
    notFirst: ['middle', 'last'],
    not_first: ['middle', 'last'],
    notLast: ['first', 'middle'],
    not_last: ['first', 'middle'],
  };

  const raw = Array.isArray(value) ? value : String(value ?? '').split(',');
  const selected = raw.flatMap((item) => legacyMap[item.trim()] ?? [item.trim() as FloorCategory]);
  const unique = new Set<FloorCategory>();

  selected.forEach((item) => {
    if (item === 'first' || item === 'middle' || item === 'last') {
      unique.add(item);
    }
  });

  return [...unique];
}

function getSelectedFloorCategories() {
  const selected = normalizeFloorCategories(preferences.selectedFloorCategories);
  return selected.length ? selected : normalizeFloorCategories(preferences.floorPreference);
}

export function getPropertyFloorCategory(property: Property): FloorCategory {
  if (property.floorCategory === 'first' || property.floorCategory === 'middle' || property.floorCategory === 'last') {
    return property.floorCategory;
  }

  if (property.floor === 1) return 'first';
  if (property.floor === property.totalFloors) return 'last';
  return 'middle';
}

function hasBudgetPreference() {
  return typeof preferences.budgetMax === 'number' && preferences.budgetMax > 0;
}

function createSignal(propertyId: string, type: TrainingSignalType, durationMs?: number): TrainingSignal {
  return {
    id: `signal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    propertyId,
    type,
    createdAt: new Date().toISOString(),
    durationMs,
  };
}

export function startTrainingSession(nextPreferences: BuyerPreferences) {
  const selectedFloorCategories = normalizeFloorCategories(nextPreferences.selectedFloorCategories);

  preferences = {
    ...nextPreferences,
    selectedFloorCategories: selectedFloorCategories.length
      ? selectedFloorCategories
      : normalizeFloorCategories(nextPreferences.floorPreference),
  };
  signals = getActiveBuyerSignals();
  saveBuyerPreferences(preferences);
}

export function getTrainingPreferences() {
  return preferences;
}

export function recordTrainingSignal(propertyId: string, type: TrainingSignalType, durationMs?: number) {
  const signal = createSignal(propertyId, type, durationMs);
  signals = [signal, ...signals];
  recordBuyerSignal(signal);
}

export function getTrainingSignals() {
  return signals;
}

export function getRatedPropertyIds() {
  return signals.filter((signal) => signal.type === 'like' || signal.type === 'dislike').map((signal) => signal.propertyId);
}

export function getRatingCount() {
  return signals.filter((signal) => signal.type === 'like' || signal.type === 'dislike').length;
}

function roomMatches(property: Property, rooms?: string) {
  const selectedRooms = String(rooms ?? '1')
    .split(',')
    .map((room) => room.trim())
    .filter(Boolean);

  if (!selectedRooms.length || selectedRooms.includes('all')) return true;
  return selectedRooms.some((room) => (room === '4+' ? property.rooms >= 4 : property.rooms === Number(room)));
}

function floorMatches(property: Property, selectedFloorCategories: FloorCategory[] | string) {
  const selected = normalizeFloorCategories(selectedFloorCategories);
  return selected.length > 0 && selected.includes(getPropertyFloorCategory(property));
}

function hardFilterMatches(property: Property) {
  return (
    property.city === preferences.city &&
    districtMatches(property) &&
    roomMatches(property, preferences.rooms) &&
    floorMatches(property, getSelectedFloorCategories())
  );
}

export function getHardFilteredProperties() {
  return getBuyerProperties().filter(hardFilterMatches);
}

function budgetScore(property: Property) {
  if (!hasBudgetPreference()) return 16;

  const budgetMin = preferences.budgetMin ?? 0;
  const budgetMax = preferences.budgetMax ?? Number.MAX_SAFE_INTEGER;

  if (property.price >= budgetMin && property.price <= budgetMax) return 16;
  if (property.price < budgetMin) return 13;

  const overBudgetRatio = (property.price - budgetMax) / budgetMax;
  if (overBudgetRatio <= 0.1) return 12;
  if (overBudgetRatio <= 0.25) return 7;
  return 3;
}

function renovationGroup(value?: string) {
  const renovation = String(value ?? '').toLowerCase();
  if (renovation.includes('чернов') || renovation.includes('С‡РµСЂРЅРѕРІ')) return 'Черновая отделка';
  if (renovation.includes('стар') || renovation.includes('СЃС‚Р°СЂ')) return 'Старый ремонт';
  if (renovation.includes('евро') || renovation.includes('РµРІСЂРѕ')) return 'Евроремонт';
  if (renovation.includes('хорош') || renovation.includes('С…РѕСЂРѕС€')) return 'Хороший ремонт';
  return value ?? 'Не указан';
}

function areaGroup(area: number) {
  if (area <= 32) return 'compact';
  if (area <= 36) return 'medium';
  return 'large';
}

function priceGroup(price: number) {
  if (price <= 20_000_000) return 'low';
  if (price <= 23_000_000) return 'medium';
  return 'high';
}

const signalWeights: Partial<Record<TrainingSignalType, number>> = {
  viewing_request: 5,
  owner_call: 4,
  like: 3,
  save: 3,
  long_detail_view: 2,
  detail_view: 1,
  dislike: -2,
};

function signalProperties(types: TrainingSignalType[]) {
  return signals
    .filter((signal) => types.includes(signal.type))
    .map((signal) => getBuyerProperties().find((item) => item.id === signal.propertyId))
    .filter(Boolean) as Property[];
}

export function getInferredBudgetRange() {
  const meaningfulSignals = signals.filter((signal) => signalWeights[signal.type] !== undefined);

  if (meaningfulSignals.length < 5) {
    return null;
  }

  const buckets = new Map<number, number>();

  meaningfulSignals.forEach((signal) => {
    const property = getBuyerProperties().find((item) => item.id === signal.propertyId);
    if (!property) return;

    const bucket = Math.floor(property.price / 10_000_000) * 10_000_000;
    buckets.set(bucket, (buckets.get(bucket) ?? 0) + (signalWeights[signal.type] ?? 0));
  });

  const bestBucket = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0];

  if (!bestBucket || bestBucket[1] <= 0) {
    return null;
  }

  return {
    min: bestBucket[0],
    max: bestBucket[0] + 10_000_000,
    actions: meaningfulSignals.length,
  };
}

export function getInferredBudgetText() {
  const range = getInferredBudgetRange();

  if (!range) {
    return 'AI пока изучает ваш предпочтительный ценовой диапазон.';
  }

  return `Вы чаще рассматриваете квартиры стоимостью от ${Math.round(range.min / 1_000_000)} до ${Math.round(range.max / 1_000_000)} млн ₸.`;
}

export function scorePropertyForTraining(property: Property) {
  const likedProperties = signalProperties(['like', 'long_detail_view']);
  const dislikedProperties = signalProperties(['dislike']);
  const likedDistricts = new Set(likedProperties.map((item) => item.district).filter(Boolean));
  const likedComplexes = new Set(likedProperties.map((item) => item.complexName).filter(Boolean));
  const likedRenovations = new Set(likedProperties.map((item) => renovationGroup(item.renovation)));
  const dislikedRenovations = new Set(dislikedProperties.map((item) => renovationGroup(item.renovation)));
  const likedAreaGroups = new Set(likedProperties.map((item) => areaGroup(item.area)));
  const dislikedAreaGroups = new Set(dislikedProperties.map((item) => areaGroup(item.area)));
  const likedPriceGroups = new Set(likedProperties.map((item) => priceGroup(item.price)));
  const dislikedPriceGroups = new Set(dislikedProperties.map((item) => priceGroup(item.price)));
  const disliked = signals.some((signal) => signal.propertyId === property.id && signal.type === 'dislike');
  const liked = signals.some((signal) => signal.propertyId === property.id && signal.type === 'like');
  const viewed = signals.some((signal) => signal.propertyId === property.id && (signal.type === 'detail_view' || signal.type === 'long_detail_view'));
  const propertyRenovation = renovationGroup(property.renovation);
  const propertyAreaGroup = areaGroup(property.area);
  const propertyPriceGroup = priceGroup(property.price);

  let score = 0;
  if (property.city === preferences.city) score += 14;
  if (districtMatches(property)) score += 18;
  if (roomMatches(property, preferences.rooms)) score += 18;
  score += budgetScore(property);
  if (floorMatches(property, getSelectedFloorCategories())) score += 14;
  if (likedDistricts.has(property.district)) score += 6;
  if (likedComplexes.has(property.complexName)) score += 6;
  if (likedRenovations.has(propertyRenovation)) score += 22;
  if (dislikedRenovations.has(propertyRenovation)) score -= 18;
  if (likedAreaGroups.has(propertyAreaGroup)) score += 10;
  if (dislikedAreaGroups.has(propertyAreaGroup)) score -= 10;
  if (likedPriceGroups.has(propertyPriceGroup)) score += 10;
  if (dislikedPriceGroups.has(propertyPriceGroup)) score -= 10;
  if (viewed) score += 6;
  if (liked) score += 10;
  if (disliked) score -= 30;

  return score;
}

export function getTrainingStream(limit = 5) {
  const filtered = getHardFilteredProperties().sort((a, b) => a.id.localeCompare(b.id));

  if (!filtered.length) {
    return [];
  }

  const stream: Property[] = [];
  while (stream.length < Math.max(limit, 5)) {
    stream.push(...filtered);
  }

  return stream.slice(0, Math.max(limit, 5));
}

export function getPersonalRecommendations(limit = 3) {
  const likedProperties = signalProperties(['like', 'long_detail_view']);
  const likedRenovations = new Set(likedProperties.map((item) => renovationGroup(item.renovation)));
  const likedAreas = likedProperties.map((item) => item.area);
  const likedPrices = likedProperties.map((item) => item.price);
  const averageLikedArea = likedAreas.length ? Math.round(likedAreas.reduce((sum, value) => sum + value, 0) / likedAreas.length) : null;
  const affordableLikes = likedPrices.filter((price) => price <= 20_000_000).length;
  const largeAreaLikes = likedAreas.filter((area) => area >= 38).length;

  return getHardFilteredProperties()
    .sort((a, b) => scorePropertyForTraining(b) - scorePropertyForTraining(a))
    .slice(0, limit)
    .map((property) => {
      const propertyRenovation = renovationGroup(property.renovation);
      const score = Math.max(78, Math.min(98, Math.round(scorePropertyForTraining(property))));
      const likedSignalReason = likedProperties.reduce<string | null>((reason, likedProperty) => {
        if (reason || likedProperty.id === property.id) return reason;
        if (renovationGroup(likedProperty.renovation) === propertyRenovation) {
          return `Вы лайкнули квартиру с таким же ремонтом: ${propertyRenovation}`;
        }
        if (likedProperty.complexName === property.complexName) {
          return `Похожа на лайкнутую квартиру в ЖК ${property.complexName}`;
        }
        if (areaGroup(likedProperty.area) === areaGroup(property.area)) {
          return 'Похожа по площади на квартиру, которая вам понравилась';
        }
        if (priceGroup(likedProperty.price) === priceGroup(property.price)) {
          return 'Похожа по цене на квартиру, которая вам понравилась';
        }
        return null;
      }, null);

      const reasons = [
        likedSignalReason ?? (hasBudgetPreference()
          ? 'Соответствует выбранному району и учитывает ваш бюджет'
          : 'Соответствует выбранному району'),
        likedRenovations.has(propertyRenovation) ? `AI заметил интерес к ремонту: ${propertyRenovation}` : 'Ремонт учитывается как обучающий фактор',
        averageLikedArea ? `Вы предпочитаете квартиры площадью около ${averageLikedArea} м²` : 'Площадь учитывается как обучающий фактор',
        largeAreaLikes >= 2 ? 'Вам чаще нравятся квартиры с большей площадью' : affordableLikes >= 2 ? 'Вы чаще выбираете доступные квартиры до 20 млн ₸' : 'Цена и площадь учтены в Match Score',
        floorMatches(property, getSelectedFloorCategories()) ? 'Подходит под ваши предпочтения по этажу' : 'Ближайший вариант с учетом остальных сигналов',
        roomMatches(property, preferences.rooms) ? 'Совпадает по количеству комнат' : 'Похожа по общему профилю поиска',
      ];

      return { property, score, reasons };
    });
}
