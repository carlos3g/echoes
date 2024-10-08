import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParams } from '@/navigation/app.navigator.types';
import { HomeScreen } from '@/screens/app/home';

const { Navigator, Screen } = createNativeStackNavigator<AppStackParams>();

const AppNavigator: React.FC = () => (
  <Navigator>
    <Screen component={HomeScreen} name="HomeScreen" />
  </Navigator>
);

export { AppNavigator };
