import React, { useCallback } from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CATEGORY_DISPLAY_NAMES, FoodCategory, FOOD_CATEGORIES } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryFilterProps {
  selected: FoodCategory | null;
  onSelect: (category: FoodCategory | null) => void;
}

interface CategoryPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function CategoryPill({ label, active, onPress }: CategoryPillProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: active ? colors.turmeric.DEFAULT : colors.white,
    borderColor: active ? colors.turmeric.DEFAULT : colors.mist,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPress();
  }, [onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.pill, animatedStyle]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <CategoryPill
        label="All"
        active={selected === null}
        onPress={() => onSelect(null)}
      />
      {FOOD_CATEGORIES.map((cat) => (
        <CategoryPill
          key={cat}
          label={CATEGORY_DISPLAY_NAMES[cat]}
          active={selected === cat}
          onPress={() => onSelect(selected === cat ? null : cat)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  pillText: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: colors.slate,
  },
  pillTextActive: {
    color: colors.white,
  },
});
