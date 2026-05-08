import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { OrderStatus } from '@gharka/shared';
import { Package } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { OrderCard } from '../../src/components/orders/OrderCard';
import { OrderTimeline } from '../../src/components/orders/OrderTimeline';
import { useOrders, useUpdateOrderStatus } from '../../src/hooks/use-orders';
import { useAuthStore } from '../../src/store/auth-store';
import { useUIStore } from '../../src/store/ui-store';

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const { data, isLoading, refetch, isRefetching } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orders = useMemo(() => data?.data ?? [], [data]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId),
    [orders, selectedOrderId]
  );

  const handleOrderPress = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
  }, []);

  const handleStatusUpdate = useCallback(
    async (status: string) => {
      if (!selectedOrderId) return;
      try {
        await updateStatus.mutateAsync({ id: selectedOrderId, status });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        addToast('success', `Order ${status.toLowerCase().replace('_', ' ')}`);
        setSelectedOrderId(null);
      } catch (err: any) {
        addToast('error', err?.message ?? 'Failed to update order');
      }
    },
    [selectedOrderId, updateStatus, addToast]
  );

  const getNextAction = useCallback(() => {
    if (!selectedOrder || !user) return null;
    const status = selectedOrder.status as OrderStatus;
    const isSeller = selectedOrder.sellerId === user.id;

    if (isSeller) {
      if (status === OrderStatus.PLACED) return { label: 'Confirm Order', next: OrderStatus.CONFIRMED };
      if (status === OrderStatus.CONFIRMED) return { label: 'Mark Ready', next: OrderStatus.READY };
    } else {
      if (status === OrderStatus.READY) return { label: 'Mark Picked Up', next: OrderStatus.PICKED_UP };
      if (status === OrderStatus.PICKED_UP) return { label: 'Complete Order', next: OrderStatus.COMPLETED };
    }

    if (
      (status === OrderStatus.PLACED || status === OrderStatus.CONFIRMED) &&
      (isSeller || selectedOrder.buyerId === user.id)
    ) {
      return { label: 'Cancel Order', next: OrderStatus.CANCELLED, variant: 'ghost' as const };
    }

    return null;
  }, [selectedOrder, user]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            currentUserId={user?.id ?? ''}
            onPress={handleOrderPress}
          />
        )}
        contentContainerStyle={[
          styles.list,
          orders.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
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
              icon={<Package size={48} color={colors.ash} />}
              title="No orders yet"
              subtitle="Your orders will appear here once you request a dish from a cook."
              actionLabel="Browse Food"
              onAction={() => router.push('/(tabs)/feed')}
            />
          ) : null
        }
      />

      {/* Order detail bottom sheet */}
      <BottomSheet
        visible={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        snapPoints={[0.55]}
      >
        {selectedOrder && (
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>
              {(selectedOrder as any).listing?.title ?? 'Order Details'}
            </Text>
            <OrderTimeline currentStatus={selectedOrder.status as OrderStatus} />

            <View style={styles.sheetActions}>
              {getNextAction() && (
                <Button
                  title={getNextAction()!.label}
                  onPress={() => handleStatusUpdate(getNextAction()!.next)}
                  variant={getNextAction()!.label.includes('Cancel') ? 'ghost' : 'primary'}
                  loading={updateStatus.isPending}
                  fullWidth
                  size="lg"
                />
              )}
              <Button
                title="Go to Chat"
                onPress={() => {
                  setSelectedOrderId(null);
                  router.push(`/(tabs)/chat/${selectedOrder.id}`);
                }}
                variant="outline"
                fullWidth
                size="md"
              />
            </View>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cloud,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  emptyList: {
    flexGrow: 1,
  },
  sheetContent: {
    paddingHorizontal: spacing.sm,
  },
  sheetTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  sheetActions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
