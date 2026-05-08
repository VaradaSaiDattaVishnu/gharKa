import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/spacing';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: AvatarSize;
  showOnline?: boolean;
}

const sizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const fontSizes: Record<AvatarSize, number> = {
  sm: 12,
  md: 14,
  lg: 20,
  xl: 28,
};

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColorForName(name: string | null | undefined): string {
  const palette = [
    colors.turmeric.DEFAULT,
    colors.coriander.DEFAULT,
    colors.terracotta,
    colors.info,
    '#7B1FA2',
    '#00897B',
  ];
  const charCode = (name ?? '?').charCodeAt(0);
  return palette[charCode % palette.length];
}

export function Avatar({ uri, name, size = 'md', showOnline }: AvatarProps) {
  const dimension = sizes[size];
  const fontSize = fontSizes[size];

  return (
    <View style={[styles.container, { width: dimension, height: dimension }]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: getColorForName(name),
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
        </View>
      )}
      {showOnline && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dimension * 0.3,
              height: dimension * 0.3,
              borderRadius: dimension * 0.15,
              borderWidth: dimension * 0.06,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontFamily: 'Nunito_700Bold',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderColor: colors.white,
  },
});
