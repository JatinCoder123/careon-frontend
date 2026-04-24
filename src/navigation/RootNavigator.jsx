import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/splash/SplashScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import AppStack from "./AppStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={LoginScreen} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
