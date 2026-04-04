import { FlatList, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/features/user/hooks/use-user-profile';
import { useUserPublicFolders } from '@/features/folder/hooks/use-user-public-folders';
import { FollowButton } from '@/features/user/components/follow-button';
import { FolderCard } from '@/features/folder/components/folder-card';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { Text } from '@/shared/components/ui/text';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const { data: profile, isLoading: isProfileLoading } = useUserProfile(username);
  const { folders, isLoading: isFoldersLoading, isRefetching, refetch, fetchNextPage } = useUserPublicFolders(username);

  const isOwnProfile = currentUser?.username === username;

  if (isProfileLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!profile) return null;

  const header = (
    <>
      <View className="items-center border-b border-border py-6">
        <AvatarInitials name={profile.name} size="md" />

        <Text variant="headingSmall" bold className="mt-3 text-foreground">
          {profile.name}
        </Text>

        <Text variant="paragraphSmall" className="text-secondary">
          @{profile.username}
        </Text>

        {profile.bio ? (
          <Text variant="paragraphSmall" className="mt-2 px-8 text-center text-muted-foreground">
            {profile.bio}
          </Text>
        ) : null}

        <View className="mt-4 flex-row gap-6">
          <Pressable
            className="items-center"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(explore)/user/followers',
                params: { username },
              })
            }
          >
            <Text variant="paragraphMedium" bold>
              {profile.followersCount}
            </Text>
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
              {t('user.followers')}
            </Text>
          </Pressable>

          <Pressable
            className="items-center"
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/(explore)/user/following',
                params: { username },
              })
            }
          >
            <Text variant="paragraphMedium" bold>
              {profile.followingCount}
            </Text>
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
              {t('user.following')}
            </Text>
          </Pressable>
        </View>

        {!isOwnProfile && profile.isFollowedByUser !== undefined ? (
          <View className="mt-4">
            <FollowButton username={username} isFollowing={profile.isFollowedByUser} />
          </View>
        ) : null}
      </View>

      <Text variant="paragraphMedium" semiBold className="px-4 pb-2 pt-4">
        {t('user.publicFolders')}
      </Text>
    </>
  );

  if (isFoldersLoading) {
    return (
      <View className="flex-1 bg-background">
        {header}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      data={folders}
      keyExtractor={(item) => item.uuid}
      renderItem={({ item, index }) => <FolderCard data={item} index={index} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState title={t('folder.emptyTitle')} />}
      contentContainerClassName="pb-8"
      refreshing={isRefetching}
      onRefresh={refetch}
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.5}
    />
  );
}
