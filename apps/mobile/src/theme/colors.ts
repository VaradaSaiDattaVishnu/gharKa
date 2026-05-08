export const colors = {
  turmeric: { DEFAULT: '#E8913A', dark: '#C47425', light: '#FFF3E0' },
  coriander: { DEFAULT: '#2E7D52', dark: '#1B5E3A', light: '#E8F5E9' },
  terracotta: '#D84315',
  charcoal: '#263238',
  slate: '#546E7A',
  ash: '#90A4AE',
  mist: '#E0E7EA',
  cloud: '#F5F7F8',
  white: '#FFFFFF',
  error: '#C62828',
  warning: '#F9A825',
  info: '#1565C0',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
