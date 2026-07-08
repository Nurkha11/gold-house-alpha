import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

const districts = [
  'Бостандыкский',
  'Алмалинский',
  'Медеуский',
  'Ауэзовский',
  'Наурызбайский',
  'Турксибский',
  'Жетысуский',
  'Алатауский',
];

export default function DistrictScreen() {
  const { city = 'Алматы' } = useLocalSearchParams<{ city?: string }>();
  const [selected, setSelected] = useState('Бостандыкский');

  return (
    <Screen>
      <OnboardingProgress step={3} total={8} />
      <PageHeader eyebrow="Район" title="Какой район вас интересует?" subtitle="Выберите район Алматы. Позже можно будет расширить поиск." />
      <View style={styles.options}>
        {districts.map((district) => (
          <QuestionCard key={district} title={district} selected={selected === district} onPress={() => setSelected(district)} />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Продолжить" onPress={() => router.push({ pathname: '/budget', params: { city, district: selected } })} />
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
