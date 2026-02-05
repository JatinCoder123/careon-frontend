import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

let sound;
let timer;
let activeFakeCallNotificationId = null;
export async function showFakeCallNotification(callConfig) {
  const notification = await Notifications.scheduleNotificationAsync({
    content: {
      title: callConfig.name,
      body: "Incoming call",
      categoryIdentifier: "FAKE_CALL",
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: "default",
      vibrate: [0, 500, 500, 500],
      data: {
        type: "FAKE_CALL",
      },
    },
    trigger: {
      channelId: "default",
      seconds: 1,
    }, // show immediately
  });
  activeFakeCallNotificationId = notification;
  return notification;
}
export async function dismissFakeCallNotification() {
  if (activeFakeCallNotificationId) {
    await Notifications.dismissNotificationAsync(
      activeFakeCallNotificationId
    );
    activeFakeCallNotificationId = null;
  }
}
export async function playRingtone() {
  sound = new Audio.Sound();
  await sound.loadAsync(require("../../assets/notification.wav"));
  await sound.setIsLoopingAsync(true);
  await sound.playAsync();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function stopRingtone() {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
  }
}

export function scheduleFakeCall(delay, callback) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(callback, delay * 1000);
}
