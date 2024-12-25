import React, { createContext, useMemo } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ThemeContextValue } from '@/lib/nativewind/theme.context.types';
import { themes } from '@/lib/nativewind';

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props;

  const { colorScheme, setColorScheme } = useColorScheme();

  const values = useMemo(() => ({ theme: colorScheme!, setTheme: setColorScheme }), [colorScheme, setColorScheme]);

  return (
    <ThemeContext.Provider value={values}>
      <View style={themes[colorScheme!]} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
};
