import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

export default function CityScreen() {
  const params = useLocalSearchParams();

  return (
    <Screen>
      <OnboardingProgress step={2} total={8} />
      <PageHeader eyebrow="Город" title="Какой город вас интересует?" />
      <View style={styles.options}>
        <QuestionCard
          title="Алматы"
          subtitle="Сейчас Gold House работает с Алматы."
          selected
          onPress={() => router.push({ pathname: '/district', params: { ...params, city: 'Алматы' } } as never)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: spacing.md,
  },
});
