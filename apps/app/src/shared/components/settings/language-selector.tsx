import { haptics } from '@/shared/utils/haptics';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';
import { useTranslation } from 'react-i18next';
import { useLanguageStore, type AppLanguage } from '@/lib/zustand/stores/language.store';

const options: { value: AppLanguage; labelKey: string; code: string }[] = [
  { value: 'pt', labelKey: 'language.pt', code: 'PT' },
  { value: 'en', labelKey: 'language.en', code: 'EN' },
];

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const handleChangeLanguage = (lang: AppLanguage) => {
    haptics.light();
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  return (
    <View testID="language-selector" className="py-4">
      <View className="mb-3 flex-row items-center gap-3">
        <Ionicons name="language-outline" size={20} className="text-foreground" />
        <Text semiBold>{t('language.title')}</Text>
      </View>
      <View className="flex-row gap-2">
        {options.map((option) => {
          const isActive = i18n.language === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleChangeLanguage(option.value)}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
                isActive ? 'bg-primary' : 'bg-muted'
              }`}
              activeOpacity={0.7}
            >
              <Text
                variant="paragraphSmall"
                bold
                className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
              >
                {option.code}
              </Text>
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
