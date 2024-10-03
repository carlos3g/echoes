import { AppNavigator } from "@/navigation/app.navigator";
import { NavigationContainer } from "@react-navigation/native";

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export { RootNavigator };
