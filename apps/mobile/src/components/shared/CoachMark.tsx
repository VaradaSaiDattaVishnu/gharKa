import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from 'expo-secure-store';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii, shadows } from '../../theme/spacing';

interface CoachMarkProps {
  id: string;
  message: string;
  children: React.ReactNode;
}

export function CoachMark({ id, message, children }: CoachMarkProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItemAsync(`coachmark_${id}`).then((val) => {
      if (!val) setVisible(true);
    });
  }, [id]);

  const dismiss = () => {
    setVisible(false);
    AsyncStorage.setItemAsync(`coachmark_${id}`, 'seen');
  };

  return (
    <View>
      {children}
      {visible && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
          <Pressable onPress={dismiss} style={styles.tooltip}>
            <Text style={styles.text}>{message}</Text>
            <Text style={styles.dismiss}>Got it</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.charcoal,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...shadows.lg,
    zIndex: 100,
  },
  text: {
    ...typography.bodySmall,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  dismiss: {
    ...typography.label,
    color: colors.turmeric.DEFAULT,
    alignSelf: 'flex-end',
  },
});
