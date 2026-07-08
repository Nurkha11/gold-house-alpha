import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { OptionButton } from '@/components/OptionButton';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { colors, spacing } from '@/constants/theme';
import { properties } from '@/data/properties';

const timeSlots = ['18:00', '18:30', '19:00', '19:30'];

export default function ViewingFlow() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const property = properties.find((item) => item.id === id);
  const [selectedTime, setSelectedTime] = useState('18:30');

  return (
    <Screen>
      <PageHeader
        eyebrow="Просмотр"
        title="AI рекомендует лучшее время просмотра"
        subtitle={`Лучшее время сегодня — ${selectedTime}${property ? ` для ${property.title}` : ''}`}
      />

      <Section title="Почему это время подходит">
        <Text style={styles.reason}>• В квартире будет естественное вечернее освещение.</Text>
        <Text style={styles.reason}>• Можно оценить шум двора после рабочего дня.</Text>
        <Text style={styles.reason}>• Будет понятно, насколько удобно с парковкой.</Text>
        <Text style={styles.reason}>• Видно, как выглядит двор вечером.</Text>
      </Section>

      {property ? (
        <View style={styles.recommendation}>
          <Text style={styles.recommendationLabel}>Рекомендуемое окно</Text>
          <Text style={styles.recommendationText}>
            {property.availableViewingTime.day}, {property.availableViewingTime.time}
          </Text>
        </View>
      ) : null}

      <View style={styles.times}>
        {timeSlots.map((time) => (
          <OptionButton key={time} label={time} selected={selectedTime === time} onPress={() => setSelectedTime(time)} />
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Подтвердить просмотр"
          variant="success"
          onPress={() => router.push({ pathname: '/confirmed', params: { id, time: selectedTime } })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  reason: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  recommendation: {
    backgroundColor: colors.accentSoft,
    borderRadius: 22,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  recommendationLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recommendationText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: spacing.xs,
  },
  times: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: spacing.xl,
  },
});
