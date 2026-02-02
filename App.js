import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { configureGoogleSignIn } from "./src/services/googleAuth.service";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { FakeCallProvider } from "./src/context/fakeCall.context";
import * as Notifications from 'expo-notifications';


export default function App() {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    configureGoogleSignIn();
  }, []);
  return (
    <Provider store={store}>
      <FakeCallProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </FakeCallProvider>
    </Provider>
  );
}
