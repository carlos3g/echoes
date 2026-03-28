import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuoteList, QuoteFilterBadge } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { useGetCategories } from '@/features/category/hooks/use-get-categories';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Text } from '@/shared/components/ui/text';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { cn } from '@/shared/utils';

type SearchParams = {
  tagUuid?: string;
  tagTitle?: string;
};

export default function ManageQuotesScreen() {
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

  const handleCategoryPress = (categoryUuid: string) => {
    setSelectedCategoryUuid((prev) => (prev === categoryUuid ? undefined : categoryUuid));
  };

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar citações..."
          testID="search-input"
        />

        {categories.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-4 py-2 gap-2"
            testID="category-chips"
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.uuid}
                testID={`category-chip-${category.uuid}`}
                onPress={() => handleCategoryPress(category.uuid)}
                accessibilityLabel={category.title}
                accessibilityRole="button"
                activeOpacity={0.7}
                className={cn(
                  'rounded-full border px-3 py-2',
                  selectedCategoryUuid === category.uuid ? 'border-primary bg-primary' : 'border-border bg-muted'
                )}
              >
                <Text
                  variant="paragraphSmall"
                  semiBold
                  className={cn(selectedCategoryUuid === category.uuid ? 'text-primary-foreground' : 'text-foreground')}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
