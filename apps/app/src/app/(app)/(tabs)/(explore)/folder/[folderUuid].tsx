import { Alert, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { FolderMetaBadges } from '@/features/folder/components/folder-meta-badges';
import { useFolderDetail } from '@/features/folder/hooks/use-folder-detail';
import { useFolderQuotes } from '@/features/folder/hooks/use-folder-quotes';
import { useLeaveFolder } from '@/features/folder/hooks/use-leave-folder';
import { QuoteList } from '@/features/quote/components/quote-list';
import { TagQuoteBottomSheetProvider } from '@/features/quote/components/tag-quote-bottom-sheet';
import { AddToFolderBottomSheetProvider } from '@/features/folder/components/add-to-folder-bottom-sheet';
import { Text } from '@/shared/components/ui/text';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { useTheme } from '@/lib/nativewind/theme.context';
import type { Folder } from '@/types/entities';

function FolderHeader({ folder, folderUuid }: { folder: Folder; folderUuid: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const folderColor = folder.color || colors.primary;
  const memberRole = folder.metadata?.memberRole;

  const { mutate: leave } = useLeaveFolder({
    onSuccess: () => router.back(),
  });

  const handleLeave = () => {
    Alert.alert(t('folder.leaveTitle'), t('folder.leaveMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('folder.leaveConfirm'), style: 'destructive', onPress: () => leave(folderUuid) },
    ]);
  };

  return (
    <View className="border-b border-border bg-card px-4 pb-4 pt-2">
      {/* Color bar */}
      <View style={{ backgroundColor: folderColor, height: 4, borderRadius: 2, marginBottom: 12 }} />

      <Text variant="headingSmall" semiBold>
        {folder.name}
      </Text>

      {folder.description ? (
        <Text variant="paragraphSmall" className="mt-1 text-muted-foreground">
          {folder.description}
        </Text>
      ) : null}

      <View className="mt-3">
        <FolderMetaBadges folder={folder} />
      </View>

      {/* Action buttons */}
      {memberRole && (
        <View className="mt-3 flex-row items-center gap-3">
          <TouchableOpacity
            className="flex-row items-center gap-1 rounded-lg border border-border px-3 py-1.5"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(explore)/folder/members',
                params: { folderUuid },
              })
            }
          >
            <Ionicons name="people-outline" size={16} color={colors.foreground} />
            <Text variant="paragraphCaption">{t('folder.members')}</Text>
          </TouchableOpacity>

          {memberRole !== 'OWNER' && (
            <TouchableOpacity
              className="flex-row items-center gap-1 rounded-lg border border-border px-3 py-1.5"
              onPress={handleLeave}
            >
              <Ionicons name="exit-outline" size={16} color={colors.foreground} />
              <Text variant="paragraphCaption">{t('folder.leave')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export default function FolderDetailScreen() {
  const { folderUuid } = useLocalSearchParams<{ folderUuid: string }>();
  const { data: folder, isLoading: isFolderLoading } = useFolderDetail(folderUuid);
  const { quotes, isLoading: isQuotesLoading, isRefetching, fetchNextPage } = useFolderQuotes(folderUuid);

  if (isFolderLoading || !folder) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <TagQuoteBottomSheetProvider>
        <AddToFolderBottomSheetProvider>
          <FolderHeader folder={folder} folderUuid={folderUuid} />
          <QuoteList
            quotes={quotes}
            isLoading={isQuotesLoading}
            isRefetching={isRefetching}
            onRefresh={() => {}}
            onEndReached={fetchNextPage}
          />
        </AddToFolderBottomSheetProvider>
      </TagQuoteBottomSheetProvider>
    </View>
  );
}
