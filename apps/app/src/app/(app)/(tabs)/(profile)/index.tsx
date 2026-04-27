import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useUserProfile } from '@/features/user/hooks/use-user-profile';
import { ProfileStats } from '@/features/auth/components/profile-stats';
import { ActivityFeed } from '@/features/auth/components/activity-feed';
import { ThemeToggle } from '@/shared/components/settings/theme-toggle';
import { LanguageSelector } from '@/shared/components/settings/language-selector';
import { SettingsMenuItem } from '@/shared/components/settings/settings-menu-item';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';

export default function ProfileScreen() {
  const { handleSignOut, user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: profile } = useUserProfile(user?.username ?? '');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8">
      {/* Profile header */}
      {user && (
        <View className="items-center border-b border-border py-6">
          <AvatarInitials name={user.name} size="md" />
          <Text variant="headingSmall" bold className="mt-3 text-foreground">
            {user.name}
          </Text>
          <Text variant="paragraphSmall" className="text-secondary">
            @{user.username}
          </Text>

          {profile ? (
            <View className="mt-3 flex-row gap-6">
              <Pressable
                className="items-center"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/(tabs)/(explore)/user/followers',
                    params: { username: user.username },
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
                    params: { username: user.username },
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
          ) : null}
        </View>
      )}

      {/* Stats */}
      <ProfileStats />

      {/* Activity feed */}
      <ActivityFeed />

      {/* Menu */}
      <View className="px-4 pt-2">
        <ThemeToggle />
        <LanguageSelector />

        <SettingsMenuItem
          testID="insights-button"
          label={t('profile.insights')}
          onPress={() => router.push('/(app)/(tabs)/(profile)/insights')}
        />

        <SettingsMenuItem
          testID="activity-button"
          label={t('activity.title')}
          onPress={() => router.push('/(app)/(tabs)/(profile)/activity')}
        />

        <SettingsMenuItem
          testID="reading-preferences-button"
          label={t('profile.readingPreferences')}
          onPress={() => router.push('/(app)/(tabs)/(profile)/reading-preferences')}
        />

        <SettingsMenuItem
          testID="edit-profile-button"
          label={t('profile.editProfile')}
          onPress={() => router.push('/(app)/(tabs)/(profile)/edit-profile')}
        />

        <SettingsMenuItem
          testID="go-to-change-password-button"
          label={t('profile.changePassword')}
          onPress={() => router.push('/(app)/(tabs)/(profile)/change-password')}
        />

        <SettingsMenuItem
          testID="logout-button"
          label={t('profile.signOut')}
          variant="destructive"
          onPress={handleSignOut}
        />
      </View>
    </ScrollView>
  );
}
