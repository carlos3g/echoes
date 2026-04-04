import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { QuoteList, QuoteFilterBadge } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { AddToFolderBottomSheetProvider } from '@/features/folder/components/add-to-folder-bottom-sheet';
import { FeaturedAuthors } from '@/features/quote/components/explore/featured-authors';
import { DiscoverFolders } from '@/features/folder/components/discover-folders';
import { DiscoverUsers } from '@/features/user/components/discover-users';
import { AuthorOfTheDay } from '@/features/author/components/author-of-the-day';
import { SearchResults } from '@/features/search/components/search-results';
import { SearchHistory } from '@/features/search/components/search-history';
import { useQuoteList } from '@/features/quote/hooks/use-quote-list';
import { useGetCategories } from '@/features/category/hooks/use-get-categories';
import { useSearch } from '@/features/search/hooks/use-search';
import { useSearchHistoryStore } from '@/lib/zustand/stores/search-history.store';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { FilterChipRow } from '@/shared/components/ui/filter-chip-row';

type SearchParams = {
  tagUuids?: string;
  tagTitles?: string;
};

export default function ExploreScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tagUuids: tagUuidsParam, tagTitles: tagTitlesParam } = useLocalSearchParams<SearchParams>();
  const tagUuids = tagUuidsParam ? tagUuidsParam.split(',').filter(Boolean) : [];
  const tagTitles = tagTitlesParam ? tagTitlesParam.split(',').filter(Boolean) : [];
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryUuid, setSelectedCategoryUuid] = useState<string | undefined>(undefined);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedSearch = useDebounce(searchText, 400);
  const addSearch = useSearchHistoryStore((s) => s.addSearch);

  const { categories } = useGetCategories();

  const { isRefetching, refetch, fetchNextPage, quotes, isLoading, currentPage, lastPage, onPageChange } = useQuoteList(
    {
      tagUuids: tagUuids.length > 0 ? tagUuids : undefined,
      categoryUuid: selectedCategoryUuid,
      search: !isSearchFocused && debouncedSearch ? debouncedSearch : undefined,
    }
  );

  const { data: searchData, isLoading: isSearchLoading } = useSearch(isSearchFocused ? debouncedSearch : '');

  const clearFilters = () => {
    router.setParams({ tagUuids: undefined, tagTitles: undefined });
  };

  const handleSearchSelect = useCallback(
    (term: string) => {
      setSearchText(term);
      addSearch(term);
    },
    [addSearch]
  );

  const handleSearchSubmit = useCallback(() => {
    if (searchText.trim().length >= 2) {
      addSearch(searchText.trim());
    }
  }, [searchText, addSearch]);

  return (
    <View className="flex-1 bg-background">
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder={t('explore.searchPlaceholder')}
        testID="search-input"
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        onSubmit={handleSearchSubmit}
      />

      {isSearchFocused && !(debouncedSearch.length >= 2) && <SearchHistory onSelect={handleSearchSelect} />}

      {isSearchFocused && debouncedSearch.length >= 2 && (
        <SearchResults data={searchData} isLoading={isSearchLoading} searchTerm={debouncedSearch} />
      )}

      {!isSearchFocused && (
        <TagQuoteBottomSheetProvider>
          <AddToFolderBottomSheetProvider>
            <AuthorOfTheDay />
            <FeaturedAuthors />
            <DiscoverFolders />
            <DiscoverUsers />

            <FilterChipRow
              items={categories}
              selectedUuids={selectedCategoryUuid ? [selectedCategoryUuid] : []}
              onSelect={(uuids) => setSelectedCategoryUuid(uuids[uuids.length - 1])}
              allLabel={t('common.all')}
            />

            {tagTitles.length > 0 && <QuoteFilterBadge tagTitles={tagTitles} onClear={clearFilters} />}

            <QuoteList
              quotes={quotes}
              isLoading={isLoading}
              isRefetching={isRefetching}
              onRefresh={refetch}
              onEndReached={fetchNextPage}
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={onPageChange}
            />
          </AddToFolderBottomSheetProvider>
        </TagQuoteBottomSheetProvider>
      )}
    </View>
  );
}
