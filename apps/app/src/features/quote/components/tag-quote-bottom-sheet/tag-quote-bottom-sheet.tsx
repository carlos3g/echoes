import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetView, useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { Button } from '@/shared/components/ui/button';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { useTags } from '@/features/tag/hooks/use-tags';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet, BottomSheetFooter } from '@/lib/nativewind/components';
import { useTagQuoteBottomSheet } from './tag-quote-bottom-sheet.context';
import { ItemSeparatorComponent, ListEmptyComponent, renderItem, renderItemSkeleton } from './tag-list-item';

const SNAP_POINTS = ['30%', '50%', '70%', '80%'];

export const TagQuoteBottomSheet = React.forwardRef<RNBottomSheet>((props, ref) => {
  const { bottom } = useAppSafeArea();
  const { hide, quote } = useTagQuoteBottomSheet();
  const { colors } = useTheme();
  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const router = useRouter();

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
          title="Criar"
          testID="create-tag-button"
          onPress={() => {
            hide();
            router.push('/(app)/(tabs)/collection');
          }}
        />
      </BottomSheetFooter>
    ),
    [bottom, router, hide, colors.background]
  );

  const { isRefetching, refetch, fetchNextPage, tags, isLoading } = useTags();

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={refetch} />,
    [isRefetching, refetch]
  );

  return (
    // @ts-expect-error BottomSheet types incompatible with cssInterop
    <BottomSheet
      ref={ref}
      index={-1}
      footerComponent={renderFooter}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enablePanDownToClose
      snapPoints={SNAP_POINTS}
      onClose={hide}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
    >
      <BottomSheetView className="flex-1">
        <FlashList
          renderScrollComponent={BottomSheetScrollable}
          data={isLoading ? Array(10).fill(null) : tags}
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
