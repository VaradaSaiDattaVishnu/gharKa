import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store/auth-store';
import { LoadingPot } from '../src/components/ui/LoadingPot';
import { colors } from '../src/theme/colors';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, isOnboarded, user } = useAuthStore();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingPot size={100} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!isOnboarded || !user?.name) {
    return <Redirect href="/onboard" />;
  }

  return <Redirect href="/(tabs)/feed" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cloud,
  },
});
