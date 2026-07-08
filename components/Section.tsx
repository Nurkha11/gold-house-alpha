import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';

type SectionProps = PropsWithChildren<{
  title?: string;
  soft?: boolean;
}>;

export function Section({ title, soft, children }: SectionProps) {
  return (
    <View style={[styles.section, soft && styles.soft]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  soft: {
    backgroundColor: colors.surface,
    shadowOpacity: 0,
    elevation: 0,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
