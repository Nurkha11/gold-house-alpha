import { loadYandexMapsApi } from './loadYandexMapsApi';

// PropertyMap.web.tsx reuses the same window.ymaps3 singleton and script tag
// as the owner location picker (loadYandexMapsApi), so both features share one
// script load, one `ymaps3.ready` wait, and the same HMR-safe error handling
// instead of racing two independent loaders for the same v3 script.
export function loadYandexMaps() {
  return loadYandexMapsApi();
}
