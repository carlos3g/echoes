import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import ContentLoader, { Rect } from 'react-content-loader/native';
import type { TouchableOpacityProps } from 'react-native';
import { Dimensions, TouchableOpacity, View } from 'react-native';
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

interface TagCardProps extends TouchableOpacityProps {
  data: Tag;
  icon?: 'outline' | 'solid';
}

// Better use compound components here, but not worth since it's a simple component
export const TagCard: React.FC<TagCardProps> = (props) => {
  const { data, icon, ...rest } = props;

  return (
    <TouchableOpacity className="flex-row items-center justify-between px-4 py-4" {...rest}>
      <View className="flex-row items-center gap-3">
        {icon === 'solid' ? (
          <Ionicons name="pricetag" size={19} className="text-primary" />
        ) : (
          <Ionicons name="pricetag-outline" size={19} className="text-primary" />
        )}

        <Text variant="paragraphMedium">{data.title}</Text>
      </View>

      <Text variant="paragraphCaption" className="text-zinc-500">
        {data.metadata.totalQuotes} quotes
      </Text>
    </TouchableOpacity>
  );
};

export const TagCardSkeleton: React.FC = () => {
  return (
    <ContentLoader
      speed={2}
      width={wWidth}
      height={56}
      viewBox={`0 0 ${wWidth} 56`}
      backgroundColor="#e5e7eb"
      foregroundColor="#d1d5db"
    >
      <Rect x="16" y="18" rx="4" ry="4" width="19" height="19" />

      <Rect x="51" y="20" rx="4" ry="4" width={120} height="16" />

      <Rect x={wWidth - 80} y="22" rx="4" ry="4" width="48" height="12" />
    </ContentLoader>
  );
};
