import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { loadYandexMaps } from '@/utils/loadYandexMaps';
import type { PropertyMapProps } from './PropertyMap.types';

type MapStatus = 'loading' | 'ready' | 'error';

function createMarkerElement() {
  const marker = document.createElement('div');
  marker.style.width = '22px';
  marker.style.height = '22px';
  marker.style.borderRadius = '999px';
  marker.style.background = colors.accent;
  marker.style.border = '4px solid #fff';
  marker.style.boxShadow = '0 10px 24px rgba(0,0,0,.25)';
  marker.style.transform = 'translate(-50%, -50%)';
  return marker;
}

export default function PropertyMap({ center, zoom = 16, height = 220 }: PropertyMapProps) {
  const containerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [status, setStatus] = useState<MapStatus>('loading');

  useEffect(() => {
    let disposed = false;
    setStatus('loading');

    loadYandexMaps()
      .then((ymaps3: any) => {
        if (disposed || !containerRef.current || mapRef.current) return;

        const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
        // ymaps3 coordinates are [lng, lat], the reverse of our { lat, lng } prop shape.
        const lngLat: [number, number] = [center.lng, center.lat];

        const map = new YMap(containerRef.current, {
          location: { center: lngLat, zoom },
        });

        map.addChild(new YMapDefaultSchemeLayer({}));
        map.addChild(new YMapDefaultFeaturesLayer({}));

        markerRef.current = new YMapMarker({ coordinates: lngLat }, createMarkerElement());
        map.addChild(markerRef.current);

        mapRef.current = map;
        setStatus('ready');
      })
      .catch(() => {
        if (!disposed) setStatus('error');
      });

    return () => {
      disposed = true;
      mapRef.current?.destroy?.();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [center.lat, center.lng, zoom]);

  return (
    <View style={[styles.wrap, { height }]}>
      {status !== 'ready' ? (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>{status === 'error' ? 'Не удалось загрузить карту' : 'Загружаем карту...'}</Text>
        </View>
      ) : null}
      <View ref={containerRef} style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.card,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  overlayText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
});
