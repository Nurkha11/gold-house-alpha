import { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, spacing } from '@/constants/theme';
import { isAdminAuthenticated } from '@/data/adminStore';
import { getSubmissionById, updateSubmissionStatus } from '@/data/ownerStore';
import { MediaFile, PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';

const adminActions: Array<{ label: string; status: SubmissionStatus }> = [
  { label: 'Одобрить и опубликовать', status: 'published' },
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

      <Section title="Действия администратора" soft>
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
            placeholder="Комментарий для собственника, например: Добавьте фотографии кухни"
            placeholderTextColor={colors.muted}
            multiline
            style={styles.commentInput}
          />
          <PrimaryButton
            title="Запросить исправления"
            variant="secondary"
            onPress={() => setStatus('changes_requested', adminComment || 'Нужно исправить данные объявления перед публикацией.')}
          />
        </View>
      </Section>

      <SubmissionDetails submission={currentSubmission} />
    </Screen>
  );
}

function SubmissionDetails({ submission }: { submission: PropertySubmission }) {
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
          <Info label="Балкон" value={submission.characteristics.balcony} />
          <Info label="Лифт" value={submission.characteristics.elevator} />
          <Info label="Парковка" value={submission.characteristics.parking} />
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

      <MediaSection title="Фото" media={submission.media.filter((file) => file.type === 'photo')} />
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

function MediaSection({ title, media }: { title: string; media: MediaFile[] }) {
  return (
    <Section title={title}>
      {media.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaRow}>
          {media.map((file) => (
            <View key={file.id} style={styles.mediaCard}>
              {file.type === 'photo' && file.uri ? <Image source={{ uri: file.uri }} style={styles.mediaImage} /> : <View style={styles.videoBox}><Text style={styles.play}>Play</Text></View>}
              <Text style={styles.mediaName}>{file.name}</Text>
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
  empty: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
});
