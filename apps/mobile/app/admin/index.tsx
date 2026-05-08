import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Users, UtensilsCrossed, BarChart3 } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii, shadows } from '../../src/theme/spacing';
import { LoadingPot } from '../../src/components/ui/LoadingPot';
import { adminApi } from '../../src/hooks/use-api';

const api = adminApi();

export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: api.getStats,
  });

  const stats = data?.data;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <LoadingPot size={60} />
        </View>
      ) : (
        <View style={styles.content}>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.turmeric.light }]}>
              <BarChart3 size={24} color={colors.turmeric.DEFAULT} />
              <Text style={styles.statNumber}>{stats?.totalUsers ?? 0}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.coriander.light }]}>
              <UtensilsCrossed size={24} color={colors.coriander.DEFAULT} />
              <Text style={styles.statNumber}>{stats?.activeListings ?? 0}</Text>
              <Text style={styles.statLabel}>Active Listings</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <UtensilsCrossed size={24} color={colors.info} />
              <Text style={styles.statNumber}>{stats?.totalListings ?? 0}</Text>
              <Text style={styles.statLabel}>Total Listings</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF8E1' }]}>
              <BarChart3 size={24} color="#F57F17" />
              <Text style={styles.statNumber}>{stats?.totalOrders ?? 0}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
          </View>

          {/* Quick Links */}
          <Text style={styles.sectionTitle}>Manage</Text>

          <Pressable
            onPress={() => router.push('/admin/users')}
            style={styles.linkCard}
          >
            <Users size={22} color={colors.turmeric.DEFAULT} />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Users</Text>
              <Text style={styles.linkDesc}>View, search, and manage user accounts</Text>
            </View>
            <ChevronLeft
              size={18}
              color={colors.ash}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/admin/listings')}
            style={styles.linkCard}
          >
            <UtensilsCrossed size={22} color={colors.coriander.DEFAULT} />
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Listings</Text>
              <Text style={styles.linkDesc}>Browse and moderate food listings</Text>
            </View>
            <ChevronLeft
              size={18}
              color={colors.ash}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </Pressable>
        </View>
      )}
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  statCard: {
    width: '47%',
    padding: spacing.lg,
    borderRadius: radii.xl,
    gap: spacing.sm,
    ...shadows.sm,
  },
  statNumber: {
    ...typography.display,
    color: colors.charcoal,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.slate,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radii.xl,
    marginBottom: spacing.md,
    gap: spacing.md,
    ...shadows.sm,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    ...typography.h3,
    color: colors.charcoal,
  },
  linkDesc: {
    ...typography.bodySmall,
    color: colors.slate,
    marginTop: 2,
  },
});
