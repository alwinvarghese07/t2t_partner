import { Platform } from 'react-native';

export const Fonts = {
  regular: Platform.select({ web: 'Inter, sans-serif', default: 'Inter_400Regular' }),
  medium: Platform.select({ web: 'Inter, sans-serif', default: 'Inter_500Medium' }),
  semiBold: Platform.select({ web: 'Inter, sans-serif', default: 'Inter_600SemiBold' }),
  bold: Platform.select({ web: 'Inter, sans-serif', default: 'Inter_700Bold' }),
};

export const Palette = {
  bg: '#f6f7fb',
  card: '#ffffff',
  text: '#111318',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#f0f2f5',
  darkPill: '#111318',
  bluePill: '#3b82f6',
  badgeBlueBg: '#e0f2fe',
  badgeBlueText: '#0284c7',
  badgeGreenBg: '#ecfdf5',
  badgeGreenText: '#059669',
  badgeAmberBg: '#fffbeb',
  badgeAmberText: '#d97706',
};
