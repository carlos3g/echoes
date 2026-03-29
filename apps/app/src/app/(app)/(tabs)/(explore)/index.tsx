import { useState } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuoteList, QuoteFilterBadge } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { FeaturedAuthors } from '@/features/quote/components/explore/featured-authors';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { useGetCategories } from '@/features/category/hooks/use-get-categories';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { FilterChipRow } from '@/shared/components/ui/filter-chip-row';

type SearchParams = {
  tagUuid?: string;
  tagTitle?: string;
};

export default function ExploreScreen() {
  const router = useRouter();
  const { tagUuid, tagTitle } = useLocalSearchParams<SearchParams>();
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryUuid, setSelectedCategoryUuid] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(searchText, 400);

  const { categories } = useGetCategories();

  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({
    tagUuid,
    categoryUuid: selectedCategoryUuid,
    search: debouncedSearch || undefined,
  });

  const clearFilters = () => {
    router.setParams({ tagUuid: undefined, tagTitle: undefined });
  };

  const isSearching = debouncedSearch.length > 0;

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar quotes, autores..."
          testID="search-input"
        />

        {!isSearching && (
          <>
            <FeaturedAuthors />

            <FilterChipRow
              items={categories}
              selectedUuid={selectedCategoryUuid}
              onSelect={setSelectedCategoryUuid}
              allLabel="Todas"
            />
          </>
        )}

        {tagTitle && <QuoteFilterBadge tagTitle={tagTitle} onClear={clearFilters} />}

        <QuoteList
          quotes={quotes}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
        />
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
