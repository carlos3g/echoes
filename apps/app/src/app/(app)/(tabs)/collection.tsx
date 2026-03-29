import type RNBottomSheet from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { CreateTagBottomSheet } from '@/features/tag/components/create-tag-bottom-sheet';
import { useGetQuotes } from '@/features/quote/hooks/use-get-quotes';
import { useTags } from '@/features/tag/hooks/use-tags';
import { Text } from '@/shared/components/ui/text';
import { Fab } from '@/shared/components/ui/fab';
import { FilterChipRow } from '@/shared/components/ui/filter-chip-row';

export default function CollectionScreen() {
  const bottomSheetRef = useRef<RNBottomSheet>(null);
  const [selectedTagUuid, setSelectedTagUuid] = useState<string | undefined>(undefined);

  const { tags } = useTags();
  const { isRefetching, refetch, fetchNextPage, quotes, isLoading } = useGetQuotes({
    favoritesOnly: true,
    tagUuid: selectedTagUuid,
  });

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <View className="flex-row items-center justify-between px-4 pb-1 pt-2">
          <Text variant="paragraphSmall" className="text-muted-foreground">
            {quotes.length} favoritos
          </Text>
        </View>

        <FilterChipRow items={tags} selectedUuid={selectedTagUuid} onSelect={setSelectedTagUuid} />

        <QuoteList
          quotes={quotes}
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={refetch}
          onEndReached={fetchNextPage}
        />
      </TagQuoteBottomSheetProvider>

      <CreateTagBottomSheet ref={bottomSheetRef} />
      <Fab testID="collection-fab" iconName="pricetag-outline" onPress={() => bottomSheetRef.current?.expand()} />
    </View>
  );
}
