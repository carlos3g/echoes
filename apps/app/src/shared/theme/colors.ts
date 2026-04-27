export const stone = {
  50: '#FAF8F5',
  100: '#F8F6F0',
  200: '#E8E4DC',
  300: '#D9CEBC',
  400: '#9B8E7E',
  500: '#8A7A6A',
  600: '#6B5B4A',
  700: '#4A3F32',
  800: '#2D2D28',
  900: '#1A1B18',
  950: '#0F0F0D',
};

export const terracotta = {
  light: '#C49468',
  DEFAULT: '#B5845A',
  dark: '#9B7048',
};

export const sage = {
  light: '#8B9B7F',
  DEFAULT: '#7A8B6F',
  dark: '#5C6B50',
};

export { darkThemeColors, lightThemeColors, type ThemeColors } from '@/lib/nativewind';

export const colors = {
  primary: terracotta.DEFAULT,
  primaryForeground: '#ffffff',
  background: stone[100],
  foreground: stone[800],
  muted: stone[200],
  mutedForeground: stone[400],
  border: stone[300],
  input: stone[300],
  destructive: '#C45D4A',
  destructiveForeground: '#ffffff',
  success: sage.DEFAULT,
  successForeground: '#ffffff',
  accent: sage.DEFAULT,
  accentForeground: '#ffffff',
  card: '#FFFFFF',
  secondary: sage.DEFAULT,
  secondaryForeground: '#ffffff',
};
