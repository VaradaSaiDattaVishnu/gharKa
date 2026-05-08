import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { formatRelativeTime, formatCurrency, OrderStatus } from '@gharka/shared';
import type { OrderResponse, ListingResponse, UserResponse } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii, shadows } from '../../theme/spacing';
import { Avatar } from '../ui/Avatar';
import { OrderStatusBadge } from './OrderStatusBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OrderCardProps {
  order: OrderResponse & {
    listing?: ListingResponse;
    buyer?: UserResponse;
    seller?: UserResponse;
  };
  currentUserId: string;
  onPress: (orderId: string) => void;
}

export function OrderCard({ order, currentUserId, onPress }: OrderCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(order.id);
  }, [order.id, onPress]);

  const isBuyer = order.buyerId === currentUserId;
  const otherUser = isBuyer ? order.seller : order.buyer;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
    >
      {/* Listing thumbnail */}
      {order.listing && order.listing.images.length > 0 && (
        <Image
          source={{ uri: order.listing.images[0] }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {order.listing?.title ?? 'Order'}
          </Text>
          <OrderStatusBadge status={order.status as OrderStatus} size="sm" />
        </View>

        <View style={styles.info}>
          <View style={styles.userInfo}>
            <Avatar uri={otherUser?.avatarUrl} name={otherUser?.name} size="sm" />
            <Text style={styles.userName} numberOfLines={1}>
              {isBuyer ? `by ${otherUser?.name ?? 'Cook'}` : `from ${otherUser?.name ?? 'Buyer'}`}
            </Text>
          </View>
          <Text style={styles.meta}>
            Qty: {order.quantity}
            {order.listing ? ` | ${formatCurrency(order.listing.price * order.quantity)}` : ''}
          </Text>
        </View>

        <Text style={styles.time}>
          {formatRelativeTime(new Date(order.createdAt))}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  thumbnail: {
    width: 80,
    height: '100%',
    minHeight: 90,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.charcoal,
    flex: 1,
    fontSize: 15,
  },
  info: {
    marginBottom: spacing.xs,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.bodySmall,
    color: colors.slate,
    flex: 1,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.slate,
  },
  time: {
    ...typography.bodySmall,
    color: colors.ash,
    fontSize: 11,
  },
});
