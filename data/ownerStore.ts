import { Owner, PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';
import { Property } from '@/data/properties';

let currentOwner: Owner | null = null;

let submissions: PropertySubmission[] = [
  {
    id: 'sub-demo-001',
    ownerId: 'owner-demo',
    ownerName: 'Нурхан',
    ownerPhone: '+7 777 000 07 07',
    status: 'reviewing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    address: {
      city: 'Алматы',
      district: 'Бостандыкский',
      complexName: 'ЖК Gold Residence',
      street: 'ул. Гагарина, 124',
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
      balcony: 'Да',
      elevator: 'Да',
      parking: 'Подземная',
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
      },
    ],
  },
];

export const statusLabels: Record<SubmissionStatus, string> = {
  draft: 'Черновик',
  submitted: 'Отправлена',
  reviewing: 'На проверке',
  needs_shooting: 'Нужна съемка',
  approved: 'Одобрена',
  published: 'Опубликована',
  rejected: 'Отклонена',
};

export function loginOwner(name: string, phone: string) {
  currentOwner = {
    id: `owner-${Date.now()}`,
    name: name.trim() || 'Собственник',
    phone: phone.trim() || '+7',
  };
  return currentOwner;
}

export function getCurrentOwner() {
  return currentOwner;
}

export function getOwnerSubmissions(ownerId?: string) {
  if (!ownerId) {
    return submissions;
  }

  return submissions.filter((submission) => submission.ownerId === ownerId || submission.ownerId === 'owner-demo');
}

export function getAllSubmissions() {
  return submissions;
}

export function getSubmissionById(id: string) {
  return submissions.find((submission) => submission.id === id);
}

export function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  const existing = submissions.find((submission) => submission.id === id);

  if (!existing) {
    return undefined;
  }

  existing.status = status;
  existing.updatedAt = new Date().toISOString();
  return existing;
}

export function getPublishedProperties(): Property[] {
  return submissions
    .filter((submission) => submission.status === 'published')
    .map(submissionToProperty);
}

export function saveSubmission(submission: PropertySubmission) {
  const existingIndex = submissions.findIndex((item) => item.id === submission.id);

  if (existingIndex >= 0) {
    submissions[existingIndex] = submission;
  } else {
    submissions = [submission, ...submissions];
  }

  return submission;
}

function submissionToProperty(submission: PropertySubmission): Property {
  const photo = submission.media.find((file) => file.type === 'photo')?.uri ?? 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80';
  const images = submission.media.filter((file) => file.type === 'photo' && file.uri).map((file) => file.uri as string);
  const descriptionParts = [
    submission.ownerDescription.likes,
    submission.ownerDescription.minuses ? `Честные минусы: ${submission.ownerDescription.minuses}` : '',
    submission.ownerDescription.fitFor ? `Кому подойдет: ${submission.ownerDescription.fitFor}` : '',
  ].filter(Boolean);

  return {
    id: `published-${submission.id}`,
    title: submission.address.complexName || submission.address.street || 'Gold House Verified',
    city: submission.address.city,
    district: submission.address.district,
    address: submission.address.street || submission.address.complexName || 'Адрес уточняется',
    price: Number(submission.priceTerms.price || 0),
    rooms: Number(String(submission.characteristics.rooms).replace(/\D/g, '') || 1),
    area: Number(submission.characteristics.totalArea || 0),
    floor: Number(submission.characteristics.floor || 1),
    totalFloors: Number(submission.characteristics.totalFloors || 1),
    year: Number(submission.characteristics.year || new Date().getFullYear()),
    ceilingHeight: Number(submission.characteristics.ceilingHeight || 2.8),
    matchPercent: 96,
    verified: true,
    image: photo,
    imageUrl: photo,
    images: images.length ? images : [photo],
    description: descriptionParts.join('\n') || 'Объект опубликован после проверки Gold House.',
    tags: ['Gold Verified', 'Trust Index 98 / 100', submission.condition.renovation, submission.address.district].filter(Boolean),
    availableViewingTime: { day: 'Сегодня', time: '18:00–20:00' },
    locationText: `${submission.address.district}. ${submission.address.street || submission.address.complexName}. Рядом парк, школа, супермаркет и остановка.`,
    videos: [
      { label: 'Квартира', duration: '1:10' },
      { label: 'Подъезд', duration: '0:35' },
      { label: 'Двор', duration: '0:42' },
      { label: 'Собственник', duration: '0:30' },
    ],
    ownerName: submission.ownerName,
    ownerPhone: submission.ownerPhone,
  };
}
