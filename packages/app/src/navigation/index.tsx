import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AppNavigator } from '@/navigation/app.navigator';
import { AuthNavigator } from '@/navigation/auth.navigator';

const RootNavigator: React.FC = () => {
  const { isAuth } = useAuth();

  return <NavigationContainer>{isAuth ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
};

export { RootNavigator };
