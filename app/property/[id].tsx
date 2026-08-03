import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { PrimaryButton } from '@/components/PrimaryButton';
import PropertyMap from '@/components/PropertyMap';
import { ResolvedImage } from '@/components/ResolvedImage';
import { Screen } from '@/components/Screen';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getBalconyLabel, normalizeBalconyType } from '@/data/balconyTypes';
import { getElevatorLabel } from '@/data/elevatorTypes';
import { getParkingLabel } from '@/data/parkingTypes';
import { getRatingCount, recordTrainingSignal } from '@/data/aiTrainingStore';
import { getLocalMediaReferenceId, loadLocalMediaBlobUrl } from '@/data/localMediaStore';
import { Property, properties } from '@/data/properties';
import { getBuyerProperties, getBuyerPropertyById } from '@/data/propertyStore';
import { getSelectedDistricts } from '@/data/aiTrainingStore';

const fallbackOwnerPhone = '+7 777 245 88 11';
const viewingDates = ['Сегодня', 'Завтра', 'В выходные'];
const viewingTimes = ['12:00', '15:30', '18:30', '20:00'];

function similarTo(property: Property) {
  const selectedDistricts = getSelectedDistricts();
  const districtScope = selectedDistricts.includes(property.district) ? selectedDistricts : [property.district];

  return getBuyerProperties()
    .filter((item) => item.id !== property.id)
    .filter((item) => districtScope.includes(item.district))
    .map((item) => ({
      item,
      score:
        (item.district === property.district ? 3 : 0) +
        (item.complexName === property.complexName ? 3 : 0) +
        (Math.abs(item.price - property.price) <= 3_000_000 ? 2 : 0) +
        (Math.abs(item.area - property.area) <= 4 ? 2 : 0) +
        (item.rooms === property.rooms ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ item }) => item);
}

function cleanText(value?: string) {
  const text = String(value ?? '').trim();
  if (!text || /test|тест|алгоритм|scoring|price\/area/i.test(text)) {
    return 'Светлая квартира в Наурызбайском районе с понятными характеристиками и честным описанием. Подойдет для первого жилья, спокойной жизни или покупки под ремонт, если вы хотите настроить пространство под себя.';
  }
  return text;
}

function useResolvedMediaUris(uris: string[]) {
  const [resolvedUris, setResolvedUris] = useState(uris);

  useEffect(() => {
    let mounted = true;
    const objectUrls: string[] = [];

    async function resolveUris() {
      const resolved = await Promise.all(
        uris.map(async (uri) => {
          const mediaId = getLocalMediaReferenceId(uri);
          if (!mediaId) {
            return uri;
          }

          const blobUrl = await loadLocalMediaBlobUrl(mediaId).catch(() => null);
          if (blobUrl) {
            objectUrls.push(blobUrl);
          }

          return blobUrl ?? uri;
        }),
      );

      if (mounted) {
        setResolvedUris(resolved);
      }
    }

    resolveUris();

    return () => {
      mounted = false;
      if (typeof URL !== 'undefined') {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    };
  }, [uris.join('|')]);

  return resolvedUris;
}

export default function PropertyDetailsScreen() {
  const { id, source, targetRatingCount } = useLocalSearchParams<{ id: string; source?: string; targetRatingCount?: string }>();
  const { width } = useWindowDimensions();
  const isWideLayout = width >= 900;
  const property = getBuyerPropertyById(id) ?? getBuyerProperties()[0] ?? properties[0];
  const gallery = property.images?.length ? property.images : [property.imageUrl];
  const resolvedGallery = useResolvedMediaUris(gallery);
  const videoUris = property.videos.map((video) => video.uri).filter((uri): uri is string => Boolean(uri));
  const resolvedVideoUris = useResolvedMediaUris(videoUris);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewingVisible, setViewingVisible] = useState(false);
  const [viewingSent, setViewingSent] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Завтра');
  const [selectedTime, setSelectedTime] = useState('18:30');
  const openedAt = useRef(Date.now());
  const similar = useMemo(() => similarTo(property), [property]);
  const activePhoto = resolvedGallery[photoIndex] ?? gallery[photoIndex];
  const resolvedVideoByUri = useMemo(() => {
    const map = new Map<string, string>();
    videoUris.forEach((uri, index) => {
      map.set(uri, resolvedVideoUris[index] ?? uri);
    });
    return map;
  }, [resolvedVideoUris, videoUris.join('|')]);
  const detailVideoHeight = isWideLayout ? 292 : 190;

  useEffect(() => {
    recordTrainingSignal(property.id, 'detail_view');

    return () => {
      recordTrainingSignal(property.id, 'long_detail_view', Date.now() - openedAt.current);
    };
  }, [property.id]);

  const nextPhoto = () => setPhotoIndex((value) => (value + 1) % gallery.length);
  const prevPhoto = () => setPhotoIndex((value) => (value - 1 + gallery.length) % gallery.length);

  function confirmViewing() {
    recordTrainingSignal(property.id, 'viewing_request');
    setViewingSent(true);
  }

  function callOwner() {
    recordTrainingSignal(property.id, 'owner_call');
    Linking.openURL(`tel:${(property.ownerPhone ?? fallbackOwnerPhone).replace(/\s/g, '')}`);
  }

  function rateFromDetails(type: 'like' | 'dislike') {
    recordTrainingSignal(property.id, type);
    const trainingTarget = targetRatingCount ? Number(targetRatingCount) : 5;

    if (source === 'training' && getRatingCount() >= trainingTarget) {
      router.replace('/ai-analysis' as never);
      return;
    }
    if (source === 'training') {
      router.replace({ pathname: '/swipe', params: { trainingMode: 'continue', targetRatingCount: String(trainingTarget) } } as never);
      return;
    }
    router.back();
  }

  return (
    <Screen scroll={false}>
      <ScrollView
        style={styles.scroller}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isWideLayout && styles.scrollContentWide]}
      >
      <View style={[styles.galleryWrap, isWideLayout && styles.galleryWrapWide]}>
        <ResolvedImage uri={activePhoto} style={[styles.hero, isWideLayout && styles.heroWide]} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.topControls}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Text style={styles.iconText}>‹</Text>
          </Pressable>
          <View style={styles.topRight}>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconText}>♡</Text>
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconText}>↗</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.heroBadges}>
          <Badge label="Gold Verified" />
          <View style={styles.photoCounter}>
            <Text style={styles.photoCounterText}>{photoIndex + 1} / 24</Text>
          </View>
        </View>
        <View style={[styles.galleryNav, isWideLayout && styles.galleryNavWide]}>
          <Pressable style={styles.galleryPill} onPress={prevPhoto}>
            <Text style={styles.galleryPillText}>‹</Text>
          </Pressable>
          <Pressable style={styles.galleryPill} onPress={nextPhoto}>
            <Text style={styles.galleryPillText}>›</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
        <Text style={styles.address}>{property.city}, {property.district}</Text>
        <Text style={styles.title}>{property.complexName}</Text>
        <Text style={styles.meta}>{property.address}</Text>
      </View>

      <View style={styles.quickGrid}>
        <QuickFact label="Комнаты" value={`${property.rooms}`} />
        <QuickFact label="Площадь" value={`${property.area} м²`} />
        <QuickFact label="Этаж" value={`${property.floor}/${property.totalFloors}`} />
        <QuickFact label="Год" value={String(property.year)} />
        <QuickFact label="Потолки" value={`${property.ceilingHeight} м`} />
        <QuickFact label="Ремонт" value={property.renovation} />
        <QuickFact label="Балкон / лоджия" value={getBalconyLabel(normalizeBalconyType(property.balconyType, property.balcony))} />
        <QuickFact label="Лифт" value={getElevatorLabel(property)} />
        <QuickFact label="Парковка" value={getParkingLabel(property)} />
      </View>

      <View style={styles.recommendCard}>
        <View style={styles.blockTitleRow}>
          <Text style={styles.blockTitle}>Почему мы рекомендуем эту квартиру?</Text>
          <Text style={styles.infoIcon}>i</Text>
        </View>
        <Text style={styles.matchText}>
          Подходит вам на <Text style={styles.matchPercent}>{property.matchPercent}%</Text>
        </Text>
        {['Подходит под бюджет', 'Подходит по этажу', 'Нравится такой ремонт', 'Похожа на квартиры, которые вы лайкнули'].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Text style={styles.goldCheck}>✓</Text>
            <Text style={styles.reason}>{item}</Text>
          </View>
        ))}
        <Text style={styles.smallNote}>На основе ваших предпочтений и истории просмотров</Text>
      </View>

      <InfoBlock title="Индекс доверия" header="98 из 100" items={['Фото актуальны', 'Видео актуально', 'Собственник подтвержден', 'Геолокация подтверждена', 'Документы проверены']} />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Видео и фото</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videoRow}>
          {['Квартира', 'Подъезд', 'Двор', 'Собственник'].map((label, index) => (
            <View key={label} style={[styles.videoCard, property.videos[index]?.uri && styles.videoPlayerCard, property.videos[index]?.uri && isWideLayout && styles.videoPlayerCardWide]}>
              {property.videos[index]?.uri && Platform.OS === 'web'
                ? React.createElement('video', {
                    src: resolvedVideoByUri.get(property.videos[index]?.uri ?? '') ?? property.videos[index]?.remoteUrl ?? property.videos[index]?.uri,
                    controls: true,
                    preload: 'metadata',
                    style: {
                      width: '100%',
                      height: detailVideoHeight,
                      borderRadius: 14,
                      backgroundColor: colors.black,
                      objectFit: 'contain',
                    },
                  })
                : null}
              <Text style={styles.play}>▶</Text>
              <Text style={styles.videoLabel}>{property.videos[index]?.label ?? label}</Text>
              <Text style={styles.videoDuration}>{property.videos[index]?.duration ?? '0:40'}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <InfoBlock title="Цифровой паспорт" items={['Документы проверены', 'Геолокация подтверждена', 'Фото соответствуют', 'Видео актуально']} />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Описание</Text>
        <Text style={styles.description}>{cleanText(property.description)}</Text>
        <View style={styles.tags}>
          {property.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} label={tag} tone="neutral" />
          ))}
        </View>
      </View>

      <InfoBlock title="Плюсы" items={property.pros.slice(0, 5)} />
      <InfoBlock title="Минусы" items={property.cons.slice(0, 5)} muted />

      <View style={styles.block}>
        <Text style={styles.blockTitle}>На карте</Text>
        {property.coordinates ? (
          <PropertyMap center={property.coordinates} zoom={16} height={220} />
        ) : (
          <View style={styles.mapMock}>
            <View style={styles.pin} />
            <Text style={styles.mapTitle}>{property.complexName}</Text>
            <Text style={styles.mapText}>{property.locationText}</Text>
          </View>
        )}
        <Pressable
          style={styles.mapButton}
          onPress={() => {
            if (!property.coordinates) return;
            const { lat, lng } = property.coordinates;
            Linking.openURL(`https://yandex.ru/maps/?ll=${lng}%2C${lat}&z=16&pt=${lng},${lat}`);
          }}
        >
          <Text style={styles.mapButtonText}>↗ Открыть в картах</Text>
        </Pressable>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Похожие квартиры</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
          {similar.map((item) => (
            <Pressable key={item.id} style={styles.similarCard} onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}>
              <ResolvedImage uri={item.images[0]} style={styles.similarImage} />
              <View style={styles.similarBody}>
                <View style={styles.similarTop}>
                  <Text style={styles.similarPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.saveSmall}>♡</Text>
                </View>
                <Text style={styles.similarMeta}>{item.rooms} комн. • {item.area} м²</Text>
                <Text style={styles.similarMeta}>{item.district} • {item.floor}/{item.totalFloors} этаж</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.bottomSpacer} />
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.actionRow}>
          <Pressable style={styles.saveButton} onPress={() => recordTrainingSignal(property.id, 'save')}>
            <Text style={styles.saveButtonText}>♡ Сохранить</Text>
          </Pressable>
          <Pressable style={styles.callButton} onPress={callOwner}>
            <Text style={styles.saveButtonText}>Позвонить</Text>
          </Pressable>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.likeButton} onPress={() => rateFromDetails('like')}>
            <Text style={styles.likeButtonText}>Нравится</Text>
          </Pressable>
          <Pressable style={styles.dislikeButton} onPress={() => rateFromDetails('dislike')}>
            <Text style={styles.dislikeButtonText}>Не нравится</Text>
          </Pressable>
        </View>
        <Pressable style={styles.goldButton} onPress={() => setViewingVisible(true)}>
          <Text style={styles.goldButtonText}>Хочу посмотреть</Text>
          <Text style={styles.bottomHint}>Выбрать дату и время</Text>
        </Pressable>
      </View>

      <Modal transparent visible={viewingVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {viewingSent ? (
              <>
                <Text style={styles.modalTitle}>Запрос на просмотр отправлен собственнику.</Text>
                <Text style={styles.modalText}>Мы передали выбранное время: {selectedDate}, {selectedTime}. Собственник или менеджер свяжется с вами для подтверждения.</Text>
                <PrimaryButton title="Готово" onPress={() => setViewingVisible(false)} />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Выберите дату и время</Text>
                <Text style={styles.modalText}>Собственник получит запрос и подтвердит возможность просмотра.</Text>
                <View style={styles.optionRow}>
                  {viewingDates.map((date) => (
                    <PrimaryButton key={date} title={date} variant={selectedDate === date ? 'primary' : 'ghost'} onPress={() => setSelectedDate(date)} style={styles.modalOption} />
                  ))}
                </View>
                <View style={styles.optionRow}>
                  {viewingTimes.map((time) => (
                    <PrimaryButton key={time} title={time} variant={selectedTime === time ? 'primary' : 'ghost'} onPress={() => setSelectedTime(time)} style={styles.modalOption} />
                  ))}
                </View>
                <PrimaryButton title="Подтвердить запрос" onPress={confirmViewing} />
                <PrimaryButton title="Позвонить собственнику" variant="secondary" onPress={callOwner} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.quickFact}>
      <Text style={styles.quickLabel}>{label}</Text>
      <Text style={styles.quickValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function InfoBlock({ title, header, items, muted = false }: { title: string; header?: string; items: string[]; muted?: boolean }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {header ? <Text style={styles.blockHeader}>{header}</Text> : null}
      <View style={styles.itemList}>
        {items.map((item) => (
          <View key={item} style={styles.checkRow}>
            <Text style={styles.goldCheck}>✓</Text>
            <Text style={[styles.reason, muted && styles.mutedReason]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroller: { flex: 1 },
  scrollContent: { paddingBottom: 260 },
  scrollContentWide: { width: '100%', maxWidth: 1180, alignSelf: 'center' },
  galleryWrap: { position: 'relative', marginHorizontal: -spacing.lg, marginTop: -spacing.lg, marginBottom: spacing.lg, overflow: 'hidden' },
  galleryWrapWide: { marginHorizontal: 0, borderRadius: radius.xl },
  hero: { width: '100%', height: 430, backgroundColor: colors.surface },
  heroWide: { height: 620 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(13,13,13,0.08)' },
  topControls: { position: 'absolute', top: spacing.lg, left: spacing.lg, right: spacing.lg, flexDirection: 'row', justifyContent: 'space-between' },
  topRight: { flexDirection: 'row', gap: spacing.sm },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  iconText: { color: colors.text, fontSize: 24, fontWeight: '900' },
  heroBadges: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photoCounter: { borderRadius: radius.sm, backgroundColor: 'rgba(13,13,13,0.72)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  photoCounterText: { color: colors.background, fontWeight: '900' },
  galleryNav: { position: 'absolute', right: spacing.lg, top: 210, gap: spacing.sm },
  galleryNavWide: { top: 300 },
  galleryPill: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  galleryPillText: { color: colors.text, fontSize: 24, fontWeight: '900' },
  mainInfo: { gap: spacing.xs, marginBottom: spacing.lg },
  price: { color: colors.text, fontSize: 38, lineHeight: 44, fontWeight: '900' },
  address: { color: colors.muted, fontSize: 15, fontWeight: '800' },
  title: { color: colors.text, fontSize: 23, lineHeight: 29, fontWeight: '900' },
  meta: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  quickFact: { width: '31%', minHeight: 78, borderRadius: radius.md, backgroundColor: colors.surface, padding: spacing.sm, justifyContent: 'space-between' },
  quickLabel: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  quickValue: { color: colors.text, fontSize: 15, fontWeight: '900' },
  recommendCard: { borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg, ...shadows.card },
  matchText: { color: colors.text, fontSize: 22, lineHeight: 30, fontWeight: '900' },
  matchPercent: { color: colors.accent, fontSize: 30 },
  block: { borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg, ...shadows.card },
  blockTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  blockTitle: { color: colors.text, fontSize: 21, fontWeight: '900' },
  infoIcon: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.line, color: colors.muted, textAlign: 'center', lineHeight: 22, fontWeight: '900' },
  blockHeader: { color: colors.text, fontSize: 38, fontWeight: '900' },
  itemList: { gap: spacing.xs },
  reason: { color: colors.text, fontSize: 16, lineHeight: 24 },
  mutedReason: { color: colors.muted },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  goldCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.accent, color: colors.accentDark, textAlign: 'center', lineHeight: 20, fontSize: 13, fontWeight: '900' },
  smallNote: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: spacing.xs },
  description: { color: colors.text, fontSize: 16, lineHeight: 25 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  videoRow: { gap: spacing.md },
  videoCard: { width: 140, height: 112, borderRadius: radius.md, backgroundColor: colors.black, padding: spacing.md, justifyContent: 'space-between' },
  videoPlayerCard: { width: 340, height: 276, backgroundColor: colors.black },
  videoPlayerCardWide: { width: 520, height: 376 },
  play: { color: colors.accentSoft, fontSize: 22, fontWeight: '900' },
  videoLabel: { color: colors.background, fontWeight: '900' },
  videoDuration: { color: colors.accentSoft, fontSize: 12, fontWeight: '800' },
  mapMock: { minHeight: 185, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  pin: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent, borderWidth: 5, borderColor: colors.accentSoft },
  mapTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  mapText: { color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  mapButton: { minHeight: 50, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  mapButtonText: { color: colors.accentDark, fontSize: 15, fontWeight: '900' },
  similarRow: { gap: spacing.md },
  similarCard: { width: 220, borderRadius: radius.lg, backgroundColor: colors.surface, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  similarImage: { width: '100%', height: 132, backgroundColor: colors.line },
  similarBody: { padding: spacing.md, gap: spacing.xs },
  similarTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  similarPrice: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '900' },
  saveSmall: { color: colors.accentDark, fontSize: 20, fontWeight: '900' },
  similarMeta: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  bottomSpacer: { height: spacing.xl },
  bottomBar: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(255,255,255,0.97)', padding: spacing.sm, gap: spacing.sm, ...shadows.card },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  saveButton: { flex: 1, minHeight: 52, borderRadius: radius.md, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  callButton: { flex: 1, minHeight: 52, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: colors.text, fontSize: 15, fontWeight: '900' },
  likeButton: { flex: 1, minHeight: 52, borderRadius: radius.md, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  likeButtonText: { color: colors.background, fontSize: 15, fontWeight: '900' },
  dislikeButton: { flex: 1, minHeight: 52, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  dislikeButtonText: { color: colors.text, fontSize: 15, fontWeight: '900' },
  goldButton: { minHeight: 58, borderRadius: radius.md, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  goldButtonText: { color: colors.background, fontSize: 16, fontWeight: '900' },
  bottomHint: { color: colors.muted, fontSize: 12, textAlign: 'center', fontWeight: '800' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(13,13,13,0.42)', justifyContent: 'flex-end', padding: spacing.lg },
  modalCard: { backgroundColor: colors.background, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.lg, ...shadows.card },
  modalTitle: { color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  modalText: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modalOption: { flexGrow: 1 },
});
