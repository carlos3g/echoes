import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { darkThemeColors, lightThemeColors, themes, type ThemeColors } from '@/lib/nativewind';

export type ThemeContextValue = {
  theme: 'light' | 'dark';
  setTheme: (value: 'light' | 'dark') => void;
  colors: ThemeColors;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  const { colorScheme, setColorScheme } = useColorScheme();

  const themeColors = colorScheme === 'dark' ? darkThemeColors : lightThemeColors;

  const values = useMemo(
    () => ({ theme: colorScheme!, setTheme: setColorScheme, colors: themeColors }),
    [colorScheme, setColorScheme, themeColors]
  );

  return (
    <ThemeContext.Provider value={values}>
      <View style={themes[colorScheme!]} className="flex-1">
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
