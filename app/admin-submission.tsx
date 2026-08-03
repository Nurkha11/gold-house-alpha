import React, { useEffect, useState } from 'react';
import { Image, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, spacing } from '@/constants/theme';
import { getBalconyLabel, normalizeBalconyType } from '@/data/balconyTypes';
import { getElevatorCountLabel, normalizeElevatorData } from '@/data/elevatorTypes';
import { getParkingTypeLabel, normalizeParkingData } from '@/data/parkingTypes';
import { isAdminAuthenticated } from '@/data/adminStore';
import { loadLocalMediaBlobUrl } from '@/data/localMediaStore';
import { getSubmissionById, updateSubmissionStatus } from '@/data/ownerStore';
import { MediaFile, PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';

const adminActions: Array<{ label: string; status: SubmissionStatus }> = [
  { label: 'Согласовано и опубликовать', status: 'published' },
  { label: 'Отклонить', status: 'rejected' },
];

export default function AdminSubmissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [submission, setSubmission] = useState(() => getSubmissionById(id));
  const [adminComment, setAdminComment] = useState('');
  const adminAllowed = isAdminAuthenticated();

  if (!adminAllowed) {
    return (
      <Screen>
        <PageHeader eyebrow="Gold House" title="Доступ запрещен" subtitle="Эта страница доступна только администраторам Gold House." />
        <PrimaryButton title="Вернуться в главное меню" onPress={() => router.replace('/' as never)} />
      </Screen>
    );
  }

  if (!submission) {
    return (
      <Screen>
        <PageHeader eyebrow="Gold Admin" title="Заявка не найдена" subtitle="Возможно, она была удалена из локального состояния." />
        <PrimaryButton title="Назад в админку" onPress={() => router.replace('/admin' as never)} />
      </Screen>
    );
  }

  const currentSubmission = submission;

  function setStatus(status: SubmissionStatus, comment?: string) {
    const updated = updateSubmissionStatus(currentSubmission.id, status, comment);
    if (updated) {
      setSubmission({ ...updated });
      router.replace({ pathname: '/admin', params: { tab: status } } as never);
    }
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Gold Admin"
        title={currentSubmission.address.complexName || currentSubmission.address.street || 'Заявка собственника'}
        subtitle={`${currentSubmission.id} · ${new Date(currentSubmission.createdAt).toLocaleDateString('ru-RU')}`}
      />

      <View style={styles.statusRow}>
        <OwnerStatusBadge status={currentSubmission.status} />
        <Text style={styles.price}>{currentSubmission.priceTerms.price ? `${Number(currentSubmission.priceTerms.price).toLocaleString('ru-RU')} ₸` : 'Цена не указана'}</Text>
      </View>


      <SubmissionDetails submission={currentSubmission} />

      <Section title="Итог модерации" soft>
        <View style={styles.actions}>
          {adminActions.map((action) => (
            <PrimaryButton
              key={action.status}
              title={action.label}
              variant={action.status === 'rejected' ? 'ghost' : action.status === 'published' ? 'primary' : 'secondary'}
              onPress={() => setStatus(action.status)}
            />
          ))}
          <TextInput
            value={adminComment}
            onChangeText={setAdminComment}
            placeholder="Комментарий для собственника, например: добавьте фотографии кухни"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.commentInput}
          />
          <PrimaryButton
            title="Запросить исправления"
            variant="secondary"
            onPress={() => setStatus('changes_requested', adminComment || 'Нужно исправить данные объявления перед публикацией.')}
          />
          {currentSubmission.status === 'published' ? (
            <PrimaryButton
              title="Открыть опубликованную карточку"
              variant="secondary"
              onPress={() => router.push({ pathname: '/property/[id]', params: { id: `published-${currentSubmission.id}` } } as never)}
            />
          ) : null}
        </View>
      </Section>
    </Screen>
  );
}

