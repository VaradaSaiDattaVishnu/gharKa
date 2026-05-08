import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { formatDistance } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface DistanceBadgeProps {
  meters: number;
}

export function DistanceBadge({ meters }: DistanceBadgeProps) {
  const isNearby = meters < 1000;

  return (
    <View style={styles.container}>
      <View style={[styles.dot, isNearby ? styles.dotNearby : styles.dotFar]} />
      <MapPin size={12} color={isNearby ? colors.coriander.DEFAULT : colors.slate} />
      <Text style={[styles.text, isNearby ? styles.textNearby : styles.textFar]}>
        {formatDistance(meters)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cloud,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotNearby: {
    backgroundColor: colors.coriander.DEFAULT,
  },
  dotFar: {
    backgroundColor: colors.ash,
  },
  text: {
    ...typography.bodySmall,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  textNearby: {
    color: colors.coriander.DEFAULT,
  },
  textFar: {
    color: colors.slate,
  },
});
