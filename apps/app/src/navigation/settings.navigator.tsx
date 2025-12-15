import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import type { SettingsStackParams } from '@/navigation/settings.navigator.types';
import { ChangePasswordScreen } from '@/screens/app/change-password';
import { SettingsScreen } from '@/screens/app/settings';
import { colors } from '@/shared/theme/colors';

const { Navigator, Screen } = createNativeStackNavigator<SettingsStackParams>();

type ScreenOptions = (props: { route: RouteProp<SettingsStackParams> }) => NativeStackNavigationOptions;

const options: { [key in keyof SettingsStackParams]: NativeStackNavigationOptions } = {
  ChangePasswordScreen: {
    title: 'Alterar senha',
  },
  SettingsScreen: {
    title: 'Configurações',
  },
};

const screenOptions: ScreenOptions = ({ route }) => ({
  ...options[route.name],
  headerTitleStyle: {
    color: colors.lightTheme.backgroundContrast,
  },
  contentStyle: {
    borderTopColor: '#C2C2C2',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerShadowVisible: false,
});

export const SettingsNavigator: React.FC = () => (
  <Navigator initialRouteName="SettingsScreen" screenOptions={screenOptions}>
    <Screen component={SettingsScreen} name="SettingsScreen" />
    <Screen component={ChangePasswordScreen} name="ChangePasswordScreen" />
  </Navigator>
);
