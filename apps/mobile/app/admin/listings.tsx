import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { formatCurrency, CATEGORY_DISPLAY_NAMES, type FoodCategory } from '@gharka/shared';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Badge } from '../../src/components/ui/Badge';
import { adminApi } from '../../src/hooks/use-api';
import { useUIStore } from '../../src/store/ui-store';

const api = adminApi();

export default function AdminListingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addToast = useUIStore((s) => s.addToast);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: api.listListings,
  });

  const deleteListing = useMutation({
    mutationFn: api.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    },
  });

  const listings = data?.data ?? [];

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
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>All Listings</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const categoryName = CATEGORY_DISPLAY_NAMES[item.category as FoodCategory] ?? item.category;
          return (
            <View style={styles.listingCard}>
              {item.images.length > 0 && (
                <Image source={{ uri: item.images[0] }} style={styles.thumb} />
              )}
              <View style={styles.listingInfo}>
                <Text style={styles.listingTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.listingMeta}>
                  <Badge label={categoryName} variant="turmeric" size="sm" />
                  <Text style={styles.listingPrice}>{formatCurrency(item.price)}</Text>
                </View>
                <Badge
                  label={item.isActive ? 'Active' : 'Inactive'}
                  variant={item.isActive ? 'coriander' : 'muted'}
                  size="sm"
                />
              </View>
              <Pressable
                onPress={() => handleDelete(item.id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={18} color={colors.error} />
              </Pressable>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.charcoal,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
  },
  listingInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  listingTitle: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    color: colors.charcoal,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listingPrice: {
    ...typography.bodySmall,
    color: colors.turmeric.DEFAULT,
    fontFamily: 'Inter_600SemiBold',
  },
  deleteBtn: {
    padding: spacing.sm,
  },
});
