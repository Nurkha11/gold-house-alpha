import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { OptionButton } from '@/components/OptionButton';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

const budgetRanges = [
  { id: 'under-30', label: 'До 30 млн ₸', min: 0, max: 30_000_000 },
  { id: '30-45', label: '30-45 млн ₸', min: 30_000_000, max: 45_000_000 },
  { id: '45-60', label: '45-60 млн ₸', min: 45_000_000, max: 60_000_000 },
  { id: '60-80', label: '60-80 млн ₸', min: 60_000_000, max: 80_000_000 },
  { id: '80-100', label: '80-100 млн ₸', min: 80_000_000, max: 100_000_000 },
  { id: '100-plus', label: '100+ млн ₸', min: 100_000_000, max: 999_000_000 },
];

function initialBudgetId(min?: string, max?: string) {
  const budgetMin = Number(min);
  const budgetMax = Number(max);
  return budgetRanges.find((range) => range.min === budgetMin && range.max === budgetMax)?.id ?? 'under-30';
}

export default function BudgetScreen() {
  const params = useLocalSearchParams<{ city?: string; district?: string; budgetMin?: string; budgetMax?: string }>();
  const [selectedId, setSelectedId] = useState(initialBudgetId(params.budgetMin, params.budgetMax));
  const selectedRange = budgetRanges.find((range) => range.id === selectedId) ?? budgetRanges[0];

  return (
    <Screen>
      <OnboardingProgress step={4} total={8} />
      <PageHeader eyebrow="Бюджет" title="Какой у вас бюджет?" subtitle="Нижняя граница бюджета мягкая: если квартира дешевле, но подходит по остальным критериям, мы тоже покажем ее." />
      <View style={styles.options}>
        {budgetRanges.map((range) => (
          <OptionButton key={range.id} label={range.label} selected={selectedId === range.id} onPress={() => setSelectedId(range.id)} />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title="Продолжить"
          onPress={() =>
            router.push({
              pathname: '/rooms',
              params: {
                ...params,
                budgetRange: selectedRange.id,
                budgetLabel: selectedRange.label,
                budgetMin: String(selectedRange.min),
                budgetMax: String(selectedRange.max),
              },
            } as never)
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
