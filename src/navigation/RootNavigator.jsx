import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/splash/SplashScreen";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}
