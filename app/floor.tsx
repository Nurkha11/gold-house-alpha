import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { FloorCategory, normalizeFloorCategories } from '@/data/aiTrainingStore';

const floorOptions: { id: FloorCategory; title: string; subtitle: string }[] = [
  { id: 'first', title: 'Первый этаж', subtitle: 'Квартиры на первом этаже' },
  { id: 'middle', title: 'Средние этажи', subtitle: 'Не первый и не последний этаж' },
  { id: 'last', title: 'Последний этаж', subtitle: 'Верхний этаж дома' },
];

export default function FloorScreen() {
  const params = useLocalSearchParams<{ floorPreference?: string; selectedFloorCategories?: string }>();
  const { width } = useWindowDimensions();
  const initialSelection = useMemo(
    () => normalizeFloorCategories(params.selectedFloorCategories ?? params.floorPreference),
    [params.floorPreference, params.selectedFloorCategories],
  );
  const [selectedFloorCategories, setSelectedFloorCategories] = useState<FloorCategory[]>(initialSelection);
  const isWide = width >= 900;

  function toggleFloor(category: FloorCategory) {
    setSelectedFloorCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  }

  function continueToAiLoading() {
    const selected = selectedFloorCategories.join(',');

    router.push({
      pathname: '/ai-loading',
      params: {
        ...params,
        selectedFloorCategories: selected,
        floorPreference: selected,
      },
    } as never);
  }

  return (
    <Screen>
      <OnboardingProgress step={6} total={8} />
      <PageHeader
        eyebrow="Этаж"
        title="Какие этажи вам подходят?"
        subtitle="Можно выбрать несколько вариантов"
      />
      <View style={[styles.options, isWide && styles.optionsWide]}>
        {floorOptions.map((option) => {
          const selected = selectedFloorCategories.includes(option.id);

          return (
            <Pressable
              key={option.id}
              onPress={() => toggleFloor(option.id)}
              style={({ pressed }) => [
                styles.card,
                isWide && styles.cardWide,
                selected && styles.cardSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.cardText}>
                <Text style={[styles.title, selected && styles.titleSelected]}>{option.title}</Text>
                <Text style={styles.subtitle}>{option.subtitle}</Text>
              </View>
              <View style={[styles.check, selected && styles.checkSelected]}>
                <Text style={[styles.checkText, selected && styles.checkTextSelected]}>{selected ? '✓' : ''}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title="Далее"
          disabled={selectedFloorCategories.length === 0}
          onPress={continueToAiLoading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
  optionsWide: {
    flexDirection: 'row',
  },
  card: {
    minHeight: 124,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    ...shadows.card,
  },
  cardWide: {
    flex: 1,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  cardText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  titleSelected: {
    color: colors.accentDark,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  checkSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  checkText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },
  checkTextSelected: {
    color: colors.background,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
