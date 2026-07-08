import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { saveBuyerProfile, startGuestBuyerSession } from '@/data/buyerProfileStore';

export default function BuyerProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function saveAndContinue() {
    if (!name.trim() || !phone.trim()) {
      setError('Введите имя и номер телефона или продолжите без сохранения.');
      return;
    }

    const result = saveBuyerProfile(name, phone);
    setError('');
    setMessage(result.restored ? 'Мы нашли ваши прошлые предпочтения.' : 'Рекомендации будут сохранены для следующего входа.');
    setTimeout(() => router.push('/city' as never), 450);
  }

  function continueAsGuest() {
    startGuestBuyerSession();
    router.push('/city' as never);
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Gold House"
        title="Хотите сохранить свои рекомендации?"
        subtitle="Оставьте имя и номер телефона, чтобы Gold House запомнил ваши лайки, просмотры и подборки. Так рекомендации станут точнее при следующем входе."
      />

      <Section title="Запомнить мои рекомендации" soft>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Имя</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Например, Нурхан" placeholderTextColor={colors.muted} style={styles.input} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+7 777 000 00 00" placeholderTextColor={colors.muted} style={styles.input} />
          </View>

          {message ? (
            <View style={styles.notice}>
              <Text style={styles.noticeMark}>✓</Text>
              <Text style={styles.noticeText}>{message}</Text>
            </View>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton title="Сохранить и продолжить" onPress={saveAndContinue} />
          <PrimaryButton title="Продолжить без сохранения" variant="secondary" onPress={continueAsGuest} />
        </View>
      </Section>

      <Text style={styles.helper}>Вы можете пользоваться приложением и без регистрации. Сохранение рекомендаций - это дополнительная возможность.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    padding: spacing.md,
    ...shadows.card,
  },
  noticeMark: {
    color: colors.accentDark,
    fontSize: 18,
    fontWeight: '900',
  },
  noticeText: {
    flex: 1,
    color: colors.accentDark,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
  },
  error: {
    color: '#8B3528',
    fontSize: 14,
    fontWeight: '800',
  },
  helper: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
