import React from 'react';
import { Switch, View } from 'react-native';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <View testID="theme-switcher" className="flex-row items-center justify-between py-4">
      <View className="flex-row items-center gap-3">
        <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={20} className="text-foreground" />
        <Text>Tema escuro</Text>
      </View>
      <Switch value={isDarkMode} onValueChange={toggleTheme} accessibilityLabel="Alternar tema escuro" />
    </View>
  );
};
