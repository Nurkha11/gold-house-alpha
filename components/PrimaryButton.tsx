import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  icon?: ReactNode;
  style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, variant = 'primary', icon, style }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.text, variant !== 'primary' && variant !== 'success' && styles.darkText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.black,
  },
  secondary: {
    backgroundColor: colors.accentSoft,
  },
  ghost: {
    backgroundColor: colors.surface,
  },
  success: {
    backgroundColor: colors.success,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  text: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  darkText: {
    color: colors.text,
  },
});
