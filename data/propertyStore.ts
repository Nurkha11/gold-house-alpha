import { getPublishedProperties } from '@/data/ownerStore';
import { properties } from '@/data/properties';

export function getBuyerProperties() {
  return [...getPublishedProperties(), ...properties];
}

export function getBuyerPropertyById(id: string) {
  return getBuyerProperties().find((property) => property.id === id);
}
