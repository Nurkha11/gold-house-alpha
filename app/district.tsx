import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { spacing } from '@/constants/theme';

const districts = ['Наурызбайский', 'Бостандыкский'];

export default function DistrictScreen() {
  const params = useLocalSearchParams<{ city?: string; district?: string; selectedDistricts?: string }>();
  const initialDistricts = String(params.selectedDistricts ?? params.district ?? 'Наурызбайский')
    .split(',')
    .map((district) => district.trim())
    .filter(Boolean);
  const [selected, setSelected] = useState<string[]>(initialDistricts.length ? initialDistricts : ['Наурызбайский']);

  function toggleDistrict(district: string) {
    setSelected((current) => (current.includes(district) ? current.filter((item) => item !== district) : [...current, district]));
  }

  function continueFlow() {
    if (!selected.length) return;

    router.push({
      pathname: '/rooms',
      params: {
        ...params,
        district: selected[0],
        selectedDistricts: selected.join(','),
      },
    } as never);
  }

  return (
    <Screen>
      <OnboardingProgress step={3} total={8} />
      <PageHeader eyebrow="Район" title="Какой район вас интересует?" subtitle="Можно выбрать один район или несколько, если вы рассматриваете оба направления." />
      <View style={styles.options}>
        {districts.map((district) => (
          <QuestionCard key={district} title={district} selected={selected.includes(district)} onPress={() => toggleDistrict(district)} />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton title={selected.length ? 'Продолжить' : 'Выберите район'} onPress={continueFlow} />
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
