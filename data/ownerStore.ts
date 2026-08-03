import { MediaFile, Owner, PropertyPhoto, PropertySubmission, PropertyVideo, SubmissionStatus } from '@/data/ownerTypes';
import { Property } from '@/data/properties';
import { getBalconyLabel, normalizeBalconyType } from '@/data/balconyTypes';
import { getElevatorLabel, normalizeElevatorData } from '@/data/elevatorTypes';
import { getParkingLabel, normalizeParkingData } from '@/data/parkingTypes';
import { createLocalMediaReference } from '@/data/localMediaStore';
import { createLocation } from '@/data/residentialComplexes';

let currentOwner: Owner | null = null;
const SUBMISSIONS_STORAGE_KEY = 'gold-house-owner-submissions-v1';
const OWNER_STORAGE_KEY = 'gold-house-current-owner-v1';

let submissions: PropertySubmission[] = [
  {
    id: 'sub-demo-001',
    ownerId: 'owner-demo',
    ownerName: 'Нурхан',
    ownerPhone: '+7 777 000 07 07',
    status: 'pending_moderation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      city: 'Алматы',
      district: 'Бостандыкский',
      complexName: 'ЖК Gold Residence',
      street: 'ул. Гагарина, 124',
      location: createLocation({
        fullAddress: 'Алматы, Бостандыкский район, ул. Гагарина, 124',
        district: 'Бостандыкский',
        latitude: 43.2219,
        longitude: 76.8973,
        source: 'manual',
        districtSource: 'manual',
        locationConfirmed: true,
      }),
      residentialComplexId: undefined,
      newResidentialComplex: null,
    },
    characteristics: {
      rooms: '3',
      totalArea: '82',
      livingArea: '54',
      kitchenArea: '14',
      floor: '5',
      totalFloors: '11',
      year: '2023',
      buildingMaterial: 'Монолит',
      ceilingHeight: '3.0',
      bathroom: 'Раздельный',
      balcony: 'Балкон',
      balconyType: 'balcony',
      elevator: '2 лифта',
      elevatorCount: 2,
      hasFreightElevator: false,
      parking: 'Подземный паркинг',
      parkingType: 'underground',
      hasPrivateParkingSpace: true,
      parkingSpaceIncludedInPrice: true,
    },
    priceTerms: {
      price: '58500000',
      bargain: 'Нет',
      mortgage: 'Да',
      documents: 'Да',
      encumbrance: 'Нет',
    },
    condition: {
      renovation: 'Хороший ремонт',
      repairComment: 'Ремонт в хорошем состоянии, санузел обновлен недавно.',
      furniture: 'Частично',
      appliances: 'Частично',
      remains: 'Кухня, шкафы, кондиционер и часть техники.',
    },
    ownerDescription: {
      likes: 'Светлая квартира в новом комплексе с закрытым двором.',
      minuses: 'Парковку лучше проверять вечером.',
      fitFor: 'Подойдет семье или паре.',
      sellingReason: 'Переезд в другой город.',
    },
    media: [
      {
        id: 'media-demo-1',
        type: 'photo',
        category: 'apartment',
        name: 'Фото квартиры',
        uri: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
        localUri: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
        remoteUrl: null,
        fileName: 'demo-apartment-photo.jpg',
        mimeType: 'image/jpeg',
        fileSize: null,
        width: null,
        height: null,
        order: 0,
        isCover: true,
        uploadStatus: 'local',
        uploadProgress: 0,
        errorMessage: null,
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

hydrateSubmissionsFromStorage();

export const statusLabels: Record<SubmissionStatus, string> = {
  draft: 'Черновик',
  pending_moderation: 'На модерации',
  submitted: 'На модерации',
  sent: 'На модерации',
  reviewing: 'На модерации',
  needs_shooting: 'На модерации',
  approved: 'На модерации',
  published: 'Опубликована',
  changes_requested: 'Нужны исправления',
  rejected: 'Отклонена',
};

export function normalizeSubmissionStatus(status: SubmissionStatus | string): SubmissionStatus {
  if (status === 'submitted' || status === 'sent' || status === 'reviewing' || status === 'needs_shooting' || status === 'approved') {
    return 'pending_moderation';
  }

  if (status === 'draft' || status === 'pending_moderation' || status === 'published' || status === 'changes_requested' || status === 'rejected') {
    return status;
  }

  return 'draft';
}

function normalizeSubmission(submission: PropertySubmission) {
  const normalizedStatus = normalizeSubmissionStatus(submission.status);

  if (submission.status !== normalizedStatus) {
    submission.status = normalizedStatus;
  }

  return submission;
}

function getLocalStorage() {
  try {
    return (globalThis as { localStorage?: Storage }).localStorage;
  } catch {
    return undefined;
  }
}

function hydrateSubmissionsFromStorage() {
  const storage = getLocalStorage();
  const stored = storage?.getItem(SUBMISSIONS_STORAGE_KEY);

  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      submissions = parsed.map((item) => normalizeSubmission(item as PropertySubmission));
    }
  } catch {
    storage?.removeItem(SUBMISSIONS_STORAGE_KEY);
  }
}

function persistSubmissions() {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions.map(serializeSubmissionForStorage)));
  } catch {
    storage.setItem(
      SUBMISSIONS_STORAGE_KEY,
      JSON.stringify(
        submissions.map((submission) =>
          serializeSubmissionForStorage({
            ...submission,
            media: [],
          }),
        ),
      ),
    );
  }
}

