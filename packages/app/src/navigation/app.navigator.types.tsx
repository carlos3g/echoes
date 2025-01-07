// See: https://reactnavigation.org/docs/typescript

import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

export type AppTabParams = {
  HomeScreen: {
    tagUuid?: string;
  };
  ManageTagsScreen: undefined;
  SettingsNavigator: undefined;
};

// Helpers
export type AppTabScreenProps<T extends keyof AppTabParams> = BottomTabScreenProps<AppTabParams, T>;
export type AppTabNavigationProp<T extends keyof AppTabParams> = BottomTabNavigationProp<AppTabParams, T>;
export type AppTabRouteProp<T extends keyof AppTabParams> = RouteProp<AppTabParams, T>;
