import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface LoadingPotProps {
  size?: number;
}

export function LoadingPot({ size = 80 }: LoadingPotProps) {
  const steam1Y = useSharedValue(0);
  const steam2Y = useSharedValue(0);
  const steam3Y = useSharedValue(0);
  const steam1Opacity = useSharedValue(0);
  const steam2Opacity = useSharedValue(0);
  const steam3Opacity = useSharedValue(0);

  useEffect(() => {
    const animateSteam = (
      yVal: Animated.SharedValue<number>,
      opacityVal: Animated.SharedValue<number>,
      delay: number
    ) => {
      yVal.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(-20, { duration: 1200, easing: Easing.out(Easing.ease) })
          ),
          -1,
          false
        )
      );
      opacityVal.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.8, { duration: 300 }),
            withTiming(0, { duration: 900 })
          ),
          -1,
          false
        )
      );
    };

    animateSteam(steam1Y, steam1Opacity, 0);
    animateSteam(steam2Y, steam2Opacity, 400);
    animateSteam(steam3Y, steam3Opacity, 800);
  }, [steam1Y, steam2Y, steam3Y, steam1Opacity, steam2Opacity, steam3Opacity]);

  const steam1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: steam1Y.value }],
    opacity: steam1Opacity.value,
  }));

  const steam2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: steam2Y.value }],
    opacity: steam2Opacity.value,
  }));

  const steam3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: steam3Y.value }],
    opacity: steam3Opacity.value,
  }));

  const scale = size / 80;

  return (
    <View style={[styles.container, { width: size, height: size + 20 }]}>
      {/* Steam wisps */}
      <View style={[styles.steamContainer, { top: 0 }]}>
        <Animated.View style={[styles.steam, { left: 20 * scale }, steam1Style]}>
          <View style={[styles.steamDot, { backgroundColor: colors.turmeric.DEFAULT }]} />
        </Animated.View>
        <Animated.View style={[styles.steam, { left: 38 * scale }, steam2Style]}>
          <View style={[styles.steamDot, { backgroundColor: colors.turmeric.dark }]} />
        </Animated.View>
        <Animated.View style={[styles.steam, { left: 56 * scale }, steam3Style]}>
          <View style={[styles.steamDot, { backgroundColor: colors.turmeric.DEFAULT }]} />
        </Animated.View>
      </View>

      {/* Pot SVG */}
      <Svg width={size} height={size * 0.7} viewBox="0 0 80 56" style={{ marginTop: 20 }}>
        {/* Lid */}
        <Ellipse cx="40" cy="8" rx="30" ry="6" fill={colors.turmeric.dark} />
        <Circle cx="40" cy="4" r="4" fill={colors.turmeric.DEFAULT} />
        {/* Pot body */}
        <Path
          d="M12 14 L10 44 Q10 54 20 54 L60 54 Q70 54 70 44 L68 14 Z"
          fill={colors.turmeric.DEFAULT}
        />
        {/* Handles */}
        <Path d="M10 22 Q2 22 2 28 Q2 34 10 34" stroke={colors.turmeric.dark} strokeWidth="3" fill="none" />
        <Path d="M70 22 Q78 22 78 28 Q78 34 70 34" stroke={colors.turmeric.dark} strokeWidth="3" fill="none" />
        {/* Stripe */}
        <Path d="M14 30 L66 30" stroke={colors.turmeric.dark} strokeWidth="2" opacity="0.3" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  steamContainer: {
    position: 'absolute',
    flexDirection: 'row',
    width: '100%',
    height: 30,
  },
  steam: {
    position: 'absolute',
    top: 0,
  },
  steamDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
