export type ParkingType = 'none' | 'open' | 'covered' | 'underground';

export type ParkingData = {
  parkingType: ParkingType;
  hasPrivateParkingSpace: boolean;
  parkingSpaceIncludedInPrice: boolean | null;
};

export const parkingTypeLabels: Record<ParkingType, string> = {
  none: 'Нет парковки',
  open: 'Открытая парковка',
  covered: 'Крытая наземная парковка',
  underground: 'Подземный паркинг',
};

export const parkingTypeOptions: ParkingType[] = ['none', 'open', 'covered', 'underground'];

export function getParkingTypeLabel(type: ParkingType) {
  return parkingTypeLabels[type];
}

export function getParkingTypeByLabel(label: string): ParkingType {
  const found = parkingTypeOptions.find((type) => parkingTypeLabels[type] === label);
  return found ?? 'none';
}

function normalizeParkingType(value: unknown): ParkingType | undefined {
  if (value === 'none' || value === 'open' || value === 'covered' || value === 'underground') {
    return value;
  }

  if (value === true) return 'open';
  if (value === false) return 'none';
  if (typeof value !== 'string') return undefined;

  const text = value.trim().toLowerCase();
  if (!text || text === 'нет' || text === 'false' || text.includes('нет парков')) return 'none';
  if (text === 'true' || text === 'да' || text.includes('открыт')) return 'open';
  if (text.includes('крыт')) return 'covered';
  if (text.includes('подзем') || text.includes('паркинг')) return 'underground';

  return undefined;
}

export function normalizeParkingData(source?: {
  parkingType?: unknown;
  parking?: unknown;
  hasParking?: unknown;
  hasPrivateParkingSpace?: unknown;
  parkingSpaceIncludedInPrice?: unknown;
}): ParkingData {
  const parkingType =
    normalizeParkingType(source?.parkingType) ??
    normalizeParkingType(source?.parking) ??
    normalizeParkingType(source?.hasParking) ??
    'none';
  const hasPrivateParkingSpace = parkingType !== 'none' && source?.hasPrivateParkingSpace === true;

  return {
    parkingType,
    hasPrivateParkingSpace,
    parkingSpaceIncludedInPrice:
      hasPrivateParkingSpace && typeof source?.parkingSpaceIncludedInPrice === 'boolean'
        ? source.parkingSpaceIncludedInPrice
        : null,
  };
}

export function getParkingLabel(source?: {
  parkingType?: unknown;
  parking?: unknown;
  hasParking?: unknown;
  hasPrivateParkingSpace?: unknown;
  parkingSpaceIncludedInPrice?: unknown;
}) {
  const { parkingType, hasPrivateParkingSpace, parkingSpaceIncludedInPrice } = normalizeParkingData(source);

  if (parkingType === 'none') return 'Нет';
  if (parkingType === 'open' && !hasPrivateParkingSpace) return 'Открытая парковка, без закрепленного места';
  if (parkingType === 'covered' && !hasPrivateParkingSpace) return 'Крытая наземная парковка, без закрепленного места';
  if (parkingType === 'underground' && !hasPrivateParkingSpace) return 'Подземный паркинг, без закрепленного места';

  const included = parkingSpaceIncludedInPrice ? 'место входит в стоимость' : 'место продается отдельно';
  if (parkingType === 'open') return `Открытая парковка, собственное место: ${included}`;
  if (parkingType === 'covered') return `Крытая, собственное место ${included}`;
  return `Подземный, ${included}`;
}
