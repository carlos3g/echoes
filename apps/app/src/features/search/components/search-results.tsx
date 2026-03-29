import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { SearchResult } from '@/features/search/contracts';
import type { Quote } from '@/types/entities';
import { QuoteCard } from '@/features/quote/components/quote-card';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { Text } from '@/shared/components/ui/text';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';

const PLACEHOLDER_DATE = new Date(0);

interface SearchResultsProps {
  data: SearchResult | undefined;
  isLoading: boolean;
  searchTerm: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ data, isLoading, searchTerm }) => {
  const router = useRouter();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator />
      </View>
    );
  }

  if (!data) return null;

  const hasResults = data.authors.length > 0 || data.quotes.length > 0 || data.categories.length > 0;

  if (!hasResults) {
    return (
      <EmptyState
        icon="search-outline"
        title={t('search.noResults', { term: searchTerm })}
        description={t('search.noResultsHint')}
      />
    );
  }

  return (
    <TagQuoteBottomSheetProvider>
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {data.authors.length > 0 && (
          <View className="py-3">
            <Text variant="paragraphSmall" semiBold className="mb-2 px-4 text-foreground">
              {t('search.authors')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 gap-4"
              style={{ flexGrow: 0 }}
            >
              {data.authors.map((author) => (
                <TouchableOpacity
                  key={author.uuid}
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]',
                      params: { authorUuid: author.uuid },
                    })
                  }
                  className="items-center"
                  activeOpacity={0.7}
                >
                  <AvatarInitials name={author.name} size="sm" />
                  <Text
                    variant="paragraphCaptionSmall"
                    className="mt-1 w-16 text-center text-foreground"
                    numberOfLines={1}
                  >
                    {author.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {data.categories.length > 0 && (
          <View className="py-2">
            <Text variant="paragraphSmall" semiBold className="mb-2 px-4 text-foreground">
              {t('search.categories')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-4 gap-2"
              style={{ flexGrow: 0 }}
            >
              {data.categories.map((category) => (
                <TouchableOpacity
                  key={category.uuid}
                  onPress={() =>
                    router.push({
                      pathname: '/(app)/(tabs)/(explore)',
                      params: { categoryUuid: category.uuid },
                    })
                  }
                  className="rounded-full border border-border bg-muted px-3 py-2"
                  activeOpacity={0.7}
                >
                  <Text variant="paragraphSmall" semiBold className="text-foreground">
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {data.quotes.length > 0 && (
          <View className="pt-2">
            <Text variant="paragraphSmall" semiBold className="mb-1 px-4 text-foreground">
              {t('search.quotes')}
            </Text>
            {data.quotes.map((quote, index) => (
              <QuoteCard
                key={quote.uuid}
                data={{
                  uuid: quote.uuid,
                  body: quote.body,
                  author: quote.author as Quote['author'],
                  metadata: quote.metadata,
                  createdAt: PLACEHOLDER_DATE,
                  updatedAt: PLACEHOLDER_DATE,
                }}
                index={index}
                onPress={() => router.push(`/(app)/(tabs)/(explore)/quote/${quote.uuid}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </TagQuoteBottomSheetProvider>
  );
};
