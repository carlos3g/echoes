import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type React from 'react';
import { QuoteScreen } from '@/screens/app/quote';
import type { QuoteStackParam } from './quotes.navigator.types';
import { ManageQuotesScreen } from '@/screens/app/manage-quotes';

const { Screen, Navigator } = createNativeStackNavigator<QuoteStackParam>();

const screenOptions: NativeStackNavigationOptions = {};

const options: { [key in keyof QuoteStackParam]: NativeStackNavigationOptions } = {
  ManageQuotesScreen: {
    title: 'Gerenciar citações',
  },
  QuoteScreen: {
    title: 'Citação',
  },
};

export const QuotesNavigator: React.FC = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen name="ManageQuotesScreen" component={ManageQuotesScreen} options={options.ManageQuotesScreen} />
    <Screen name="QuoteScreen" component={QuoteScreen} options={options.QuoteScreen} />
  </Navigator>
);
