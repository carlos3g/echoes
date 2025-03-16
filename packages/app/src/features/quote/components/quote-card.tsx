import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import type { PressableProps } from 'react-native';
import { Dimensions, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import { toast } from 'sonner-native';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Portal } from 'react-native-portalize';
import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import RNBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
  BottomSheetView,
  BottomSheetFooter as RNBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, createContext, useContext, useState } from 'react';
import type { ListRenderItem } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import type { Quote, Tag } from '@/types/entities';
import { cn, humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { quoteService } from '@/features/quote/services';
import type { ApiPaginatedResult, ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';
import { Button } from '@/shared/components/ui/button';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import type { ListTagsOutput } from '@/features/tag/contracts/tag-service.contract';
import { tagService } from '@/features/tag/services';
import { TagCard, TagCardSkeleton } from '@/features/tag/components/tag-card';
import type { IsQuoteTaggedOutput } from '@/features/quote/contracts/quote-service.contract';
import type { AppTabNavigationProp } from '@/navigation/app.navigator.types';

const { width: wWidth } = Dimensions.get('window');

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

const BottomSheet = cssInterop(RNBottomSheet, {
  className: {
    target: 'style',
  },
  handleClassName: {
    target: 'handleStyle',
  },
  containerClassName: {
    target: 'containerStyle',
  },
  backgroundClassName: {
    target: 'backgroundStyle',
  },
  handleIndicatorClassName: {
    target: 'handleIndicatorStyle',
  },
});

const BottomSheetFooter = cssInterop(RNBottomSheetFooter, {
  className: {
    target: 'style',
  },
});

interface ShareButtonProps {
  data: Quote;
}

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { data } = props;

  const handleShare = async () => {
    await Share.open({ url: `https://echoes.carlos3g.dev/quotes/${data.uuid}` });
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
    { previousState?: [QueryKey, InfiniteData<ApiPaginatedResult<Quote>> | undefined] }
  >({
    mutationFn: async (uuid) => quoteService.favorite(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [_, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
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

      queryClient.setQueryData(previousStateQuery, newState);

      return { previousState };
    },
    onError: (_, __, context) => {
      if (context?.previousState) {
        const [previousStateQuery, previousStateData] = context.previousState;
        queryClient.setQueryData(previousStateQuery, previousStateData);
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
    { previousState?: [QueryKey, InfiniteData<ApiPaginatedResult<Quote>> | undefined] }
  >({
    mutationFn: async (uuid) => quoteService.unfavorite(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [_, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
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

      queryClient.setQueryData(previousStateQuery, newState);

      return { previousState };
    },
    onError: (_, __, context) => {
      if (context?.previousState) {
        const [previousStateQuery, previousStateData] = context.previousState;
        queryClient.setQueryData(previousStateQuery, previousStateData);
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

const RenderItem: React.FC<{ item: Tag }> = ({ item }) => {
  const { quote } = useTagQuoteBottomSheet();

  const queryClient = useQueryClient();

  const tagMutation = useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.tag(uuid, item.uuid),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      await queryClient.invalidateQueries({ queryKey: ['quote', 'is-tagged', quote?.uuid, item.uuid] });
      await queryClient.invalidateQueries({ queryKey: ['tags'] });

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [_, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
          const quotes = page.data.map((q) => {
            if (q.uuid === quote!.uuid) {
              return {
                ...q,
                metadata: { ...q.metadata, tags: q.metadata.tags + 1 },
              };
            }

            return q;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(previousStateQuery, newState);
    },
  });

  const untagMutation = useMutation<void, HttpError<ApiResponseError>, string>({
    mutationFn: async (uuid) => quoteService.untag(uuid, item.uuid),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['quotes'] });

      await queryClient.invalidateQueries({ queryKey: ['quote', 'is-tagged', quote?.uuid, item.uuid] });
      await queryClient.invalidateQueries({ queryKey: ['tags'] });

      // TODO: get previousState using queryClient.getQueryData. Needs to get quotes filters first
      const queriesData = queryClient.getQueriesData<InfiniteData<ApiPaginatedResult<Quote>>>({
        queryKey: ['quotes'],
      });

      const previousState = queriesData.find((qData) => {
        const [_, queryData] = qData;

        return !!queryData?.pageParams;
      });

      const [previousStateQuery, previousStateData] = previousState || [];

      if (!previousStateData || !previousStateQuery) {
        return {};
      }

      const newState: InfiniteData<ApiPaginatedResult<Quote>> = {
        pageParams: previousStateData?.pageParams,
        pages: previousStateData?.pages?.map((page) => {
          const quotes = page.data.map((q) => {
            if (q.uuid === quote!.uuid) {
              return {
                ...q,
                metadata: { ...q.metadata, tags: q.metadata.tags - 1 },
              };
            }

            return q;
          });

          return {
            ...page,
            data: quotes,
          };
        }),
      };

      queryClient.setQueryData(previousStateQuery, newState);
    },
  });

  const isTaggedQuery = useQuery<IsQuoteTaggedOutput, HttpError<ApiResponseError>, IsQuoteTaggedOutput>({
    queryKey: ['quote', 'is-tagged', quote?.uuid, item.uuid],
    queryFn: () => quoteService.isTagged(quote!.uuid, item.uuid),
    enabled: !!quote,
  });

  const isTagged = isTaggedQuery.data?.exists;

  const handleTag = () => {
    if (!quote) {
      return;
    }

    if (isTagged) {
      untagMutation.mutate(quote.uuid);
      return;
    }

    tagMutation.mutate(quote.uuid);
  };

  return (
    <TagCard
      data={item}
      key={item.uuid}
      onPress={handleTag}
      icon={isTagged ? 'solid' : 'outline'}
      disabled={tagMutation.isPending || untagMutation.isPending}
    />
  );
};

const renderItem: ListRenderItem<Tag> = ({ item }) => <RenderItem item={item} />;

const renderItemSkeleton: ListRenderItem<Tag> = () => <TagCardSkeleton />;

const ItemSeparatorComponent = () => <View className="bg-[#D6D6D6]" style={{ height: StyleSheet.hairlineWidth }} />;

const ListEmptyComponent = () => (
  <View className="items-center">
    <Text>Nenhuma tag cadastrada</Text>
  </View>
);

export const TagQuoteBottomSheet = React.forwardRef<RNBottomSheet>((props, ref) => {
  const { bottom } = useAppSafeArea();
  const { hide } = useTagQuoteBottomSheet();

  const { navigate } = useNavigation<AppTabNavigationProp<'ManageTagsScreen'>>();

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />,
    []
  );

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter {...footerProps} bottomInset={bottom + 16} className="px-4">
        <Button
          title="Criar"
          testID="create-tag-button"
          onPress={() => {
            hide();
            navigate('ManageTagsScreen');
          }}
        />
      </BottomSheetFooter>
    ),
    [bottom, navigate, hide]
  );

  const { isRefetching, refetch, hasNextPage, fetchNextPage, data, isLoading } = useInfiniteQuery<ListTagsOutput>({
    queryKey: ['tags'],
    queryFn: ({ pageParam }) => tagService.list({ paginate: { page: pageParam as number } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
    getPreviousPageParam: (lastPage) => lastPage.meta.prev,
  });

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  const tags: Tag[] = useMemo(() => data?.pages.map((page) => page.data).flat() ?? [], [data]);

  const safeFetchNextPage = useCallback(() => {
    if (hasNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      footerComponent={renderFooter}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enablePanDownToClose
      snapPoints={['30%', '50%', '70%', '80%']}
      onClose={hide}
    >
      <BottomSheetView className="flex-1">
        <BottomSheetFlashList
          estimatedItemSize={56}
          data={isLoading ? Array(10).fill(null) : tags}
          renderItem={isLoading ? renderItemSkeleton : renderItem}
          onEndReached={safeFetchNextPage}
          onEndReachedThreshold={0.5}
          refreshControl={refreshControl}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});

interface TagQuoteBottomSheetContextValue {
  quote: Quote | null;
  show: (quote: Quote) => void;
  hide: () => void;
}

const TagQuoteBottomSheetContext = createContext<TagQuoteBottomSheetContextValue | null>(null);

export const useTagQuoteBottomSheet = () => {
  const context = useContext(TagQuoteBottomSheetContext);

  if (!context) {
    throw new Error('useTagQuoteBottomSheet must be used within TagQuoteBottomSheetProvider');
  }

  return context;
};

interface TagQuoteBottomSheetProviderProps {
  children: React.ReactNode;
}

export const TagQuoteBottomSheetProvider: React.FC<TagQuoteBottomSheetProviderProps> = ({ children }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const bottomSheetRef = useRef<RNBottomSheet>(null);

  const show = useCallback((q: Quote) => {
    setQuote(q);
    bottomSheetRef.current?.expand();
  }, []);

  const hide = useCallback(() => {
    setQuote(null);
    bottomSheetRef.current?.close();
  }, []);

  const value = useMemo(() => ({ quote, show, hide }), [quote, show, hide]);

  return (
    <TagQuoteBottomSheetContext.Provider value={value}>
      {children}

      <Portal>
        <TagQuoteBottomSheetContext.Provider value={value}>
          <TagQuoteBottomSheet ref={bottomSheetRef} />
        </TagQuoteBottomSheetContext.Provider>
      </Portal>
    </TagQuoteBottomSheetContext.Provider>
  );
};

interface TagButtonProps {
  data: Quote;
}

export const TagButton: React.FC<TagButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;
  const { show } = useTagQuoteBottomSheet();

  const formattedTags = humanizeNumber(metadata?.tags);

  const handleTag = () => {
    show(data);
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

interface QuoteCardProps extends PressableProps {
  data: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = (props) => {
  const { data, ...rest } = props;

  return (
    <Pressable key={data.uuid} className="px-4 py-4" {...rest}>
      <Text className="leading-relaxed">{data.body}</Text>
      <Text variant="paragraphSmall" className="mt-3 text-[#2559ac]">
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
