import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { Host } from 'react-native-portalize';
import * as Sentry from '@sentry/react-native';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { AppNavigator } from '@/navigation/app.navigator';
import { AuthNavigator } from '@/navigation/auth.navigator';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const RootNavigator: React.FC = () => {
  const { isAuth } = useAuth();

  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        navigationIntegration.registerNavigationContainer(navigationRef);
      }}
    >
      <Host>{isAuth ? <AppNavigator /> : <AuthNavigator />}</Host>
    </NavigationContainer>
  );
};
