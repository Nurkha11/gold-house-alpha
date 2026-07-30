import { useEffect, useMemo, useState } from 'react';
import { BackHandler, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OwnerField } from '@/components/OwnerField';
import { OwnerMediaUploader } from '@/components/OwnerMediaUploader';
import { OwnerStatusBadge } from '@/components/OwnerStatusBadge';
import { OwnerStepIndicator } from '@/components/OwnerStepIndicator';
import { OptionButton } from '@/components/OptionButton';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { getCurrentOwner, getSubmissionById, saveSubmission } from '@/data/ownerStore';
import { MediaFile, PropertySubmission, SubmissionStatus } from '@/data/ownerTypes';
import { createLocation } from '@/data/residentialComplexes';

const totalSteps = 9;
const roomOptions = ['1', '2', '3', '4', '5+'];
const yesNo = ['Да', 'Нет'];
const documentOptions = ['Да', 'Нужно уточнить'];
const encumbranceOptions = ['Нет', 'Есть', 'Нужно уточнить'];
const repairOptions = ['Хороший ремонт', 'Средний ремонт', 'Требуется ремонт', 'Черновая отделка', 'Предчистовая отделка'];
const remainsOptions = ['Полностью', 'Частично', 'Не остается'];
const bathroomOptions = ['Совмещенный', 'Раздельный', '2 санузла'];
const buildingMaterialOptions = ['Монолит', 'Кирпич', 'Панель', 'Монолит-кирпич-панель', 'Панель-кирпич', 'Другое'];
const districtOptions = ['Бостандыкский', 'Наурызбайский'];
const ownerVideoQuestions = [
  'Представьтесь.',
  'Почему продаете квартиру?',
  'Что больше всего нравится?',
  'Какие честные минусы?',
  'Кому подойдет?',
  'Если бы не продавали, за что продолжали бы жить здесь?',
];

function createInitialSubmission(ownerId: string): PropertySubmission {
  const now = new Date().toISOString();

  return {
    id: `sub-${Date.now()}`,
    ownerId,
    ownerName: 'Собственник',
    ownerPhone: '+7',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    address: {
      city: 'Алматы',
      district: 'Бостандыкский',
      complexName: '',
      street: '',
      location: createLocation({
        fullAddress: 'Алматы, Бостандыкский район',
        district: 'Бостандыкский',
        source: 'manual',
        districtSource: 'manual',
      }),
      residentialComplexId: undefined,
      newResidentialComplex: null,
    },
    characteristics: {
      rooms: '2',
      totalArea: '',
      livingArea: '',
      kitchenArea: '',
      floor: '',
      totalFloors: '',
      year: '',
      buildingMaterial: '',
      ceilingHeight: '',
      bathroom: 'Раздельный',
      balcony: 'Да',
      elevator: 'Да',
      parking: 'Нет',
    },
    priceTerms: {
      price: '',
      bargain: 'Нет',
      mortgage: 'Да',
      documents: 'Да',
      encumbrance: 'Нет',
    },
    condition: {
      renovation: 'Хороший ремонт',
      repairComment: '',
      furniture: 'Частично',
      appliances: 'Частично',
      remains: '',
    },
    ownerDescription: {
      likes: '',
      minuses: '',
      fitFor: '',
      sellingReason: '',
    },
    media: [],
  };
}

function formatPrice(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits ? `${Number(digits).toLocaleString('ru-RU')} ₸` : '';
}

