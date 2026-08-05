import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ResolvedImage } from '@/components/ResolvedImage';
import { Screen } from '@/components/Screen';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getPersonalRecommendations, getTrainingSignals } from '@/data/aiTrainingStore';
import { saveFinalRecommendationSignals } from '@/data/buyerProfileStore';

const recommendationPageSize = 3;
const recommendationPoolSize = 12;

export default function PersonalRecommendationsScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const [page, setPage] = useState(0);
  const recommendations = useMemo(() => getPersonalRecommendations(recommendationPoolSize), []);
  const likeCount = getTrainingSignals().filter((signal) => signal.type === 'like').length;
  const shouldShowRecommendations = likeCount > 0;
  const visibleRecommendations = recommendations.slice(
    page * recommendationPageSize,
    page * recommendationPageSize + recommendationPageSize,
  );
  const hasMoreRecommendations = shouldShowRecommendations && recommendations.length > (page + 1) * recommendationPageSize;

  useEffect(() => {
    if (shouldShowRecommendations) {
      saveFinalRecommendationSignals(visibleRecommendations.map(({ property }) => property.id));
    }
  }, [shouldShowRecommendations, visibleRecommendations]);

  function showMoreRecommendations() {
    if (hasMoreRecommendations) {
      setPage((currentPage) => currentPage + 1);
      return;
    }

    continueTraining();
  }

  function continueTraining() {
    router.replace({
      pathname: '/swipe',
      params: { ...params, trainingMode: 'continue' },
    } as never);
  }

  function startNewSearch() {
    router.replace('/city' as never);
  }

  return (
    <Screen>
      <PageHeader
        eyebrow={shouldShowRecommendations ? 'Готово' : 'Нужны еще сигналы'}
        title={shouldShowRecommendations ? 'Персональные рекомендации готовы.' : 'Пока рано предлагать TOP-квартиры.'}
        subtitle={
          shouldShowRecommendations
            ? 'Мы учли ваши лайки, дизлайки, просмотры карточек и параметры поиска.'
            : 'Вы не отметили ни одну квартиру как понравившуюся, поэтому AI не будет делать вид, что уже понял ваш вкус.'
        }
      />

      {shouldShowRecommendations ? (
        <View style={styles.list}>
          {visibleRecommendations.map(({ property, score, reasons }, index) => (
            <View key={property.id} style={styles.card}>
              <ResolvedImage uri={property.images[0]} style={styles.image} />
              <View style={styles.body}>
                <View style={styles.badges}>
                  <Badge label={`ТОП-${page * recommendationPageSize + index + 1}`} />
                  <Badge label={`${score}% Match`} />
                </View>
                <Text style={styles.price}>{formatPrice(property.price)}</Text>
                <Text style={styles.title}>{property.title}</Text>
                <Text style={styles.meta}>
                  {property.district} • {property.complexName} • {property.rooms} комн. • {property.area} м² • {property.floor}/{property.totalFloors} этаж
                </Text>
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonTitle}>Почему AI рекомендует этот объект</Text>
                  {reasons.map((reason) => (
                    <Text key={reason} style={styles.reason}>• {reason}</Text>
                  ))}
                </View>
                <PrimaryButton
                  title="Подробнее"
                  onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id, source: 'personal' } })}
                />
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.nextStepCard}>
        <Badge label="Gold House AI" />
        <Text style={styles.nextStepTitle}>Не нашли подходящий вариант?</Text>
        <Text style={styles.nextStepText}>
          {shouldShowRecommendations
            ? 'Можно посмотреть следующие рекомендации, продолжить обучение AI на этих же критериях или начать новый поиск и поправить район, бюджет, комнатность или этажи.'
            : 'Вы отклонили все первые варианты. Лучше продолжить обучение AI или начать новый поиск, чем показывать случайные TOP-квартиры.'}
        </Text>
        <View style={styles.nextStepActions}>
          {shouldShowRecommendations ? (
            <PrimaryButton
              title={hasMoreRecommendations ? 'Показать еще варианты' : 'Показать еще через обучение AI'}
              onPress={showMoreRecommendations}
            />
          ) : null}
          <PrimaryButton
            title="Продолжить обучение AI"
            variant={shouldShowRecommendations ? 'secondary' : 'primary'}
            onPress={continueTraining}
          />
          <PrimaryButton
            title="Начать новый поиск"
            variant="ghost"
            onPress={startNewSearch}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
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
    height: 260,
    backgroundColor: colors.surface,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  reasonBox: {
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    padding: spacing.md,
    gap: spacing.xs,
  },
  reasonTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  reason: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  nextStepCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    gap: spacing.md,
    ...shadows.card,
  },
  nextStepTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  nextStepText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  nextStepActions: {
    gap: spacing.sm,
  },
});
