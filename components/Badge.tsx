import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

type BadgeProps = {
  label: string;
  tone?: 'gold' | 'green' | 'neutral';
};

export function Badge({ label, tone = 'gold' }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.text, tone === 'neutral' && styles.neutralText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  gold: {
    backgroundColor: colors.accentSoft,
  },
  green: {
    backgroundColor: colors.successSoft,
  },
  neutral: {
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '800',
  },
  neutralText: {
    color: colors.muted,
  },
});
