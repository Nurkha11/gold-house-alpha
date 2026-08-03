export type BalconyType = 'none' | 'balcony' | 'loggia' | 'balcony_and_loggia' | 'multiple';

export const balconyTypeLabels: Record<BalconyType, string> = {
  none: 'Нет',
  balcony: 'Балкон',
  loggia: 'Лоджия',
  balcony_and_loggia: 'Балкон и лоджия',
  multiple: '2 и более балконов/лоджий',
};

export const balconyTypeOptions: BalconyType[] = ['none', 'balcony', 'loggia', 'balcony_and_loggia', 'multiple'];

export function getBalconyLabel(type?: BalconyType) {
  return balconyTypeLabels[type ?? 'balcony'];
}

export function getBalconyTypeByLabel(label: string): BalconyType {
  const option = balconyTypeOptions.find((type) => balconyTypeLabels[type] === label);
  return option ?? 'balcony';
}

export function normalizeBalconyType(type?: BalconyType | string, legacyBalcony?: boolean | string): BalconyType {
  if (type === 'none' || type === 'balcony' || type === 'loggia' || type === 'balcony_and_loggia' || type === 'multiple') {
    return type;
  }

  if (legacyBalcony === false) return 'none';
  if (legacyBalcony === true) return 'balcony';

  const value = String(legacyBalcony ?? '').trim().toLowerCase();
  if (!value || value === 'да') return 'balcony';
  if (value === 'нет') return 'none';
  if (value.includes('лодж') && value.includes('балкон')) return 'balcony_and_loggia';
  if (value.includes('лодж')) return 'loggia';
  if (value.includes('2') || value.includes('более')) return 'multiple';
  if (value.includes('балкон')) return 'balcony';

  return 'balcony';
}
