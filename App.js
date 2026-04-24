import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { configureGoogleSignIn } from "./src/services/googleAuth.service";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/store/store";

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return (
    <Provider store={store}>  
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
    </Provider>
  );
}
