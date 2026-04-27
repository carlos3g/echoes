import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import type { Folder } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { $shadowProps } from '@/shared/theme/theme';
import { FolderMetaBadges } from '@/features/folder/components/folder-meta-badges';

interface FolderCardProps {
  data: Folder;
  index?: number;
  testID?: string;
}

export const FolderCard: React.FC<FolderCardProps> = React.memo(({ data, index = 0, testID }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const folderColor = data.color || colors.primary;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(400)
        .springify()}
    >
      <Pressable
        testID={testID ?? `folder-card-${data.uuid}`}
        className="mx-4 my-2 overflow-hidden rounded-2xl border border-border bg-card"
        style={$shadowProps}
        onPress={() =>
          router.push({
            pathname: '/(app)/(tabs)/(explore)/folder/[folderUuid]',
            params: { folderUuid: data.uuid },
          })
        }
      >
        <View style={{ backgroundColor: folderColor, height: 4 }} />

        {data.metadata?.isSaved ? (
          <View className="absolute right-3 top-3">
            <Text variant="paragraphCaptionSmall" className="text-secondary">
              {t('folder.saved')}
            </Text>
          </View>
        ) : null}

        <View className="p-4">
          <Text variant="paragraphMedium" semiBold numberOfLines={1}>
            {data.name}
          </Text>

          {data.description ? (
            <Text variant="paragraphSmall" className="mt-1 text-muted-foreground" numberOfLines={2}>
              {data.description}
            </Text>
          ) : null}

          <View className="mt-3">
            <FolderMetaBadges folder={data} />
          </View>

          {data.owner ? (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: '/(app)/(tabs)/(explore)/user/[username]',
                  params: { username: data.owner!.username },
                });
              }}
              hitSlop={8}
            >
              <Text variant="paragraphCaptionSmall" className="mt-2 text-secondary">
                @{data.owner.username}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
});
