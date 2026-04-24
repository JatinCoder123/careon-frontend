import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useFakeCall, CALL_STATE } from "../../context/fakeCall.context";
import { dismissFakeCallNotification, playRingtone, stopRingtone } from "../../services/fakeCall.service";

export default function IncomingCallScreen() {
  const { fakeCallContact, setCallState } = useFakeCall();

  useEffect(() => {
    playRingtone();
    return () => stopRingtone();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top */}
      <Text style={styles.incomingText}>Incoming call</Text>

      {/* Caller Info */}
      <Text style={styles.name}>{fakeCallContact?.name}</Text>
      <Text style={styles.number}>{fakeCallContact?.number}</Text>

      {/* Avatar */}
      <Image source={{ uri: fakeCallContact?.profilePic }} style={styles.avatar} />
      {/* Buttons */}
      <View style={styles.actions}>
        {/* Accept */}
        <TouchableOpacity
          style={[styles.circleBtn, styles.accept]}
          onPress={() => {
            dismissFakeCallNotification();
            stopRingtone();
            setCallState(CALL_STATE.ONGOING);
          }}
        >
          <Ionicons name="call" size={32} color="white" />
        </TouchableOpacity>

        {/* Decline */}
        <TouchableOpacity
          style={[styles.circleBtn, styles.decline]}
          onPress={() => {
            dismissFakeCallNotification();
            stopRingtone();
            setCallState(CALL_STATE.IDLE);
          }}
        >
          <Ionicons name="call" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#1e1e1e",
  },

  incomingText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 10,
  },

  name: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },

  number: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 6,
  },

  avatar: {
    marginTop: 50,

    width: 130,
    height: 130,
    borderRadius: 65,
  },

  actions: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
  },

  circleBtn: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    justifyContent: "center",
    alignItems: "center",
  },

  accept: {
    backgroundColor: "#2ecc71",
  },

  decline: {
    backgroundColor: "#e74c3c",
    transform: [{ rotate: "135deg" }],
  },
});
