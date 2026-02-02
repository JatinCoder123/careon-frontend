import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useFakeCall, CALL_STATE } from "../../context/fakeCall.context";

export default function OngoingCallScreen() {
  const {
    callConfig,
    setCallState,
    callDuration,
    setCallDuration,
  } = useFakeCall();

  /* Call timer */
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(callDuration / 60);
  const seconds = (callDuration % 60).toString().padStart(2, "0");

  return (
    <View
      style={styles.container}
    >
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: callConfig?.profilePic }}
          style={styles.avatar}
        />
      </View>

      {/* Name & Time */}
      <Text style={styles.name}>{callConfig?.callerName}</Text>
      <Text style={styles.timer}>
        {minutes}:{seconds}
      </Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Control icon="videocam" label="Video" />
        <Control icon="chatbubble" label="Message" />
        <Control icon="volume-high" label="Speaker" />
        <Control icon="person-add" label="Add" />
        <Control icon="mic-off" label="Mute" />
        <Control icon="ellipsis-horizontal" label="More" />
      </View>

      {/* End Call */}
      <TouchableOpacity
        style={styles.endCall}
        onPress={() => setCallState(CALL_STATE.IDLE)}
      >
        <Ionicons name="call" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

/* Reusable control button */
function Control({ icon, label }) {
  return (
    <View style={styles.controlItem}>
      <TouchableOpacity style={styles.controlBtn}>
        <Ionicons name={icon} size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.controlText}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#12193c",
  },

  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  name: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },

  timer: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
    fontSize: 14,
  },

  controls: {
    marginTop: 200,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 30,
    rowGap: 30,
  },

  controlItem: {
    alignItems: "center",
    width: "30%",
  },

  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  controlText: {
    color: "white",
    marginTop: 8,
    fontSize: 12,
  },

  endCall: {
    position: "absolute",
    bottom: 60,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
});
