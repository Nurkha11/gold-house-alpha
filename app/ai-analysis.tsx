import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/constants/theme';

const stages = [
  'Анализируем ваши лайки',
  'Изучаем просмотренные квартиры',
  'Сравниваем похожие объекты',
  'Формируем профиль предпочтений',
  'Подбираем лучшие варианты',
];

export default function AiAnalysisScreen() {
  const params = useLocalSearchParams();
  const [stageIndex, setStageIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 6500,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const stageTimer = setInterval(() => {
      setStageIndex((value) => Math.min(value + 1, stages.length - 1));
    }, 1200);

    const routeTimer = setTimeout(() => {
      router.replace({ pathname: '/personal-recommendations', params } as never);
    }, 7000);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(routeTimer);
    };
  }, [params, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['8%', '100%'],
  });

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <PageHeader
          eyebrow="AI-анализ"
          title="Создаем персональный профиль предпочтений"
          subtitle="Gold House анализирует ваши действия и ищет закономерности в выборе квартир."
        />

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width }]} />
        </View>

        <View style={styles.stages}>
          {stages.map((stage, index) => (
            <View key={stage} style={[styles.stage, index <= stageIndex && styles.activeStage]}>
              <Text style={[styles.stageMark, index <= stageIndex && styles.activeText]}>{index <= stageIndex ? '✓' : '•'}</Text>
              <Text style={[styles.stageText, index <= stageIndex && styles.activeText]}>{stage}</Text>
            </View>
          ))}
        </View>
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
  progressTrack: {
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  stages: {
    gap: spacing.md,
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.md,
  },
  activeStage: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  stageMark: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '900',
  },
  stageText: {
    flex: 1,
    color: colors.muted,
    fontSize: 16,
    fontWeight: '800',
  },
  activeText: {
    color: colors.accentDark,
  },
});
