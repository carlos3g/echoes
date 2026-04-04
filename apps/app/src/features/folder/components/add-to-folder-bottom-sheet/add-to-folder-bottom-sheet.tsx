import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { useFolders } from '@/features/folder/hooks/use-folders';
import { useAddQuoteToFolder } from '@/features/folder/hooks/use-add-quote-to-folder';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet } from '@/lib/nativewind/components';
import type { Folder } from '@/types/entities';
import { useAddToFolderBottomSheet } from './add-to-folder-bottom-sheet.context';

interface AddToFolderBottomSheetProps {
  onDismiss?: () => void;
}

export const AddToFolderBottomSheet = React.forwardRef<RNBottomSheet, AddToFolderBottomSheetProps>(
  ({ onDismiss }, ref) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { quote } = useAddToFolderBottomSheet();
    const { folders, isLoading } = useFolders();
    const { mutate: addQuote } = useAddQuoteToFolder();

    const handleSelect = useCallback(
      (folder: Folder) => {
        if (!quote) return;
        addQuote({ folderUuid: folder.uuid, quoteUuid: quote.uuid });
      },
      [quote, addQuote]
    );

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />,
      []
    );

    const renderItem = useCallback(
      ({ item }: { item: Folder }) => {
        const folderColor = item.color || colors.primary;

        return (
          <Pressable
            className="flex-row items-center gap-3 px-4 py-3"
            onPress={() => handleSelect(item)}
            testID={`add-to-folder-${item.uuid}`}
          >
            <View style={{ backgroundColor: folderColor, width: 4, height: 32, borderRadius: 2 }} />
            <View className="flex-1">
              <Text variant="paragraphSmall" semiBold numberOfLines={1}>
                {item.name}
              </Text>
              <Text variant="paragraphCaption" className="text-muted-foreground">
                {t('folder.quoteCount', { count: item.metadata.totalQuotes })}
              </Text>
            </View>
            <Ionicons name="add-circle-outline" size={22} color={colors.mutedForeground} />
          </Pressable>
        );
      },
      [colors, handleSelect, t]
    );

    return (
      // @ts-expect-error BottomSheet types incompatible with cssInterop
      <BottomSheet
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        snapPoints={['50%']}
        onClose={onDismiss}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      >
        <BottomSheetView className="px-4 pb-2">
          <Text variant="paragraphMedium" semiBold>
            {t('folder.addToFolderTitle')}
          </Text>
        </BottomSheetView>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <BottomSheetFlatList
            data={folders}
            keyExtractor={(item: Folder) => item.uuid}
            renderItem={renderItem}
            ListEmptyComponent={
              <View className="items-center py-8">
                <Text variant="paragraphSmall" className="text-muted-foreground">
                  {t('folder.emptyTitle')}
                </Text>
              </View>
            }
          />
        )}
      </BottomSheet>
    );
  }
);
