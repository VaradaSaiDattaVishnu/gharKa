import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ConversationCard } from '../../../src/components/chat/ConversationCard';
import { useConversations } from '../../../src/hooks/use-messages';

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch, isRefetching } = useConversations();

  const conversations = data?.data ?? [];

  const handleConversationPress = useCallback(
    (orderId: string) => {
      router.push(`/(tabs)/chat/${orderId}`);
    },
    [router]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => (
          <ConversationCard
            conversation={item}
            onPress={handleConversationPress}
          />
        )}
        contentContainerStyle={[
          styles.list,
          conversations.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.turmeric.DEFAULT}
            colors={[colors.turmeric.DEFAULT]}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon={<MessageCircle size={48} color={colors.ash} />}
              title="No messages yet"
              subtitle="When you place or receive an order, you can chat with the other person here."
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
  },
  list: {
    paddingBottom: spacing['5xl'],
  },
  emptyList: {
    flexGrow: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.mist,
    marginLeft: spacing.lg + 56 + spacing.md,
  },
});
