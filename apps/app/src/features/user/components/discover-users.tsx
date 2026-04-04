import React from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSuggestedUsers } from '@/features/user/hooks/use-suggested-users';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

export const DiscoverUsers: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { users } = useSuggestedUsers();

  const preview = users.slice(0, 8);

  if (preview.length === 0) return null;

  return (
    <View className="py-3">
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Text variant="paragraphSmall" semiBold className="text-foreground">
          {t('user.discoverTitle')}
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/(explore)/user/search')} hitSlop={8}>
            <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(app)/(tabs)/(explore)/user/search')} hitSlop={8}>
            <Text variant="paragraphCaption" className="text-primary">
              {t('user.seeAll')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-3">
        {preview.map((user) => (
          <Pressable
            key={user.uuid}
            className="w-28 items-center overflow-hidden rounded-xl border border-border bg-card p-3"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(explore)/user/[username]',
                params: { username: user.username },
              })
            }
          >
            <AvatarInitials name={user.name} size="sm" />
            <Text variant="paragraphSmall" semiBold numberOfLines={1} className="mt-2 text-center">
              {user.name.split(' ')[0]}
            </Text>
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground" numberOfLines={1}>
              @{user.username}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
