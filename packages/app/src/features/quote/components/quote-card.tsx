import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { cssInterop } from 'nativewind';
import { Text } from '@/shared/components/ui/text';
import type { Quote } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

interface QuoteCardProps {
  data: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
  const { data } = props;
  const { metadata = { likes: 856, tags: 2, likedByUser: true } } = data;

  const formattedLikes = humanizeNumber(metadata?.likes);
  const formattedTags = humanizeNumber(metadata?.tags);

  return (
    <View key={data.uuid} className="py-4 px-4">
      <Text className="leading-relaxed">{data.body}</Text>
      <Text variant="paragraphSmall" className="mt-3 text-[#2559ac]">
        {data.author?.name}
      </Text>

      <View className="flex-row justify-between mt-4">
        <View className="gap-5 flex-row">
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons
              name="heart-outline"
              size={20}
              className={metadata?.likedByUser ? 'text-red-500' : 'text-[#4b5563]'}
            />
            <Text variant="paragraphSmall" className={cn('text-gray-600', metadata?.likedByUser && 'text-red-500')}>
              {formattedLikes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="pricetag-outline" size={19} className="text-[#4b5563]" />
            <Text variant="paragraphSmall" className="text-gray-600">
              {formattedTags}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={20} className="text-[#4b5563]" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
