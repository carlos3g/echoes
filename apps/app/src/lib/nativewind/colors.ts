export const lightThemeColors = {
  primary: '#18181b',
  primaryForeground: '#ffffff',
  background: '#ffffff',
  foreground: '#09090b',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  border: '#e4e4e7',
  input: '#e4e4e7',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  successForeground: '#ffffff',
  accent: '#f4f4f5',
  accentForeground: '#18181b',
};

export const darkThemeColors: typeof lightThemeColors = {
  primary: '#fafafa',
  primaryForeground: '#18181b',
  background: '#09090b',
  foreground: '#fafafa',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  border: '#27272a',
  input: '#27272a',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  successForeground: '#ffffff',
  accent: '#27272a',
  accentForeground: '#fafafa',
};

export type ThemeColors = typeof lightThemeColors;
