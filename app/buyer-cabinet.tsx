import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { formatPrice } from '@/components/BudgetSlider';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ResolvedImage } from '@/components/ResolvedImage';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getPersonalRecommendations, startTrainingSession } from '@/data/aiTrainingStore';
import {
  BuyerActionEvent,
  BuyerPropertySnapshot,
  getActiveBuyerEvents,
  getActiveBuyerPreferences,
  getLastBuyerProfile,
  pauseBuyerAutoRestore,
  removeBuyerFavorite,
  signOutBuyerProfile,
} from '@/data/buyerProfileStore';
import { Property } from '@/data/properties';
import { getBuyerPropertyById } from '@/data/propertyStore';

type CabinetItem = {
  event: BuyerActionEvent;
  property?: Property;
  snapshot: BuyerPropertySnapshot;
};

function uniqueByProperty(events: BuyerActionEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    if (!event.propertySnapshot || seen.has(event.propertyId)) return false;
    seen.add(event.propertyId);
    return true;
  });
}

function toCabinetItems(events: BuyerActionEvent[]) {
  return uniqueByProperty(events)
    .map((event) => {
      if (!event.propertySnapshot) return null;
      return {
        event,
        property: getBuyerPropertyById(event.propertyId),
        snapshot: event.propertySnapshot,
      };
    })
    .filter(Boolean) as CabinetItem[];
}

