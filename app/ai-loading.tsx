import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/constants/theme';
import { FloorPreference, startTrainingSession } from '@/data/aiTrainingStore';

export default function AiLoadingScreen() {
  const params = useLocalSearchParams<{
    city?: string;
    district?: string;
    budgetMin?: string;
    budgetMax?: string;
    rooms?: string;
    floorPreference?: FloorPreference;
  }>();
  const pulse = useRef(new Animated.Value(0.86)).current;

  useEffect(() => {
    startTrainingSession({
      city: params.city ?? 'Алматы',
      district: params.district,
      rooms: params.rooms,
      budgetMin: Number(params.budgetMin ?? 0),
      budgetMax: Number(params.budgetMax ?? 45_000_000),
      floorPreference: params.floorPreference ?? 'any',
    });

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 780, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.86, duration: 780, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [params.budgetMax, params.budgetMin, params.city, params.district, params.floorPreference, params.rooms, pulse]);

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
          subtitle="Оцените несколько квартир. Чем больше оценок, тем точнее будут рекомендации."
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
