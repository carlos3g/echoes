import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useActivityStore, type ActivityItem } from '@/lib/zustand/stores/activity.store';
import { formatRelativeTime } from '@/shared/utils';

const ActivityItemRow = ({ item }: { item: ActivityItem }) => {
  const { colors } = useTheme();

  const icon = item.type === 'favorite' ? 'heart' : 'pricetag';
  const iconColor = item.type === 'favorite' ? colors.destructive : colors.primary;

  return (
    <View className="flex-row items-center gap-3 border-b border-border py-3">
      <Ionicons name={icon} size={16} color={iconColor} />
      <View className="flex-1">
        <Text variant="paragraphSmall" className="text-foreground">
          {item.description}
        </Text>
        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          {formatRelativeTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );
};

export const ActivityFeed: React.FC = () => {
  const { t } = useTranslation();
  const activities = useActivityStore((s) => s.activities);

  if (activities.length === 0) return null;

  return (
    <View className="px-4 pt-2">
      <Text variant="paragraphSmall" semiBold className="mb-2 text-foreground">
        {t('profile.recentActivity')}
      </Text>
      {activities.slice(0, 10).map((item, index) => (
        <ActivityItemRow key={item.id} item={item} />
      ))}
    </View>
  );
};