export function loginOwner(name: string, phone: string) {
  currentOwner = {
    id: getStableOwnerId(formatOwnerPhone(phone)),
    name: name.trim() || 'Собственник',
    phone: formatOwnerPhone(phone),
  };
  persistOwner(currentOwner);
  return currentOwner;
}

function formatOwnerPhone(value: string) {
  const raw = value.replace(/\D/g, '');
  const local = (raw.startsWith('7') ? raw.slice(1) : raw).slice(0, 10);
  const parts = [local.slice(0, 3), local.slice(3, 6), local.slice(6, 8), local.slice(8, 10)].filter(Boolean);

  return `+7${parts.length ? ` ${parts.join(' ')}` : ' '}`;
}

function normalizeOwnerPhone(value?: string) {
  const raw = (value ?? '').replace(/\D/g, '');
  if (!raw) {
    return '';
  }

  return raw.startsWith('7') ? raw : `7${raw}`;
}

function getStableOwnerId(phone: string) {
  const digits = normalizeOwnerPhone(phone);
  return digits ? `owner-${digits}` : `owner-${Date.now()}`;
}

function persistOwner(owner: Owner) {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }

  storage.setItem(OWNER_STORAGE_KEY, JSON.stringify(owner));
}

function hydrateOwnerFromStorage() {
  const storage = getLocalStorage();
  const stored = storage?.getItem(OWNER_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const owner = JSON.parse(stored) as Owner;
    if (owner?.phone) {
      return {
        ...owner,
        id: getStableOwnerId(owner.phone),
        phone: formatOwnerPhone(owner.phone),
      };
    }
  } catch {
    storage?.removeItem(OWNER_STORAGE_KEY);
  }

  return null;
}

function serializeMediaFileForStorage(file: MediaFile): MediaFile {
  if (!isTemporaryLocalMediaUri(file.localUri) && !isTemporaryLocalMediaUri(file.uri)) {
    return file;
  }

  return {
    ...file,
    uri: isTemporaryLocalMediaUri(file.uri) ? undefined : file.uri,
    localUri: isTemporaryLocalMediaUri(file.localUri) ? '' : file.localUri,
  };
}

function serializeSubmissionForStorage(submission: PropertySubmission) {
  return normalizeSubmission({
    ...submission,
    media: submission.media.map(serializeMediaFileForStorage),
  });
}

export function getCurrentOwner() {
  if (!currentOwner) {
    currentOwner = hydrateOwnerFromStorage();
  }

  return currentOwner;
}

export function getOwnerSubmissions(ownerId?: string) {
  hydrateSubmissionsFromStorage();
  const owner = getCurrentOwner();
  const ownerPhone = normalizeOwnerPhone(owner?.phone);

  if (!ownerId) {
    return submissions.map(normalizeSubmission);
  }

  return submissions
    .map(normalizeSubmission)
    .filter(
      (submission) =>
        submission.ownerId === ownerId ||
        (ownerPhone.length > 0 && normalizeOwnerPhone(submission.ownerPhone) === ownerPhone),
    );
}

export function getAllSubmissions() {
  hydrateSubmissionsFromStorage();
  return submissions.map(normalizeSubmission);
}

export function getSubmissionById(id: string) {
  hydrateSubmissionsFromStorage();
  const submission = submissions.find((item) => item.id === id);
  return submission ? normalizeSubmission(submission) : undefined;
}

export function updateSubmissionStatus(id: string, status: SubmissionStatus, adminComment?: string) {
  hydrateSubmissionsFromStorage();
  const existing = submissions.find((submission) => submission.id === id);

  if (!existing) {
    return undefined;
  }

  existing.status = normalizeSubmissionStatus(status);
  existing.adminComment = adminComment?.trim() || undefined;
  existing.updatedAt = new Date().toISOString();
  persistSubmissions();
  return existing;
}

