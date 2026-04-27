import { haptics } from '@/shared/utils/haptics';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

const options = [
  { value: 'system' as const, labelKey: 'theme.system', icon: 'phone-portrait-outline' as const },
  { value: 'light' as const, labelKey: 'theme.light', icon: 'sunny-outline' as const },
  { value: 'dark' as const, labelKey: 'theme.dark', icon: 'moon-outline' as const },
];

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <View testID="theme-switcher" className="py-4">
      <View className="mb-3 flex-row items-center gap-3">
        <Ionicons name="color-palette-outline" size={20} className="text-foreground" />
        <Text semiBold>{t('theme.title')}</Text>
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
                {t(option.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
