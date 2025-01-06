import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions, View } from 'react-native';
import type { Tag } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';

const { width: wWidth } = Dimensions.get('window');

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

interface TagCardProps {
  data: Tag;
}

export const TagCard: React.FC<TagCardProps> = (props) => {
  const { data } = props;

  return (
    <View key={data.uuid} className="flex-row items-center justify-between px-4 py-4">
      <View className="flex-row items-center gap-3">
        <Ionicons name="pricetag-outline" size={19} className="text-primary" />

        <Text variant="paragraphMedium">{data.title}</Text>
      </View>

      <Text variant="paragraphCaption" className="text-zinc-500">
        23 quotes
      </Text>
    </View>
  );
};

export interface TagCardSkeletonProps {}

export const TagCardSkeleton: React.FC<TagCardSkeletonProps> = () => {
  return (
    <ContentLoader
      speed={2}
      width={wWidth}
      height={166}
      viewBox={`0 0 ${wWidth} 166`}
      backgroundColor="#e5e7eb"
      foregroundColor="#d1d5db"
    >
      <Rect x="16" y="16" rx="4" ry="4" width={wWidth - 64} height="16" />
      <Rect x="16" y="40" rx="4" ry="4" width={wWidth - 96} height="16" />
      <Rect x="16" y="64" rx="4" ry="4" width={wWidth - 128} height="16" />
    </ContentLoader>
  );
};
