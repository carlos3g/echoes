import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { useActivityStore } from '@/lib/zustand/stores/activity.store';

export const ProfileStats: React.FC = () => {
  const favoritesCount = useActivityStore((s) => s.favoritesCount);
  const tagsCount = useActivityStore((s) => s.tagsCount);
  const readCount = useActivityStore((s) => s.readCount);

  const stats = [
    { label: 'Favoritos', value: favoritesCount },
    { label: 'Tags', value: tagsCount },
    { label: 'Lidas', value: readCount },
  ];

  return (
    <View className="flex-row gap-2 px-4 py-4">
      {stats.map((stat) => (
        <View key={stat.label} className="flex-1 items-center rounded-xl bg-muted py-3">
          <Text variant="headingSmall" bold className="text-foreground">
            {stat.value}
          </Text>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
};
