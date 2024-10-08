// See: https://reactnavigation.org/docs/typescript

import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParams = {
  SignInScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
};

// Helpers
export type AuthStackScreenProps<T extends keyof AuthStackParams> = NativeStackScreenProps<AuthStackParams, T>;
export type AuthStackNavigationProp<T extends keyof AuthStackParams> = NativeStackNavigationProp<AuthStackParams, T>;
