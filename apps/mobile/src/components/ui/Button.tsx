import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii, spacing } from '../../theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: colors.turmeric.DEFAULT },
    text: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.coriander.DEFAULT },
    text: { color: colors.white },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.turmeric.DEFAULT },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.turmeric.DEFAULT,
    },
    text: { color: colors.turmeric.DEFAULT },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.md,
    },
    text: { fontSize: 13, lineHeight: 18 },
  },
  md: {
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.lg,
    },
    text: { fontSize: 15, lineHeight: 20 },
  },
  lg: {
    container: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
      borderRadius: radii.xl,
    },
    text: { fontSize: 16, lineHeight: 22 },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [loading, disabled, onPress]);

  const isDisabled = disabled || loading;
  const vStyles = variantStyles[variant];
  const sStyles = sizeStyles[size];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.container,
        vStyles.container,
        sStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' || variant === 'outline' ? colors.turmeric.DEFAULT : colors.white}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              vStyles.text,
              sStyles.text,
              icon ? styles.textWithIcon : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  textWithIcon: {
    marginLeft: spacing.sm,
  },
});
