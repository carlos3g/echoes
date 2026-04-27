import type RNBottomSheet from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { AddToFolderBottomSheetProvider } from '@/features/folder/components/add-to-folder-bottom-sheet';
import { CreateTagBottomSheet } from '@/features/tag/components/create-tag-bottom-sheet';
import { CreateFolderBottomSheet } from '@/features/folder/components/create-folder-bottom-sheet';
import { FolderList } from '@/features/folder/components/folder-list';
import { useQuoteList } from '@/features/quote/hooks/use-quote-list';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useFolders } from '@/features/folder/hooks/use-folders';
import { useTagContextMenu } from '@/features/tag/hooks/use-tag-context-menu';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Text } from '@/shared/components/ui/text';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { Fab } from '@/shared/components/ui/fab';
import { FilterChipRow } from '@/shared/components/ui/filter-chip-row';
import { useTheme } from '@/lib/nativewind/theme.context';

type CollectionTab = 'favorites' | 'folders';

export default function CollectionScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const createTagSheetRef = useRef<RNBottomSheet>(null);
  const createFolderSheetRef = useRef<RNBottomSheet>(null);
  const [activeTab, setActiveTab] = useState<CollectionTab>('favorites');
  const [selectedTagUuids, setSelectedTagUuids] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  const handleTagDeleted = useCallback(
    (uuid: string) => setSelectedTagUuids((prev) => prev.filter((id) => id !== uuid)),
    []
  );
  const { showContextMenu } = useTagContextMenu({ onDelete: handleTagDeleted });

  const { tags } = useTags();
  const {
    folders,
    isLoading: isFoldersLoading,
    isRefetching: isFoldersRefetching,
    refetch: refetchFolders,
    fetchNextPage: fetchNextFolders,
  } = useFolders();
  const { isRefetching, refetch, fetchNextPage, quotes, isLoading, currentPage, lastPage, onPageChange } = useQuoteList(
    {
      favoritesOnly: true,
      tagUuids: selectedTagUuids.length > 0 ? selectedTagUuids : undefined,
      search: debouncedSearch || undefined,
    }
  );

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <AddToFolderBottomSheetProvider>
          {/* Segmented control */}
          <View className="flex-row border-b border-border">
            <Pressable
              className={`flex-1 items-center py-3 ${activeTab === 'favorites' ? 'border-b-2 border-primary' : ''}`}
              onPress={() => setActiveTab('favorites')}
            >
              <Text
                variant="paragraphSmall"
                semiBold
                className={activeTab === 'favorites' ? 'text-primary' : 'text-muted-foreground'}
              >
                {t('collection.favorites')}
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 items-center py-3 ${activeTab === 'folders' ? 'border-b-2 border-primary' : ''}`}
              onPress={() => setActiveTab('folders')}
            >
              <Text
                variant="paragraphSmall"
                semiBold
                className={activeTab === 'folders' ? 'text-primary' : 'text-muted-foreground'}
              >
                {t('collection.folders')}
              </Text>
            </Pressable>
          </View>

          {activeTab === 'favorites' ? (
            <>
              <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                placeholder={t('collection.searchPlaceholder')}
              />

              <View className="flex-row items-center justify-between px-4 pb-1">
                <Text variant="paragraphSmall" className="text-muted-foreground">
                  {t('collection.favoriteCount', { count: quotes.length })}
                </Text>
              </View>

              <FilterChipRow
                items={tags}
                selectedUuids={selectedTagUuids}
                onSelect={setSelectedTagUuids}
                onLongPress={showContextMenu}
              />

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
            </>
          ) : (
            <FolderList
              folders={folders}
              isLoading={isFoldersLoading}
              isRefetching={isFoldersRefetching}
              onRefresh={refetchFolders}
              onEndReached={fetchNextFolders}
            />
          )}
        </AddToFolderBottomSheetProvider>
      </TagQuoteBottomSheetProvider>

      <CreateTagBottomSheet ref={createTagSheetRef} />
      <CreateFolderBottomSheet ref={createFolderSheetRef} />

      {activeTab === 'favorites' ? (
        <Fab testID="collection-fab" iconName="pricetag-outline" onPress={() => createTagSheetRef.current?.expand()} />
      ) : (
        <Fab
          testID="create-folder-fab"
          iconName="folder-outline"
          onPress={() => createFolderSheetRef.current?.expand()}
        />
      )}
    </View>
  );
}
