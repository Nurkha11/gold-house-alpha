import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { isAdminAuthenticated, verifyAdminPin } from '@/data/adminStore';
import { getAllSubmissions, statusLabels } from '@/data/ownerStore';
import { PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';

const statusOrder: SubmissionStatus[] = ['submitted', 'reviewing', 'needs_shooting', 'approved', 'published', 'rejected'];

export default function AdminScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const submissions = useMemo(() => getAllSubmissions(), [authenticated]);

  function unlock() {
    if (verifyAdminPin(pin)) {
      setAuthenticated(true);
      setError('');
      return;
    }

    setError('Неверный PIN-код');
  }

  if (!authenticated) {
    return (
      <Screen>
        <View style={styles.pinScreen}>
          <Text style={styles.brand}>Gold Admin</Text>
          <Text style={styles.pinTitle}>Скрытый кабинет администратора</Text>
          <Text style={styles.pinText}>Введите PIN-код владельца, чтобы открыть заявки собственников.</Text>
          <TextInput value={pin} onChangeText={setPin} keyboardType="number-pad" secureTextEntry placeholder="PIN" placeholderTextColor={colors.muted} style={styles.pinInput} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton title="Войти" onPress={unlock} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Gold Admin"
        title="Панель администратора"
        subtitle="Заявки собственников, проверка объекта, съемка, одобрение и публикация в каталог покупателей."
      />

      <View style={styles.stats}>
        {statusOrder.map((status) => (
          <View key={status} style={styles.statCard}>
            <Text style={styles.statNumber}>{submissions.filter((item) => item.status === status).length}</Text>
            <Text style={styles.statLabel}>{statusLabels[status]}</Text>
          </View>
        ))}
      </View>

      <Section title="Все заявки" soft>
        <View style={styles.list}>
          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </View>
      </Section>
    </Screen>
  );
}

function SubmissionCard({ submission }: { submission: PropertySubmission }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/admin-submission', params: { id: submission.id } } as never)}>
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <Text style={styles.id}>{submission.id}</Text>
          <Text style={styles.title}>{submission.address.complexName || submission.address.street || 'Новая квартира'}</Text>
          <Text style={styles.meta}>{new Date(submission.createdAt).toLocaleDateString('ru-RU')} · {submission.ownerName} · {submission.ownerPhone}</Text>
        </View>
        <OwnerStatusBadge status={submission.status} />
      </View>

      <View style={styles.facts}>
        <Text style={styles.fact}>{submission.address.district}</Text>
        <Text style={styles.fact}>{submission.characteristics.rooms} комн.</Text>
        <Text style={styles.fact}>{submission.characteristics.totalArea || '-'} м²</Text>
        <Text style={styles.fact}>{submission.characteristics.floor || '-'}/{submission.characteristics.totalFloors || '-'} этаж</Text>
      </View>

      <Text style={styles.price}>{submission.priceTerms.price ? `${Number(submission.priceTerms.price).toLocaleString('ru-RU')} ₸` : 'Цена не указана'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pinScreen: {
    minHeight: 560,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  brand: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  pinTitle: {
    color: colors.text,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '900',
  },
  pinText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  pinInput: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    paddingHorizontal: spacing.md,
  },
  error: {
    color: '#8B3528',
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '47%',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    ...shadows.card,
  },
  statNumber: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  cardText: {
    flex: 1,
  },
  id: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  fact: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  price: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
});
