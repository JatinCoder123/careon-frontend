import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function setupFakeCallNotifications() {
  // 🔹 Android channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("fake-call", {
      name: "Fake Call",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 500, 500],
      sound: "default",
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  // 🔹 Notification buttons
  await Notifications.setNotificationCategoryAsync("FAKE_CALL", [
    {
      identifier: "ACCEPT_CALL",
      buttonTitle: "Accept",
      options: { opensAppToForeground: true },
    },
    {
      identifier: "DECLINE_CALL",
      buttonTitle: "Decline",
      options: { opensAppToForeground: false },
    },
  ]);
}
