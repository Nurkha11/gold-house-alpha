import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Badge } from '@/components/Badge';
import { formatPrice } from '@/components/BudgetSlider';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getRatingCount, recordTrainingSignal } from '@/data/aiTrainingStore';
import { Property, properties } from '@/data/properties';
import { getBuyerProperties, getBuyerPropertyById } from '@/data/propertyStore';

const ownerPhone = '+7 777 245 88 11';
const viewingDates = ['РЎРµРіРѕРґРЅСЏ', 'Р—Р°РІС‚СЂР°', 'Р’ РІС‹С…РѕРґРЅС‹Рµ'];
const viewingTimes = ['12:00', '15:30', '18:30', '20:00'];

function similarTo(property: Property) {
  return getBuyerProperties()
    .filter((item) => item.id !== property.id)
    .map((item) => ({
      item,
      score:
        (item.district === property.district ? 3 : 0) +
        (Math.abs(item.price - property.price) <= 10_000_000 ? 2 : 0) +
        (item.rooms === property.rooms ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
}

export default function PropertyDetailsScreen() {
  const { id, source } = useLocalSearchParams<{ id: string; source?: string }>();
  const property = getBuyerPropertyById(id) ?? getBuyerProperties()[0] ?? properties[0];
  const gallery = property.images?.length ? property.images : [property.imageUrl];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewingVisible, setViewingVisible] = useState(false);
  const [viewingSent, setViewingSent] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Р—Р°РІС‚СЂР°');
  const [selectedTime, setSelectedTime] = useState('18:30');
  const openedAt = useRef(Date.now());
  const similar = useMemo(() => similarTo(property), [property]);
  const activePhoto = gallery[photoIndex];

  useEffect(() => {
    recordTrainingSignal(property.id, 'detail_view');
    const timer = setTimeout(() => {
      recordTrainingSignal(property.id, 'long_detail_view', Date.now() - openedAt.current);
    }, 1800);

    return () => clearTimeout(timer);
  }, [property.id]);

  const nextPhoto = () => setPhotoIndex((value) => (value + 1) % gallery.length);
  const prevPhoto = () => setPhotoIndex((value) => (value - 1 + gallery.length) % gallery.length);

  function confirmViewing() {
    recordTrainingSignal(property.id, 'viewing_request');
    setViewingSent(true);
  }

  function callOwner() {
    recordTrainingSignal(property.id, 'owner_call');
    Linking.openURL(`tel:${(property.ownerPhone ?? ownerPhone).replace(/\s/g, '')}`);
  }

  function rateFromDetails(type: 'like' | 'dislike') {
    recordTrainingSignal(property.id, type);
    if (source === 'training' && getRatingCount() >= 10) {
      router.replace('/ai-analysis' as never);
      return;
    }
    if (source === 'training') {
      router.replace('/swipe' as never);
      return;
    }
    router.back();
  }

  return (
    <Screen>
      <View style={styles.galleryWrap}>
        <Image source={{ uri: activePhoto }} style={styles.hero} />
        <View style={styles.topControls}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Text style={styles.iconText}>вЂ№</Text>
          </Pressable>
          <View style={styles.topRight}>
            <Pressable style={styles.iconButton} onPress={() => undefined}>
              <Text style={styles.iconText}>в™Ў</Text>
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => undefined}>
              <Text style={styles.iconText}>в†—</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.photoCounter}>
          <Text style={styles.photoCounterText}>{photoIndex + 1} / {gallery.length}</Text>
        </View>
        <View style={styles.galleryNav}>
          <PrimaryButton title="РќР°Р·Р°Рґ" variant="ghost" onPress={prevPhoto} style={styles.galleryButton} />
          <PrimaryButton title="Р’РїРµСЂРµРґ" variant="ghost" onPress={nextPhoto} style={styles.galleryButton} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbs}>
        {gallery.map((image, index) => (
          <Pressable key={`${image}-${index}`} onPress={() => setPhotoIndex(index)}>
            <Image source={{ uri: image }} style={[styles.thumb, photoIndex === index && styles.activeThumb]} />
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.titleBlock}>
        <View style={styles.badges}>
          {property.verified ? <Badge label="Gold Verified" tone="green" /> : null}
          <Badge label={`${property.matchPercent}% Match`} />
          <Badge label="Trust Index 98 / 100" tone="neutral" />
        </View>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>{formatPrice(property.price)}</Text>
        <Text style={styles.address}>{property.city}, {property.district}</Text>
        <Text style={styles.meta}>{property.address}</Text>
      </View>

      <Section title="AI Summary">
        <Text style={styles.description}>
          Р­С‚Р° РєРІР°СЂС‚РёСЂР° С…РѕСЂРѕС€Рѕ СЃРѕРІРїР°РґР°РµС‚ СЃ РІС‹Р±СЂР°РЅРЅС‹Рј СЂР°Р№РѕРЅРѕРј, Р±СЋРґР¶РµС‚РѕРј Рё Р±Р°Р·РѕРІС‹РјРё РїСЂРµРґРїРѕС‡С‚РµРЅРёСЏРјРё РїРѕ СЌС‚Р°Р¶Сѓ. РћР±СЉРµРєС‚ РІС‹РіР»СЏРґРёС‚ РЅР°РґРµР¶РЅРѕ РґР»СЏ РїРµСЂРІРѕРіРѕ РїСЂРѕСЃРјРѕС‚СЂР°: РµСЃС‚СЊ С„РѕС‚Рѕ, РІРёРґРµРѕ, РїРѕРґС‚РІРµСЂР¶РґРµРЅРЅР°СЏ Р»РѕРєР°С†РёСЏ Рё РїРѕРЅСЏС‚РЅР°СЏ РёСЃС‚РѕСЂРёСЏ РїСЂРѕРІРµСЂРєРё.
        </Text>
      </Section>

      <Section title="Р’РёРґРµРѕ">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.videoRow}>
          {['РљРІР°СЂС‚РёСЂР°', 'Р”РІРѕСЂ', 'РџРѕРґСЉРµР·Рґ', 'РЎРѕР±СЃС‚РІРµРЅРЅРёРє'].map((label) => (
            <View key={label} style={styles.videoCard}>
              <Text style={styles.play}>в–¶</Text>
              <Text style={styles.videoLabel}>{label}</Text>
            </View>
          ))}
        </ScrollView>
      </Section>

      <Section title="РџР»СЋСЃС‹">
        {['РџРѕРґС…РѕРґРёС‚ РїРѕРґ Р±СЋРґР¶РµС‚', 'РҐРѕСЂРѕС€РµРµ СЃРѕРІРїР°РґРµРЅРёРµ РїРѕ СЂР°Р№РѕРЅСѓ', 'Р¤РѕС‚Рѕ Рё РІРёРґРµРѕ Р°РєС‚СѓР°Р»СЊРЅС‹', 'Р”РѕРєСѓРјРµРЅС‚С‹ РІ РїСЂРѕРІРµСЂРєРµ Gold House'].map((item) => (
          <Text key={item} style={styles.reason}>вЂў {item}</Text>
        ))}
      </Section>

      <Section title="РњРёРЅСѓСЃС‹">
        {['РќСѓР¶РЅРѕ РїСЂРѕРІРµСЂРёС‚СЊ С€СѓРј РІ РІРµС‡РµСЂРЅРµРµ РІСЂРµРјСЏ', 'РџР°СЂРєРѕРІРєСѓ Р»СѓС‡С€Рµ РѕС†РµРЅРёС‚СЊ РЅР° РїСЂРѕСЃРјРѕС‚СЂРµ', 'Р¤РёРЅР°Р»СЊРЅС‹Рµ РґРѕРєСѓРјРµРЅС‚С‹ РїРѕРґС‚РІРµСЂРґРёС‚ РјРµРЅРµРґР¶РµСЂ'].map((item) => (
          <Text key={item} style={styles.reason}>вЂў {item}</Text>
        ))}
      </Section>

      <Section title="РџРѕР»РЅС‹Рµ С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё">
        <View style={styles.specGrid}>
          <Spec label="РљРѕРјРЅР°С‚С‹" value={`${property.rooms}`} />
          <Spec label="РџР»РѕС‰Р°РґСЊ" value={`${property.area} РјВІ`} />
          <Spec label="Р­С‚Р°Р¶" value={`${property.floor}/${property.totalFloors}`} />
          <Spec label="Р“РѕРґ РїРѕСЃС‚СЂРѕР№РєРё" value={String(property.year)} />
          <Spec label="РџРѕС‚РѕР»РєРё" value={`${property.ceilingHeight} Рј`} />
          <Spec label="Р”РѕРІРµСЂРёРµ" value="98 / 100" />
        </View>
      </Section>

      <Section title="РРЅРґРµРєСЃ РґРѕРІРµСЂРёСЏ">
        <View style={styles.trustHeader}>
          <Text style={styles.trustScore}>98 / 100</Text>
          <Badge label="Р’С‹СЃРѕРєР°СЏ РЅР°РґРµР¶РЅРѕСЃС‚СЊ" tone="green" />
        </View>
        {['Р”РѕРєСѓРјРµРЅС‚С‹ РїСЂРѕРІРµСЂРµРЅС‹', 'Р“РµРѕР»РѕРєР°С†РёСЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅР°', 'Р¤РѕС‚Рѕ Р°РєС‚СѓР°Р»СЊРЅС‹', 'Р’РёРґРµРѕ Р°РєС‚СѓР°Р»СЊРЅРѕ', 'РЎРѕР±СЃС‚РІРµРЅРЅРёРє РїРѕРґС‚РІРµСЂР¶РґРµРЅ'].map((item) => (
          <Text key={item} style={styles.reason}>вЂў {item}</Text>
        ))}
      </Section>

      <Section title="РџРѕС‡РµРјСѓ РјС‹ СЂРµРєРѕРјРµРЅРґСѓРµРј РёРјРµРЅРЅРѕ СЌС‚Сѓ РєРІР°СЂС‚РёСЂСѓ?">
        {[
          'РџРѕРґС…РѕРґРёС‚ РїРѕРґ РІР°С€ Р±СЋРґР¶РµС‚',
          'Р’С‹Р±СЂР°РЅРЅС‹Р№ СЂР°Р№РѕРЅ',
          'РЎРѕРІРїР°РґР°РµС‚ РїРѕ РєРѕРјРЅР°С‚РЅРѕСЃС‚Рё',
          'РџРѕРґС…РѕРґРёС‚ РїРѕ СЌС‚Р°Р¶Сѓ',
          'Р¦РµРЅР° РЅРёР¶Рµ РїРѕС…РѕР¶РёС… РєРІР°СЂС‚РёСЂ',
          'Р”Рѕ СЂР°Р±РѕС‚С‹ 15 РјРёРЅСѓС‚',
          'Р’Р°Рј РЅСЂР°РІРёС‚СЃСЏ С‚Р°РєРѕР№ СЂРµРјРѕРЅС‚',
        ].map((item) => (
          <Text key={item} style={styles.reason}>вЂў {item}</Text>
        ))}
      </Section>

      <Section title="РћРїРёСЃР°РЅРёРµ">
        <Text style={styles.description}>{property.description}</Text>
        <View style={styles.tags}>
          {property.tags.map((tag) => (
            <Badge key={tag} label={tag} tone="neutral" />
          ))}
        </View>
      </Section>

      <Section title="РќР° РєР°СЂС‚Рµ">
        <View style={styles.mapMock}>
          <View style={styles.pin} />
          <Text style={styles.mapText}>РљР°СЂС‚Р° Р±СѓРґРµС‚ РїРѕРґРєР»СЋС‡РµРЅР° РїРѕР·Р¶Рµ</Text>
        </View>
        <Text style={styles.description}>{property.address}</Text>
        <Text style={styles.muted}>{property.locationText}</Text>
      </Section>

      <Section title="РџРѕС…РѕР¶РёРµ РєРІР°СЂС‚РёСЂС‹">
        {similar.map((item) => (
          <Pressable key={item.id} style={styles.similarCard} onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}>
            <Image source={{ uri: item.images[0] }} style={styles.similarImage} />
            <View style={styles.similarBody}>
              <Text style={styles.similarTitle}>{item.title}</Text>
              <Text style={styles.muted}>{item.district} В· {item.rooms} РєРѕРјРЅ. В· {formatPrice(item.price)}</Text>
            </View>
          </Pressable>
        ))}
      </Section>

      <View style={styles.bottomActions}>
        <PrimaryButton title="в†ђ Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє РѕС†РµРЅРєР°Рј" variant="ghost" onPress={() => router.back()} style={styles.actionButton} />
        <View style={styles.ratingActions}>
          <PrimaryButton title="вќ¤пёЏ РќСЂР°РІРёС‚СЃСЏ" onPress={() => rateFromDetails('like')} style={styles.ratingButton} />
          <PrimaryButton title="рџ‘Ћ РќРµ РЅСЂР°РІРёС‚СЃСЏ" variant="ghost" onPress={() => rateFromDetails('dislike')} style={styles.ratingButton} />
        </View>
        <PrimaryButton title="рџ“… Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РїСЂРѕСЃРјРѕС‚СЂ" onPress={() => setViewingVisible(true)} style={styles.actionButton} />
        <PrimaryButton title="рџ“ћ РџРѕР·РІРѕРЅРёС‚СЊ СЃРѕР±СЃС‚РІРµРЅРЅРёРєСѓ" variant="secondary" onPress={callOwner} style={styles.actionButton} />
      </View>
      <Text style={styles.phoneText}>РќРѕРјРµСЂ СЃРѕР±СЃС‚РІРµРЅРЅРёРєР°: {property.ownerPhone ?? ownerPhone}</Text>

      <Modal transparent visible={viewingVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {viewingSent ? (
              <>
                <Text style={styles.modalTitle}>Р—Р°РїСЂРѕСЃ РЅР° РїСЂРѕСЃРјРѕС‚СЂ РѕС‚РїСЂР°РІР»РµРЅ СЃРѕР±СЃС‚РІРµРЅРЅРёРєСѓ.</Text>
                <Text style={styles.modalText}>РњС‹ РїРµСЂРµРґР°Р»Рё РІС‹Р±СЂР°РЅРЅРѕРµ РІСЂРµРјСЏ: {selectedDate}, {selectedTime}. РЎРѕР±СЃС‚РІРµРЅРЅРёРє РёР»Рё РјРµРЅРµРґР¶РµСЂ СЃРІСЏР¶РµС‚СЃСЏ СЃ РІР°РјРё РґР»СЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ.</Text>
                <PrimaryButton title="Р“РѕС‚РѕРІРѕ" onPress={() => setViewingVisible(false)} />
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚Сѓ Рё РІСЂРµРјСЏ</Text>
                <Text style={styles.modalText}>РЎРѕР±СЃС‚РІРµРЅРЅРёРє РїРѕР»СѓС‡РёС‚ Р·Р°РїСЂРѕСЃ Рё РїРѕРґС‚РІРµСЂРґРёС‚ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РїСЂРѕСЃРјРѕС‚СЂР°.</Text>
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
                <PrimaryButton title="РџРѕРґС‚РІРµСЂРґРёС‚СЊ Р·Р°РїСЂРѕСЃ" onPress={confirmViewing} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryWrap: { position: 'relative', marginBottom: spacing.md },
  hero: { width: '100%', height: 390, borderRadius: radius.xl, backgroundColor: colors.surface },
  topControls: { position: 'absolute', top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: 'row', justifyContent: 'space-between' },
  topRight: { flexDirection: 'row', gap: spacing.sm },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  iconText: { color: colors.text, fontSize: 24, fontWeight: '900' },
  photoCounter: { position: 'absolute', right: spacing.md, bottom: spacing.md, borderRadius: radius.sm, backgroundColor: 'rgba(13,13,13,0.72)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  photoCounterText: { color: colors.background, fontWeight: '900' },
  galleryNav: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md, flexDirection: 'row', gap: spacing.sm },
  galleryButton: { flex: 1, minHeight: 42 },
  thumbs: { gap: spacing.sm, paddingBottom: spacing.lg },
  thumb: { width: 74, height: 74, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: 'transparent' },
  activeThumb: { borderColor: colors.accent },
  titleBlock: { gap: spacing.sm, marginBottom: spacing.lg },
  badges: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  title: { color: colors.text, fontSize: 30, lineHeight: 36, fontWeight: '900' },
  price: { color: colors.text, fontSize: 34, fontWeight: '900' },
  address: { color: colors.text, fontSize: 19, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 15 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  spec: { width: '47%', gap: spacing.xs },
  specLabel: { color: colors.muted, fontSize: 13 },
  specValue: { color: colors.text, fontSize: 16, fontWeight: '800' },
  trustHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  trustScore: { color: colors.success, fontSize: 30, fontWeight: '900' },
  reason: { color: colors.text, fontSize: 16, lineHeight: 24 },
  description: { color: colors.text, fontSize: 16, lineHeight: 25 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  videoRow: { gap: spacing.md },
  videoCard: { width: 132, height: 92, borderRadius: radius.md, backgroundColor: colors.black, padding: spacing.md, justifyContent: 'space-between' },
  play: { color: colors.accentSoft, fontSize: 20, fontWeight: '900' },
  videoLabel: { color: colors.background, fontWeight: '900' },
  mapMock: { height: 160, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  pin: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accent, borderWidth: 5, borderColor: colors.accentSoft },
  mapText: { color: colors.muted, fontWeight: '800' },
  similarCard: { flexDirection: 'row', gap: spacing.md, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.surface },
  similarImage: { width: 86, height: 86, borderRadius: radius.md, backgroundColor: colors.line },
  similarBody: { flex: 1, justifyContent: 'center', gap: spacing.xs },
  similarTitle: { color: colors.text, fontSize: 15, fontWeight: '900' },
  bottomActions: { gap: spacing.sm, marginTop: spacing.lg },
  ratingActions: { flexDirection: 'row', gap: spacing.sm },
  ratingButton: { flex: 1 },
  actionButton: { width: '100%' },
  phoneText: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: spacing.sm, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(13,13,13,0.42)', justifyContent: 'flex-end', padding: spacing.lg },
  modalCard: { backgroundColor: colors.background, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.lg, ...shadows.card },
  modalTitle: { color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' },
  modalText: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modalOption: { flexGrow: 1 },
});
