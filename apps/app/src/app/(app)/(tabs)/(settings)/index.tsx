import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { Image, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useTheme } from '@/lib/nativewind/theme.context';
import { Text } from '@/shared/components/ui/text';
import { userAvatarUrl } from '@/shared/utils';

const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

export default function SettingsScreen() {
  const { handleSignOut, user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="border-border flex flex-col items-center px-4 py-6"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
      >
        <Image
          testID="user-avatar"
          source={{
            uri: userAvatarUrl(user!),
          }}
          className="border-border mb-3 h-40 w-40 rounded-full"
          style={{ borderWidth: StyleSheet.hairlineWidth }}
        />
        <Text testID="user-name" variant="headingSmall">
          {user?.name}
        </Text>
        <Text testID="user-username" variant="paragraphLarge" className="text-muted-foreground">
          @{user?.username}
        </Text>
      </View>

      <View className="space-y-2 px-4 py-4">
        <View testID="theme-switcher" className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={20} className="text-foreground" />
            <Text>Tema escuro</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <TouchableOpacity testID="edit-profile-button" className="flex-row items-center justify-between py-4">
          <Text className="text-muted-foreground">Editar perfil</Text>
          <Ionicons name="chevron-forward" size={24} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="go-to-change-password-button"
          className="flex-row items-center justify-between py-4"
          onPress={() => router.push('/(app)/(tabs)/(settings)/change-password')}
        >
          <Text>Alterar senha</Text>
          <Ionicons name="chevron-forward" size={24} className="text-muted-foreground" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="logout-button"
          className="flex-row items-center justify-between py-4"
          onPress={handleSignOut}
        >
          <Text className="text-destructive">Sair</Text>
          <Ionicons name="chevron-forward" size={24} className="text-destructive" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
