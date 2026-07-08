import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, spacing } from '@/constants/theme';
import { getCurrentOwner, getOwnerSubmissions } from '@/data/ownerStore';

export default function OwnerDashboardScreen() {
  const owner = getCurrentOwner();
  const submissions = useMemo(() => getOwnerSubmissions(owner?.id), [owner?.id]);

  return (
    <Screen>
      <PageHeader
        eyebrow="Gold House Owner"
        title={`Здравствуйте${owner?.name ? `, ${owner.name}` : ''}`}
        subtitle="Здесь можно подать квартиру на проверку, следить за статусом заявки и готовить объект к публикации."
      />

      <PrimaryButton title="Подать объявление" onPress={() => router.push('/owner-submission' as never)} />

      <Section title="Мои заявки" soft>
        {submissions.map((submission) => (
          <Pressable key={submission.id} style={styles.submissionCard}>
            <View style={styles.cardTop}>
              <View style={styles.cardText}>
                <Text style={styles.title}>{submission.address.complexName || submission.address.street || 'Новая квартира'}</Text>
                <Text style={styles.meta}>
                  {submission.address.city}, {submission.address.district} · {submission.characteristics.rooms || '-'} комн. · {submission.characteristics.totalArea || '-'} м²
                </Text>
              </View>
              <OwnerStatusBadge status={submission.status} />
            </View>
            <Text style={styles.price}>
              {submission.priceTerms.price ? `${Number(submission.priceTerms.price).toLocaleString('ru-RU')} ₸` : 'Цена не указана'}
            </Text>
          </Pressable>
        ))}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  submissionCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  price: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
});
