import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';
import type { Quote } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { quoteService } from '@/features/quote/services';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

interface ShareButtonProps {
  data: Quote;
}

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { data } = props;

  const handleShare = async () => {
    await Share.open({
      url: `https://echoes.carlos3g.dev/quotes/${data.uuid}`,
    });
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Ionicons name="share-social-outline" size={20} className="text-[#4b5563]" />
    </TouchableOpacity>
  );
};

interface FavoriteButtonProps {
  data: Quote;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const { data } = props;
  const { metadata = { favorites: 856, tags: 2, favoritedByUser: true } } = data;

  const favoriteMutation = useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.favorite(uuid),
    onError: () => {
      toast.error('Opa!!', {
        description: 'E-mail ou senha inválidos',
      });
    },
  });

  const unfavoriteMutation = useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.favorite(uuid),
    onError: () => {
      toast.error('Opa!!', {
        description: 'E-mail ou senha inválidos',
      });
    },
  });

  const formattedFavorites = humanizeNumber(metadata?.favorites);

  const handleFavorite = () => {
    if (metadata?.favoritedByUser) {
      unfavoriteMutation.mutate(data.uuid);
      return;
    }

    favoriteMutation.mutate(data.uuid);
  };

  return (
    <TouchableOpacity className="flex-row items-center gap-1" onPress={handleFavorite}>
      <Ionicons
        name={metadata?.favoritedByUser ? 'heart' : 'heart-outline'}
        size={20}
        className={metadata?.favoritedByUser ? 'text-red-500' : 'text-[#4b5563]'}
      />
      <Text variant="paragraphSmall" className={cn('text-gray-600', metadata?.favoritedByUser && 'text-red-500')}>
        {formattedFavorites}
      </Text>
    </TouchableOpacity>
  );
};

interface TagButtonProps {
  data: Quote;
}

export const TagButton: React.FC<TagButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;

  const formattedTags = humanizeNumber(metadata?.tags);

  const handleTag = () => {
    toast.info('Essa funcionalidade ainda não está disponível', {
      id: 'tag-toast',
      icon: <Ionicons name="alert-circle" className="text-yellow-500" size={20} />,
      description: 'Estamos trabalhando para trazer essa funcionalidade o mais breve possível',
    });
  };

  return (
    <TouchableOpacity className="flex-row items-center gap-1" onPress={handleTag}>
      <Ionicons name="pricetag-outline" size={19} className="text-[#4b5563]" />
      <Text variant="paragraphSmall" className="text-gray-600">
        {formattedTags}
      </Text>
    </TouchableOpacity>
  );
};

interface QuoteCardProps {
  data: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
  const { data } = props;

  return (
    <View key={data.uuid} className="py-4 px-4">
      <Text className="leading-relaxed">{data.body}</Text>
      <Text variant="paragraphSmall" className="mt-3 text-[#2559ac]">
        {data.author?.name}
      </Text>

      <View className="flex-row justify-between mt-4">
        <View className="gap-5 flex-row">
          <FavoriteButton data={data} />

          <TagButton data={data} />
        </View>

        <ShareButton data={data} />
      </View>
    </View>
  );
};
