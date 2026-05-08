import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
  index?: number;
}

export function ChatBubble({ content, timestamp, isSent, index = 0 }: ChatBubbleProps) {
  const time = new Date(timestamp);
  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 30).duration(200)}
      style={[styles.container, isSent ? styles.sent : styles.received]}
    >
      <View style={[styles.bubble, isSent ? styles.bubbleSent : styles.bubbleReceived]}>
        <Text style={[styles.content, isSent ? styles.contentSent : styles.contentReceived]}>
          {content}
        </Text>
        <Text style={[styles.time, isSent ? styles.timeSent : styles.timeReceived]}>
          {timeStr}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  sent: {
    alignItems: 'flex-end',
  },
  received: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
  },
  bubbleSent: {
    backgroundColor: colors.turmeric.light,
    borderBottomRightRadius: radii.sm,
  },
  bubbleReceived: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: radii.sm,
  },
  content: {
    ...typography.body,
  },
  contentSent: {
    color: colors.charcoal,
  },
  contentReceived: {
    color: colors.charcoal,
  },
  time: {
    ...typography.bodySmall,
    fontSize: 10,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timeSent: {
    color: colors.turmeric.dark,
  },
  timeReceived: {
    color: colors.ash,
  },
});
