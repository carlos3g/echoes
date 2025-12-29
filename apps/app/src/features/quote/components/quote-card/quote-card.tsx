import type { PressableProps } from 'react-native';
import { Dimensions, Pressable, View } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';
import React from 'react';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { ShareButton } from './share-button';
import { FavoriteButton } from './favorite-button';
import { TagButton } from './tag-button';

const { width: wWidth } = Dimensions.get('window');
const SKELETON_HEIGHT = 166;

interface QuoteCardProps extends PressableProps {
  data: Quote;
  testID?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
  const { data, testID, ...rest } = props;

  return (
    <Pressable testID={testID ?? `quote-card-${data.uuid}`} key={data.uuid} className="px-4 py-4" {...rest}>
      <Text testID={`quote-body-${data.uuid}`} className="leading-relaxed">
        {data.body}
      </Text>
      <Text testID={`quote-author-${data.uuid}`} variant="paragraphSmall" className="text-muted-foreground mt-3">
        {data.author?.name}
      </Text>

      <View className="mt-4 flex-row justify-between">
        <View className="flex-row gap-5">
          <FavoriteButton data={data} />

          <TagButton data={data} />
        </View>

        <ShareButton data={data} />
      </View>
    </Pressable>
  );
};

export const QuoteCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ContentLoader
      speed={2}
      width={wWidth}
      height={SKELETON_HEIGHT}
      viewBox={`0 0 ${wWidth} ${SKELETON_HEIGHT}`}
      backgroundColor={colors.muted}
      foregroundColor={colors.border}
    >
      <Rect x="16" y="16" rx="4" ry="4" width={wWidth - 64} height="16" />
      <Rect x="16" y="40" rx="4" ry="4" width={wWidth - 96} height="16" />
      <Rect x="16" y="64" rx="4" ry="4" width={wWidth - 128} height="16" />

      <Rect x="16" y="96" rx="4" ry="4" width={120} height="14" />

      <Rect x="16" y="128" rx="4" ry="4" width="50" height="20" />
      <Rect x="90" y="128" rx="4" ry="4" width="50" height="20" />
      <Rect x={wWidth - 36} y="128" rx="4" ry="4" width="20" height="20" />
    </ContentLoader>
  );
};
