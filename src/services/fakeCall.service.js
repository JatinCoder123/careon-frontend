import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

let sound;
let timer;

export async function showFakeCallNotification(callConfig) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: callConfig.callerName,
      body: "Incoming call",
      categoryIdentifier: "FAKE_CALL",
      priority: Notifications.AndroidNotificationPriority.MAX,
      sound: "default",
      vibrate: [0, 500, 500, 500],
      data: {
        type: "FAKE_CALL",
      },
    },
    trigger: null, // show immediately
  });
}

export async function playRingtone() {
  sound = new Audio.Sound();
  // await sound.loadAsync(require("../assets/ringtone.mp3"));
  await sound.setIsLoopingAsync(true);
  await sound.playAsync();
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.ERROR);
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
