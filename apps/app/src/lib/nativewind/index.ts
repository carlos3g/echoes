import { vars } from 'nativewind';
import { darkThemeColors, lightThemeColors } from './colors';

export { darkThemeColors, lightThemeColors, type ThemeColors } from './colors';

export const themes = {
  light: vars({
    '--color-primary': lightThemeColors.primary,
    '--color-primary-foreground': lightThemeColors.primaryForeground,
    '--color-background': lightThemeColors.background,
    '--color-foreground': lightThemeColors.foreground,
    '--color-muted': lightThemeColors.muted,
    '--color-muted-foreground': lightThemeColors.mutedForeground,
    '--color-border': lightThemeColors.border,
    '--color-input': lightThemeColors.input,
    '--color-destructive': lightThemeColors.destructive,
    '--color-destructive-foreground': lightThemeColors.destructiveForeground,
    '--color-success': lightThemeColors.success,
    '--color-success-foreground': lightThemeColors.successForeground,
    '--color-accent': lightThemeColors.accent,
    '--color-accent-foreground': lightThemeColors.accentForeground,
  }),
  dark: vars({
    '--color-primary': darkThemeColors.primary,
    '--color-primary-foreground': darkThemeColors.primaryForeground,
    '--color-background': darkThemeColors.background,
    '--color-foreground': darkThemeColors.foreground,
    '--color-muted': darkThemeColors.muted,
    '--color-muted-foreground': darkThemeColors.mutedForeground,
    '--color-border': darkThemeColors.border,
    '--color-input': darkThemeColors.input,
    '--color-destructive': darkThemeColors.destructive,
    '--color-destructive-foreground': darkThemeColors.destructiveForeground,
    '--color-success': darkThemeColors.success,
    '--color-success-foreground': darkThemeColors.successForeground,
    '--color-accent': darkThemeColors.accent,
    '--color-accent-foreground': darkThemeColors.accentForeground,
  }),
};
