import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView, useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { AnimatedChip } from '@/shared/components/ui/filter-chip-row';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useQuoteTags } from '@/features/quote/hooks/use-quote-tags';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet, BottomSheetFooter, Ionicons } from '@/lib/nativewind/components';
import { useTagQuoteBottomSheet } from './tag-quote-bottom-sheet.context';
import { TagListItem, TagListItemSkeleton } from './tag-list-item';
import { getRecentTagUuids } from '@/lib/mmkv/recent-tags';
import { quoteService } from '@/features/quote/services';
import { addRecentTag } from '@/lib/mmkv/recent-tags';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { Tag } from '@/types/entities';

const SNAP_POINTS = ['50%', '70%', '80%'];

interface TagQuoteBottomSheetProps {
  onDismiss?: () => void;
}

export const TagQuoteBottomSheet = React.forwardRef<RNBottomSheet, TagQuoteBottomSheetProps>(({ onDismiss }, ref) => {
  const { bottom } = useAppSafeArea();
  const { hide, quote } = useTagQuoteBottomSheet();
  const { colors } = useTheme();
  const BottomSheetScrollable = useBottomSheetScrollableCreator();
  const router = useRouter();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const { isRefetching, refetch, fetchNextPage, tags, isLoading } = useTags();
  const { data: appliedTags } = useQuoteTags({
    quoteUuid: quote?.uuid ?? '',
    enabled: !!quote,
  });

  const appliedTagUuids = useMemo(
    () => new Set((appliedTags ?? []).map((tag) => tag.uuid)),
    [appliedTags]
  );

  const recentTagUuids = useMemo(() => getRecentTagUuids(), [quote?.uuid]);
  const recentTagUuidSet = useMemo(() => new Set(recentTagUuids), [recentTagUuids]);
  const recentTags = useMemo(
    () => tags.filter((tag) => recentTagUuidSet.has(tag.uuid)),
    [tags, recentTagUuidSet]
  );

  const queryClient = useQueryClient();

  const handleRecentToggle = useCallback(
    async (tag: Tag) => {
      if (!quote) return;
      if (appliedTagUuids.has(tag.uuid)) {
        await quoteService.untag(quote.uuid, tag.uuid);
      } else {
        await quoteService.tag(quote.uuid, tag.uuid);
        addRecentTag(tag.uuid);
      }
      void queryClient.invalidateQueries({ queryKey: queryKeys.quotes.tags(quote.uuid) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
    [quote, appliedTagUuids, queryClient]
  );

  const filteredTags = useMemo(() => {
    if (!searchText.trim()) return tags;
    const lower = searchText.toLowerCase();
    return tags.filter((tag) => tag.title.toLowerCase().includes(lower));
  }, [tags, searchText]);

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />,
    []
  );

  const renderFooter = useCallback(
    (footerProps: BottomSheetFooterProps) => (
      <BottomSheetFooter
        {...footerProps}
        bottomInset={bottom + 16}
        className="px-4"
        style={{ backgroundColor: colors.background }}
      >
        <Button
          title={t('common.create')}
          testID="create-tag-button"
          onPress={() => {
            hide();
            router.push('/(app)/(tabs)/collection');
          }}
        />
      </BottomSheetFooter>
    ),
    [bottom, router, hide, colors.background, t]
  );

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  const renderItem = useCallback(
    ({ item }: { item: Tag }) => (
      <TagListItem item={item} isTagged={appliedTagUuids.has(item.uuid)} />
    ),
    [appliedTagUuids]
  );

  const renderItemSkeleton = useCallback(() => <TagListItemSkeleton />, []);

  const ItemSeparatorComponent = useCallback(
    () => <View className="bg-border" style={{ height: 1 }} />,
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="items-center justify-center py-8">
        <Text variant="paragraphSmall" className="text-muted-foreground">
          {t('tag.emptyTitle')}
        </Text>
      </View>
    ),
    [t]
  );

  return (
    // @ts-expect-error BottomSheet types incompatible with cssInterop
    <BottomSheet
      ref={ref}
      index={0}
      footerComponent={renderFooter}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enablePanDownToClose
      snapPoints={SNAP_POINTS}
      onClose={() => {
        hide();
        onDismiss?.();
      }}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
    >
      <BottomSheetView className="flex-1">
        {/* Search */}
        <View className="px-4 pb-2">
          <View className="flex-row items-center rounded-xl bg-muted px-4 py-3">
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
            <BottomSheetTextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={t('tag.searchPlaceholder')}
              placeholderTextColor={colors.mutedForeground}
              style={{ flex: 1, marginLeft: 12, color: colors.foreground, fontFamily: 'DMSans_400Regular', fontSize: 16 }}
            />
          </View>
        </View>

        {/* Recents */}
        {!searchText && recentTags.length > 0 && (
          <View className="pb-2">
            <Text variant="paragraphCaption" className="text-muted-foreground px-4 pb-1">
              {t('tag.recents')}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexDirection: 'row' }}
              style={{ flexGrow: 0 }}
            >
              {recentTags.map((tag) => (
                <AnimatedChip
                  key={tag.uuid}
                  label={tag.title}
                  isActive={appliedTagUuids.has(tag.uuid)}
                  onPress={() => handleRecentToggle(tag)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Tag list */}
        <FlashList
          renderScrollComponent={BottomSheetScrollable}
          data={isLoading ? Array(10).fill(null) : filteredTags}
          renderItem={isLoading ? renderItemSkeleton : renderItem}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          refreshControl={refreshControl}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
        />
      </BottomSheetView>
    </BottomSheet>
  );
});
