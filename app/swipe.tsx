import { useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ResolvedImage } from '@/components/ResolvedImage';
import { Screen } from '@/components/Screen';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getHardFilteredProperties, getRatingCount, getTrainingStream, recordTrainingSignal, scorePropertyForTraining } from '@/data/aiTrainingStore';
import { Property } from '@/data/properties';

const minimumRatings = 5;

function matchPercent(property: Property) {
  return Math.max(78, Math.min(98, Math.round(scorePropertyForTraining(property))));
}

export default function SwipeScreen() {
  const params = useLocalSearchParams<{ selectedDistricts?: string; district?: string; rooms?: string; trainingMode?: string; targetRatingCount?: string }>();
  const { width } = useWindowDimensions();
  const [ratingCount, setRatingCount] = useState(() => getRatingCount());
  const [initialRatingCount] = useState(() => getRatingCount());
  const currentSessionRatedCount = Math.max(ratingCount - initialRatingCount, 0);
  const availableCount = useMemo(() => getHardFilteredProperties().length, []);
  const effectiveMinimumRatings = Math.max(1, Math.min(minimumRatings, availableCount));
  const [targetRatingCount] = useState(() => {
    const currentCount = getRatingCount();
    if (params.targetRatingCount) return Number(params.targetRatingCount);
    return currentCount + effectiveMinimumRatings;
  });

  const sessionTargetCount = Math.max(0, targetRatingCount - (ratingCount - currentSessionRatedCount));
  const streamLimit = Math.max(effectiveMinimumRatings, sessionTargetCount);
  const stream = useMemo(() => getTrainingStream(streamLimit), [streamLimit]);
  const currentIndex = currentSessionRatedCount;
  const current = stream[currentIndex];
  const hasExhaustedCurrentStream = stream.length > 0 && currentSessionRatedCount >= stream.length;
  const remaining = Math.max(Math.min(targetRatingCount - ratingCount, stream.length - currentSessionRatedCount), 0);
  const selectedDistricts = String(params.selectedDistricts ?? params.district ?? '')
    .split(',')
    .map((district) => district.trim())
    .filter(Boolean);
  const selectedDistrictLabel = selectedDistricts.length ? selectedDistricts.join(', ') : 'выбранном районе';
  const emptyText = `В районе ${selectedDistrictLabel} по выбранным критериям квартир пока нет. Можете вернуться назад и выбрать другой район, комнатность или этаж.`;
  const isWideLayout = width >= 900;

  function rate(property: Property, type: 'like' | 'dislike') {
    recordTrainingSignal(property.id, type);
    const nextCount = ratingCount + 1;
    const nextSessionRatedCount = currentSessionRatedCount + 1;
    const ratedAllAvailableBeforeFive = stream.length < minimumRatings && nextSessionRatedCount >= stream.length;
    setRatingCount(nextCount);

    if (nextCount >= targetRatingCount && !ratedAllAvailableBeforeFive) {
      router.replace({ pathname: '/ai-analysis', params } as never);
    }
  }

  function goToNextStep() {
    if (ratingCount > 0) {
      router.replace({ pathname: '/ai-analysis', params } as never);
      return;
    }

    router.replace({ pathname: '/personal-recommendations', params } as never);
  }

  return (
    <Screen>
      <OnboardingProgress step={8} total={8} />
      <PageHeader
        eyebrow="AI изучает вкус"
        title="Оцените несколько квартир."
        subtitle={
          availableCount <= 1
            ? 'В выбранных критериях найден один вариант. Оцените его, и AI сразу покажет следующий шаг.'
            : remaining > 0
              ? `Осталось оценить: ${remaining}. После этого AI соберет персональные рекомендации.`
              : 'Достаточно сигналов для анализа.'
        }
      />

      <View style={styles.counter}>
        <Text style={styles.counterText}>{Math.min(currentSessionRatedCount, stream.length)} / {stream.length || effectiveMinimumRatings} оценок</Text>
      </View>

      {current ? (
        <TrainingCard
          property={current}
          match={matchPercent(current)}
          isWideLayout={isWideLayout}
          onLike={() => rate(current, 'like')}
          onDislike={() => rate(current, 'dislike')}
          onDetails={() => router.push({ pathname: '/property/[id]', params: { id: current.id, source: 'training', targetRatingCount: String(targetRatingCount) } })}
        />
      ) : hasExhaustedCurrentStream ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Вариантов больше нет.</Text>
          <Text style={styles.emptyText}>
            В районе {selectedDistrictLabel} по выбранным критериям мы показали все доступные квартиры. Можно перейти к анализу или изменить район, комнатность и этажи.
          </Text>
          <PrimaryButton title="Перейти к анализу AI" onPress={goToNextStep} />
          <PrimaryButton title="Начать новый поиск" variant="secondary" onPress={() => router.replace('/' as never)} />
          <PrimaryButton title="Вернуться к выбору района" variant="ghost" onPress={() => router.replace({ pathname: '/district', params } as never)} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Квартир пока нет.</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
          <PrimaryButton title="Вернуться к выбору района" onPress={() => router.replace({ pathname: '/district', params } as never)} />
        </View>
      )}
    </Screen>
  );
}

function TrainingCard({
  property,
  match,
  isWideLayout,
  onLike,
  onDislike,
  onDetails,
}: {
  property: Property;
  match: number;
  isWideLayout: boolean;
  onLike: () => void;
  onDislike: () => void;
  onDetails: () => void;
}) {
  const actionButtonStyle = isWideLayout ? styles.actionButtonWide : styles.actionButton;

  return (
    <View style={[styles.card, isWideLayout && styles.cardWide]}>
      <ResolvedImage uri={property.images[0]} style={[styles.image, isWideLayout && styles.imageWide]} />
      <View style={[styles.body, isWideLayout && styles.bodyWide]}>
        <View style={styles.badges}>
          <Badge label="Gold Verified" />
          <Badge label={`${match}% Match`} />
        </View>
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.meta}>
          {property.district} • {property.complexName} • {property.rooms} комн. • {property.area} м² • {property.floor}/{property.totalFloors} этаж
        </Text>
        <View style={[styles.actions, isWideLayout && styles.actionsWide]}>
          <PrimaryButton title="Нравится" onPress={onLike} style={actionButtonStyle} />
          <PrimaryButton title="Не нравится" variant="ghost" onPress={onDislike} style={actionButtonStyle} />
          <PrimaryButton title="Подробнее" variant="secondary" onPress={onDetails} style={actionButtonStyle} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  counterText: {
    color: colors.accentDark,
    fontSize: 14,
    fontWeight: '900',
  },
  card: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1180,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadows.card,
  },
  cardWide: {
    flexDirection: 'row',
    minHeight: 520,
  },
  image: {
    width: '100%',
    height: 310,
    backgroundColor: colors.surface,
  },
  imageWide: {
    width: '58%',
    height: 520,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bodyWide: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
  actionsWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: '100%',
  },
  actionButtonWide: {
    flexBasis: '31%',
    flexGrow: 1,
    width: undefined,
  },
  empty: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
});
