import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    lineHeight: 34,
  } satisfies TextStyle,
  h1: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    lineHeight: 31,
  } satisfies TextStyle,
  h2: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    lineHeight: 26,
  } satisfies TextStyle,
  h3: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 17,
    lineHeight: 24,
  } satisfies TextStyle,
  bodyLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  } satisfies TextStyle,
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  } satisfies TextStyle,
  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
  } satisfies TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
