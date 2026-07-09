import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import { saveBuyerProfile, startGuestBuyerSession } from '@/data/buyerProfileStore';

const profileMessageDelayMs = 2200;

function formatKazakhstanPhone(value: string) {
  const rawDigits = value.replace(/\D/g, '');
  const withoutCountryCode = rawDigits.startsWith('7') ? rawDigits.slice(1) : rawDigits;
  const digits = withoutCountryCode.slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8, 10)].filter(Boolean);
  return `+7${parts.length ? ` ${parts.join(' ')}` : ' '}`;
}

export default function BuyerProfileScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 ');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handlePhoneChange(value: string) {
    setPhone(formatKazakhstanPhone(value));
  }

  function saveAndContinue() {
    const phoneDigits = phone.replace(/\D/g, '');
    if (!name.trim() || phoneDigits.length < 11) {
      setError('Введите имя и номер телефона или продолжите без сохранения.');
      return;
    }

    const result = saveBuyerProfile(name, phone);
    setError('');
    setMessage(result.message);
    setTimeout(() => {
      router.replace(result.restored ? ('/buyer-cabinet' as never) : ('/city' as never));
    }, profileMessageDelayMs);
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
        subtitle="Введите имя и номер телефона. Мы будем запоминать ваши предпочтения, чтобы при следующем входе рекомендации стали точнее."
      />

      <Section title="Запомнить мои рекомендации" soft>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Имя</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Например, Нурхан" placeholderTextColor={colors.muted} style={styles.input} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Телефон</Text>
            <TextInput
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              placeholder="+7 777 000 00 00"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>

          {message ? (
            <View style={styles.notice}>
              <Text style={styles.noticeMark}>•</Text>
              <Text style={styles.noticeText}>{message}</Text>
            </View>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton title="Сохранить и продолжить" onPress={saveAndContinue} />
          <PrimaryButton title="Продолжить без сохранения" variant="secondary" onPress={continueAsGuest} />
        </View>
      </Section>

      <Text style={styles.helper}>Регистрация не обязательна. Без номера история будет храниться только внутри текущей сессии.</Text>
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
