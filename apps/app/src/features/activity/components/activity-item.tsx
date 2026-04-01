import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/shared/components/ui/text';
import { ActivityQuoteCard } from '@/features/activity/components/activity-quote-card';
import { ActivityAuthorCard } from '@/features/activity/components/activity-author-card';
import type { ActivityItemResponse } from '@/features/activity/contracts/activity-service.contract';
import { formatRelativeTime } from '@/shared/utils';

interface ActivityItemProps {
  item: ActivityItemResponse;
  index: number;
}

const ACTIVITY_CONFIG = {
  favorite_quote: {
    icon: 'heart' as const,
    iconColor: '#c97878',
    bgColor: '#f0e6e6',
  },
  favorite_author: {
    icon: 'star' as const,
    iconColor: '#8b7aab',
    bgColor: '#e8e2f0',
  },
  share: {
    icon: 'share-outline' as const,
    iconColor: '#6b7c6b',
    bgColor: '#e6ede6',
  },
  tag_created: {
    icon: 'pricetag' as const,
    iconColor: '#6b7c6b',
    bgColor: '#e6ede6',
  },
};

const MAX_ANIMATION_DELAY_INDEX = 15;

export const ActivityItem: React.FC<ActivityItemProps> = ({ item, index }) => {
  const { t } = useTranslation();
  const config = ACTIVITY_CONFIG[item.type];

  const getLabel = (): string => {
    switch (item.type) {
      case 'favorite_quote':
        return t('activity.favoritedQuote');
      case 'favorite_author':
        return t('activity.favoritedAuthor');
      case 'share':
        return t('activity.sharedOn', { platform: item.platform ?? '' });
      case 'tag_created':
        return t('activity.createdTag', { title: item.tag?.title ?? '' });
    }
  };

  const animationDelay = Math.min(index, MAX_ANIMATION_DELAY_INDEX) * 60;

  return (
    <Animated.View
      entering={FadeInUp.delay(animationDelay).duration(300).springify()}
      className="flex-row gap-3.5 border-b border-border px-4 py-3.5"
    >
      <View style={{ backgroundColor: config.bgColor }} className="h-9 w-9 items-center justify-center rounded-full">
        <Ionicons name={config.icon} size={16} color={config.iconColor} />
      </View>

      <View className="flex-1">
        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          {formatRelativeTime(item.timestamp)}
        </Text>
        <Text variant="paragraphSmall" className="mt-1 text-foreground">
          {getLabel()}
        </Text>

        {item.quote && (
          <ActivityQuoteCard uuid={item.quote.uuid} content={item.quote.content} author={item.quote.author} />
        )}

        {item.type === 'favorite_author' && item.author && (
          <ActivityAuthorCard uuid={item.author.uuid} name={item.author.name} />
        )}
      </View>
    </Animated.View>
  );
};
