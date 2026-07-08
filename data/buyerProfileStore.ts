import type { BuyerPreferences, TrainingSignal, TrainingSignalType } from '@/data/aiTrainingStore';

export type BuyerProfile = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  lastActiveAt: string;
};

export type BuyerSignal = {
  id: string;
  buyerId: string;
  propertyId: string;
  type: TrainingSignalType;
  createdAt: string;
  durationMs?: number;
};

export type SavedBuyerPreferences = BuyerPreferences & {
  buyerId: string;
  updatedAt: string;
};

let profiles: BuyerProfile[] = [];
let activeProfile: BuyerProfile | null = null;
let guestSessionId = '';
let buyerSignals: BuyerSignal[] = [];
let buyerPreferences: SavedBuyerPreferences[] = [];
let restoredMessage = '';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function saveBuyerProfile(name: string, phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const now = new Date().toISOString();
  const existing = profiles.find((profile) => normalizePhone(profile.phone) === normalizedPhone);

  if (existing) {
    existing.name = name.trim() || existing.name;
    existing.phone = phone.trim() || existing.phone;
    existing.lastActiveAt = now;
    activeProfile = existing;
    restoredMessage = 'Мы нашли ваши прошлые предпочтения.';
    return { profile: existing, restored: true };
  }

  const profile: BuyerProfile = {
    id: createId('buyer'),
    name: name.trim() || 'Покупатель',
    phone: phone.trim(),
    createdAt: now,
    lastActiveAt: now,
  };

  profiles = [profile, ...profiles];
  activeProfile = profile;
  restoredMessage = '';
  return { profile, restored: false };
}

export function startGuestBuyerSession() {
  activeProfile = null;
  guestSessionId = createId('guest');
  restoredMessage = '';
  return guestSessionId;
}

export function getActiveBuyerProfile() {
  return activeProfile;
}

export function getBuyerRestoreMessage() {
  return restoredMessage;
}

export function saveBuyerPreferences(preferences: BuyerPreferences) {
  if (!activeProfile) return;

  const nextPreferences: SavedBuyerPreferences = {
    ...preferences,
    buyerId: activeProfile.id,
    updatedAt: new Date().toISOString(),
  };
  buyerPreferences = [nextPreferences, ...buyerPreferences.filter((item) => item.buyerId !== activeProfile?.id)];
}

export function getActiveBuyerPreferences() {
  if (!activeProfile) return undefined;
  return buyerPreferences.find((item) => item.buyerId === activeProfile?.id);
}

export function recordBuyerSignal(signal: TrainingSignal) {
  if (!activeProfile) return;

  buyerSignals = [
    {
      id: signal.id,
      buyerId: activeProfile.id,
      propertyId: signal.propertyId,
      type: signal.type,
      createdAt: signal.createdAt,
      durationMs: signal.durationMs,
    },
    ...buyerSignals,
  ];
}

export function getActiveBuyerSignals(): TrainingSignal[] {
  if (!activeProfile) return [];

  return buyerSignals
    .filter((signal) => signal.buyerId === activeProfile?.id)
    .map(({ buyerId: _buyerId, ...signal }) => signal);
}

export function saveFinalRecommendationSignals(propertyIds: string[]) {
  if (!activeProfile) return;

  const now = new Date().toISOString();
  buyerSignals = [
    ...propertyIds.map((propertyId) => ({
      id: createId('final-rec'),
      buyerId: activeProfile?.id ?? '',
      propertyId,
      type: 'detail_view' as TrainingSignalType,
      createdAt: now,
    })),
    ...buyerSignals,
  ];
}