export default function OwnerSubmissionScreen() {
  const owner = getCurrentOwner();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState<PropertySubmission>(() => {
    const existing = id ? getSubmissionById(id) : undefined;
    if (existing) {
      return { ...existing, status: existing.status === 'changes_requested' ? 'draft' : existing.status };
    }

    return createInitialSubmission(owner?.id ?? 'owner-local');
  });

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step <= 1) {
        return false;
      }

      setStep((current) => Math.max(1, current - 1));
      return true;
    });

    return () => subscription.remove();
  }, [step]);

  const mainPhoto = useMemo(
    () => submission.media.find((file) => file.type === 'photo')?.uri ?? 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    [submission.media],
  );

  function updateAddress(key: keyof PropertySubmission['address'], value: string) {
    setSubmission((current) => ({ ...current, address: { ...current.address, [key]: value } }));
  }

  function updateCharacteristics(key: keyof PropertySubmission['characteristics'], value: string) {
    setSubmission((current) => ({ ...current, characteristics: { ...current.characteristics, [key]: value } }));
  }

  function updatePriceTerms(key: keyof PropertySubmission['priceTerms'], value: string) {
    setSubmission((current) => ({ ...current, priceTerms: { ...current.priceTerms, [key]: value } }));
  }

  function updatePrice(value: string) {
    updatePriceTerms('price', value.replace(/\D/g, ''));
  }

  function updateCondition(key: keyof PropertySubmission['condition'], value: string) {
    setSubmission((current) => {
      const nextCondition = { ...current.condition, [key]: value };
      if ((key === 'furniture' || key === 'appliances') && nextCondition.furniture === 'Не остается' && nextCondition.appliances === 'Не остается') {
        nextCondition.remains = 'Ничего не остается.';
      }
      return { ...current, condition: nextCondition };
    });
  }

  function updateOwnerDescription(key: keyof PropertySubmission['ownerDescription'], value: string) {
    setSubmission((current) => ({ ...current, ownerDescription: { ...current.ownerDescription, [key]: value } }));
  }

  function addMedia(file: MediaFile) {
    setSubmission((current) => ({ ...current, media: [file, ...current.media] }));
  }

  function removeMedia(id: string) {
    setSubmission((current) => ({ ...current, media: current.media.filter((file) => file.id !== id) }));
  }

  function persist(status: SubmissionStatus) {
    const now = new Date().toISOString();
    saveSubmission({
      ...submission,
      ownerName: owner?.name ?? submission.ownerName,
      ownerPhone: owner?.phone ?? submission.ownerPhone,
      status,
      adminComment: status === 'submitted' ? undefined : submission.adminComment,
      updatedAt: now,
    });
    if (status === 'submitted') {
      setSubmitted(true);
      return;
    }
    router.replace('/owner-dashboard' as never);
  }

  if (submitted) {
    return (
      <Screen>
        <View style={styles.successScreen}>
          <Text style={styles.successMark}>Gold House</Text>
          <Text style={styles.successTitle}>Заявка отправлена.</Text>
          <Text style={styles.successText}>Команда Gold House проверит объект и свяжется с вами.</Text>
          <PrimaryButton title="Вернуться в кабинет" onPress={() => router.replace('/owner-dashboard' as never)} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <OwnerStepIndicator current={step} total={totalSteps} />
      <PageHeader
        eyebrow="Кабинет собственника"
        title={stepTitle(step)}
        subtitle="Заполните объект по шагам. Данные сохраняются в локальной MVP-структуре и готовы для будущей админ-панели."
      />

      {step === 1 ? (
        <Section title="Где находится квартира?">
          <View style={styles.twoColumns}>
            <OwnerField label="Город" value={submission.address.city} onChangeText={(value) => updateAddress('city', value)} placeholder="Алматы" />
            <OwnerField label="ЖК / название дома" value={submission.address.complexName} onChangeText={(value) => updateAddress('complexName', value)} placeholder="Например, Riviera" />
          </View>
          {renderChoiceGroup('Район', districtOptions, submission.address.district, (value) => updateAddress('district', value))}
          <OwnerField label="Адрес" value={submission.address.street} onChangeText={(value) => updateAddress('street', value)} placeholder="Улица, дом, корпус, квартира" />
        </Section>
      ) : null}

      {step === 2 ? (
        <Section title="Основные характеристики">
          {renderChoiceGroup('Количество комнат', roomOptions, submission.characteristics.rooms, (value) => updateCharacteristics('rooms', value))}
          <View style={styles.twoColumns}>
            <OwnerField label="Общая площадь" value={submission.characteristics.totalArea} onChangeText={(value) => updateCharacteristics('totalArea', value)} keyboardType="numeric" />
            <OwnerField label="Жилая площадь" value={submission.characteristics.livingArea} onChangeText={(value) => updateCharacteristics('livingArea', value)} keyboardType="numeric" />
            <OwnerField label="Площадь кухни" value={submission.characteristics.kitchenArea} onChangeText={(value) => updateCharacteristics('kitchenArea', value)} keyboardType="numeric" />
            <OwnerField label="Этаж" value={submission.characteristics.floor} onChangeText={(value) => updateCharacteristics('floor', value)} keyboardType="numeric" />
            <OwnerField label="Этажность дома" value={submission.characteristics.totalFloors} onChangeText={(value) => updateCharacteristics('totalFloors', value)} keyboardType="numeric" />
            <OwnerField label="Год постройки" value={submission.characteristics.year} onChangeText={(value) => updateCharacteristics('year', value)} keyboardType="numeric" />
            <OwnerField label="Высота потолков" value={submission.characteristics.ceilingHeight} onChangeText={(value) => updateCharacteristics('ceilingHeight', value)} keyboardType="decimal-pad" />
          </View>
          {renderChoiceGroup('Материал дома', buildingMaterialOptions, submission.characteristics.buildingMaterial, (value) => updateCharacteristics('buildingMaterial', value))}
          {renderChoiceGroup('Санузел', bathroomOptions, submission.characteristics.bathroom, (value) => updateCharacteristics('bathroom', value))}
          {renderChoiceGroup('Балкон', yesNo, submission.characteristics.balcony, (value) => updateCharacteristics('balcony', value))}
          {renderChoiceGroup('Лифт', yesNo, submission.characteristics.elevator, (value) => updateCharacteristics('elevator', value))}
          {renderChoiceGroup('Парковка', yesNo, submission.characteristics.parking, (value) => updateCharacteristics('parking', value))}
        </Section>
      ) : null}

      {step === 3 ? (
        <Section title="Цена и условия">
          <OwnerField label="Цена" value={formatPrice(submission.priceTerms.price)} onChangeText={updatePrice} placeholder="58 000 000 ₸" keyboardType="numeric" />
          {renderChoiceGroup('Возможен ли торг?', yesNo, submission.priceTerms.bargain, (value) => updatePriceTerms('bargain', value))}
          {renderChoiceGroup('Можно ли купить в ипотеку?', yesNo, submission.priceTerms.mortgage, (value) => updatePriceTerms('mortgage', value))}
          {renderChoiceGroup('Документы готовы к сделке?', documentOptions, submission.priceTerms.documents, (value) => updatePriceTerms('documents', value))}
          {renderChoiceGroup('Есть ли обременения?', encumbranceOptions, submission.priceTerms.encumbrance, (value) => updatePriceTerms('encumbrance', value))}
        </Section>
      ) : null}

      {step === 4 ? (
        <Section title="Ремонт и состояние">
          {renderChoiceGroup('Состояние ремонта', repairOptions, submission.condition.renovation, (value) => updateCondition('renovation', value))}
          <OwnerField label="Комментарий по ремонту" value={submission.condition.repairComment} onChangeText={(value) => updateCondition('repairComment', value)} placeholder="Например: ремонт делали 3 года назад" multiline />
        </Section>
      ) : null}

      {step === 5 ? (
        <Section title="Что остается после продажи">
          {renderChoiceGroup('Мебель', remainsOptions, submission.condition.furniture, (value) => updateCondition('furniture', value))}
          {renderChoiceGroup('Техника', remainsOptions, submission.condition.appliances, (value) => updateCondition('appliances', value))}
          <OwnerField
            label="Что именно остается?"
            value={submission.condition.remains}
            onChangeText={(value) => updateCondition('remains', value)}
            placeholder="Например: кухонный гарнитур, кондиционер, холодильник, стиральная машина, шкаф."
            multiline
          />
        </Section>
      ) : null}

      {step === 6 ? (
        <Section title="Описание от собственника">
          <OwnerField label="Что вам нравится в квартире?" value={submission.ownerDescription.likes} onChangeText={(value) => updateOwnerDescription('likes', value)} multiline />
          <OwnerField label="Какие есть честные минусы?" value={submission.ownerDescription.minuses} onChangeText={(value) => updateOwnerDescription('minuses', value)} multiline />
          <OwnerField label="Кому подойдет квартира?" value={submission.ownerDescription.fitFor} onChangeText={(value) => updateOwnerDescription('fitFor', value)} multiline />
          <OwnerField label="Почему продаете?" value={submission.ownerDescription.sellingReason} onChangeText={(value) => updateOwnerDescription('sellingReason', value)} multiline />
        </Section>
      ) : null}

      {step === 7 ? (
        <Section title="Фото">
          <Text style={styles.helper}>Mock upload: нажмите “Добавить фото”, чтобы файл появился в интерфейсе. Фото можно удалить.</Text>
          <OwnerMediaUploader media={submission.media} onAdd={addMedia} onRemove={removeMedia} mode="photo" />
        </Section>
      ) : null}

      {step === 8 ? (
        <Section title="Видео">
          <Text style={styles.helper}>Видео собственника помогает Gold House быстрее проверить объект и повысить доверие к объявлению.</Text>
          <View style={styles.questionList}>
            {ownerVideoQuestions.map((question, index) => (
              <View key={question} style={styles.question}>
                <Text style={styles.questionNumber}>{index + 1}</Text>
                <Text style={styles.questionText}>{question}</Text>
              </View>
            ))}
          </View>
          <OwnerMediaUploader media={submission.media} onAdd={addMedia} onRemove={removeMedia} mode="video" />
        </Section>
      ) : null}

      {step === 9 ? (
        <View style={styles.previewWrap}>
          <Section title="Предпросмотр объявления">
            <View style={styles.previewCard}>
              <Image source={{ uri: mainPhoto }} style={styles.previewImage} />
              <View style={styles.previewBody}>
                <View style={styles.previewTop}>
                  <OwnerStatusBadge status="draft" />
                  <Text style={styles.pending}>Gold Verified: ожидает проверки</Text>
                </View>
                <Text style={styles.previewPrice}>{formatPrice(submission.priceTerms.price) || 'Цена не указана'}</Text>
                <Text style={styles.previewTitle}>{submission.address.complexName || submission.address.street || 'Новая квартира'}</Text>
                <Text style={styles.previewMeta}>{submission.address.city}, {submission.address.district} · {submission.address.street || 'Адрес уточняется'}</Text>
                <View style={styles.factRow}>
                  <Text style={styles.fact}>{submission.characteristics.rooms} комн.</Text>
                  <Text style={styles.fact}>{submission.characteristics.totalArea || '-'} м²</Text>
                  <Text style={styles.fact}>{submission.characteristics.floor || '-'}/{submission.characteristics.totalFloors || '-'} этаж</Text>
                </View>
                <Text style={styles.description}>{buildDescription(submission)}</Text>
                <Text style={styles.pending}>Trust Index: будет рассчитан</Text>
              </View>
            </View>
          </Section>

          <Section title="Характеристики" soft>
            <Text style={styles.helper}>Материал: {submission.characteristics.buildingMaterial || '-'} · Год: {submission.characteristics.year || '-'} · Потолки: {submission.characteristics.ceilingHeight || '-'} м</Text>
            <Text style={styles.helper}>Санузел: {submission.characteristics.bathroom} · Балкон: {submission.characteristics.balcony} · Лифт: {submission.characteristics.elevator} · Парковка: {submission.characteristics.parking}</Text>
            <Text style={styles.helper}>Ремонт: {submission.condition.renovation}. {submission.condition.repairComment || 'Комментарий не указан.'}</Text>
            <Text style={styles.helper}>Мебель: {submission.condition.furniture} · Техника: {submission.condition.appliances} · {submission.condition.remains || 'Что остается не указано.'}</Text>
            <Text style={styles.helper}>Медиа: фото {submission.media.filter((file) => file.type === 'photo').length}, видео {submission.media.filter((file) => file.type === 'video').length}</Text>
            <Text style={styles.helper}>
              Локация: {submission.address.location?.latitude.toFixed(6) || '-'}, {submission.address.location?.longitude.toFixed(6) || '-'} · источник района: {submission.address.location?.districtSource || '-'}
            </Text>
            {submission.address.location?.locationWarnings?.length ? (
              <Text style={styles.helper}>Предупреждения: {submission.address.location.locationWarnings.join(' · ')}</Text>
            ) : null}
          </Section>
        </View>
      ) : null}

      <View style={styles.footer}>
        {step > 1 ? <PrimaryButton title="Назад" variant="ghost" onPress={() => setStep((current) => current - 1)} /> : null}
        {step < totalSteps ? (
          <PrimaryButton title="Далее" disabled={!canGoNext(step, submission)} onPress={() => setStep((current) => current + 1)} />
        ) : (
          <>
            <PrimaryButton title="Назад" variant="ghost" onPress={() => setStep(8)} />
            <PrimaryButton title="Сохранить черновик" variant="secondary" onPress={() => persist('draft')} />
            <PrimaryButton title="Отправить заявку" onPress={() => persist('submitted')} />
          </>
        )}
      </View>
    </Screen>
  );
}

