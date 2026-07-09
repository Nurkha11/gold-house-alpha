import { Property } from '@/data/properties';
import { getActiveBuyerSignals, recordBuyerSignal, saveBuyerPreferences } from '@/data/buyerProfileStore';
import { getBuyerProperties } from '@/data/propertyStore';

export type FloorPreference = 'any' | 'notFirst' | 'notLast' | 'middle';

export type BuyerPreferences = {
  city: string;
  district?: string;
  rooms?: string;
  budgetMin: number;
  budgetMax: number;
  floorPreference: FloorPreference;
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
  rooms: '1',
  budgetMin: 0,
  budgetMax: 30_000_000,
  floorPreference: 'any',
};

let signals: TrainingSignal[] = [];

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
  preferences = nextPreferences;
  signals = getActiveBuyerSignals();
  saveBuyerPreferences(nextPreferences);
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

function floorMatches(property: Property, preference: FloorPreference) {
  if (preference === 'notFirst') return property.floor !== 1;
  if (preference === 'notLast') return property.floor !== property.totalFloors;
  if (preference === 'middle') return property.floor > 1 && property.floor < property.totalFloors;
  return true;
}

function budgetMatches(property: Property) {
  return property.price <= preferences.budgetMax;
}

function hardFilterMatches(property: Property) {
  return (
    property.city === preferences.city &&
    (!preferences.district || property.district === preferences.district) &&
    roomMatches(property, preferences.rooms) &&
    budgetMatches(property) &&
    floorMatches(property, preferences.floorPreference)
  );
}

export function getHardFilteredProperties() {
  return getBuyerProperties().filter(hardFilterMatches);
}

function budgetScore(property: Property) {
  if (property.price >= preferences.budgetMin && property.price <= preferences.budgetMax) return 16;
  if (property.price < preferences.budgetMin) return 13;
  const gap = property.price - preferences.budgetMax;
  return Math.max(0, 10 - gap / 1_000_000);
}

function renovationGroup(value?: string) {
  const renovation = String(value ?? '').toLowerCase();
  if (renovation.includes('чернов')) return 'Черновая планировка';
  if (renovation.includes('стар')) return 'Старый ремонт';
  if (renovation.includes('евро')) return 'Евроремонт';
  if (renovation.includes('хорош')) return 'Хороший ремонт';
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

function signalProperties(types: TrainingSignalType[]) {
  return signals
    .filter((signal) => types.includes(signal.type))
    .map((signal) => getBuyerProperties().find((item) => item.id === signal.propertyId))
    .filter(Boolean) as Property[];
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
  if (property.district === preferences.district) score += 18;
  if (roomMatches(property, preferences.rooms)) score += 18;
  score += budgetScore(property);
  if (floorMatches(property, preferences.floorPreference)) score += 14;
  if (likedDistricts.has(property.district)) score += 6;
  if (likedComplexes.has(property.complexName)) score += 6;
  if (likedRenovations.has(propertyRenovation)) score += 12;
  if (dislikedRenovations.has(propertyRenovation)) score -= 14;
  if (likedAreaGroups.has(propertyAreaGroup)) score += 10;
  if (dislikedAreaGroups.has(propertyAreaGroup)) score -= 10;
  if (likedPriceGroups.has(propertyPriceGroup)) score += 10;
  if (dislikedPriceGroups.has(propertyPriceGroup)) score -= 10;
  if (viewed) score += 6;
  if (liked) score += 10;
  if (disliked) score -= 30;

  return score;
}

export function getTrainingStream(limit = 10) {
  const filtered = getHardFilteredProperties().sort((a, b) => a.id.localeCompare(b.id));

  if (!filtered.length) {
    return [];
  }

  const stream: Property[] = [];
  while (stream.length < Math.max(limit, 10)) {
    stream.push(...filtered);
  }

  return stream.slice(0, Math.max(limit, 10));
}

export function getPersonalRecommendations() {
  const likedProperties = signalProperties(['like', 'long_detail_view']);
  const likedRenovations = new Set(likedProperties.map((item) => renovationGroup(item.renovation)));
  const likedAreas = likedProperties.map((item) => item.area);
  const likedPrices = likedProperties.map((item) => item.price);
  const averageLikedArea = likedAreas.length ? Math.round(likedAreas.reduce((sum, value) => sum + value, 0) / likedAreas.length) : null;
  const affordableLikes = likedPrices.filter((price) => price <= 20_000_000).length;
  const largeAreaLikes = likedAreas.filter((area) => area >= 38).length;

  return getHardFilteredProperties()
    .sort((a, b) => scorePropertyForTraining(b) - scorePropertyForTraining(a))
    .slice(0, 3)
    .map((property) => {
      const propertyRenovation = renovationGroup(property.renovation);
      const score = Math.max(78, Math.min(98, Math.round(scorePropertyForTraining(property))));
      const likedSimilar = signals.some((signal) => {
        const likedProperty = getBuyerProperties().find((item) => item.id === signal.propertyId);
        return (
          signal.type === 'like' &&
          (likedProperty?.district === property.district ||
            likedProperty?.complexName === property.complexName ||
            renovationGroup(likedProperty?.renovation) === propertyRenovation ||
            areaGroup(likedProperty?.area ?? 0) === areaGroup(property.area) ||
            priceGroup(likedProperty?.price ?? 0) === priceGroup(property.price))
        );
      });

      const reasons = [
        likedSimilar ? 'Похожа на квартиры, которым вы поставили лайк' : 'Подходит под ваш бюджет и район',
        likedRenovations.has(propertyRenovation) ? `AI заметил интерес к формату: ${propertyRenovation}` : 'Ремонт учитывается как обучающий фактор',
        averageLikedArea ? `Вы предпочитаете квартиры площадью около ${averageLikedArea} м²` : 'Площадь учитывается как обучающий фактор',
        largeAreaLikes >= 2 ? 'Вам чаще нравятся квартиры с большей площадью' : affordableLikes >= 2 ? 'Вы чаще выбираете доступные квартиры до 20 млн ₸' : 'Цена и площадь учтены в Match Score',
        floorMatches(property, preferences.floorPreference) ? 'Подходит под ваши предпочтения по этажу' : 'Ближайший вариант с учетом остальных сигналов',
        roomMatches(property, preferences.rooms) ? 'Совпадает по количеству комнат' : 'Похожа по общему профилю поиска',
      ];

      return { property, score, reasons };
    });
}
