import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import type { Folder } from '@/types/entities';

interface FolderMetaBadgesProps {
  folder: Folder;
}

export const FolderMetaBadges: React.FC<FolderMetaBadgesProps> = ({ folder }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-4">
      <View className="flex-row items-center gap-1">
        <Ionicons name="document-text-outline" size={14} color={colors.mutedForeground} />
        <Text variant="paragraphCaption" className="text-muted-foreground">
          {t('folder.quoteCount', { count: folder.metadata.totalQuotes })}
        </Text>
      </View>

      {folder.visibility === 'PUBLIC' && (
        <View className="flex-row items-center gap-1">
          <Ionicons name="people-outline" size={14} color={colors.mutedForeground} />
          <Text variant="paragraphCaption" className="text-muted-foreground">
            {t('folder.followerCount', { count: folder.metadata.totalFollowers })}
          </Text>
        </View>
      )}

      {folder.visibility === 'PRIVATE' && (
        <View className="flex-row items-center gap-1">
          <Ionicons name="lock-closed-outline" size={14} color={colors.mutedForeground} />
          <Text variant="paragraphCaption" className="text-muted-foreground">
            {t('folder.private')}
          </Text>
        </View>
      )}
    </View>
  );
};
