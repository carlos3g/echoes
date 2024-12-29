import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AppNavigator } from '@/navigation/app.navigator';
import { AuthNavigator } from '@/navigation/auth.navigator';

export const RootNavigator: React.FC = () => {
  const { isAuth } = useAuth();

  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return <NavigationContainer ref={navigationRef}>{isAuth ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>;
};
