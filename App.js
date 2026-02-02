import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import { configureGoogleSignIn } from "./src/services/googleAuth.service";
import { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { CALL_STATE, FakeCallProvider } from "./src/context/fakeCall.context";
import * as Notifications from "expo-notifications";
import { setupFakeCallNotifications } from "./notification.config";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function App() {
  useEffect(() => {
    setupFakeCallNotifications();
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
