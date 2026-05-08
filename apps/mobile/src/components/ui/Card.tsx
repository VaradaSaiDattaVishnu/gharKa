import React, { useCallback } from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { radii, shadows, spacing } from '../../theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
}

export function Card({ children, style, padding = 'lg' }: CardProps) {
  return (
    <View style={[styles.card, { padding: spacing[padding] }, style]}>
      {children}
    </View>
  );
}

interface PressableCardProps extends CardProps {
  onPress: () => void;
  disabled?: boolean;
}

export function PressableCard({
  children,
  onPress,
  disabled,
  style,
  padding = 'lg',
}: PressableCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.card, { padding: spacing[padding] }, style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    ...shadows.md,
  },
});
