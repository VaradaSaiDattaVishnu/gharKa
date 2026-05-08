import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Camera, X } from 'lucide-react-native';
import { CATEGORY_DISPLAY_NAMES, FOOD_CATEGORIES, type FoodCategory } from '@gharka/shared';
import { colors } from '../../../src/theme/colors';
import { typography } from '../../../src/theme/typography';
import { spacing, radii, shadows } from '../../../src/theme/spacing';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { Badge } from '../../../src/components/ui/Badge';
import { useCreateListing } from '../../../src/hooks/use-listings';
import { useLocationStore } from '../../../src/store/location-store';
import { useUIStore } from '../../../src/store/ui-store';

export default function NewListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addToast = useUIStore((s) => s.addToast);
  const { latitude, longitude } = useLocationStore();
  const createListing = useCreateListing();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<FoodCategory | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handlePickImage = useCallback(async () => {
    if (images.length >= 5) {
      addToast('info', 'Maximum 5 photos allowed');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } catch {
      addToast('error', 'Could not pick image');
    }
  }, [images, addToast]);

  const handleRemoveImage = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || title.trim().length < 3) {
      addToast('error', 'Title must be at least 3 characters');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      addToast('error', 'Please enter a valid price');
      return;
    }
    if (!category) {
      addToast('error', 'Please select a category');
      return;
    }
    if (images.length === 0) {
      addToast('error', 'Please add at least one photo');
      return;
    }
    if (latitude === null || longitude === null) {
      addToast('error', 'Location is required. Please enable location services.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // In production, images would be uploaded to Cloudinary first
      // For now, use the local URIs as placeholders
      await createListing.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        images: images,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10) || 1,
        category,
        location: { latitude, longitude },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToast('success', 'Listing created! It is now visible to your neighbors.');
      router.back();
    } catch (err: any) {
      addToast('error', err?.message ?? 'Failed to create listing');
    }
  }, [title, description, price, quantity, category, images, latitude, longitude, createListing, addToast, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.charcoal} />
        </Pressable>
        <Text style={styles.headerTitle}>Add a Dish</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing['5xl'] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo picker */}
        <Text style={styles.sectionLabel}>PHOTOS</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageRow}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.imageThumb}>
              <Image source={{ uri }} style={styles.thumbImage} />
              <Pressable
                onPress={() => handleRemoveImage(index)}
                style={styles.removeImage}
              >
                <X size={14} color={colors.white} />
              </Pressable>
            </View>
          ))}
          {images.length < 5 && (
            <Pressable onPress={handlePickImage} style={styles.addImageBtn}>
              <Camera size={24} color={colors.turmeric.DEFAULT} />
              <Text style={styles.addImageText}>Add Photo</Text>
            </Pressable>
          )}
        </ScrollView>

        {/* Form fields */}
        <Input
          label="Title"
          placeholder="e.g., Paneer Tikka Masala"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <Input
          label="Description (optional)"
          placeholder="Tell buyers what makes this dish special..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={500}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Input
              label="Price (INR)"
              placeholder="150"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <Input
              label="Quantity"
              placeholder="1"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Category selection */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {FOOD_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                setCategory(cat);
                Haptics.selectionAsync();
              }}
            >
              <Badge
                label={CATEGORY_DISPLAY_NAMES[cat]}
                variant={category === cat ? 'turmeric' : 'muted'}
                size="md"
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.submitSection}>
          <Button
            title="Publish Listing"
            onPress={handleSubmit}
            loading={createListing.isPending}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
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
  scroll: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  imageRow: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
    paddingRight: spacing.lg,
  },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: radii.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageBtn: {
    width: 100,
    height: 100,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.turmeric.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.turmeric.light,
    gap: spacing.xs,
  },
  addImageText: {
    ...typography.bodySmall,
    color: colors.turmeric.DEFAULT,
    fontFamily: 'Inter_600SemiBold',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  submitSection: {
    marginTop: spacing.lg,
  },
});
