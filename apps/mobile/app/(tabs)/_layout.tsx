import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Home,
  ShoppingBag,
  ChefHat,
  MessageCircle,
  User,
} from 'lucide-react-native';
import { useAuthStore } from '../../src/store/auth-store';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

function TabIcon({
  icon: IconComponent,
  label,
  focused,
}: {
  icon: typeof Home;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={tabStyles.iconContainer}>
      {focused && <View style={tabStyles.indicator} />}
      <IconComponent
        size={22}
        color={focused ? colors.turmeric.DEFAULT : colors.ash}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Text
        style={[
          tabStyles.label,
          { color: focused ? colors.turmeric.DEFAULT : colors.ash },
          focused && tabStyles.labelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.turmeric.DEFAULT,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  labelActive: {
    fontFamily: 'Inter_600SemiBold',
  },
});

export default function TabLayout() {
  const user = useAuthStore((s) => s.user);
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.mist,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 4,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Home} label="Feed" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={ShoppingBag} label="Orders" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          href: isSeller ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={ChefHat} label="My Food" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={MessageCircle} label="Chat" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
