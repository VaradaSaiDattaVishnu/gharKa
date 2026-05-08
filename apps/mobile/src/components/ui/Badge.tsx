import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii, spacing } from '../../theme/spacing';

type BadgeVariant = 'turmeric' | 'coriander' | 'terracotta' | 'info' | 'warning' | 'error' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  turmeric: { bg: colors.turmeric.light, text: colors.turmeric.dark },
  coriander: { bg: colors.coriander.light, text: colors.coriander.dark },
  terracotta: { bg: '#FBE9E7', text: colors.terracotta },
  info: { bg: '#E3F2FD', text: colors.info },
  warning: { bg: '#FFF8E1', text: '#F57F17' },
  error: { bg: '#FFEBEE', text: colors.error },
  muted: { bg: colors.mist, text: colors.slate },
};

export function Badge({ label, variant = 'turmeric', size = 'sm', style }: BadgeProps) {
  const palette = variantColors[variant];

  return (
    <View
      style={[
        styles.badge,
        size === 'md' ? styles.md : styles.sm,
        { backgroundColor: palette.bg },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'md' ? styles.textMd : styles.textSm,
          { color: palette.text },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.full,
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
  },
  textSm: {
    fontSize: 10,
    lineHeight: 14,
  },
  textMd: {
    fontSize: 12,
    lineHeight: 16,
  },
});
