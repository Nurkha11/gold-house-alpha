import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, spacing } from '@/constants/theme';
import { deleteOwnerSubmission, getCurrentOwner, getOwnerSubmissions } from '@/data/ownerStore';

export default function OwnerDashboardScreen() {
  const owner = getCurrentOwner();
  const [submissions, setSubmissions] = useState(() => getOwnerSubmissions(owner?.id));
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  function refreshSubmissions() {
    setSubmissions(getOwnerSubmissions(owner?.id));
  }

  useEffect(() => {
    refreshSubmissions();
    const timer = setInterval(refreshSubmissions, 1000);
    return () => clearInterval(timer);
  }, [owner?.id]);

  function handleDeleteSubmission(id: string) {
    const deleted = deleteOwnerSubmission(id, owner?.id);
    if (deleted) {
      setDeleteCandidateId(null);
      refreshSubmissions();
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Gold House Owner"
        title={`Здравствуйте${owner?.name ? `, ${owner.name}` : ''}`}
        subtitle="Здесь можно подать квартиру на проверку, следить за статусом заявки и готовить объект к публикации."
      />

      <PrimaryButton title="Подать объявление" onPress={() => router.push('/owner-submission' as never)} />

      <Section title="Мои заявки" soft>
        {submissions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Заявок пока нет</Text>
            <Text style={styles.emptyText}>Подайте объявление, и оно появится здесь со статусом модерации.</Text>
          </View>
        ) : null}
        {submissions.map((submission) => (
          <View
            key={submission.id}
            style={styles.submissionCard}
          >
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
            {submission.adminComment ? (
              <View style={styles.commentBox}>
                <Text style={styles.commentTitle}>Комментарий Gold House</Text>
                <Text style={styles.commentText}>{submission.adminComment}</Text>
              </View>
            ) : null}
            {submission.status === 'changes_requested' ? (
              <PrimaryButton title="Исправить и отправить снова" variant="secondary" onPress={() => router.push({ pathname: '/owner-submission', params: { id: submission.id } } as never)} />
            ) : null}
            <View style={styles.actionRow}>
              <PrimaryButton
                title="Открыть"
                variant="secondary"
                style={styles.actionButton}
                onPress={() => router.push({ pathname: '/owner-submission', params: { id: submission.id } } as never)}
              />
              {deleteCandidateId === submission.id ? (
                <>
                  <PrimaryButton title="Отмена" variant="ghost" style={styles.actionButton} onPress={() => setDeleteCandidateId(null)} />
                  <PrimaryButton title="Точно удалить" style={styles.actionButton} onPress={() => handleDeleteSubmission(submission.id)} />
                </>
              ) : (
                <PrimaryButton title="Удалить" variant="ghost" style={styles.actionButton} onPress={() => setDeleteCandidateId(submission.id)} />
              )}
            </View>
            {submission.status === 'published' ? (
              <PrimaryButton
                title="Посмотреть как покупатель"
                variant="secondary"
                onPress={() => router.push({ pathname: '/property/[id]', params: { id: `published-${submission.id}` } } as never)}
              />
            ) : null}
          </View>
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
  emptyCard: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
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
  commentBox: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  commentTitle: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  commentText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButton: {
    flexGrow: 1,
  },
});
