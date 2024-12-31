import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import { toast } from 'sonner-native';
import type { InfiniteData } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ContentLoader, { Rect } from 'react-content-loader/native';
import type { Quote } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { quoteService } from '@/features/quote/services';
import type { ApiPaginatedResult, ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';

const { width: wWidth } = Dimensions.get('window');

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
    <TouchableOpacity testID="share-button" onPress={handleShare}>
      <Ionicons name="share-social-outline" size={20} className="text-[#4b5563]" />
    </TouchableOpacity>
  );
};

interface FavoriteButtonProps {
  data: Quote;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;

  const queryClient = useQueryClient();

  const favoriteMutation = useMutation<
    void,
    HttpError<ApiResponseError>,
    string,
    { previousState?: InfiniteData<ApiPaginatedResult<Quote>> }
  >({
    mutationFn: async (uuid) => quoteService.favorite(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      const previousState = queryClient.getQueryData<InfiniteData<ApiPaginatedResult<Quote>>>(['quotes']);

      if (!previousState) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousState?.pageParams,
        pages: previousState?.pages?.map((page) => {
          const quotes = page.data.map((quote) => {
            if (quote.uuid === uuid) {
              return {
                ...quote,
                metadata: { ...quote.metadata, favorites: quote.metadata.favorites + 1, favoritedByUser: true },
              };
            }

            return quote;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(['quotes'], newState);

      return { previousState };
    },
    onError: (_, __, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(['quotes'], context.previousState);
      }

      toast.error('Erro!', {
        description: 'Tente novamente',
      });
    },
  });

  const unfavoriteMutation = useMutation<
    void,
    HttpError<ApiResponseError>,
    string,
    { previousState?: InfiniteData<ApiPaginatedResult<Quote>> }
  >({
    mutationFn: async (uuid) => quoteService.unfavorite(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      const previousState = queryClient.getQueryData<InfiniteData<ApiPaginatedResult<Quote>>>(['quotes']);

      if (!previousState) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousState?.pageParams,
        pages: previousState?.pages?.map((page) => {
          const quotes = page.data.map((quote) => {
            if (quote.uuid === uuid) {
              return {
                ...quote,
                metadata: { ...quote.metadata, favorites: quote.metadata.favorites - 1, favoritedByUser: false },
              };
            }

            return quote;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(['quotes'], newState);

      return { previousState };
    },
    onError: (_, __, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(['quotes'], context.previousState);
      }

      toast.error('Erro!', {
        description: 'Tente novamente',
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
    <TouchableOpacity testID="toggle-favorite-button" className="flex-row items-center gap-1" onPress={handleFavorite}>
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
    <TouchableOpacity testID="toggle-tag-button" className="flex-row items-center gap-1" onPress={handleTag}>
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

export interface QuoteCardSkeletonProps {}

export const QuoteCardSkeleton: React.FC<QuoteCardSkeletonProps> = () => {
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

      <Rect x="16" y="96" rx="4" ry="4" width={120} height="14" />

      <Rect x="16" y="128" rx="4" ry="4" width="50" height="20" />
      <Rect x="90" y="128" rx="4" ry="4" width="50" height="20" />
      <Rect x={wWidth - 36} y="128" rx="4" ry="4" width="20" height="20" />
    </ContentLoader>
  );
};
