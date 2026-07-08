import { DimensionValue, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

type OwnerStepIndicatorProps = {
  current: number;
  total: number;
};

export function OwnerStepIndicator({ current, total }: OwnerStepIndicatorProps) {
  const progress = `${Math.round((current / total) * 100)}%`;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>Шаг {current} из {total}</Text>
        <Text style={styles.percent}>{progress}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: progress as DimensionValue }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  percent: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    height: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
  },
});
