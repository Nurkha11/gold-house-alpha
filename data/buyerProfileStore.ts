import { Property } from '@/data/properties';
import type { BuyerPreferences, TrainingSignal, TrainingSignalType } from '@/data/aiTrainingStore';
import { getBuyerPropertyById } from '@/data/propertyStore';

export type BuyerProfile = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  lastActiveAt: string;
};

export type AnonymousSession = {
  id: string;
  createdAt: string;
};

export type BuyerPropertySnapshot = {
  propertyId: string;
  district: string;
  rooms: number;
  price: number;
  floor: number;
  totalFloors: number;
  repair: string;
  area: number;
  residentialComplex: string;
};

export type BuyerActionType = 'LIKE' | 'DISLIKE' | 'VIEW_DETAILS' | 'LONG_VIEW_DETAILS' | 'CALL_OWNER' | 'SCHEDULE_VIEWING' | 'SAVE' | 'FINAL_RECOMMENDATION';

export type BuyerActionEvent = {
  id: string;
  buyerId: string;
  propertyId: string;
  type: BuyerActionType;
  timestamp: string;
  timeSpent?: number;
  propertySnapshot?: BuyerPropertySnapshot;
};

export type SavedBuyerPreferences = BuyerPreferences & {
  buyerId: string;
  updatedAt: string;
};

type BuyerMemoryState = {
  profiles: BuyerProfile[];
  buyerEvents: BuyerActionEvent[];
  buyerPreferences: SavedBuyerPreferences[];
};

const storageKey = 'gold-house-buyer-memory-v1';
const sessionKey = 'gold-house-buyer-session-v1';
const anonymousPrefix = 'anonymous-';

let memory: BuyerMemoryState = {
  profiles: [],
  buyerEvents: [],
  buyerPreferences: [],
};
let activeProfile: BuyerProfile | null = null;
let anonymousSession: AnonymousSession | null = null;
let restoredMessage = '';
let loaded = false;
let autoRestoreDisabled = false;

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function getStorage() {
  const storage = (globalThis as { localStorage?: Storage }).localStorage;
  return storage;
}

function loadMemory() {
  if (loaded) return;
  loaded = true;

  try {
    const sessionRaw = getStorage()?.getItem(sessionKey);
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw) as { autoRestoreDisabled?: boolean };
      autoRestoreDisabled = Boolean(session.autoRestoreDisabled);
    }

    const raw = getStorage()?.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<BuyerMemoryState>;
    memory = {
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
      buyerEvents: Array.isArray(parsed.buyerEvents) ? parsed.buyerEvents : [],
      buyerPreferences: Array.isArray(parsed.buyerPreferences) ? parsed.buyerPreferences : [],
    };
  } catch {
    memory = { profiles: [], buyerEvents: [], buyerPreferences: [] };
  }
}

function persistMemory() {
  try {
    getStorage()?.setItem(storageKey, JSON.stringify(memory));
  } catch {
    // Native MVP fallback: keep the data in the current JS session.
  }
}

function persistSession() {
  try {
    getStorage()?.setItem(sessionKey, JSON.stringify({ autoRestoreDisabled }));
  } catch {
    // Native MVP fallback: keep the session flag in memory.
  }
}

function setAutoRestoreDisabled(value: boolean) {
  autoRestoreDisabled = value;
  persistSession();
}

function currentBuyerId() {
  return activeProfile?.id ?? anonymousSession?.id ?? '';
}

function signalToActionType(type: TrainingSignalType): BuyerActionType {
  if (type === 'like') return 'LIKE';
  if (type === 'dislike') return 'DISLIKE';
  if (type === 'detail_view') return 'VIEW_DETAILS';
  if (type === 'long_detail_view') return 'LONG_VIEW_DETAILS';
  if (type === 'owner_call') return 'CALL_OWNER';
  if (type === 'viewing_request') return 'SCHEDULE_VIEWING';
  return 'SAVE';
}

function actionToSignalType(type: BuyerActionType): TrainingSignalType | 'detail_view' {
  if (type === 'LIKE') return 'like';
  if (type === 'DISLIKE') return 'dislike';
  if (type === 'LONG_VIEW_DETAILS') return 'long_detail_view';
  if (type === 'CALL_OWNER') return 'owner_call';
  if (type === 'SCHEDULE_VIEWING') return 'viewing_request';
  if (type === 'SAVE') return 'save';
  return 'detail_view';
}

function findProperty(propertyId: string) {
  return getBuyerPropertyById(propertyId);
}

function createPropertySnapshot(property?: Property): BuyerPropertySnapshot | undefined {
  if (!property) return undefined;

  return {
    propertyId: property.id,
    district: property.district,
    rooms: property.rooms,
    price: property.price,
    floor: property.floor,
    totalFloors: property.totalFloors,
    repair: property.renovation,
    area: property.area,
    residentialComplex: property.complexName,
  };
}

export function saveBuyerProfile(name: string, phone: string) {
  loadMemory();
  const normalizedPhone = normalizePhone(phone);
  const now = new Date().toISOString();
  const existing = memory.profiles.find((profile) => normalizePhone(profile.phone) === normalizedPhone);

  if (existing) {
    existing.name = name.trim() || existing.name;
    existing.phone = phone.trim() || existing.phone;
    existing.lastActiveAt = now;
    activeProfile = existing;
    anonymousSession = null;
    setAutoRestoreDisabled(false);
    restoredMessage = `Добро пожаловать снова, ${existing.name}. Мы сохранили ваши предпочтения.`;
    persistMemory();
    return { profile: existing, restored: true, message: restoredMessage };
  }

  const profile: BuyerProfile = {
    id: createId('buyer'),
    name: name.trim() || 'Покупатель',
    phone: phone.trim(),
    createdAt: now,
    lastActiveAt: now,
  };

  memory.profiles = [profile, ...memory.profiles];
  activeProfile = profile;
  anonymousSession = null;
  setAutoRestoreDisabled(false);
  restoredMessage = '';
  persistMemory();
  return { profile, restored: false, message: 'Рекомендации будут сохранены для следующего входа.' };
}

