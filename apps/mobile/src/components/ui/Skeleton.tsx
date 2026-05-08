import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/spacing';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width,
  height,
  borderRadius = radii.md,
  style,
}: SkeletonProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      shimmer.value,
      [0, 1],
      [colors.mist, colors.turmeric.light]
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <Animated.View style={skeletonStyles.card}>
      <Skeleton width="100%" height={160} borderRadius={radii.xl} />
      <Animated.View style={skeletonStyles.content}>
        <Skeleton width="70%" height={18} />
        <Animated.View style={skeletonStyles.row}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width="40%" height={14} />
        </Animated.View>
        <Skeleton width="30%" height={16} />
      </Animated.View>
    </Animated.View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: 12,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
