import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Minus, Plus } from 'lucide-react-native';
import { formatCurrency, CATEGORY_DISPLAY_NAMES, type FoodCategory } from '@gharka/shared';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, radii, shadows } from '../../../src/theme/spacing';
import { Avatar } from '../../../src/components/ui/Avatar';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { LoadingPot } from '../../../src/components/ui/LoadingPot';
import { DisclaimerBanner } from '../../../src/components/shared/DisclaimerBanner';
import { useListing } from '../../../src/hooks/use-listings';
import { useCreateOrder } from '../../../src/hooks/use-orders';
import { useAuthStore } from '../../../src/store/auth-store';
import { useUIStore } from '../../../src/store/ui-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.75;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const scrollY = useSharedValue(0);

  const { data, isLoading } = useListing(id ?? '');
  const createOrder = useCreateOrder();
  const [quantity, setQuantity] = useState(1);

  const listing = data?.data;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, IMAGE_HEIGHT],
      [-50, 0, IMAGE_HEIGHT * 0.5],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.3, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [IMAGE_HEIGHT - 120, IMAGE_HEIGHT - 60],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const handleOrder = useCallback(async () => {
    if (!listing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await createOrder.mutateAsync({
        listingId: listing.id,
        quantity,
      });
      addToast('success', 'Order placed! The cook will confirm shortly.');
      router.back();
    } catch (err: any) {
      addToast('error', err?.message ?? 'Failed to place order');
    }
  }, [listing, quantity, createOrder, addToast, router]);

  if (isLoading || !listing) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <View style={styles.loadingContent}>
          <LoadingPot size={80} />
        </View>
      </View>
    );
  }

  const seller = (listing as any).seller;
  const maxQty = listing.availableQuantity;
  const categoryName = CATEGORY_DISPLAY_NAMES[listing.category as FoodCategory] ?? listing.category;
  const isSelf = user?.id === listing.sellerId;

  return (
    <View style={styles.container}>
      {/* Floating back button */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtnFloat}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Animated.View style={[styles.floatingTitle, headerStyle]}>
          <Text style={styles.floatingTitleText} numberOfLines={1}>
            {listing.title}
          </Text>
        </Animated.View>
      </View>

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        {/* Parallax image */}
        <Animated.View style={[styles.imageWrapper, imageStyle]}>
          <Image
            source={
              listing.images.length > 0
                ? { uri: listing.images[0] }
                : require('../../../assets/icon.png')
            }
            style={styles.heroImage}
            resizeMode="cover"
          />
        </Animated.View>

        <View style={styles.content}>
          {/* Title + Price */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>{formatCurrency(listing.price)}</Text>
          </View>

          <View style={styles.badges}>
            <Badge label={categoryName} variant="turmeric" size="md" />
            {listing.availableQuantity <= 3 && listing.availableQuantity > 0 && (
              <Badge label={`Only ${listing.availableQuantity} left`} variant="warning" size="md" />
            )}
          </View>

          {listing.description && (
            <Text style={styles.description}>{listing.description}</Text>
          )}

          {/* Seller card */}
          {seller && (
            <View style={styles.sellerCard}>
              <Avatar uri={seller.avatarUrl} name={seller.name} size="lg" />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerLabel}>Made by</Text>
                <Text style={styles.sellerName}>{seller.name ?? 'Cook'}</Text>
              </View>
            </View>
          )}

          {/* Disclaimer */}
          <View style={styles.disclaimerWrapper}>
            <DisclaimerBanner />
          </View>

          {/* Quantity picker */}
          {!isSelf && maxQty > 0 && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityPicker}>
                <Pressable
                  onPress={() => {
                    setQuantity((q) => Math.max(1, q - 1));
                    Haptics.selectionAsync();
                  }}
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  disabled={quantity <= 1}
                >
                  <Minus size={18} color={quantity <= 1 ? colors.ash : colors.charcoal} />
                </Pressable>
                <Text style={styles.qtyText}>{quantity}</Text>
                <Pressable
                  onPress={() => {
                    setQuantity((q) => Math.min(maxQty, q + 1));
                    Haptics.selectionAsync();
                  }}
                  style={[styles.qtyBtn, quantity >= maxQty && styles.qtyBtnDisabled]}
                  disabled={quantity >= maxQty}
                >
                  <Plus size={18} color={quantity >= maxQty ? colors.ash : colors.charcoal} />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </AnimatedScrollView>

      {/* Bottom CTA */}
      {!isSelf && maxQty > 0 && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              {formatCurrency(listing.price * quantity)}
            </Text>
          </View>
          <Button
            title="Request This Dish"
            onPress={handleOrder}
            loading={createOrder.isPending}
            fullWidth
            size="lg"
          />
        </View>
      )}

      {isSelf && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Text style={styles.selfNote}>This is your listing</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  backBtnFloat: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  floatingTitle: {
    flex: 1,
    marginLeft: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
  },
  floatingTitleText: {
    ...typography.h3,
    color: colors.charcoal,
  },
  imageWrapper: {
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
    flex: 1,
  },
  price: {
    ...typography.h1,
    color: colors.turmeric.DEFAULT,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.bodyLarge,
    color: colors.slate,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.cloud,
    borderRadius: radii.xl,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerLabel: {
    ...typography.bodySmall,
    color: colors.ash,
    marginBottom: 2,
  },
  sellerName: {
    ...typography.h3,
    color: colors.charcoal,
  },
  disclaimerWrapper: {
    marginBottom: spacing.lg,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    ...typography.h3,
    color: colors.charcoal,
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyText: {
    ...typography.h2,
    color: colors.charcoal,
    minWidth: 24,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.mist,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    ...shadows.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    ...typography.body,
    color: colors.slate,
  },
  totalPrice: {
    ...typography.h2,
    color: colors.turmeric.DEFAULT,
  },
  selfNote: {
    ...typography.body,
    color: colors.slate,
    textAlign: 'center',
  },
});
