export const zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
};

export { darkThemeColors, lightThemeColors, type ThemeColors } from '@/lib/nativewind';

export const colors = {
  primary: zinc[900],
  primaryForeground: '#ffffff',
  background: '#ffffff',
  foreground: zinc[950],
  muted: zinc[100],
  mutedForeground: zinc[500],
  border: zinc[200],
  input: zinc[200],
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  successForeground: '#ffffff',
  accent: zinc[100],
  accentForeground: zinc[900],
};
