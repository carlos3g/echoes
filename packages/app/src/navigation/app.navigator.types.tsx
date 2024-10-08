// See: https://reactnavigation.org/docs/typescript

import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParams = {
  HomeScreen: undefined;
};

// Helpers
export type AppStackScreenProps<T extends keyof AppStackParams> = NativeStackScreenProps<AppStackParams, T>;
export type AppStackNavigationProp<T extends keyof AppStackParams> = NativeStackNavigationProp<AppStackParams, T>;
