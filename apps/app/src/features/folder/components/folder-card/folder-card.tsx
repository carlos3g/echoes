import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
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
        </View>
      </Pressable>
    </Animated.View>
  );
});
