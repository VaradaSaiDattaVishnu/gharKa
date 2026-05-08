import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: number[];
  children: React.ReactNode;
}

export function BottomSheet({
  visible,
  onClose,
  snapPoints = [0.5],
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const maxTranslateY = -SCREEN_HEIGHT * Math.max(...snapPoints);

  useEffect(() => {
    if (visible) {
      const targetY = SCREEN_HEIGHT * (1 - snapPoints[0]);
      translateY.value = withSpring(targetY, { damping: 20, stiffness: 200 });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, snapPoints, translateY, backdropOpacity]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newY = context.value.y + event.translationY;
      translateY.value = Math.max(newY, SCREEN_HEIGHT * (1 - Math.max(...snapPoints)));
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 200 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
        runOnJS(onClose)();
      } else {
        const targetY = SCREEN_HEIGHT * (1 - snapPoints[0]);
        translateY.value = withSpring(targetY, { damping: 20, stiffness: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + spacing.lg },
            sheetStyle,
          ]}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.charcoal,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    minHeight: 200,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.mist,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
});