function topValue<T extends string | number>(values: T[]) {
  const counts = new Map<T, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

function floorLabel(snapshot: BuyerPropertySnapshot) {
  if (snapshot.floor === 1) return 'первый этаж';
  if (snapshot.floor === snapshot.totalFloors) return 'последний этаж';
  return 'средние этажи';
}

function aiProgress(actionCount: number) {
  if (actionCount <= 3) return 20;
  if (actionCount <= 7) return 45;
  if (actionCount <= 12) return 65;
  if (actionCount <= 20) return 82;
  return 95;
}

function buildAiInsights(events: BuyerActionEvent[]) {
  const positive = events.filter((event) => event.type === 'LIKE' || event.type === 'SAVE' || event.type === 'LONG_VIEW_DETAILS');
  const meaningful = events.filter((event) =>
    ['LIKE', 'SAVE', 'LONG_VIEW_DETAILS', 'VIEW_DETAILS', 'CALL_OWNER', 'SCHEDULE_VIEWING', 'DISLIKE'].includes(event.type),
  );
  const snapshots = positive.map((event) => event.propertySnapshot).filter(Boolean) as BuyerPropertySnapshot[];
  const weightedBudgetSamples = meaningful
    .map((event) => {
      const snapshot = event.propertySnapshot;
      if (!snapshot) return null;
      const weightMap: Record<string, number> = {
        SCHEDULE_VIEWING: 5,
        CALL_OWNER: 4,
        LIKE: 3,
        SAVE: 3,
        LONG_VIEW_DETAILS: 2,
        VIEW_DETAILS: 1,
        DISLIKE: -2,
      };
      return { price: snapshot.price, weight: weightMap[event.type] ?? 0 };
    })
    .filter(Boolean) as { price: number; weight: number }[];

  if (snapshots.length < 3) {
    return ['Пока данных мало. Оцените больше квартир, чтобы AI точнее понял ваши предпочтения.'];
  }

  const rooms = topValue(snapshots.map((snapshot) => snapshot.rooms));
  const district = topValue(snapshots.map((snapshot) => snapshot.district));
  const repair = topValue(snapshots.map((snapshot) => snapshot.repair));
  const floor = topValue(snapshots.map(floorLabel));
  const averagePrice = Math.round(snapshots.reduce((sum, snapshot) => sum + snapshot.price, 0) / snapshots.length);
  const areas = snapshots.map((snapshot) => snapshot.area).sort((a, b) => a - b);
  const minArea = areas[0];
  const maxArea = areas[areas.length - 1];
  const budgetBuckets = new Map<number, number>();

  weightedBudgetSamples.forEach((sample) => {
    const bucket = Math.floor(sample.price / 10_000_000) * 10_000_000;
    budgetBuckets.set(bucket, (budgetBuckets.get(bucket) ?? 0) + sample.weight);
  });

  const preferredBudget = meaningful.length >= 5 ? [...budgetBuckets.entries()].sort((a, b) => b[1] - a[1])[0] : null;

  return [
    rooms ? `Чаще выбираете: ${rooms}-комнатные квартиры.` : '',
    district ? `Любимый район: ${district}.` : '',
    repair ? `Предпочитаемый ремонт: ${repair}.` : '',
    floor ? `Предпочитаемые этажи: ${floor}.` : '',
    preferredBudget && preferredBudget[1] > 0
      ? `Вы чаще рассматриваете квартиры стоимостью от ${Math.round(preferredBudget[0] / 1_000_000)} до ${Math.round((preferredBudget[0] + 10_000_000) / 1_000_000)} млн ₸.`
      : `Средний бюджет: до ${formatPrice(averagePrice)}.`,
    `Любимая площадь: ${minArea}-${maxArea} м².`,
  ].filter(Boolean);
}

function openProperty(propertyId: string) {
  router.push({ pathname: '/property/[id]', params: { id: propertyId, source: 'profile' } });
}

function MiniPropertyCard({
  item,
  status,
  actionLabel,
  onAction,
}: {
  item: CabinetItem;
  status?: string;
  actionLabel?: string;
  onAction?: (propertyId: string) => void;
}) {
  const { property, snapshot } = item;
  const image = property?.images?.[0] ?? property?.imageUrl;

  return (
    <Pressable style={styles.propertyCard} onPress={() => openProperty(snapshot.propertyId)}>
      {image ? <ResolvedImage uri={image} style={styles.cardImage} /> : <View style={styles.cardImagePlaceholder} />}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{snapshot.residentialComplex}</Text>
          <Text style={styles.openArrow}>→</Text>
        </View>
        <Text style={styles.cardPrice}>{formatPrice(snapshot.price)}</Text>
        <Text style={styles.cardMeta}>
          {snapshot.rooms} комн. · {snapshot.area} м² · {snapshot.floor}/{snapshot.totalFloors} этаж
        </Text>
        <Text style={styles.cardMeta}>{snapshot.repair}</Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}
        {actionLabel && onAction ? (
          <Pressable style={styles.cardAction} onPress={() => onAction(snapshot.propertyId)}>
            <Text style={styles.cardActionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}

function PropertyCardList({
  empty,
  events,
  status,
  actionLabel,
  onAction,
}: {
  empty: string;
  events: BuyerActionEvent[];
  status?: string;
  actionLabel?: string;
  onAction?: (propertyId: string) => void;
}) {
  const items = toCabinetItems(events).slice(0, 4);

  if (!items.length) {
    return <Text style={styles.empty}>{empty}</Text>;
  }

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <MiniPropertyCard key={item.event.id} item={item} status={status} actionLabel={actionLabel} onAction={onAction} />
      ))}
    </View>
  );
}

