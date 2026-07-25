import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { OwnerField } from '@/components/OwnerField';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, spacing } from '@/constants/theme';
import { loginOwner } from '@/data/ownerStore';

export default function OwnerLoginScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7 ');

  function handleLogin() {
    loginOwner(name, phone);
    router.replace('/owner-dashboard' as never);
  }

  function handlePhoneChange(value: string) {
    setPhone(formatKazakhstanPhone(value));
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Кабинет собственника"
        title="Войдите, чтобы подать квартиру в Gold House"
        subtitle="Введите имя и номер телефона. Мы создадим ваш кабинет, чтобы вы могли подать квартиру на проверку и отслеживать статус заявки."
      />

      <Section title="Ваши данные">
        <OwnerField label="Имя" value={name} onChangeText={setName} placeholder="Например, Айдар" />
        <OwnerField label="Телефон" value={phone} onChangeText={handlePhoneChange} placeholder="+7 777 000 00 00" keyboardType="phone-pad" />
        <PrimaryButton title="Войти в кабинет" onPress={handleLogin} />
      </Section>

      <Text style={styles.note}>Единый формат номера: +7 777 000 00 00.</Text>
    </Screen>
  );
}

function formatKazakhstanPhone(value: string) {
  const raw = value.replace(/\D/g, '');
  const local = (raw.startsWith('7') ? raw.slice(1) : raw).slice(0, 10);
  const parts = [local.slice(0, 3), local.slice(3, 6), local.slice(6, 8), local.slice(8, 10)].filter(Boolean);

  return `+7${parts.length ? ` ${parts.join(' ')}` : ' '}`;
}

const styles = StyleSheet.create({
  note: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
