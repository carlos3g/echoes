import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
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

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex flex-col items-center border-[#D6D6D6] px-4 py-6"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
      >
        <Image
          testID="user-avatar"
          source={{
            uri: userAvatarUrl(user!),
          }}
          className="mb-3 h-40 w-40 rounded-full border-[#D6D6D6]"
          style={{ borderWidth: StyleSheet.hairlineWidth }}
        />
        <Text testID="user-name" variant="headingSmall" className="text-gray-900">
          {user?.name}
        </Text>
        <Text testID="user-username" variant="paragraphLarge" className="text-gray-600">
          @{user?.username}
        </Text>
      </View>

      <View className="space-y-2 px-4 py-4">
        <TouchableOpacity testID="edit-profile-button" className="flex-row items-center justify-between py-4">
          <Text className="text-[#D1D5DB]">Editar perfil</Text>
          <Ionicons name="chevron-forward" size={24} className="text-[#D1D5DB]" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="go-to-change-password-button"
          className="flex-row items-center justify-between py-4"
          onPress={() => router.push('/(app)/(tabs)/(settings)/change-password')}
        >
          <Text>Alterar senha</Text>
          <Ionicons name="chevron-forward" size={24} className="text-[#D1D5DB]" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="logout-button"
          className="flex-row items-center justify-between py-4"
          onPress={handleSignOut}
        >
          <Text className="text-red-600">Sair</Text>
          <Ionicons name="chevron-forward" size={24} className="text-red-600" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
