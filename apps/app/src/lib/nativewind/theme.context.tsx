import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { darkThemeColors, lightThemeColors, themes, type ThemeColors } from '@/lib/nativewind';
import { storage } from '@/lib/react-native-mmkv';

type ThemePreference = 'system' | 'light' | 'dark';

export type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (value: ThemePreference) => void;
  colors: ThemeColors;
};

const THEME_STORAGE_KEY = 'theme-preference';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;
  const { setColorScheme } = useColorScheme();

  const [preference, setPreference] = useState<ThemePreference>(() => {
    const stored = storage.getString(THEME_STORAGE_KEY);
    return (stored as ThemePreference) || 'system';
  });

  const resolvedScheme: 'light' | 'dark' = preference === 'system'
    ? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light')
    : preference;

  useEffect(() => {
    setColorScheme(resolvedScheme);
  }, [resolvedScheme, setColorScheme]);

  useEffect(() => {
    if (preference !== 'system') return;
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, [preference, setColorScheme]);

  const handleSetTheme = (value: ThemePreference) => {
    setPreference(value);
    storage.set(THEME_STORAGE_KEY, value);
    if (value === 'system') {
      const scheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
      setColorScheme(scheme);
    } else {
      setColorScheme(value);
    }
  };

  const themeColors = resolvedScheme === 'dark' ? darkThemeColors : lightThemeColors;

  const values = useMemo(
    () => ({ theme: preference, setTheme: handleSetTheme, colors: themeColors }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preference, themeColors]
  );

  return (
    <ThemeContext.Provider value={values}>
      <View style={themes[resolvedScheme]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
