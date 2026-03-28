import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetAuthors } from '@/features/author/hooks/use-get-authors';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Text } from '@/shared/components/ui/text';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { FlashList } from '@/shared/components/ui/flash-list';
import { SearchBar } from '@/shared/components/ui/search-bar';
import type { Author } from '@/types/entities';

const AuthorListEmpty = React.memo(() => <EmptyState icon="person-outline" title="Nenhum autor encontrado" />);

export default function AuthorsScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 400);

  const { authors, isLoading, fetchNextPage } = useGetAuthors({
    search: debouncedSearch || undefined,
  });

  return (
    <View className="flex-1 bg-background">
      <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Buscar autores..." />

      <FlashList<Author>
        data={authors}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border-b border-border px-4 py-3"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(authors)/[authorUuid]',
                params: { authorUuid: item.uuid },
              })
            }
          >
            <Text variant="paragraphMedium" className="font-semibold text-foreground">
              {item.name}
            </Text>
            {item.bio && (
              <Text variant="paragraphSmall" className="mt-1 text-muted-foreground" numberOfLines={2}>
                {item.bio}
              </Text>
            )}
          </TouchableOpacity>
        )}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={isLoading ? undefined : AuthorListEmpty}
      />
    </View>
  );
}
