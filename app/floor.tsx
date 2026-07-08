import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';

const floorOptions = [
  { id: 'any', title: 'Любые этажи', subtitle: 'Покажем все подходящие варианты.' },
  { id: 'notFirst', title: 'Только не первый', subtitle: 'Исключим квартиры на первом этаже.' },
  { id: 'notLast', title: 'Только не последний', subtitle: 'Исключим последний этаж.' },
  { id: 'middle', title: 'Только средние этажи', subtitle: 'Не первый и не последний.' },
];

export default function FloorScreen() {
  const params = useLocalSearchParams();
  const [floorPreference, setFloorPreference] = useState('any');

  return (
    <Screen>
      <OnboardingProgress step={6} total={8} />
      <PageHeader eyebrow="Этаж" title="Есть ли ограничения по этажу?" subtitle="Выберите один вариант. Это поможет быстрее отсечь неподходящие квартиры." />
      <View style={styles.options}>
        {floorOptions.map((option) => (
          <QuestionCard
            key={option.id}
            title={option.title}
            subtitle={option.subtitle}
            selected={floorPreference === option.id}
            icon={<Text style={styles.check}>✓</Text>}
            onPress={() => setFloorPreference(option.id)}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          title="Запустить AI-подбор"
          onPress={() => router.push({ pathname: '/ai-loading', params: { ...params, floorPreference } } as never)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
  check: {
    color: colors.background,
    fontSize: 19,
    fontWeight: '900',
  },
  footer: {
    marginTop: spacing.xl,
  },
});
