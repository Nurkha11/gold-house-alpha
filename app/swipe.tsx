import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getRatedPropertyIds, getRatingCount, getTrainingStream, recordTrainingSignal, scorePropertyForTraining } from '@/data/aiTrainingStore';
import { Property } from '@/data/properties';

const minimumRatings = 10;

function matchPercent(property: Property) {
  return Math.max(78, Math.min(98, Math.round(scorePropertyForTraining(property))));
}

export default function SwipeScreen() {
  const params = useLocalSearchParams<{ selectedDistricts?: string; district?: string; rooms?: string }>();
  const [ratedIds, setRatedIds] = useState<string[]>(() => getRatedPropertyIds());
  const [ratingCount, setRatingCount] = useState(() => getRatingCount());

  const stream = useMemo(() => getTrainingStream(minimumRatings), []);
  const currentIndex = Math.min(ratedIds.length, stream.length - 1);
  const current = stream[currentIndex];
  const remaining = Math.max(minimumRatings - ratingCount, 0);
  const selectedDistricts = String(params.selectedDistricts ?? params.district ?? '')
    .split(',')
    .map((district) => district.trim())
    .filter(Boolean);
  const emptyText =
    selectedDistricts.length === 1 && selectedDistricts[0] === 'Бостандыкский' && params.rooms === '2'
      ? 'В Бостандыкском районе пока нет двухкомнатных квартир по выбранным критериям. Попробуйте выбрать другой район или изменить комнатность.'
      : 'Попробуйте выбрать другой район, комнатность или предпочтение по этажу.';

  function rate(property: Property, type: 'like' | 'dislike') {
    recordTrainingSignal(property.id, type);
    const nextCount = ratingCount + 1;
    setRatingCount(nextCount);
    setRatedIds((ids) => [...ids, property.id]);

    if (nextCount >= minimumRatings) {
      router.replace({ pathname: '/ai-analysis', params } as never);
    }
  }

  return (
    <Screen>
      <OnboardingProgress step={8} total={8} />
      <PageHeader
        eyebrow="AI изучает вкус"
        title="Оцените несколько квартир."
        subtitle={remaining > 0 ? `Осталось оценить: ${remaining}. После этого AI соберет персональные рекомендации.` : 'Достаточно сигналов для анализа.'}
      />

      <View style={styles.counter}>
        <Text style={styles.counterText}>{Math.min(ratingCount, minimumRatings)} / {minimumRatings} оценок</Text>
      </View>

      {current ? (
        <TrainingCard
          property={current}
          match={matchPercent(current)}
          onLike={() => rate(current, 'like')}
          onDislike={() => rate(current, 'dislike')}
          onDetails={() => router.push({ pathname: '/property/[id]', params: { id: current.id, source: 'training' } })}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>По этим фильтрам нет квартир.</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
          <PrimaryButton title="Изменить фильтры" onPress={() => router.replace('/district' as never)} />
        </View>
      )}
    </Screen>
  );
}

function TrainingCard({
  property,
  match,
  onLike,
  onDislike,
  onDetails,
}: {
  property: Property;
  match: number;
  onLike: () => void;
  onDislike: () => void;
  onDetails: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: property.images[0] }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.badges}>
          <Badge label="Gold Verified" />
          <Badge label={`${match}% Match`} />
        </View>
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.meta}>
          {property.district} • {property.complexName} • {property.rooms} комн. • {property.area} м² • {property.floor}/{property.totalFloors} этаж
        </Text>
        <View style={styles.actions}>
          <PrimaryButton title="Нравится" onPress={onLike} style={styles.actionButton} />
          <PrimaryButton title="Не нравится" variant="ghost" onPress={onDislike} style={styles.actionButton} />
          <PrimaryButton title="Подробнее" variant="secondary" onPress={onDetails} style={styles.actionButton} />
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
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadows.card,
  },
  image: {
    width: '100%',
    height: 310,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
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
  actionButton: {
    width: '100%',
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
