import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

const roomOptions = ['1', '2', '3', '4+'];

export default function RoomsScreen() {
  const params = useLocalSearchParams<{
    city?: string;
    district?: string;
    budgetRange?: string;
    budgetLabel?: string;
    budgetMin?: string;
    budgetMax?: string;
  }>();
  const [rooms, setRooms] = useState('2');

  return (
    <Screen>
      <OnboardingProgress step={5} total={8} />
      <PageHeader eyebrow="Комнаты" title="Сколько комнат вы ищете?" />
      <View style={styles.grid}>
        {roomOptions.map((option) => (
          <QuestionCard key={option} title={option} selected={rooms === option} onPress={() => setRooms(option)} />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Продолжить" onPress={() => router.push({ pathname: '/floor', params: { ...params, rooms } } as never)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
  },
});
