// See: https://reactnavigation.org/docs/typescript

import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AppTabParams = {
  HomeScreen: undefined;
  SettingsNavigator: undefined;
};

// Helpers
export type AppTabScreenProps<T extends keyof AppTabParams> = BottomTabScreenProps<AppTabParams, T>;
export type AppTabNavigationProp<T extends keyof AppTabParams> = BottomTabNavigationProp<AppTabParams, T>;
