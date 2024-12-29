import type { AppTabParams } from '@/navigation/app.navigator.types';
import { HomeScreen } from '@/screens/app/home';
import { SettingsScreen } from '@/screens/app/settings';
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type IoniconsGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json';
import { colors } from '@/shared/theme/colors';

const { Navigator, Screen } = createBottomTabNavigator<AppTabParams>();

type ScreenOptions = (props: { route: RouteProp<AppTabParams> }) => BottomTabNavigationOptions;

interface TabBarItemOptions extends BottomTabNavigationOptions {
  onFocusIcon: keyof typeof IoniconsGlyphMap;
  onBlurIcon: keyof typeof IoniconsGlyphMap;
}

const options: { [key in keyof AppTabParams]: TabBarItemOptions } = {
  HomeScreen: {
    onFocusIcon: 'home',
    onBlurIcon: 'home-outline',
    title: 'Echoes',
  },
  SettingsScreen: {
    onBlurIcon: 'settings-outline',
    onFocusIcon: 'settings',
    title: 'Configurações',
  },
};

const screenOptions: ScreenOptions = ({ route }) => ({
  ...options[route.name],
  tabBarShowLabel: false,
  tabBarIndicatorStyle: { backgroundColor: colors.lightTheme.background },
  tabBarActiveTintColor: colors.lightTheme.primary,
  tabBarInactiveTintColor: colors.lightTheme.gray4,
  headerTitleStyle: {
    color: colors.lightTheme.backgroundContrast,
  },
  tabBarHideOnKeyboard: true,
  tabBarIcon: ({ color, focused, size }) => {
    const { onFocusIcon, onBlurIcon } = options[route.name];
    const name = focused ? onFocusIcon : onBlurIcon;

    return <Ionicons name={name} color={color} size={size} />;
  },
});

export const AppNavigator: React.FC = () => (
  <Navigator screenOptions={screenOptions}>
    <Screen component={HomeScreen} name="HomeScreen" />
    <Screen component={SettingsScreen} name="SettingsScreen" />
  </Navigator>
);
