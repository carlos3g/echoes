import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSearchFolders } from '@/features/folder/hooks/use-search-folders';
import { FolderList } from '@/features/folder/components/folder-list';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { useDebounce } from '@/shared/hooks/use-debounce';

export default function SearchFoldersScreen() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  const { folders, isLoading, isRefetching, refetch, fetchNextPage } = useSearchFolders(debouncedSearch);

  return (
    <View className="flex-1 bg-background">
      <SearchBar value={searchText} onChangeText={setSearchText} placeholder={t('folder.searchPlaceholder')} />
      <FolderList
        folders={folders}
        isLoading={debouncedSearch.length >= 2 ? isLoading : false}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onEndReached={fetchNextPage}
      />
    </View>
  );
}
