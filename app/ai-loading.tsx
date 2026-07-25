import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/constants/theme';
import { FloorPreference, normalizeFloorCategories, startTrainingSession } from '@/data/aiTrainingStore';

export default function AiLoadingScreen() {
  const params = useLocalSearchParams<{
    city?: string;
    district?: string;
    selectedDistricts?: string;
    budgetMin?: string;
    budgetMax?: string;
    rooms?: string;
    floorPreference?: FloorPreference;
    selectedFloorCategories?: string;
  }>();
  const pulse = useRef(new Animated.Value(0.86)).current;

  useEffect(() => {
    startTrainingSession({
      city: params.city ?? 'Алматы',
      district: params.district ?? 'Наурызбайский',
      selectedDistricts: params.selectedDistricts ?? params.district ?? 'Наурызбайский',
      rooms: params.rooms ?? '1',
      budgetMin: params.budgetMin ? Number(params.budgetMin) : undefined,
      budgetMax: params.budgetMax ? Number(params.budgetMax) : undefined,
      selectedFloorCategories: normalizeFloorCategories(params.selectedFloorCategories ?? params.floorPreference),
      floorPreference: params.floorPreference,
    });

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 780, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.86, duration: 780, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [params.budgetMax, params.budgetMin, params.city, params.district, params.selectedDistricts, params.floorPreference, params.selectedFloorCategories, params.rooms, pulse]);

  return (
    <Screen scroll={false}>
      <OnboardingProgress step={7} total={8} />
      <View style={styles.center}>
        <Animated.View style={[styles.orbit, { transform: [{ scale: pulse }] }]}>
          <Text style={styles.ai}>AI</Text>
        </Animated.View>
        <PageHeader
          eyebrow="Обучение AI"
          title="Помогите AI лучше понять ваши предпочтения."
          subtitle="Оцените минимум 10 квартир из контрольного датасета. Чем больше действий, тем точнее будут рекомендации."
        />
        <PrimaryButton title="Оценить квартиры" onPress={() => router.replace({ pathname: '/swipe', params } as never)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  orbit: {
    alignSelf: 'center',
    width: 108,
    height: 108,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ai: {
    color: colors.background,
    fontSize: 28,
    fontWeight: '900',
  },
});
