import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  ChevronRight,
  Shield,
  LogOut,
  RefreshCw,
  Info,
  Settings,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, radii, shadows } from '../../src/theme/spacing';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/store/auth-store';
import { usersApi } from '../../src/hooks/use-api';
import { persistUser } from '../../src/store/auth-store';
import { useUIStore } from '../../src/store/ui-store';
import { clearTokens } from '../../src/lib/api-client';

function ProfileMenuItem({
  icon,
  label,
  onPress,
  color = colors.charcoal,
  showChevron = true,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      {icon}
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      {showChevron && <ChevronRight size={18} color={colors.ash} />}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, setUser, logout } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const roleBadgeVariant = user?.role === 'ADMIN'
    ? 'terracotta' as const
    : user?.role === 'SELLER'
    ? 'coriander' as const
    : 'turmeric' as const;

  const handleSwitchRole = useCallback(async () => {
    if (!user) return;
    const newRole = user.role === 'BUYER' ? 'SELLER' : 'BUYER';
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const api = usersApi();
      const result = await api.updateRole(newRole as 'BUYER' | 'SELLER');
      await persistUser(result.data);
      setUser(result.data);
      addToast('success', `Switched to ${newRole.toLowerCase()} mode`);
    } catch (err: any) {
      addToast('error', err?.message ?? 'Failed to switch role');
    }
  }, [user, setUser, addToast]);

  const handleLogout = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    await clearTokens();
    router.replace('/login');
  }, [logout, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['5xl'] }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Profile</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <Avatar
            uri={user?.avatarUrl}
            name={user?.name}
            size="xl"
          />
          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
          <Text style={styles.phone}>{user?.phone}</Text>
          <Badge
            label={user?.role ?? 'BUYER'}
            variant={roleBadgeVariant}
            size="md"
          />
        </View>

        {/* Menu items */}
        <View style={styles.section}>
          {user?.role !== 'ADMIN' && (
            <ProfileMenuItem
              icon={<RefreshCw size={20} color={colors.charcoal} />}
              label={`Switch to ${user?.role === 'BUYER' ? 'Seller' : 'Buyer'} Mode`}
              onPress={handleSwitchRole}
            />
          )}
          {user?.role === 'ADMIN' && (
            <ProfileMenuItem
              icon={<Shield size={20} color={colors.terracotta} />}
              label="Admin Dashboard"
              onPress={() => router.push('/admin')}
              color={colors.terracotta}
            />
          )}
        </View>

        <View style={styles.section}>
          <ProfileMenuItem
            icon={<Settings size={20} color={colors.charcoal} />}
            label="Settings"
            onPress={() => {
              addToast('info', 'Settings coming soon');
            }}
          />
          <ProfileMenuItem
            icon={<Info size={20} color={colors.charcoal} />}
            label="About GharKa"
            onPress={() => {
              addToast('info', 'GharKa v0.1.0 - Community food sharing');
            }}
          />
        </View>

        <View style={styles.section}>
          <ProfileMenuItem
            icon={<LogOut size={20} color={colors.error} />}
            label="Log Out"
            onPress={handleLogout}
            color={colors.error}
            showChevron={false}
          />
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>GharKa v0.1.0</Text>
          <Text style={styles.appInfoText}>
            A community food sharing platform. No payments processed.
          </Text>
          <Text style={styles.appInfoText}>
            All transactions arranged directly between buyer and seller.
          </Text>
        </View>
      </ScrollView>
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
  screenTitle: {
    ...typography.h1,
    color: colors.charcoal,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  name: {
    ...typography.h1,
    color: colors.charcoal,
  },
  phone: {
    ...typography.body,
    color: colors.slate,
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  menuLabel: {
    ...typography.bodyLarge,
    flex: 1,
  },
  appInfo: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    alignItems: 'center',
    gap: spacing.xs,
  },
  appInfoText: {
    ...typography.bodySmall,
    color: colors.ash,
    textAlign: 'center',
  },
});
