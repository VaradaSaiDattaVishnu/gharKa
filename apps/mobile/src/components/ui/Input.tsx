import React, { useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const AnimatedView = Animated.createAnimatedComponent(View);

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftElement,
  rightElement,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const handleFocus = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      setIsFocused(true);
      focusProgress.value = withTiming(1, { duration: 200 });
      onFocus?.(e);
    },
    [focusProgress, onFocus]
  );

  const handleBlur = useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      setIsFocused(false);
      focusProgress.value = withTiming(0, { duration: 200 });
      onBlur?.(e);
    },
    [focusProgress, onBlur]
  );

  const borderStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? colors.error
      : interpolateColor(
          focusProgress.value,
          [0, 1],
          [colors.mist, colors.turmeric.DEFAULT]
        );
    return { borderColor };
  });

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <AnimatedView style={[styles.container, borderStyle]}>
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
        <TextInput
          style={[
            styles.input,
            leftElement ? styles.inputWithLeft : undefined,
            rightElement ? styles.inputWithRight : undefined,
          ]}
          placeholderTextColor={colors.ash}
          selectionColor={colors.turmeric.DEFAULT}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </AnimatedView>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

interface PhoneInputProps extends Omit<InputProps, 'keyboardType' | 'leftElement'> {}

export function PhoneInput(props: PhoneInputProps) {
  return (
    <Input
      keyboardType="phone-pad"
      maxLength={13}
      leftElement={<Text style={styles.countryCode}>+91</Text>}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.charcoal,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderRadius: radii.lg,
    minHeight: 48,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.charcoal,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputWithLeft: {
    paddingLeft: spacing.xs,
  },
  inputWithRight: {
    paddingRight: spacing.xs,
  },
  leftElement: {
    paddingLeft: spacing.lg,
  },
  rightElement: {
    paddingRight: spacing.lg,
  },
  countryCode: {
    ...typography.bodyLarge,
    color: colors.slate,
    fontFamily: 'Inter_600SemiBold',
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