export function deleteOwnerSubmission(id: string, ownerId?: string) {
  hydrateSubmissionsFromStorage();
  const owner = getCurrentOwner();
  const ownerPhone = normalizeOwnerPhone(owner?.phone);
  const existing = submissions.find((submission) => submission.id === id);

  if (!existing) {
    return false;
  }

  const belongsToOwner =
    !ownerId ||
    existing.ownerId === ownerId ||
    (ownerPhone.length > 0 && normalizeOwnerPhone(existing.ownerPhone) === ownerPhone);

  if (!belongsToOwner) {
    return false;
  }

  submissions = submissions.filter((submission) => submission.id !== id);
  persistSubmissions();
  return true;
}

export function updateSubmissionLocationReview(id: string, action: 'confirm_location' | 'request_manual_check' | 'approve_complex' | 'merge_complex') {
  hydrateSubmissionsFromStorage();
  const existing = submissions.find((submission) => submission.id === id);

  if (!existing) {
    return undefined;
  }

  const location = existing.address.location;

  if (location && action === 'confirm_location') {
    existing.address.location = {
      ...location,
      locationConfirmed: true,
      locationWarnings: [],
    };
  }

  if (location && action === 'request_manual_check') {
    existing.address.location = {
      ...location,
      locationWarnings: Array.from(new Set([...(location.locationWarnings ?? []), 'Администратор запросил ручную проверку адреса.'])),
    };
    existing.status = 'pending_moderation';
  }

  if (existing.address.newResidentialComplex && action === 'approve_complex') {
    existing.address.newResidentialComplex = {
      ...existing.address.newResidentialComplex,
      status: 'approved',
    };
  }

  if (existing.address.newResidentialComplex && action === 'merge_complex') {
    existing.address.newResidentialComplex = {
      ...existing.address.newResidentialComplex,
      status: 'merged',
    };
  }

  existing.updatedAt = new Date().toISOString();
  persistSubmissions();
  return existing;
}

export function getPublishedProperties(): Property[] {
  hydrateSubmissionsFromStorage();
  return submissions
    .map(normalizeSubmission)
    .filter((submission) => submission.status === 'published')
    .map(submissionToProperty);
}

export function saveSubmission(submission: PropertySubmission) {
  hydrateSubmissionsFromStorage();
  submission.status = normalizeSubmissionStatus(submission.status);
  const existingIndex = submissions.findIndex((item) => item.id === submission.id);

  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions = [submission, ...submissions];
  }

  persistSubmissions();
  return submission;
}

