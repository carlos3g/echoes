import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { Tag } from '@/types/entities';
import type { AppTabParams } from '@/navigation/app.navigator.types';

export type QuoteStackParam = {
  ManageQuotesScreen: {
    tag?: Tag;
  };
  QuoteScreen: {
    quoteUuid: string;
  };
};

export type QuoteStackScreenProps<T extends keyof QuoteStackParam> = CompositeScreenProps<
  NativeStackScreenProps<QuoteStackParam, T>,
  BottomTabScreenProps<AppTabParams>
>;

export type QuoteStackNavigationProp<T extends keyof QuoteStackParam> = QuoteStackScreenProps<T>['navigation'];

export type QuoteStackRouteProp<T extends keyof QuoteStackParam> = QuoteStackScreenProps<T>['route'];
