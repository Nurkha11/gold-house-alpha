export type ElevatorCount = 0 | 1 | 2 | 3;

export type ElevatorData = {
  elevatorCount: ElevatorCount;
  hasFreightElevator: boolean;
};

export const elevatorCountLabels: Record<ElevatorCount, string> = {
  0: 'Нет',
  1: '1 лифт',
  2: '2 лифта',
  3: '3 и более лифтов',
};

export const elevatorCountOptions: ElevatorCount[] = [0, 1, 2, 3];

export function getElevatorCountLabel(count: ElevatorCount) {
  return elevatorCountLabels[count];
}

export function getElevatorCountByLabel(label: string): ElevatorCount {
  const found = elevatorCountOptions.find((count) => elevatorCountLabels[count] === label);
  return found ?? 0;
}

function normalizeElevatorCount(value: unknown): ElevatorCount | undefined {
  if (value === 0 || value === 1 || value === 2 || value === 3) return value;

  if (typeof value === 'number') {
    if (value <= 0) return 0;
    if (value === 1) return 1;
    if (value === 2) return 2;
    return 3;
  }

  if (typeof value !== 'string') return undefined;

  const text = value.trim().toLowerCase();
  if (!text || text === 'нет' || text === 'false' || text === 'без лифта') return 0;
  if (text.includes('3') || text.includes('более')) return 3;
  if (text.includes('2')) return 2;
  if (text.includes('1') || text.includes('да') || text === 'true') return 1;

  return undefined;
}

export function normalizeElevatorData(source?: {
  elevatorCount?: unknown;
  elevators?: unknown;
  elevator?: unknown;
  hasFreightElevator?: unknown;
}): ElevatorData {
  const elevatorCount =
    normalizeElevatorCount(source?.elevatorCount) ??
    normalizeElevatorCount(source?.elevators) ??
    normalizeElevatorCount(source?.elevator) ??
    0;

  return {
    elevatorCount,
    hasFreightElevator: elevatorCount > 0 && source?.hasFreightElevator === true,
  };
}

export function getElevatorLabel(source?: {
  elevatorCount?: unknown;
  elevators?: unknown;
  elevator?: unknown;
  hasFreightElevator?: unknown;
}) {
  const { elevatorCount, hasFreightElevator } = normalizeElevatorData(source);

  if (elevatorCount === 0) return 'Нет';
  if (elevatorCount === 1) return hasFreightElevator ? '1 лифт, грузовой' : '1 пассажирский лифт';
  if (elevatorCount === 2) return hasFreightElevator ? '2, есть грузовой' : '2 пассажирских лифта';
  return hasFreightElevator ? '3 и более, есть грузовой' : '3 и более';
}