function submissionToProperty(submission: PropertySubmission): Property {
  const sortedPhotos = submission.media
    .filter((file): file is PropertyPhoto => file.type === 'photo' && file.uploadStatus !== 'error')
    .sort(comparePublishedPhotos);
  const photo = getPublishedMediaUri(sortedPhotos[0]) || 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80';
  const images = sortedPhotos
    .map(getPublishedMediaUri)
    .filter((uri): uri is string => Boolean(uri));
  const videos = submission.media
    .filter((file): file is PropertyVideo => file.type === 'video' && file.uploadStatus !== 'error')
    .map((file) => ({
      label:
        file.category === 'apartment'
          ? 'Квартира'
          : file.category === 'entrance'
            ? 'Подъезд'
            : file.category === 'yard'
              ? 'Двор'
              : 'Собственник',
      duration: formatVideoDuration(file.duration),
      uri: getPublishedMediaUri(file),
      remoteUrl: file.remoteUrl,
    }))
    .filter((file) => Boolean(file.uri));
  const descriptionParts = [
    submission.ownerDescription.likes,
    submission.ownerDescription.minuses ? `Честные минусы: ${submission.ownerDescription.minuses}` : '',
    submission.ownerDescription.fitFor ? `Кому подойдет: ${submission.ownerDescription.fitFor}` : '',
  ].filter(Boolean);

  const balconyType = normalizeBalconyType(submission.characteristics.balconyType, submission.characteristics.balcony);
  const elevatorData = normalizeElevatorData(submission.characteristics);
  const parkingData = normalizeParkingData(submission.characteristics);

  return {
    id: `published-${submission.id}`,
    title: submission.address.complexName || submission.address.street || 'Gold House Verified',
    city: submission.address.city,
    district: submission.address.district,
    complexName: submission.address.complexName || 'Gold House Verified',
    address: submission.address.street || submission.address.complexName || 'Адрес уточняется',
    price: Number(submission.priceTerms.price || 0),
    rooms: Number(String(submission.characteristics.rooms).replace(/\D/g, '') || 1),
    area: Number(submission.characteristics.totalArea || 0),
    floor: Number(submission.characteristics.floor || 1),
    totalFloors: Number(submission.characteristics.totalFloors || 1),
    floorCategory:
      Number(submission.characteristics.floor || 1) === 1
        ? 'first'
        : Number(submission.characteristics.floor || 1) === Number(submission.characteristics.totalFloors || 1)
          ? 'last'
          : 'middle',
    year: Number(submission.characteristics.year || new Date().getFullYear()),
    buildingMaterial: submission.characteristics.buildingMaterial || 'Не указан',
    renovation: submission.condition.renovation || 'Не указан',
    furniture: submission.condition.furniture || 'Не указана',
    appliances: submission.condition.appliances || 'Не указана',
    balcony: getBalconyLabel(balconyType),
    balconyType,
    elevator: getElevatorLabel(elevatorData),
    elevatorCount: elevatorData.elevatorCount,
    hasFreightElevator: elevatorData.hasFreightElevator,
    parking: getParkingLabel(parkingData),
    parkingType: parkingData.parkingType,
    hasPrivateParkingSpace: parkingData.hasPrivateParkingSpace,
    parkingSpaceIncludedInPrice: parkingData.parkingSpaceIncludedInPrice,
    ceilingHeight: Number(submission.characteristics.ceilingHeight || 2.8),
    matchPercent: 96,
    verified: true,
    image: photo,
    imageUrl: photo,
    images: images.length ? images : [photo],
    description: descriptionParts.join('\n') || 'Объект опубликован после проверки Gold House.',
    tags: ['Gold Verified', 'Trust Index 98 / 100', submission.condition.renovation, submission.address.district].filter(Boolean),
    aiSummary: 'Объект опубликован после проверки Gold House. Данные собственника сохранены для будущего рекомендательного алгоритма.',
    pros: [submission.ownerDescription.likes || 'Собственник отметил сильные стороны квартиры.'],
    cons: [submission.ownerDescription.minuses || 'Честные минусы будут уточнены на проверке.'],
    fitFor: [submission.ownerDescription.fitFor || 'Подойдет покупателю с совпадающим профилем поиска.'],
    sellingReason: submission.ownerDescription.sellingReason || 'Причина продажи будет уточнена менеджером.',
    availableViewingTime: { day: 'Сегодня', time: '18:00–20:00' },
    locationText: submission.address.location
      ? `${submission.address.district}. ${submission.address.location.fullAddress}. Точное расположение подтверждено для модерации; покупателю показываем район и ориентиры.`
      : `${submission.address.district}. ${submission.address.street || submission.address.complexName}. Рядом парк, школа, супермаркет и остановка.`,
    videos: videos.length
      ? videos
      : [
          { label: 'Квартира', duration: '1:10' },
          { label: 'Подъезд', duration: '0:35' },
          { label: 'Двор', duration: '0:42' },
          { label: 'Собственник', duration: '0:30' },
        ],
    ownerName: submission.ownerName,
    ownerPhone: submission.ownerPhone,
  };
}

function getPublishedMediaUri(file?: MediaFile) {
  if (!file) {
    return undefined;
  }

  if (file.remoteUrl) {
    return file.remoteUrl;
  }

  if (file.localUri && !isTemporaryLocalMediaUri(file.localUri)) {
    return file.localUri;
  }

  if (file.uri && !isTemporaryLocalMediaUri(file.uri)) {
    return file.uri;
  }

  return createLocalMediaReference(file.id);
}

function comparePublishedPhotos(a: PropertyPhoto, b: PropertyPhoto) {
  if (a.isCover !== b.isCover) {
    return a.isCover ? -1 : 1;
  }

  const categoryDiff = getPublishedPhotoCategoryRank(a.category) - getPublishedPhotoCategoryRank(b.category);
  if (categoryDiff !== 0) {
    return categoryDiff;
  }

  return a.order - b.order;
}

function getPublishedPhotoCategoryRank(category: PropertyPhoto['category']) {
  const rank: Record<PropertyPhoto['category'], number> = {
    apartment: 0,
    yard: 1,
    entrance: 2,
    view: 3,
  };

  return rank[category] ?? 99;
}

function isTemporaryLocalMediaUri(uri?: string) {
  return Boolean(uri?.startsWith('data:') || uri?.startsWith('blob:'));
}

function formatVideoDuration(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}
