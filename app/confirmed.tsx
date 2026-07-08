import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing } from '@/constants/theme';

export default function ConfirmedScreen() {
  const { time = '18:30' } = useLocalSearchParams<{ time?: string }>();

  return (
    <Screen scroll={false}>
      <View style={styles.center}>
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
        <Text style={styles.kicker}>Отлично!</Text>
        <Text style={styles.title}>Просмотр подтвержден</Text>
        <Text style={styles.subtitle}>
          Вы записаны на просмотр квартиры на {time}. Наш менеджер скоро свяжется с вами для подтверждения времени.
        </Text>
      </View>
      <PrimaryButton title="Вернуться на главную" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  check: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: colors.success,
    fontSize: 48,
    fontWeight: '900',
  },
  kicker: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
