import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User, ChefHat, ShoppingBag } from 'lucide-react-native';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, radii, shadows } from '../src/theme/spacing';
import { Input } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { Avatar } from '../src/components/ui/Avatar';
import { useAuthStore, persistUser, persistOnboarded } from '../src/store/auth-store';
import { useLocation } from '../src/hooks/use-location';
import { authApi, usersApi } from '../src/hooks/use-api';
import { useUIStore } from '../src/store/ui-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Discover homemade food near you',
    subtitle: 'Find lovingly prepared home-cooked meals from talented cooks in your neighborhood.',
    icon: '🍲',
  },
  {
    title: 'Connect with neighborhood cooks',
    subtitle: 'Chat directly with cooks, learn about ingredients, and arrange pickup.',
    icon: '🤝',
  },
  {
    title: 'Simple & honest. No payments in app.',
    subtitle: 'GharKa connects you with your neighbors. Payment is arranged directly between you and the cook.',
    icon: '💛',
  },
];

export default function OnboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, setUser, setOnboarded } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);
  const { requestPermission, getCurrentLocation } = useLocation();

  const [step, setStep] = useState<'slides' | 'profile'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState(user?.name ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatarUrl ?? null);
  const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSlideScroll = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentSlide(index);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (currentSlide < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1 });
    } else {
      setStep('profile');
    }
  }, [currentSlide]);

  const handlePickAvatar = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch {
      addToast('error', 'Could not pick image');
    }
  }, [addToast]);

  const handleComplete = useCallback(async () => {
    if (name.trim().length < 2) {
      addToast('error', 'Please enter your name (at least 2 characters)');
      return;
    }

    setLoading(true);
    try {
      const api = authApi();
      const result = await api.onboard({
        name: name.trim(),
        role,
        avatarUrl: avatarUri ?? undefined,
      });

      await persistUser(result.data);
      await persistOnboarded();
      setUser(result.data);
      setOnboarded(true);

      // Request location
      const granted = await requestPermission();
      if (granted) {
        const location = await getCurrentLocation();
        if (location) {
          const usersApiClient = usersApi();
          await usersApiClient.updateLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
        }
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/feed');
    } catch (err: any) {
      addToast('error', err?.message ?? 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  }, [name, role, avatarUri, setUser, setOnboarded, requestPermission, getCurrentLocation, router, addToast]);

  if (step === 'slides') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleSlideScroll}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
              <Text style={styles.slideIcon}>{item.icon}</Text>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          )}
        />

        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentSlide ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <View style={[styles.slideFooter, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Button
            title={currentSlide === SLIDES.length - 1 ? "Let's Go" : 'Next'}
            onPress={handleNext}
            fullWidth
            size="lg"
          />
          {currentSlide < SLIDES.length - 1 && (
            <Pressable onPress={() => setStep('profile')} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing['2xl'] }]}>
      <View style={styles.profileContent}>
        <Text style={styles.profileTitle}>Set Up Your Profile</Text>
        <Text style={styles.profileSubtitle}>
          Tell us a bit about yourself to get started
        </Text>

        {/* Avatar picker */}
        <Pressable onPress={handlePickAvatar} style={styles.avatarPicker}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Avatar name={name || '?'} size="xl" />
          )}
          <View style={styles.cameraIcon}>
            <Camera size={16} color={colors.white} />
          </View>
        </Pressable>

        {/* Name */}
        <Input
          label="Your Name"
          placeholder="What should we call you?"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          maxLength={100}
        />

        {/* Role selection */}
        <Text style={styles.roleLabel}>I WANT TO</Text>
        <View style={styles.roleRow}>
          <Pressable
            onPress={() => { setRole('BUYER'); Haptics.selectionAsync(); }}
            style={[styles.roleCard, role === 'BUYER' && styles.roleCardActive]}
          >
            <ShoppingBag
              size={28}
              color={role === 'BUYER' ? colors.turmeric.DEFAULT : colors.ash}
            />
            <Text style={[styles.roleText, role === 'BUYER' && styles.roleTextActive]}>
              Buy Food
            </Text>
            <Text style={styles.roleDesc}>Discover homemade dishes near me</Text>
          </Pressable>

          <Pressable
            onPress={() => { setRole('SELLER'); Haptics.selectionAsync(); }}
            style={[styles.roleCard, role === 'SELLER' && styles.roleCardActive]}
          >
            <ChefHat
              size={28}
              color={role === 'SELLER' ? colors.turmeric.DEFAULT : colors.ash}
            />
            <Text style={[styles.roleText, role === 'SELLER' && styles.roleTextActive]}>
              Sell Food
            </Text>
            <Text style={styles.roleDesc}>Share my cooking with neighbors</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.profileFooter, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          loading={loading}
          disabled={name.trim().length < 2}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  // Slides
  slide: {
    paddingHorizontal: spacing['3xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideIcon: {
    fontSize: 72,
    marginBottom: spacing['2xl'],
  },
  slideTitle: {
    ...typography.h1,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    ...typography.bodyLarge,
    color: colors.slate,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.turmeric.DEFAULT,
  },
  dotInactive: {
    width: 8,
    backgroundColor: colors.mist,
  },
  slideFooter: {
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.slate,
    fontFamily: 'Inter_600SemiBold',
  },
  // Profile
  profileContent: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
  },
  profileTitle: {
    ...typography.h1,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    ...typography.body,
    color: colors.slate,
    marginBottom: spacing['2xl'],
  },
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: spacing['2xl'],
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.turmeric.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  roleLabel: {
    ...typography.label,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  roleCard: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.mist,
    alignItems: 'center',
    gap: spacing.sm,
  },
  roleCardActive: {
    borderColor: colors.turmeric.DEFAULT,
    backgroundColor: colors.turmeric.light,
  },
  roleText: {
    ...typography.h3,
    color: colors.charcoal,
  },
  roleTextActive: {
    color: colors.turmeric.dark,
  },
  roleDesc: {
    ...typography.bodySmall,
    color: colors.slate,
    textAlign: 'center',
  },
  profileFooter: {
    paddingHorizontal: spacing['2xl'],
  },
});
