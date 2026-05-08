import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii, shadows } from '../../theme/spacing';
import { Button } from '../ui/Button';

interface LocationPromptProps {
  onAllow: () => void;
  loading?: boolean;
}

export function LocationPrompt({ onAllow, loading }: LocationPromptProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <MapPin size={32} color={colors.turmeric.DEFAULT} />
      </View>
      <Text style={styles.title}>Enable Location</Text>
      <Text style={styles.description}>
        GharKa needs your location to show homemade food available near you. We only
        use it while you are using the app.
      </Text>
      <Button
        title="Allow Location Access"
        onPress={onAllow}
        loading={loading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
    margin: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.turmeric.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.slate,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing['2xl'],
  },
});
