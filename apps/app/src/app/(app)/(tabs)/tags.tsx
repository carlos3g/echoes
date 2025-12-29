import type RNBottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { View } from 'react-native';
import { Fab } from '@/shared/components/ui/fab';
import { TagList } from '@/features/tag/components/tag-list';
import { CreateTagBottomSheet } from '@/features/tag/components/create-tag-bottom-sheet';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useRefreshOnFocus } from '@/lib/react-query';

export default function ManageTagsScreen() {
  const bottomSheetRef = useRef<RNBottomSheet>(null);

  const { isRefetching, refetch, fetchNextPage, tags, isLoading } = useTags();

  useRefreshOnFocus(refetch);

  return (
    <View className="flex-1 bg-background">
      <TagList
        tags={tags}
        isLoading={isLoading}
        isRefetching={isRefetching}
        onRefresh={refetch}
        onEndReached={fetchNextPage}
      />

      <CreateTagBottomSheet ref={bottomSheetRef} />

      <Fab testID="tags-fab" onPress={() => bottomSheetRef.current?.expand()} />
    </View>
  );
}
