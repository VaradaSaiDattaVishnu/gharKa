import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Plus, ChefHat, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react-native';
import { formatCurrency, CATEGORY_DISPLAY_NAMES, type FoodCategory } from '@gharka/shared';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, radii, shadows } from '../../../src/theme/spacing';
import { Badge } from '../../../src/components/ui/Badge';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { useMyListings, useToggleListing, useDeleteListing } from '../../../src/hooks/use-listings';
import { useAuthStore } from '../../../src/store/auth-store';
import { useUIStore } from '../../../src/store/ui-store';

export default function SellScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const { data, isLoading, refetch, isRefetching } = useMyListings();
  const toggleListing = useToggleListing();
  const deleteListing = useDeleteListing();

  const listings = useMemo(() => {
    const all = data?.data ?? [];
    return all.filter((l) => l.sellerId === user?.id);
  }, [data, user]);

  const handleToggle = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      try {
        await toggleListing.mutateAsync(id);
        addToast('success', 'Listing updated');
      } catch (err: any) {
        addToast('error', err?.message ?? 'Failed to update listing');
      }
    },
    [toggleListing, addToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        await deleteListing.mutateAsync(id);
        addToast('success', 'Listing removed');
      } catch (err: any) {
        addToast('error', err?.message ?? 'Failed to remove listing');
      }
    },
    [deleteListing, addToast]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/(tabs)/sell/new');
          }}
          style={styles.addButton}
        >
          <Plus size={20} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const categoryName = CATEGORY_DISPLAY_NAMES[item.category as FoodCategory] ?? item.category;
          return (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                {item.images.length > 0 && (
                  <Image source={{ uri: item.images[0] }} style={styles.thumb} />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <View style={styles.cardMeta}>
                    <Badge label={categoryName} variant="turmeric" size="sm" />
                    <Text style={styles.cardPrice}>{formatCurrency(item.price)}</Text>
                  </View>
                  <Text style={styles.cardQty}>
                    {item.availableQuantity} of {item.quantity} available
                  </Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => handleToggle(item.id)}
                  style={styles.actionBtn}
                >
                  {item.isActive ? (
                    <ToggleRight size={24} color={colors.coriander.DEFAULT} />
                  ) : (
                    <ToggleLeft size={24} color={colors.ash} />
                  )}
                  <Text
                    style={[
                      styles.actionText,
                      { color: item.isActive ? colors.coriander.DEFAULT : colors.ash },
                    ]}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item.id)}
                  style={styles.actionBtn}
                >
                  <Trash2 size={18} color={colors.error} />
                </Pressable>
              </View>
            </View>
          );
        }}
        contentContainerStyle={[
          styles.list,
          listings.length === 0 && styles.emptyList,
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
              icon={<ChefHat size={48} color={colors.ash} />}
              title="No listings yet"
              subtitle="Start sharing your homemade food with your neighbors!"
              actionLabel="Add Your First Dish"
              onAction={() => router.push('/(tabs)/sell/new')}
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
    backgroundColor: colors.cloud,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.turmeric.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    padding: spacing.md,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    marginRight: spacing.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardPrice: {
    ...typography.body,
    color: colors.turmeric.DEFAULT,
    fontFamily: 'Inter_600SemiBold',
  },
  cardQty: {
    ...typography.bodySmall,
    color: colors.slate,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.mist,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
  },
  actionText: {
    ...typography.bodySmall,
    fontFamily: 'Inter_600SemiBold',
  },
});
