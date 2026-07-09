import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PageHeader } from '@/components/PageHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuestionCard } from '@/components/QuestionCard';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';

const roomOptions = ['1', '2', '3', '4+'];
const allRoomsValue = 'all';

function initialRooms(value?: string) {
  if (!value) return ['1'];
  return value === allRoomsValue ? [allRoomsValue] : value.split(',').filter(Boolean);
}

export default function RoomsScreen() {
  const params = useLocalSearchParams<{
    city?: string;
    district?: string;
    budgetRange?: string;
    budgetLabel?: string;
    budgetMin?: string;
    budgetMax?: string;
    rooms?: string;
    floorPreference?: string;
  }>();
  const [selectedRooms, setSelectedRooms] = useState<string[]>(initialRooms(params.rooms));

  function toggleRoom(option: string) {
    if (option === allRoomsValue) {
      setSelectedRooms([allRoomsValue]);
      return;
    }

    setSelectedRooms((current) => {
      const withoutAll = current.filter((room) => room !== allRoomsValue);
      const next = withoutAll.includes(option) ? withoutAll.filter((room) => room !== option) : [...withoutAll, option];
      return next.length ? next : [option];
    });
  }

  const rooms = selectedRooms.includes(allRoomsValue) ? allRoomsValue : selectedRooms.join(',');

  return (
    <Screen>
      <OnboardingProgress step={5} total={8} />
      <PageHeader
        eyebrow="Комнаты"
        title="Какую комнатность рассматриваете?"
        subtitle="Можно выбрать несколько вариантов, например 1 + 2 или 2 + 3."
      />
      <View style={styles.grid}>
        {roomOptions.map((option) => {
          const selected = selectedRooms.includes(option) && !selectedRooms.includes(allRoomsValue);
          return (
            <QuestionCard
              key={option}
              title={option}
              selected={selected}
              icon={<Text style={styles.check}>{selected ? '✓' : ''}</Text>}
              onPress={() => toggleRoom(option)}
            />
          );
        })}
        <QuestionCard
          title="Все варианты"
          subtitle="Покажем все квартиры по комнатности."
          selected={selectedRooms.includes(allRoomsValue)}
          icon={<Text style={styles.check}>{selectedRooms.includes(allRoomsValue) ? '✓' : ''}</Text>}
          onPress={() => toggleRoom(allRoomsValue)}
        />
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="Продолжить" onPress={() => router.push({ pathname: '/floor', params: { ...params, rooms } } as never)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md,
  },
  check: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '900',
  },
  footer: {
    marginTop: spacing.xl,
  },
});