function SubmissionDetails({ submission }: { submission: PropertySubmission }) {
  const elevatorData = normalizeElevatorData(submission.characteristics);
  const parkingData = normalizeParkingData(submission.characteristics);

  return (
    <>
      <Section title="Адрес">
        <Info label="Город" value={submission.address.city} />
        <Info label="Район" value={submission.address.district} />
        <Info label="ЖК / дом" value={submission.address.complexName || '-'} />
        <Info label="Адрес" value={submission.address.street || '-'} />
      </Section>

      <Section title="Характеристики">
        <View style={styles.grid}>
          <Info label="Комнаты" value={submission.characteristics.rooms} />
          <Info label="Общая площадь" value={`${submission.characteristics.totalArea || '-'} м²`} />
          <Info label="Жилая площадь" value={`${submission.characteristics.livingArea || '-'} м²`} />
          <Info label="Кухня" value={`${submission.characteristics.kitchenArea || '-'} м²`} />
          <Info label="Этаж" value={`${submission.characteristics.floor || '-'}/${submission.characteristics.totalFloors || '-'}`} />
          <Info label="Год" value={submission.characteristics.year || '-'} />
          <Info label="Материал" value={submission.characteristics.buildingMaterial || '-'} />
          <Info label="Потолки" value={submission.characteristics.ceilingHeight || '-'} />
          <Info label="Санузел" value={submission.characteristics.bathroom} />
          <Info label="Балкон / лоджия" value={getBalconyLabel(normalizeBalconyType(submission.characteristics.balconyType, submission.characteristics.balcony))} />
          {elevatorData.elevatorCount === 0 ? (
            <Info label="Лифт" value="Нет" />
          ) : (
            <>
              <Info label="Количество лифтов" value={getElevatorCountLabel(elevatorData.elevatorCount)} />
              <Info label="Грузовой лифт" value={elevatorData.hasFreightElevator ? 'Есть' : 'Нет'} />
            </>
          )}
          {parkingData.parkingType === 'none' ? (
            <Info label="Парковка" value="Нет" />
          ) : (
            <>
              <Info label="Парковка" value={getParkingTypeLabel(parkingData.parkingType)} />
              <Info label="Собственное место" value={parkingData.hasPrivateParkingSpace ? 'Есть' : 'Нет'} />
              {parkingData.hasPrivateParkingSpace ? (
                <Info label="Входит в стоимость" value={parkingData.parkingSpaceIncludedInPrice ? 'Да' : 'Нет, продается отдельно'} />
              ) : null}
            </>
          )}
        </View>
      </Section>

      <Section title="Цена и условия">
        <Info label="Цена" value={submission.priceTerms.price ? `${Number(submission.priceTerms.price).toLocaleString('ru-RU')} ₸` : '-'} />
        <Info label="Торг" value={submission.priceTerms.bargain} />
        <Info label="Ипотека" value={submission.priceTerms.mortgage} />
        <Info label="Документы" value={submission.priceTerms.documents} />
        <Info label="Обременения" value={submission.priceTerms.encumbrance} />
      </Section>

      <Section title="Ремонт">
        <Info label="Состояние" value={submission.condition.renovation} />
        <Info label="Комментарий" value={submission.condition.repairComment || '-'} />
      </Section>

      <Section title="Мебель / техника">
        <Info label="Мебель" value={submission.condition.furniture} />
        <Info label="Техника" value={submission.condition.appliances} />
        <Info label="Что остается" value={submission.condition.remains || '-'} />
      </Section>

      <Section title="Описание от собственника">
        <Info label="Что нравится" value={submission.ownerDescription.likes || '-'} />
        <Info label="Честные минусы" value={submission.ownerDescription.minuses || '-'} />
        <Info label="Кому подойдет" value={submission.ownerDescription.fitFor || '-'} />
        <Info label="Почему продает" value={submission.ownerDescription.sellingReason || '-'} />
      </Section>

      <MediaSection title="Квартира" media={submission.media.filter((file) => file.type === 'photo' && file.category === 'apartment')} />
      <MediaSection title="Двор" media={submission.media.filter((file) => file.type === 'photo' && file.category === 'yard')} />
      <MediaSection title="Подъезд" media={submission.media.filter((file) => file.type === 'photo' && file.category === 'entrance')} />
      <MediaSection title="Вид из окна" media={submission.media.filter((file) => file.type === 'photo' && file.category === 'view')} />
      <MediaSection title="Видео" media={submission.media.filter((file) => file.type === 'video' && file.category !== 'owner')} />
      <MediaSection title="Видео собственника" media={submission.media.filter((file) => file.type === 'video' && file.category === 'owner')} />

      <Section title="Контакты собственника">
        <Info label="Имя" value={submission.ownerName} />
        <Info label="Телефон" value={submission.ownerPhone} />
        <PrimaryButton title="Позвонить собственнику" variant="secondary" onPress={() => Linking.openURL(`tel:${submission.ownerPhone.replace(/\s/g, '')}`)} />
      </Section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function mediaUri(file: MediaFile) {
  if (file.type === 'photo') {
    return file.localUri || file.remoteUrl || file.uri || '';
  }

  return file.localUri || file.remoteUrl || file.uri || '';
}

function renderMediaPreview(file: MediaFile, uri: string) {
  if (!uri) {
    return <View style={styles.videoBox}><Text style={styles.play}>{file.type === 'photo' ? 'Photo' : 'Video'}</Text></View>;
  }

  if (file.type === 'photo') {
    if (Platform.OS === 'web') {
      return React.createElement('img', {
        src: uri,
        alt: file.name,
        style: {
          width: '100%',
          height: 120,
          backgroundColor: colors.surface,
          objectFit: 'cover',
          display: 'block',
        },
      });
    }

    return <Image source={{ uri }} style={styles.mediaImage} />;
  }

  if (file.type === 'video' && Platform.OS === 'web') {
    return React.createElement('video', {
      src: uri,
      controls: true,
      preload: 'metadata',
      style: {
        width: '100%',
        height: 120,
        backgroundColor: colors.black,
        objectFit: 'cover',
      },
    });
  }

  return <View style={styles.videoBox}><Text style={styles.play}>Video</Text></View>;
}

function MediaPreview({ file }: { file: MediaFile }) {
  const uri = mediaUri(file);
  const [resolvedUri, setResolvedUri] = useState(uri);

  useEffect(() => {
    let active = true;
    let objectUrl = '';

    async function resolveMedia() {
      if (Platform.OS !== 'web') return;
      if (uri.startsWith('data:') || uri.startsWith('http')) return;

      const storedUrl = await loadLocalMediaBlobUrl(file.id).catch(() => null);
      if (active && storedUrl) {
        objectUrl = storedUrl;
        setResolvedUri(storedUrl);
      }
    }

    setResolvedUri(uri);
    resolveMedia();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file.id, uri]);

  return renderMediaPreview(file, resolvedUri);
}

function MediaSection({ title, media }: { title: string; media: MediaFile[] }) {
  return (
    <Section title={title}>
      {media.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaRow}>
          {media.map((file) => (
            <View key={file.id} style={styles.mediaCard}>
              <MediaPreview file={file} />
              <Text style={styles.mediaName}>{file.name}</Text>
              {file.type === 'video' ? <Text style={styles.coverText}>{file.remoteUrl ? 'Storage' : 'Локально'}</Text> : null}
              {file.type === 'photo' && file.isCover ? <Text style={styles.coverText}>Обложка</Text> : null}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.empty}>Не загружено</Text>
      )}
    </Section>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  price: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  actions: {
    gap: spacing.sm,
  },
  commentInput: {
    minHeight: 112,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  grid: {
    gap: spacing.sm,
  },
  info: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
  },
  mediaRow: {
    gap: spacing.md,
  },
  mediaCard: {
    width: 170,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.surface,
  },
  videoBox: {
    height: 120,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  play: {
    color: colors.accentSoft,
    fontSize: 18,
    fontWeight: '900',
  },
  mediaName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    padding: spacing.sm,
  },
  coverText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  empty: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
});
