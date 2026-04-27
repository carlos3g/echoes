import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import type { User } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { $shadowProps } from '@/shared/theme/theme';

interface UserCardProps {
  data: User;
  index?: number;
}

export const UserCard: React.FC<UserCardProps> = React.memo(({ data, index = 0 }) => {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(400)
        .springify()}
    >
      <Pressable
        className="mx-4 my-2 flex-row items-center rounded-2xl border border-border bg-card p-4"
        style={$shadowProps}
        onPress={() =>
          router.push({
            pathname: '/(app)/(tabs)/(explore)/user/[username]',
            params: { username: data.username },
          })
        }
      >
        <AvatarInitials name={data.name} size="sm" />
        <View className="ml-3 flex-1">
          <Text variant="paragraphMedium" semiBold numberOfLines={1}>
            {data.name}
          </Text>
          <Text variant="paragraphSmall" className="text-muted-foreground">
            @{data.username}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});
