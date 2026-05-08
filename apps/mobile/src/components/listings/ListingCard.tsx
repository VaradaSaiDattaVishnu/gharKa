import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { formatCurrency } from '@gharka/shared';
import { CATEGORY_DISPLAY_NAMES, type FoodCategory } from '@gharka/shared';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii, shadows } from '../../theme/spacing';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { DistanceBadge } from './DistanceBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ListingCardProps {
  id: string;
  title: string;
  images: string[];
  price: number;
  category: FoodCategory;
  sellerName?: string | null;
  sellerAvatar?: string | null;
  distance?: number;
  onPress: (id: string) => void;
  index?: number;
}

export function ListingCard({
  id,
  title,
  images,
  price,
  category,
  sellerName,
  sellerAvatar,
  distance,
  onPress,
  index = 0,
}: ListingCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(id);
  }, [id, onPress]);

  const categoryName = CATEGORY_DISPLAY_NAMES[category] ?? category;

  return (
    <Animated.View entering={FadeIn.delay(index * 80).duration(400)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, animatedStyle]}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              images.length > 0
                ? { uri: images[0] }
                : require('../../../assets/icon.png')
            }
            style={styles.image}
            resizeMode="cover"
          />
          {distance !== undefined && (
            <View style={styles.distanceBadge}>
              <DistanceBadge meters={distance} />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Badge label={categoryName} variant="turmeric" size="sm" />
          </View>

          <View style={styles.footer}>
            <View style={styles.seller}>
              <Avatar uri={sellerAvatar} name={sellerName} size="sm" />
              <Text style={styles.sellerName} numberOfLines={1}>
                {sellerName ?? 'Cook'}
              </Text>
            </View>
            <Text style={styles.price}>{formatCurrency(price)}</Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 4 / 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  distanceBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.charcoal,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  sellerName: {
    ...typography.bodySmall,
    color: colors.slate,
    flex: 1,
  },
  price: {
    ...typography.h3,
    color: colors.turmeric.DEFAULT,
  },
});
