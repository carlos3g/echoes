import { AppStackParams } from "@/navigation/app.navigator.types";
import { HomeScreen } from "@/screens/home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator<AppStackParams>();

const AppNavigator: React.FC = () => (
  <Navigator>
    <Screen component={HomeScreen} name="HomeScreen" />
  </Navigator>
);

export { AppNavigator };