function stepTitle(step: number) {
  const titles = [
    'Где находится квартира?',
    'Основные характеристики',
    'Цена и условия',
    'Ремонт и состояние',
    'Что остается после продажи',
    'Описание от собственника',
    'Фото',
    'Видео',
    'Предпросмотр',
  ];
  return titles[step - 1];
}

function canGoNext(step: number, submission: PropertySubmission) {
  if (step !== 1) {
    return true;
  }

  return Boolean(submission.address.city.trim() && submission.address.district.trim() && (submission.address.street.trim() || submission.address.complexName.trim()));
}

function buildDescription(submission: PropertySubmission) {
  const parts = [
    submission.ownerDescription.likes,
    submission.ownerDescription.minuses ? `Честные минусы: ${submission.ownerDescription.minuses}` : '',
    submission.ownerDescription.fitFor ? `Подойдет: ${submission.ownerDescription.fitFor}` : '',
    submission.ownerDescription.sellingReason ? `Причина продажи: ${submission.ownerDescription.sellingReason}` : '',
  ].filter(Boolean);

  return parts.join('\n') || 'Описание будет собрано из ответов собственника и проверки Gold House.';
}

function renderChoiceGroup(label: string, options: string[], selected: string, onSelect: (value: string) => void) {
  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.compactOptions}>
        {options.map((option) => (
          <OptionButton key={option} label={option} selected={selected === option} onPress={() => onSelect(option)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  helper: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  options: {
    gap: spacing.sm,
  },
  compactOptions: {
    gap: spacing.sm,
  },
  twoColumns: {
    gap: spacing.md,
  },
  choiceGroup: {
    gap: spacing.sm,
  },
  questionList: {
    gap: spacing.sm,
  },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  questionNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.black,
    color: colors.background,
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '900',
  },
  questionText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
  },
  previewWrap: {
    gap: spacing.lg,
  },
  previewCard: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  previewImage: {
    width: '100%',
    height: 260,
  },
  previewBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  pending: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  previewPrice: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  previewTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  previewMeta: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  factRow: {
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
  description: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  successScreen: {
    minHeight: 560,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  successMark: {
    color: colors.accentDark,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  successTitle: {
    color: colors.text,
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
  },
  successText: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 25,
  },
});
