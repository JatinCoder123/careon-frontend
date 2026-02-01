import * as Notifications from "expo-notifications";

export function configureFakeCallNotifications() {
  Notifications.setNotificationCategoryAsync("FAKE_CALL", [
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
