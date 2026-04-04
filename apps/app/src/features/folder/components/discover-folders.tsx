import React from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { usePopularFolders } from '@/features/folder/hooks/use-popular-folders';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

export const DiscoverFolders: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { folders } = usePopularFolders();

  const preview = folders.slice(0, 6);

  return (
    <View className="py-3">
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Text variant="paragraphSmall" semiBold className="text-foreground">
          {t('folder.discoverTitle')}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/(explore)/folder/search')} hitSlop={8}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/(explore)/folder/popular')} hitSlop={8}>
            <Text variant="paragraphCaption" className="text-primary">
              {t('folder.seeAll')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {preview.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-3">
          {preview.map((folder) => {
            const folderColor = folder.color || colors.primary;

            return (
              <Pressable
                key={folder.uuid}
                className="w-40 overflow-hidden rounded-xl border border-border bg-card"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/(tabs)/(explore)/folder/[folderUuid]',
                    params: { folderUuid: folder.uuid },
                  })
                }
              >
                <View style={{ backgroundColor: folderColor, height: 3 }} />
                <View className="p-3">
                  <Text variant="paragraphSmall" semiBold numberOfLines={1}>
                    {folder.name}
                  </Text>
                  <Text variant="paragraphCaptionSmall" className="mt-1 text-muted-foreground">
                    {t('folder.quoteCount', { count: folder.metadata.totalQuotes })}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};
