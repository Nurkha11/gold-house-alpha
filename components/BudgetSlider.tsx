import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

type BudgetSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const min = 10_000_000;
const max = 100_000_000;
const step = 5_000_000;

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ₸`;
}

export function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const [trackWidth, setTrackWidth] = useState(1);
  const progress = useMemo(() => (value - min) / (max - min), [value]);

  const setFromRatio = (ratio: number) => {
    const raw = min + ratio * (max - min);
    const rounded = Math.round(raw / step) * step;
    onChange(Math.min(max, Math.max(min, rounded)));
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.value}>{value >= max ? '100+ млн ₸' : formatPrice(value)}</Text>
      <Pressable
        style={styles.track}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        onPress={(event) => {
          const x = event.nativeEvent.locationX;
          setFromRatio(Math.min(1, Math.max(0, x / trackWidth)));
        }}
      >
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        <View style={[styles.thumb, { left: `${progress * 100}%` }]} />
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={styles.smallButton} onPress={() => onChange(Math.max(min, value - step))}>
          <Text style={styles.smallText}>-5 млн</Text>
        </Pressable>
        <Pressable style={styles.smallButton} onPress={() => onChange(Math.min(max, value + step))}>
          <Text style={styles.smallText}>+5 млн</Text>
        </Pressable>
      </View>
      <View style={styles.scale}>
        <Text style={styles.scaleText}>10 млн</Text>
        <Text style={styles.scaleText}>100+ млн</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  value: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  track: {
    height: 44,
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    marginLeft: -14,
    borderRadius: 14,
    backgroundColor: colors.black,
    borderWidth: 4,
    borderColor: colors.background,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  smallButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    color: colors.text,
    fontWeight: '800',
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    color: colors.muted,
    fontSize: 13,
  },
});
