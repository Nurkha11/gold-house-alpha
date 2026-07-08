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

export type TrainingSignalType = 'like' | 'dislike' | 'detail_view' | 'long_detail_view' | 'viewing_request' | 'owner_call';

export type TrainingSignal = {
  id: string;
  propertyId: string;
  type: TrainingSignalType;
  createdAt: string;
  durationMs?: number;
};

let preferences: BuyerPreferences = {
  city: 'Алматы',
  district: 'Бостандыкский',
  rooms: '2',
  budgetMin: 30_000_000,
  budgetMax: 45_000_000,
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
  return rooms === '4+' ? property.rooms >= 4 : property.rooms === Number(rooms ?? 2);
}

function floorMatches(property: Property, preference: FloorPreference) {
  if (preference === 'notFirst') return property.floor !== 1;
  if (preference === 'notLast') return property.floor !== property.totalFloors;
  if (preference === 'middle') return property.floor !== 1 && property.floor !== property.totalFloors;
  return true;
}

function budgetScore(property: Property) {
  if (property.price >= preferences.budgetMin && property.price <= preferences.budgetMax) return 22;
  const gap = property.price < preferences.budgetMin ? preferences.budgetMin - property.price : property.price - preferences.budgetMax;
  return Math.max(0, 14 - gap / 1_000_000);
}

export function scorePropertyForTraining(property: Property) {
  const likedDistricts = new Set(
    signals
      .filter((signal) => signal.type === 'like' || signal.type === 'long_detail_view')
      .map((signal) => getBuyerProperties().find((item) => item.id === signal.propertyId)?.district)
      .filter(Boolean),
  );
  const disliked = signals.some((signal) => signal.propertyId === property.id && signal.type === 'dislike');
  const liked = signals.some((signal) => signal.propertyId === property.id && signal.type === 'like');
  const viewed = signals.some((signal) => signal.propertyId === property.id && (signal.type === 'detail_view' || signal.type === 'long_detail_view'));

  let score = property.matchPercent;
  if (property.city === preferences.city) score += 8;
  if (property.district === preferences.district) score += 16;
  if (likedDistricts.has(property.district)) score += 14;
  if (roomMatches(property, preferences.rooms)) score += 18;
  if (floorMatches(property, preferences.floorPreference)) score += 14;
  score += budgetScore(property);
  if (liked) score += 18;
  if (viewed) score += 8;
  if (disliked) score -= 42;

  return score;
}

export function getTrainingStream(limit = 10) {
  return getBuyerProperties()
    .sort((a, b) => {
      const aDistrict = a.district === preferences.district ? 1 : 0;
      const bDistrict = b.district === preferences.district ? 1 : 0;
      return bDistrict - aDistrict || a.id.localeCompare(b.id);
    })
    .slice(0, Math.max(limit, 10));
}

export function getPersonalRecommendations() {
  return getBuyerProperties()
    .sort((a, b) => scorePropertyForTraining(b) - scorePropertyForTraining(a))
    .slice(0, 3)
    .map((property) => {
      const score = Math.max(84, Math.min(98, Math.round(scorePropertyForTraining(property) / 2)));
      const likedSimilar = signals.some((signal) => {
        const likedProperty = getBuyerProperties().find((item) => item.id === signal.propertyId);
        return signal.type === 'like' && likedProperty?.district === property.district;
      });

      const reasons = [
        likedSimilar ? 'Похожа на квартиры, которым вы поставили ❤️' : 'Подходит под ваш бюджет и район',
        floorMatches(property, preferences.floorPreference) ? 'Подходит под ваши предпочтения по этажу' : 'Ближайший вариант с учетом остальных сигналов',
        roomMatches(property, preferences.rooms) ? 'Совпадает по количеству комнат' : 'Похожа по общему профилю поиска',
      ];

      return { property, score, reasons };
    });
}
