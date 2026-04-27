import React, { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSearchUsers } from '@/features/user/hooks/use-search-users';
import { useSuggestedUsers } from '@/features/user/hooks/use-suggested-users';
import { UserList } from '@/features/user/components/user-list';
import { SearchBar } from '@/shared/components/ui/search-bar';
import { Text } from '@/shared/components/ui/text';

export default function UserSearchScreen() {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const searchResults = useSearchUsers(query);
  const suggestedResults = useSuggestedUsers();

  const isSearching = query.length >= 2;
  const activeResults = isSearching ? searchResults : suggestedResults;

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4">
        <SearchBar value={query} onChangeText={setQuery} placeholder={t('user.searchPlaceholder')} />
      </View>

      {!isSearching ? (
        <Text variant="paragraphMedium" semiBold className="px-4 pb-2 pt-4">
          {t('user.suggestedTitle')}
        </Text>
      ) : null}

      <UserList
        users={activeResults.users}
        isLoading={activeResults.isLoading}
        isRefetching={activeResults.isRefetching}
        onRefresh={activeResults.refetch}
        onEndReached={activeResults.fetchNextPage}
      />
    </View>
  );
}
