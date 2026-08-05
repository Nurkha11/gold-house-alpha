import Constants from 'expo-constants';

export type YMaps3 = any;

declare global {
  interface Window {
    ymaps3?: YMaps3;
    __goldHouseYandexMaps3Promise?: Promise<YMaps3>;
  }
}

export const YANDEX_MAPS_ENV_NAME = 'EXPO_PUBLIC_YANDEX_MAPS_API_KEY';

export function getYandexMapsApiKey() {
  const publicEnvKey = typeof process !== 'undefined' && process.env ? process.env.EXPO_PUBLIC_YANDEX_MAPS_API_KEY ?? '' : '';
  const expoConfigKey =
    typeof Constants.expoConfig?.extra?.yandexMapsApiKey === 'string' ? Constants.expoConfig.extra.yandexMapsApiKey : '';
  const manifestKey =
    typeof (Constants.manifest as any)?.extra?.yandexMapsApiKey === 'string'
      ? (Constants.manifest as any).extra.yandexMapsApiKey
      : '';
  const manifest2Key =
    typeof (Constants as any).manifest2?.extra?.expoClient?.extra?.yandexMapsApiKey === 'string'
      ? (Constants as any).manifest2.extra.expoClient.extra.yandexMapsApiKey
      : '';

  return publicEnvKey || expoConfigKey || manifestKey || manifest2Key;
}

export function isDevelopmentMode() {
  return typeof process !== 'undefined' ? process.env.NODE_ENV !== 'production' : true;
}

function configureYandexMapsApiKeys(ymaps3: YMaps3, apiKey: string) {
  ymaps3.getDefaultConfig?.().setApikeys?.({
    suggest: apiKey,
    search: apiKey,
  });
}

export function loadYandexMapsApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YANDEX_MAPS_BROWSER_ONLY'));
  }

  if (window.ymaps3) {
    return window.ymaps3.ready.then(() => {
      configureYandexMapsApiKeys(window.ymaps3, getYandexMapsApiKey());
      return window.ymaps3;
    });
  }

  if (window.__goldHouseYandexMaps3Promise) {
    return window.__goldHouseYandexMaps3Promise;
  }

  const apiKey = getYandexMapsApiKey();
  if (!apiKey) {
    return Promise.reject(new Error('YANDEX_MAPS_API_KEY_MISSING'));
  }

  window.__goldHouseYandexMaps3Promise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-gold-house-yandex-maps-api="3"]');

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        async () => {
          try {
            await window.ymaps3?.ready;
            configureYandexMapsApiKeys(window.ymaps3, apiKey);
            resolve(window.ymaps3);
          } catch (error) {
            reject(error);
          }
        },
        { once: true },
      );
      existingScript.addEventListener(
        'error',
        () => {
          window.__goldHouseYandexMaps3Promise = undefined;
          existingScript.remove();
          reject(new Error('YANDEX_MAPS_SCRIPT_LOAD_FAILED'));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.dataset.goldHouseYandexMapsApi = '3';
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(apiKey)}&lang=ru_RU`;
    script.onload = async () => {
      try {
        await window.ymaps3?.ready;
        if (!window.ymaps3) {
          reject(new Error('YANDEX_MAPS_NAMESPACE_UNAVAILABLE'));
          return;
        }
        configureYandexMapsApiKeys(window.ymaps3, apiKey);
        resolve(window.ymaps3);
      } catch (error) {
        window.__goldHouseYandexMaps3Promise = undefined;
        reject(error);
      }
    };
    script.onerror = () => {
      window.__goldHouseYandexMaps3Promise = undefined;
      script.remove();
      reject(new Error('YANDEX_MAPS_SCRIPT_LOAD_FAILED'));
    };
    document.head.appendChild(script);
  });

  return window.__goldHouseYandexMaps3Promise;
}