export default function BuyerCabinetScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setRefreshKey] = useState(0);
  const profile = getLastBuyerProfile();
  const events = getActiveBuyerEvents();
  const preferences = getActiveBuyerPreferences();
  const groups = useMemo(
    () => ({
      favorites: events.filter((event) => event.type === 'LIKE' || event.type === 'SAVE'),
      savedRecommendations: events.filter((event) => event.type === 'FINAL_RECOMMENDATION'),
      views: events.filter((event) => event.type === 'VIEW_DETAILS' || event.type === 'LONG_VIEW_DETAILS'),
      viewings: events.filter((event) => event.type === 'SCHEDULE_VIEWING'),
      calls: events.filter((event) => event.type === 'CALL_OWNER'),
      insights: buildAiInsights(events),
      progress: aiProgress(events.filter((event) => event.type !== 'FINAL_RECOMMENDATION').length),
    }),
    [events],
  );

  const recommendations = useMemo(() => {
    if (preferences) startTrainingSession(preferences);
    return getPersonalRecommendations().slice(0, 3);
  }, [preferences]);

  function continueRecommendations() {
    if (preferences) startTrainingSession(preferences);
    router.push('/personal-recommendations' as never);
  }

  function changeCriteria() {
    if (preferences) startTrainingSession(preferences);
    const selectedDistricts = Array.isArray(preferences?.selectedDistricts)
      ? preferences?.selectedDistricts.join(',')
      : preferences?.selectedDistricts ?? preferences?.district;
    router.push({
      pathname: '/city',
      params: preferences
        ? {
            city: preferences.city,
            district: preferences.district,
            selectedDistricts,
            rooms: preferences.rooms,
            ...(preferences.budgetMin ? { budgetMin: String(preferences.budgetMin) } : {}),
            ...(preferences.budgetMax ? { budgetMax: String(preferences.budgetMax) } : {}),
            selectedFloorCategories: Array.isArray(preferences.selectedFloorCategories)
              ? preferences.selectedFloorCategories.join(',')
              : preferences.selectedFloorCategories,
            floorPreference: preferences.floorPreference,
          }
        : {},
    } as never);
  }

  function switchProfile() {
    signOutBuyerProfile();
    router.replace('/buyer-profile' as never);
  }

  function goMainMenu() {
    setMenuOpen(false);
    pauseBuyerAutoRestore();
    router.replace('/' as never);
  }

  function goProfile() {
    setMenuOpen(false);
  }

  function switchProfileFromMenu() {
    setMenuOpen(false);
    switchProfile();
  }

  function logoutFromMenu() {
    setMenuOpen(false);
    signOutBuyerProfile();
    router.replace('/' as never);
  }

  function removeFavorite(propertyId: string) {
    removeBuyerFavorite(propertyId);
    setRefreshKey((value) => value + 1);
  }

  if (!profile) {
    return (
      <Screen>
        <PageHeader
          eyebrow="Gold House"
          title="Мой профиль"
          subtitle="Сохраненный профиль пока не найден. Можно пройти быстрый вход или продолжить без сохранения."
        />
        <PrimaryButton title="Начать поиск" onPress={() => router.replace('/buyer-profile' as never)} />
      </Screen>
    );
  }

  return (
    <Screen>
      {menuOpen ? <Pressable style={styles.menuScrim} onPress={() => setMenuOpen(false)} /> : null}
      <View style={styles.topMenu}>
        <Pressable style={[styles.profileTrigger, menuOpen && styles.profileTriggerActive]} onPress={() => setMenuOpen((value) => !value)}>
          <Text style={styles.profileTriggerText}>👤 {profile.name} ▼</Text>
        </Pressable>
        {menuOpen ? (
          <View style={styles.profileDropdown}>
            <Pressable style={styles.menuItem} onPress={goProfile}>
              <Text style={styles.menuText}>Мой профиль</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={goMainMenu}>
              <Text style={styles.menuText}>Вернуться в главное меню</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={switchProfileFromMenu}>
              <Text style={styles.menuText}>Войти под другим номером</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={logoutFromMenu}>
              <Text style={styles.menuMutedText}>Выйти</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
      <PageHeader
        eyebrow="Gold House"
        title="Мой профиль"
        subtitle="Ваши сохраненные квартиры, история действий и выводы AI в одном месте."
      />

      <Section soft>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>👤 {profile.name}</Text>
            <Text style={styles.phone}>📞 {profile.phone}</Text>
          </View>
        </View>
      </Section>

      <Section title="🧠 AI знает ваши предпочтения">
        <Text style={styles.progressTitle}>на {groups.progress}%</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${groups.progress}%` }]} />
        </View>
        <Text style={styles.empty}>Продолжайте лайкать и просматривать квартиры — рекомендации станут точнее.</Text>
      </Section>

      <Section title="🤖 Что понял AI">
        <View style={styles.list}>
          {groups.insights.map((item) => (
            <View key={item} style={styles.insight}>
              <Text style={styles.insightDot}>•</Text>
              <Text style={styles.insightText}>{item}</Text>
            </View>
          ))}
        </View>
      </Section>

      <View style={styles.actions}>
        <PrimaryButton title="Продолжить подбор" onPress={continueRecommendations} />
        <Pressable style={styles.secondaryButton} onPress={changeCriteria}>
          <Text style={styles.secondaryText}>Изменить критерии поиска</Text>
        </Pressable>
      </View>

      <Section title={`❤️ Избранные квартиры (${toCabinetItems(groups.favorites).length})`}>
        <PropertyCardList events={groups.favorites} empty="Пока нет избранных квартир." actionLabel="Убрать из избранного" onAction={removeFavorite} />
      </Section>

      <Section title={`Мои рекомендации (${toCabinetItems(groups.savedRecommendations).length})`}>
        <PropertyCardList events={groups.savedRecommendations} empty="Сохраненные рекомендации появятся после AI-анализа." status="AI рекомендовал" />
      </Section>

      <Section title={`👀 История просмотров (${toCabinetItems(groups.views).length})`}>
        <PropertyCardList events={groups.views} empty="Просмотренные квартиры появятся здесь." />
      </Section>

      <Section title={`📅 Записи на просмотр (${toCabinetItems(groups.viewings).length})`}>
        <PropertyCardList events={groups.viewings} empty="У вас пока нет записей на просмотр." status="Запрос отправлен" />
      </Section>

      <Section title={`📞 История звонков (${toCabinetItems(groups.calls).length})`}>
        <PropertyCardList events={groups.calls} empty="Вы пока не звонили собственникам." />
      </Section>

      <Section title="🔥 Новые рекомендации для вас">
        <Text style={styles.empty}>На основе ваших лайков, просмотров и сохраненных квартир.</Text>
        <View style={styles.list}>
          {recommendations.map(({ property, score }) => (
            <Pressable key={property.id} style={styles.recommendationCard} onPress={() => openProperty(property.id)}>
              <ResolvedImage uri={property.images[0]} style={styles.recommendationImage} />
              <View style={styles.cardBody}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{property.complexName}</Text>
                  <Text style={styles.badge}>{score}% Match</Text>
                </View>
                <Text style={styles.cardPrice}>{formatPrice(property.price)}</Text>
                <Text style={styles.cardMeta}>
                  {property.rooms} комн. · {property.area} м² · {property.floor}/{property.totalFloors} этаж · {property.renovation}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  menuScrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  topMenu: {
    zIndex: 30,
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  profileTrigger: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    ...shadows.card,
  },
  profileTriggerActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  profileTriggerText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  profileDropdown: {
    position: 'absolute',
    top: 56,
    right: 0,
    width: 250,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: spacing.xs,
    ...shadows.card,
  },
  menuItem: {
    minHeight: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  menuText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  menuMutedText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  avatarText: {
    color: colors.accentDark,
    fontSize: 25,
    fontWeight: '900',
  },
  profileText: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  phone: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
  },
  progressTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  list: {
    gap: spacing.sm,
  },
  insight: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  insightDot: {
    color: colors.accentDark,
    fontSize: 18,
    fontWeight: '900',
  },
  insightText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  actions: {
    gap: spacing.md,
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  secondaryText: {
    color: colors.accentDark,
    fontSize: 15,
    fontWeight: '900',
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  logoutText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '900',
  },
  empty: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  propertyCard: {
    flexDirection: 'row',
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.sm,
    ...shadows.card,
  },
  cardImage: {
    width: 96,
    height: 112,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  cardImagePlaceholder: {
    width: 96,
    height: 112,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
  },
  cardBody: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  openArrow: {
    color: colors.accentDark,
    fontSize: 22,
    fontWeight: '900',
  },
  cardPrice: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  cardMeta: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  status: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
  },
  cardAction: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  cardActionText: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
  },
  recommendationCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    ...shadows.card,
  },
  recommendationImage: {
    width: '100%',
    height: 170,
    backgroundColor: colors.surface,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
  },
});
