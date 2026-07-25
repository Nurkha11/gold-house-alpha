import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getYandexMapsApiKey, isDevelopmentMode, loadYandexMapsApi, YANDEX_MAPS_ENV_NAME } from '@/utils/loadYandexMapsApi';

type Coordinates = {
  latitude: number | null;
  longitude: number | null;
};

type YandexPropertyMapProps = {
  coordinates: Coordinates;
  onCoordinatesChange: (coordinates: { latitude: number; longitude: number }) => void;
};

type MapStatus = 'loading' | 'ready' | 'missing-key' | 'error';

const ALMATY_CENTER: [number, number] = [76.889709, 43.238949];

function getReadableMapError(message: string) {
  if (message === 'YANDEX_MAPS_SCRIPT_LOAD_FAILED') {
    return 'Ключ найден, но Яндекс.Карты не отдали скрипт. Проверьте в настройках ключа HTTP Referer: localhost. После изменения Яндекс может применять настройку до 15 минут.';
  }

  return message;
}

function toLngLat(coordinates: Coordinates): [number, number] {
  return [coordinates.longitude ?? ALMATY_CENTER[0], coordinates.latitude ?? ALMATY_CENTER[1]];
}

function createMarkerElement() {
  const marker = document.createElement('div');
  marker.style.width = '22px';
  marker.style.height = '22px';
  marker.style.borderRadius = '999px';
  marker.style.background = '#b37b34';
  marker.style.border = '4px solid #fff';
  marker.style.boxShadow = '0 10px 24px rgba(0,0,0,.25)';
  marker.style.transform = 'translate(-50%, -50%)';
  return marker;
}

export function YandexPropertyMap({ coordinates, onCoordinatesChange }: YandexPropertyMapProps) {
  const apiKey = getYandexMapsApiKey();
  const mapContainerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const listenerRef = useRef<any>(null);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  const [status, setStatus] = useState<MapStatus>(apiKey ? 'loading' : 'missing-key');
  const [errorText, setErrorText] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  function setMarker(ymaps3: any, lngLat: [number, number]) {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!markerRef.current) {
      markerRef.current = new ymaps3.YMapMarker(
        {
          coordinates: lngLat,
          draggable: true,
          mapFollowsOnDrag: true,
          onDragEnd: (nextLngLat: [number, number]) => {
            markerRef.current?.update({ coordinates: nextLngLat });
            onCoordinatesChangeRef.current({
              latitude: nextLngLat[1],
              longitude: nextLngLat[0],
            });
          },
        },
        createMarkerElement(),
      );
      map.addChild(markerRef.current);
      return;
    }

    markerRef.current.update({ coordinates: lngLat });
  }

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setStatus('error');
      setErrorText('Настоящая Яндекс.Карта доступна в web-версии через localhost.');
      return;
    }

    if (!apiKey) {
      setStatus('missing-key');
      return;
    }

    if (!mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    let disposed = false;
    setStatus('loading');
    setErrorText('');

    loadYandexMapsApi()
      .then((ymaps3: any) => {
        if (disposed || !mapContainerRef.current || mapInstanceRef.current) return;

        const {
          YMap,
          YMapDefaultSchemeLayer,
          YMapDefaultFeaturesLayer,
          YMapListener,
        } = ymaps3;

        const map = new YMap(mapContainerRef.current, {
          location: {
            center: toLngLat(coordinates),
            zoom: coordinates.latitude !== null && coordinates.longitude !== null ? 16 : 11,
          },
        });

        map.addChild(new YMapDefaultSchemeLayer({}));
        map.addChild(new YMapDefaultFeaturesLayer({}));

        listenerRef.current = new YMapListener({
          layer: 'any',
          onClick: (_object: unknown, event: { coordinates?: [number, number] }) => {
            if (!event.coordinates) return;
            setMarker(ymaps3, event.coordinates);
            onCoordinatesChangeRef.current({
              latitude: event.coordinates[1],
              longitude: event.coordinates[0],
            });
          },
        });
        map.addChild(listenerRef.current);

        mapInstanceRef.current = map;

        if (coordinates.latitude !== null && coordinates.longitude !== null) {
          setMarker(ymaps3, toLngLat(coordinates));
        }

        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (disposed) return;
        const message = error instanceof Error ? error.message : 'YANDEX_MAPS_UNKNOWN_ERROR';
        setStatus(message === 'YANDEX_MAPS_API_KEY_MISSING' ? 'missing-key' : 'error');
        setErrorText(message);
      });

    return () => {
      disposed = true;
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
      markerRef.current = null;
      listenerRef.current = null;
    };
  }, [apiKey, retryKey]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.ymaps3 || coordinates.latitude === null || coordinates.longitude === null) {
      return;
    }

    const lngLat = toLngLat(coordinates);
    setMarker(window.ymaps3, lngLat);
    mapInstanceRef.current.update({
      location: {
        center: lngLat,
        zoom: 16,
        duration: 500,
      },
    });
  }, [coordinates.latitude, coordinates.longitude]);

  function retry() {
    mapInstanceRef.current?.destroy?.();
    mapInstanceRef.current = null;
    markerRef.current = null;
    listenerRef.current = null;
    setRetryKey((current) => current + 1);
  }

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateTitle}>Карта доступна в web-версии</Text>
        <Text style={styles.stateText}>Откройте проект через localhost, чтобы выбрать точку на интерактивной карте.</Text>
      </View>
    );
  }

  const showDevDetails = isDevelopmentMode();

  return (
    <View style={styles.wrap}>
      {status === 'missing-key' ? (
        <View style={styles.stateOverlay}>
          <Text style={styles.stateTitle}>{showDevDetails ? 'Yandex Maps API key не найден.' : 'Не удалось загрузить карту.'}</Text>
          <Text style={styles.stateText}>
            {showDevDetails
              ? `Добавьте ${YANDEX_MAPS_ENV_NAME} в файл .env и перезапустите development server.`
              : 'Попробуйте обновить страницу.'}
          </Text>
        </View>
      ) : null}
      {status === 'error' ? (
        <View style={styles.stateOverlay}>
          <Text style={styles.stateTitle}>Не удалось загрузить карту.</Text>
          <Text style={styles.stateText}>{showDevDetails ? getReadableMapError(errorText) : 'Попробуйте обновить страницу.'}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}
      {status === 'loading' ? (
        <View style={styles.stateOverlay}>
          <Text style={styles.stateTitle}>Загружаем Яндекс-Карту...</Text>
        </View>
      ) : null}
      <View ref={mapContainerRef} style={styles.mapContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    minHeight: 440,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    overflow: 'hidden',
    ...shadows.card,
  },
  mapContainer: {
    width: '100%',
    height: 440,
    minHeight: 320,
  },
  stateOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  stateBox: {
    minHeight: 260,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  retryButton: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  retryText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '900',
  },
});
