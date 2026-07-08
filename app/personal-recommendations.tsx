import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { getPersonalRecommendations } from '@/data/aiTrainingStore';
import { saveFinalRecommendationSignals } from '@/data/buyerProfileStore';
import { colors, radius, shadows, spacing } from '@/constants/theme';

export default function PersonalRecommendationsScreen() {
  const recommendations = getPersonalRecommendations();

  useEffect(() => {
    saveFinalRecommendationSignals(recommendations.map(({ property }) => property.id));
  }, [recommendations]);

  return (
    <Screen>
      <PageHeader
        eyebrow="Готово"
        title="Персональные рекомендации готовы."
        subtitle="Мы учли ваши лайки, дизлайки, просмотры карточек и параметры поиска."
      />

      <View style={styles.list}>
        {recommendations.map(({ property, score, reasons }, index) => (
          <View key={property.id} style={styles.card}>
            <Image source={{ uri: property.images[0] }} style={styles.image} />
            <View style={styles.body}>
              <View style={styles.badges}>
                <Badge label={`ТОП-${index + 1}`} />
                <Badge label={`${score}% Match`} tone="green" />
              </View>
              <Text style={styles.price}>{formatPrice(property.price)}</Text>
              <Text style={styles.title}>{property.address}</Text>
              <Text style={styles.meta}>
                {property.district} · {property.rooms} комн. · {property.area} м² · {property.floor}/{property.totalFloors} этаж
              </Text>
              <View style={styles.reasonBox}>
                <Text style={styles.reasonTitle}>Почему AI рекомендует этот объект</Text>
                {reasons.map((reason) => (
                  <Text key={reason} style={styles.reason}>• {reason}</Text>
                ))}
              </View>
              <PrimaryButton title="Подробнее" onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id, source: 'personal' } })} />
            </View>
          </View>
        ))}
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
});
