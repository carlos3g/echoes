import ContentLoader, { Rect } from 'react-content-loader/native';
import type { TouchableOpacityProps } from 'react-native';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import type { Tag } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { Ionicons } from '@/lib/nativewind/components';
import { useTheme } from '@/lib/nativewind/theme.context';

const { width: wWidth } = Dimensions.get('window');

interface TagCardProps extends TouchableOpacityProps {
  data: Tag;
  icon?: 'outline' | 'solid';
  testID?: string;
}

// Better use compound components here, but not worth since it's a simple component
export const TagCard: React.FC<TagCardProps> = (props) => {
  const { data, icon, testID, ...rest } = props;

  return (
    <TouchableOpacity
      testID={testID ?? `tag-card-${data.uuid}`}
      className="flex-row items-center justify-between px-4 py-4"
      accessibilityRole="button"
      accessibilityLabel={data.title}
      activeOpacity={0.7}
      {...rest}
    >
      <View className="flex-row items-center gap-3">
        {icon === 'solid' ? (
          <Ionicons name="pricetag" size={19} className="text-primary" />
        ) : (
          <Ionicons name="pricetag-outline" size={19} className="text-primary" />
        )}

        <Text variant="paragraphMedium">{data.title}</Text>
      </View>

      <Text variant="paragraphCaption" className="text-muted-foreground">
        {data.metadata.totalQuotes} quotes
      </Text>
    </TouchableOpacity>
  );
};

export const TagCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <ContentLoader
      speed={2}
      width={wWidth}
      height={56}
      viewBox={`0 0 ${wWidth} 56`}
      backgroundColor={colors.muted}
      foregroundColor={colors.border}
    >
      <Rect x="16" y="18" rx="4" ry="4" width="19" height="19" />

      <Rect x="51" y="20" rx="4" ry="4" width={120} height="16" />

      <Rect x={wWidth - 80} y="22" rx="4" ry="4" width="48" height="12" />
    </ContentLoader>
  );
};
