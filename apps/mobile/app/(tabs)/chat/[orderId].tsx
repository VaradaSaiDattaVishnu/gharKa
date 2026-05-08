import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { Avatar } from '../../../src/components/ui/Avatar';
import { LoadingPot } from '../../../src/components/ui/LoadingPot';
import { ChatBubble } from '../../../src/components/chat/ChatBubble';
import { ChatInput } from '../../../src/components/chat/ChatInput';
import { DisclaimerBanner } from '../../../src/components/shared/DisclaimerBanner';
import { useMessages, useSendMessage, useMarkAsRead } from '../../../src/hooks/use-messages';
import { useOrder } from '../../../src/hooks/use-orders';
import { useAuthStore } from '../../../src/store/auth-store';
import { useSocket } from '../../../src/hooks/use-socket';

export default function ChatRoomScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

  useSocket();

  const { data: messagesData, isLoading } = useMessages(orderId ?? '');
  const { data: orderData } = useOrder(orderId ?? '');
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  const messages = useMemo(
    () => [...(messagesData?.data ?? [])].reverse(),
    [messagesData]
  );

  const order = orderData?.data;
  const otherUser = useMemo(() => {
    if (!order || !user) return null;
    if (order.buyerId === user.id) return (order as any).seller;
    return (order as any).buyer;
  }, [order, user]);

  useEffect(() => {
    if (orderId) {
      markAsRead.mutate(orderId);
    }
  }, [orderId]);

  const handleSend = useCallback(
    (content: string) => {
      if (!orderId) return;
      sendMessage.mutate({ orderId, content });
    },
    [orderId, sendMessage]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Avatar uri={otherUser?.avatarUrl} name={otherUser?.name} size="md" />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {otherUser?.name ?? 'Chat'}
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {(order as any)?.listing?.title ?? `Order #${orderId?.slice(0, 8)}`}
          </Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerWrapper}>
        <DisclaimerBanner message="Arrange payment directly with the cook. GharKa does not process payments." />
      </View>

      {/* Messages */}
      {isLoading ? (
        <View style={styles.loading}>
          <LoadingPot size={60} />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ChatBubble
              content={item.content}
              timestamp={item.createdAt}
              isSent={item.senderId === user?.id}
              index={index}
            />
          )}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cloud,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
    gap: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...typography.h3,
    color: colors.charcoal,
    fontSize: 15,
  },
  headerSub: {
    ...typography.bodySmall,
    color: colors.slate,
  },
  disclaimerWrapper: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageList: {
    paddingVertical: spacing.md,
  },
});
