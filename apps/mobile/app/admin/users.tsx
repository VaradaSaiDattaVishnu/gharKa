import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Search, UserX, UserCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii } from '../../src/theme/spacing';
import { Input } from '../../src/components/ui/Input';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { adminApi } from '../../src/hooks/use-api';
import { useUIStore } from '../../src/store/ui-store';

const api = adminApi();

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addToast = useUIStore((s) => s.addToast);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: api.listUsers,
  });

  const toggleStatus = useMutation({
    mutationFn: api.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const users = useMemo(() => {
    const all = data?.data ?? [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.phone.includes(q)
    );
  }, [data, search]);

  const handleToggle = useCallback(
    async (id: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        await toggleStatus.mutateAsync(id);
        addToast('success', 'User status updated');
      } catch (err: any) {
        addToast('error', err?.message ?? 'Failed to update user');
      }
    },
    [toggleStatus, addToast]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Users</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrapper}>
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChangeText={setSearch}
          leftElement={<Search size={18} color={colors.ash} />}
        />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Avatar uri={item.avatarUrl} name={item.name} size="md" />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name ?? 'No name'}</Text>
              <Text style={styles.userPhone}>{item.phone}</Text>
            </View>
            <Badge
              label={item.role}
              variant={
                item.role === 'ADMIN'
                  ? 'terracotta'
                  : item.role === 'SELLER'
                  ? 'coriander'
                  : 'turmeric'
              }
              size="sm"
            />
            <Pressable
              onPress={() => handleToggle(item.id)}
              style={styles.statusBtn}
            >
              {item.isActive ? (
                <UserX size={18} color={colors.error} />
              ) : (
                <UserCheck size={18} color={colors.coriander.DEFAULT} />
              )}
            </Pressable>
          </View>
        )}
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
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    color: colors.charcoal,
  },
  userPhone: {
    ...typography.bodySmall,
    color: colors.slate,
  },
  statusBtn: {
    padding: spacing.sm,
  },
});
