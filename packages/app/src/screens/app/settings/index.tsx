import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { SettingsStackScreenProps } from '@/navigation/settings.navigator.types';
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

export const SettingsScreen: React.FC<SettingsStackScreenProps<'SettingsScreen'>> = () => {
  const { handleSignOut, user } = useAuth();

  const { navigate } = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex flex-col items-center border-[#D6D6D6] px-4 py-6"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
      >
        <Image
          source={{
            uri: userAvatarUrl(user!),
          }}
          className="mb-3 h-20 w-20 rounded-full"
        />
        <Text variant="headingSmall" className="text-gray-900">
          {user?.name}
        </Text>
        <Text variant="paragraphLarge" className="text-gray-600">
          @{user?.username}
        </Text>
      </View>

      <View className="space-y-2 px-4 py-4">
        <TouchableOpacity className="flex-row items-center justify-between py-4">
          <Text className="text-[#D1D5DB]">Editar perfil</Text>
          <Ionicons name="chevron-forward" size={24} className="text-[#D1D5DB]" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="go-to-change-password-button"
          className="flex-row items-center justify-between py-4"
          onPress={() => navigate('SettingsNavigator', { screen: 'ChangePasswordScreen' })}
        >
          <Text>Alterar senha</Text>
          <Ionicons name="chevron-forward" size={24} className="text-[#D1D5DB]" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4" onPress={handleSignOut}>
          <Text className="text-red-600">Sair</Text>
          <Ionicons name="chevron-forward" size={24} className="text-red-600" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
