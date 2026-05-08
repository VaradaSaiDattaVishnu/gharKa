import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { UtensilsCrossed } from 'lucide-react-native';
import type { ListingResponse, UserResponse, FoodCategory } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { ListingCard } from './ListingCard';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonCard } from '../ui/Skeleton';

interface ListingItem extends ListingResponse {
  seller?: UserResponse;
}

interface ListingGridProps {
  listings: ListingItem[];
  onListingPress: (id: string) => void;
  onRefresh?: () => void;
  onEndReached?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
}

export function ListingGrid({
  listings,
  onListingPress,
  onRefresh,
  onEndReached,
  isRefreshing = false,
  isLoading = false,
  isFetchingMore = false,
  ListHeaderComponent,
}: ListingGridProps) {
  const renderItem = useCallback(
    ({ item, index }: { item: ListingItem; index: number }) => (
      <ListingCard
        id={item.id}
        title={item.title}
        images={item.images}
        price={item.price}
        category={item.category as FoodCategory}
        sellerName={item.seller?.name}
        sellerAvatar={item.seller?.avatarUrl}
        distance={item.distance}
        onPress={onListingPress}
        index={index}
      />
    ),
    [onListingPress]
  );

  const keyExtractor = useCallback((item: ListingItem) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.skeletonContainer}>
        {ListHeaderComponent}
        <View style={styles.content}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={listings}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={[
        styles.content,
        listings.length === 0 && styles.emptyContent,
      ]}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.turmeric.DEFAULT}
            colors={[colors.turmeric.DEFAULT]}
          />
        ) : undefined
      }
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <EmptyState
          icon={<UtensilsCrossed size={48} color={colors.ash} />}
          title="No dishes nearby"
          subtitle="There are no homemade dishes available near you right now. Check back later!"
        />
      }
      ListFooterComponent={
        isFetchingMore ? (
          <View style={styles.footer}>
            <SkeletonCard />
          </View>
        ) : null
      }
      removeClippedSubviews
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={11}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  emptyContent: {
    flexGrow: 1,
  },
  skeletonContainer: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing.sm,
  },
});
