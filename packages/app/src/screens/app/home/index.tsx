import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/shared/components/ui/button';

export const HomeScreen = () => {
  const { user, handleSignOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(user, null, 2)}</Text>

      <Button title="Sair" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
