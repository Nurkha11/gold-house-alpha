import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ResolvedImage } from '@/components/ResolvedImage';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { isAdminAuthenticated, verifyAdminPin } from '@/data/adminStore';
import { createLocalMediaReference } from '@/data/localMediaStore';
import { getAllSubmissions, normalizeSubmissionStatus, statusLabels } from '@/data/ownerStore';
import { PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';

const statusOrder: SubmissionStatus[] = ['pending_moderation', 'changes_requested', 'published', 'rejected'];
type AdminTab = SubmissionStatus | 'all';

const adminTabs: Array<{ key: AdminTab; label: string }> = [
  { key: 'pending_moderation', label: 'На модерации' },
  { key: 'changes_requested', label: 'Нужно исправление' },
  { key: 'published', label: 'Опубликовано' },
  { key: 'rejected', label: 'Отклонено' },
  { key: 'all', label: 'Все заявки' },
];

function normalizeAdminTab(tab?: string): AdminTab {
  return tab === 'pending_moderation' || tab === 'changes_requested' || tab === 'published' || tab === 'rejected' || tab === 'all'
    ? tab
    : 'pending_moderation';
}

export default function AdminScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(() => isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState<AdminTab>(() => normalizeAdminTab(tab));
  const [submissions, setSubmissions] = useState(() => getAllSubmissions());
  const visibleSubmissions =
    activeTab === 'all' ? submissions : submissions.filter((item) => normalizeSubmissionStatus(item.status) === activeTab);

  function countByTab(tab: AdminTab) {
    return tab === 'all' ? submissions.length : submissions.filter((item) => normalizeSubmissionStatus(item.status) === tab).length;
  }

  useEffect(() => {
    if (!authenticated) {
      return undefined;
    }

    setSubmissions(getAllSubmissions());
    const timer = setInterval(() => setSubmissions(getAllSubmissions()), 1000);
    return () => clearInterval(timer);
  }, [authenticated]);

  useEffect(() => {
    setActiveTab(normalizeAdminTab(tab));
  }, [tab]);

  function unlock() {
    if (verifyAdminPin(pin)) {
      setAuthenticated(true);
      setSubmissions(getAllSubmissions());
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
          <Pressable key={status} style={styles.statCard} onPress={() => setActiveTab(status)}>
            <Text style={styles.statNumber}>{submissions.filter((item) => normalizeSubmissionStatus(item.status) === status).length}</Text>
            <Text style={styles.statLabel}>{statusLabels[status]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.tabs}>
        {adminTabs.map((tab) => {
          const selected = activeTab === tab.key;

          return (
            <Pressable key={tab.key} style={[styles.tab, selected && styles.tabSelected]} onPress={() => setActiveTab(tab.key)}>
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{tab.label}</Text>
              <Text style={[styles.tabCount, selected && styles.tabCountSelected]}>{countByTab(tab.key)}</Text>
            </Pressable>
          );
        })}
      </View>

      <Section title={adminTabs.find((tab) => tab.key === activeTab)?.label ?? 'Заявки'} soft>
        <View style={styles.list}>
          {visibleSubmissions.length ? (
            visibleSubmissions.map((submission) => <SubmissionCard key={submission.id} submission={submission} />)
          ) : (
            <Text style={styles.emptyText}>{activeTab === 'pending_moderation' ? 'Новых заявок пока нет.' : 'В этой категории пока пусто.'}</Text>
          )}
        </View>
      </Section>
    </Screen>
  );
}

function SubmissionCard({ submission }: { submission: PropertySubmission }) {
  const cover =
    submission.media.find((file) => file.type === 'photo' && file.category === 'apartment' && file.isCover && file.uploadStatus !== 'error') ??
    submission.media.find((file) => file.type === 'photo' && file.category === 'apartment' && file.uploadStatus !== 'error') ??
    submission.media.find((file) => file.type === 'photo' && file.uploadStatus !== 'error');
  const photoUri = cover?.remoteUrl || cover?.localUri || cover?.uri || (cover?.id ? createLocalMediaReference(cover.id) : undefined);
  const photoCount = submission.media.filter((file) => file.type === 'photo' && file.uploadStatus !== 'error').length;
  const videoCount = submission.media.filter((file) => file.type === 'video' && file.uploadStatus !== 'error').length;

  return (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: '/admin-submission', params: { id: submission.id } } as never)}>
      <View style={styles.cardTop}>
        {photoUri ? <ResolvedImage uri={photoUri} style={styles.cardImage} /> : <View style={styles.cardImagePlaceholder}><Text style={styles.cardImageText}>GH</Text></View>}
        <View style={styles.cardText}>
          <Text style={styles.id}>{submission.id}</Text>
          <Text style={styles.title}>{submission.address.complexName || submission.address.street || 'Новая квартира'}</Text>
          <Text style={styles.meta}>{new Date(submission.createdAt).toLocaleDateString('ru-RU')} · {submission.ownerName} · {submission.ownerPhone}</Text>
          <Text style={styles.meta}>{photoCount} фото · {videoCount} видео</Text>
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
      <PrimaryButton title="Открыть заявку" variant="secondary" onPress={() => router.push({ pathname: '/admin-submission', params: { id: submission.id } } as never)} />
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
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tabSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  tabText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  tabTextSelected: {
    color: colors.accentDark,
  },
  tabCount: {
    minWidth: 28,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },
  tabCountSelected: {
    backgroundColor: colors.card,
    color: colors.accentDark,
  },
  list: {
    gap: spacing.md,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
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
  cardImage: {
    width: 96,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  cardImagePlaceholder: {
    width: 96,
    height: 76,
    borderRadius: radius.md,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageText: {
    color: colors.accentSoft,
    fontSize: 18,
    fontWeight: '900',
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
