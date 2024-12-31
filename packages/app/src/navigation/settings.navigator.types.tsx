// See: https://reactnavigation.org/docs/typescript

import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type SettingsStackParams = {
  SettingsScreen: undefined;
  ChangePasswordScreen: undefined;
};

// Helpers
export type SettingsStackScreenProps<T extends keyof SettingsStackParams> = NativeStackScreenProps<
  SettingsStackParams,
  T
>;
export type SettingsStackNavigationProp<T extends keyof SettingsStackParams> = NativeStackNavigationProp<
  SettingsStackParams,
  T
>;
