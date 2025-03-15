// See: https://reactnavigation.org/docs/typescript

import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import type { QuoteStackParam } from '@/navigation/quotes.navigator.types';
import type { SettingsStackParams } from '@/navigation/settings.navigator.types';

export type AppTabParams = {
  QuotesNavigator: NavigatorScreenParams<QuoteStackParam>;
  ManageTagsScreen: undefined;
  SettingsNavigator: NavigatorScreenParams<SettingsStackParams>;
};

// Helpers
export type AppTabScreenProps<T extends keyof AppTabParams> = BottomTabScreenProps<AppTabParams, T>;
export type AppTabNavigationProp<T extends keyof AppTabParams> = BottomTabNavigationProp<AppTabParams, T>;
export type AppTabRouteProp<T extends keyof AppTabParams> = RouteProp<AppTabParams, T>;
