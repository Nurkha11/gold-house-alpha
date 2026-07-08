import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { statusLabels } from '@/data/ownerStore';
import { SubmissionStatus } from '@/data/ownerTypes';

type OwnerStatusBadgeProps = {
  status: SubmissionStatus;
};

const statusTone: Record<SubmissionStatus, 'neutral' | 'gold' | 'green' | 'danger'> = {
  draft: 'neutral',
  submitted: 'gold',
  reviewing: 'gold',
  needs_shooting: 'gold',
  approved: 'green',
  published: 'green',
  rejected: 'danger',
};

export function OwnerStatusBadge({ status }: OwnerStatusBadgeProps) {
  const tone = statusTone[status];

  return (
    <View style={[styles.badge, styles[tone]]}>
      <Text style={[styles.text, tone === 'green' && styles.greenText, tone === 'danger' && styles.dangerText]}>
        {statusLabels[status]}
      </Text>
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
  neutral: {
    backgroundColor: colors.surface,
  },
  gold: {
    backgroundColor: colors.accentSoft,
  },
  green: {
    backgroundColor: colors.successSoft,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
  },
  text: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '900',
  },
  greenText: {
    color: colors.success,
  },
  dangerText: {
    color: '#8B3528',
  },
});
