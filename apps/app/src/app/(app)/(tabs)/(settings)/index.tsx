import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { UserProfileHeader, SettingsMenuItem, ThemeToggle } from '@/shared/components/settings';

export default function SettingsScreen() {
  const { handleSignOut, user } = useAuth();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <UserProfileHeader user={user!} />

      <View className="space-y-2 px-4 py-4">
        <ThemeToggle />

        <SettingsMenuItem testID="edit-profile-button" label="Editar perfil" variant="muted" />

        <SettingsMenuItem
          testID="go-to-change-password-button"
          label="Alterar senha"
          onPress={() => router.push('/(app)/(tabs)/(settings)/change-password')}
        />

        <SettingsMenuItem testID="logout-button" label="Sair" variant="destructive" onPress={handleSignOut} />
      </View>
    </View>
  );
}
