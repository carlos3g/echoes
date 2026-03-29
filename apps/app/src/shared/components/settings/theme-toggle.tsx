import { haptics } from '@/shared/utils/haptics';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

const options = [
  { value: 'system' as const, label: 'Sistema', icon: 'phone-portrait-outline' as const },
  { value: 'light' as const, label: 'Claro', icon: 'sunny-outline' as const },
  { value: 'dark' as const, label: 'Escuro', icon: 'moon-outline' as const },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <View testID="theme-switcher" className="py-4">
      <View className="mb-3 flex-row items-center gap-3">
        <Ionicons name="color-palette-outline" size={20} className="text-foreground" />
        <Text semiBold>Tema</Text>
      </View>
      <View className="flex-row gap-2">
        {options.map((option) => {
          const isActive = theme === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                haptics.light();
                setTheme(option.value);
              }}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                isActive ? 'bg-primary' : 'bg-muted'
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon}
                size={16}
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              />
              <Text
                variant="paragraphSmall"
                semiBold
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
