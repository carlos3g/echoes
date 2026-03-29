import type RNBottomSheet from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { CreateTagBottomSheet } from '@/features/tag/components/create-tag-bottom-sheet';
import { useQuoteList } from '@/features/quote/hooks/use-quote-list';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Text } from '@/shared/components/ui/text';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { Fab } from '@/shared/components/ui/fab';
import { FilterChipRow } from '@/shared/components/ui/filter-chip-row';

export default function CollectionScreen() {
  const { t } = useTranslation();
  const bottomSheetRef = useRef<RNBottomSheet>(null);
  const [selectedTagUuid, setSelectedTagUuid] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  const { tags } = useTags();
  const { isRefetching, refetch, fetchNextPage, quotes, isLoading, currentPage, lastPage, onPageChange } = useQuoteList(
    {
      favoritesOnly: true,
      tagUuid: selectedTagUuid,
      search: debouncedSearch || undefined,
    }
  );

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <SearchBar value={searchText} onChangeText={setSearchText} placeholder={t('collection.searchPlaceholder')} />

        <View className="flex-row items-center justify-between px-4 pb-1">
          <Text variant="paragraphSmall" className="text-muted-foreground">
            {t('collection.favoriteCount', { count: quotes.length })}
          </Text>
        </View>

        <FilterChipRow items={tags} selectedUuid={selectedTagUuid} onSelect={setSelectedTagUuid} />

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
      </TagQuoteBottomSheetProvider>

      <CreateTagBottomSheet ref={bottomSheetRef} />
      <Fab testID="collection-fab" iconName="pricetag-outline" onPress={() => bottomSheetRef.current?.expand()} />
    </View>
  );
}
