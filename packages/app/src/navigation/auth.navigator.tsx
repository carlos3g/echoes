import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/auth.navigator.types';
import { SignInScreen } from '@/screens/auth/sign-in';
import { SignUpScreen } from '@/screens/auth/sign-up';
import { ResetPasswordScreen } from '@/screens/auth/reset-password';
import { ForgotPasswordScreen } from '@/screens/auth/forgot-password';

const { Navigator, Screen } = createNativeStackNavigator<AuthStackParams>();

const screenOptions: NativeStackNavigationOptions = { headerShown: false };

const AuthNavigator: React.FC = () => (
  <Navigator initialRouteName="SignInScreen" screenOptions={screenOptions}>
    <Screen component={SignInScreen} name="SignInScreen" />
    <Screen component={SignUpScreen} name="SignUpScreen" />
    <Screen component={ResetPasswordScreen} name="ResetPasswordScreen" />
    <Screen component={ForgotPasswordScreen} name="ForgotPasswordScreen" />
  </Navigator>
);

export { AuthNavigator };
