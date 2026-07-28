import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import type { PropertyMapCoordinates, PropertyMapProps } from './PropertyMap.types';

function buildYandexMapsUrl(center: PropertyMapCoordinates, zoom: number) {
  return `https://yandex.ru/maps/?ll=${center.lng}%2C${center.lat}&z=${zoom}&pt=${center.lng},${center.lat}`;
}

export default function PropertyMap({ center, zoom = 16, height = 220 }: PropertyMapProps) {
  return (
    <View style={[styles.wrap, { height }]}>
      <Text style={styles.title}>Расположение на карте</Text>
      <Text style={styles.text}>
        {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
      </Text>
      <Pressable style={styles.button} onPress={() => Linking.openURL(buildYandexMapsUrl(center, zoom))}>
        <Text style={styles.buttonText}>↗ Открыть в Яндекс.Картах</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    ...shadows.card,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    minHeight: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    color: colors.accentDark,
    fontSize: 14,
    fontWeight: '900',
  },
});
