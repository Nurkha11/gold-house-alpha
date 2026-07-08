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
  const [phone, setPhone] = useState('');

  function handleLogin() {
    loginOwner(name, phone);
    router.replace('/owner-dashboard' as never);
  }

  return (
    <Screen>
      <PageHeader
        eyebrow="Кабинет собственника"
        title="Войдите, чтобы подать квартиру в Gold House"
        subtitle="Пока это mock-вход: достаточно имени и телефона. Реальную авторизацию подключим позже."
      />

      <Section title="Ваши данные">
        <OwnerField label="Имя" value={name} onChangeText={setName} placeholder="Например, Айдар" />
        <OwnerField label="Телефон" value={phone} onChangeText={setPhone} placeholder="+7 777 000 00 00" keyboardType="phone-pad" />
        <PrimaryButton title="Войти в кабинет" onPress={handleLogin} />
      </Section>

      <Text style={styles.note}>Данные остаются внутри прототипа и нужны только для демонстрации owner-flow.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});
