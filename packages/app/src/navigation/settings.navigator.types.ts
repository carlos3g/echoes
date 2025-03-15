// See: https://reactnavigation.org/docs/typescript

import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppTabParams } from '@/navigation/app.navigator.types';

export type SettingsStackParams = {
  SettingsScreen: undefined;
  ChangePasswordScreen: undefined;
};

// Helpers
export type SettingsStackScreenProps<T extends keyof SettingsStackParams> = CompositeScreenProps<
  NativeStackScreenProps<SettingsStackParams, T>,
  BottomTabScreenProps<AppTabParams>
>;
export type SettingsStackNavigationProp<T extends keyof SettingsStackParams> = NativeStackNavigationProp<
  SettingsStackParams,
  T
>;
