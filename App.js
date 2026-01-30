import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { configureGoogleSignIn } from "./src/services/googleAuth.service";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
