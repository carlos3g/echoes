import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useActivityStore } from '@/lib/zustand/stores/activity.store';

export const ProfileStats: React.FC = () => {
  const { t } = useTranslation();
  const favoritesCount = useActivityStore((s) => s.favoritesCount);
  const tagsCount = useActivityStore((s) => s.tagsCount);
  const readCount = useActivityStore((s) => s.readCount);

  const stats = [
    { label: t('profile.stats.favorites'), value: favoritesCount },
    { label: t('profile.stats.tags'), value: tagsCount },
    { label: t('profile.stats.read'), value: readCount },
  ];

  return (
    <View className="flex-row gap-2 px-4 py-4">
      {stats.map((stat, index) => (
        <Animated.View
          key={stat.label}
          entering={FadeInUp.delay(index * 100)
            .duration(400)
            .springify()}
          className="flex-1 items-center rounded-xl bg-muted py-3"
        >
          <Text variant="headingSmall" bold className="text-foreground">
            {stat.value}
          </Text>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {stat.label}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};
