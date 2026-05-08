import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { formatRelativeTime } from '@gharka/shared';
import type { Conversation } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { Avatar } from '../ui/Avatar';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: (orderId: string) => void;
}

export function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(conversation.orderId);
  }, [conversation.orderId, onPress]);

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Avatar
        uri={conversation.otherUserAvatar}
        name={conversation.otherUserName}
        size="lg"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.otherUserName}
          </Text>
          <Text style={styles.time}>
            {formatRelativeTime(new Date(conversation.lastMessageAt))}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    ...typography.h3,
    color: colors.charcoal,
    fontSize: 15,
    flex: 1,
    marginRight: spacing.sm,
  },
  time: {
    ...typography.bodySmall,
    color: colors.ash,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    ...typography.body,
    color: colors.slate,
    flex: 1,
    marginRight: spacing.sm,
  },
  lastMessageUnread: {
    color: colors.charcoal,
    fontFamily: 'Inter_600SemiBold',
  },
  unreadBadge: {
    backgroundColor: colors.turmeric.DEFAULT,
    borderRadius: radii.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    ...typography.bodySmall,
    color: colors.white,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
