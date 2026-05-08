import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface DisclaimerBannerProps {
  message?: string;
}

export function DisclaimerBanner({
  message = 'Arrange payment directly with the cook. GharKa does not process payments.',
}: DisclaimerBannerProps) {
  return (
    <View style={styles.container}>
      <Info size={16} color={colors.turmeric.dark} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.turmeric.light,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  text: {
    ...typography.bodySmall,
    color: colors.turmeric.dark,
    flex: 1,
    lineHeight: 17,
  },
});
