import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, SlidersHorizontal } from 'lucide-react-native';
import { FoodCategory, type ListingResponse, type UserResponse } from '@gharka/shared';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing } from '../../../src/theme/spacing';
import { ListingGrid } from '../../../src/components/listings/ListingGrid';
import { CategoryFilter } from '../../../src/components/listings/CategoryFilter';
import { LocationPrompt } from '../../../src/components/shared/LocationPrompt';
import { useListings } from '../../../src/hooks/use-listings';
import { useLocation } from '../../../src/hooks/use-location';
import { useLocationStore } from '../../../src/store/location-store';

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { address, permissionStatus, requestPermission, getCurrentLocation } = useLocation();
  const { latitude, longitude } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

  const {
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useListings(selectedCategory ?? undefined);

  const listings = useMemo(
    () =>
      data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const handleListingPress = useCallback(
    (id: string) => {
      router.push(`/(tabs)/feed/${id}`);
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAllowLocation = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      await getCurrentLocation();
    }
  }, [requestPermission, getCurrentLocation]);

  // Location not granted yet
  if (permissionStatus !== 'granted' || latitude === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <Text style={styles.brandTitle}>GharKa</Text>
        </View>
        <View style={styles.locationPromptWrapper}>
          <LocationPrompt onAllow={handleAllowLocation} />
        </View>
      </View>
    );
  }

  const headerComponent = (
    <View style={styles.filterWrapper}>
      <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.locationRow}>
          <MapPin size={16} color={colors.turmeric.DEFAULT} />
          <Text style={styles.locationText} numberOfLines={1}>
            {address ?? 'Your Location'}
          </Text>
        </View>
        <Text style={styles.brandTitle}>GharKa</Text>
      </View>

      {/* Listing Feed */}
      <ListingGrid
        listings={listings as (ListingResponse & { seller?: UserResponse })[]}
        onListingPress={handleListingPress}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        isRefreshing={isRefetching}
        isLoading={isLoading}
        isFetchingMore={isFetchingNextPage}
        ListHeaderComponent={headerComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cloud,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.md,
  },
  locationText: {
    ...typography.body,
    color: colors.charcoal,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
  brandTitle: {
    ...typography.h2,
    color: colors.turmeric.DEFAULT,
  },
  filterWrapper: {
    marginHorizontal: -spacing.lg,
    marginBottom: spacing.md,
  },
  locationPromptWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
