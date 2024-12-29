import { Text, View } from 'react-native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';
import type { AppTabScreenProps } from '@/navigation/app.navigator.types';

interface SettingsScreenProps extends AppTabScreenProps<'SettingsScreen'> {}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { handleSignOut } = useAuth();

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <Text>Settings Screen</Text>

      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
};