export function getLastBuyerProfile() {
  loadMemory();
  const [profile] = [...memory.profiles].sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt));
  if (!profile) return null;

  activeProfile = profile;
  anonymousSession = null;
  restoredMessage = `Добро пожаловать снова, ${profile.name}. Мы сохранили ваши предпочтения.`;
  return profile;
}

export function getAutoBuyerProfile() {
  loadMemory();
  if (autoRestoreDisabled) return null;
  return getLastBuyerProfile();
}

export function activateBuyerProfile(buyerId: string) {
  loadMemory();
  const profile = memory.profiles.find((item) => item.id === buyerId);
  if (!profile) return null;

  profile.lastActiveAt = new Date().toISOString();
  activeProfile = profile;
  anonymousSession = null;
  setAutoRestoreDisabled(false);
  restoredMessage = `Добро пожаловать снова, ${profile.name}. Мы сохранили ваши предпочтения.`;
  persistMemory();
  return profile;
}

export function startGuestBuyerSession() {
  loadMemory();
  activeProfile = null;
  setAutoRestoreDisabled(true);
  anonymousSession = {
    id: createId(anonymousPrefix),
    createdAt: new Date().toISOString(),
  };
  restoredMessage = '';
  return anonymousSession.id;
}

export function signOutBuyerProfile() {
  loadMemory();
  activeProfile = null;
  anonymousSession = null;
  restoredMessage = '';
  setAutoRestoreDisabled(true);
}

export function pauseBuyerAutoRestore() {
  loadMemory();
  setAutoRestoreDisabled(true);
}

export function getActiveBuyerProfile() {
  loadMemory();
  return activeProfile;
}

export function getActiveBuyerId() {
  loadMemory();
  return currentBuyerId();
}

export function getBuyerRestoreMessage() {
  return restoredMessage;
}

export function getBuyerProfiles() {
  loadMemory();
  return memory.profiles;
}

export function saveBuyerPreferences(preferences: BuyerPreferences) {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId || buyerId.startsWith(anonymousPrefix)) return;

  const nextPreferences: SavedBuyerPreferences = {
    ...preferences,
    buyerId,
    updatedAt: new Date().toISOString(),
  };
  memory.buyerPreferences = [nextPreferences, ...memory.buyerPreferences.filter((item) => item.buyerId !== buyerId)];
  persistMemory();
}

export function getActiveBuyerPreferences() {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId || buyerId.startsWith(anonymousPrefix)) return undefined;
  return memory.buyerPreferences.find((item) => item.buyerId === buyerId);
}

export function recordBuyerSignal(signal: TrainingSignal) {
  loadMemory();
  let buyerId = currentBuyerId();
  if (!buyerId) buyerId = startGuestBuyerSession();

  const event: BuyerActionEvent = {
    id: signal.id,
    buyerId,
    propertyId: signal.propertyId,
    type: signalToActionType(signal.type),
    timestamp: signal.createdAt,
    timeSpent: signal.durationMs,
    propertySnapshot: createPropertySnapshot(findProperty(signal.propertyId)),
  };

  memory.buyerEvents = [event, ...memory.buyerEvents];
  if (!buyerId.startsWith(anonymousPrefix)) persistMemory();
}

export function getActiveBuyerSignals(): TrainingSignal[] {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId) return [];

  return memory.buyerEvents
    .filter((event) => event.buyerId === buyerId)
    .map((event) => ({
      id: event.id,
      propertyId: event.propertyId,
      type: actionToSignalType(event.type) as TrainingSignalType,
      createdAt: event.timestamp,
      durationMs: event.timeSpent,
    }));
}

export function getActiveBuyerEvents() {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId) return [];
  return memory.buyerEvents.filter((event) => event.buyerId === buyerId);
}

export function getBuyerEventsForProfile(buyerId: string) {
  loadMemory();
  return memory.buyerEvents.filter((event) => event.buyerId === buyerId);
}

export function removeBuyerFavorite(propertyId: string) {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId) return;

  memory.buyerEvents = memory.buyerEvents.filter(
    (event) => !(event.buyerId === buyerId && event.propertyId === propertyId && (event.type === 'LIKE' || event.type === 'SAVE')),
  );

  if (!buyerId.startsWith(anonymousPrefix)) persistMemory();
}

export function saveFinalRecommendationSignals(propertyIds: string[]) {
  loadMemory();
  const buyerId = currentBuyerId();
  if (!buyerId) return;

  const now = new Date().toISOString();
  const events = propertyIds.map((propertyId) => ({
    id: createId('final-rec'),
    buyerId,
    propertyId,
    type: 'FINAL_RECOMMENDATION' as BuyerActionType,
    timestamp: now,
    propertySnapshot: createPropertySnapshot(findProperty(propertyId)),
  }));
  memory.buyerEvents = [...events, ...memory.buyerEvents];
  if (!buyerId.startsWith(anonymousPrefix)) persistMemory();
}
