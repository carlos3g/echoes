import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { SettingsStackNavigationProp, SettingsStackScreenProps } from '@/navigation/settings.navigator.types';
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

interface SettingsScreenProps extends SettingsStackScreenProps<'SettingsScreen'> {}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { handleSignOut, user } = useAuth();

  const { navigate } = useNavigation<SettingsStackNavigationProp<'SettingsScreen'>>();

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex flex-col items-center border-[#D6D6D6] px-4 py-6"
        style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
      >
        <Image
          source={{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          <Text>Editar perfil</Text>
          <Ionicons name="chevron-forward" size={24} className="text-[#D1D5DB]" />
        </TouchableOpacity>

        <TouchableOpacity
          testID="go-to-change-password-button"
          className="flex-row items-center justify-between py-4"
          onPress={() => navigate('ChangePasswordScreen')}
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
