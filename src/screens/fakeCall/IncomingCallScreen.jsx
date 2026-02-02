import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFakeCall, CALL_STATE } from "../../context/fakeCall.context";
import { playRingtone, stopRingtone } from "../../services/fakeCall.service";

export default function IncomingCallScreen() {
  const { callConfig, setCallState } = useFakeCall();

  useEffect(() => {
    playRingtone();
    return () => stopRingtone();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{callConfig?.callerName}</Text>
      <Text style={styles.number}>{callConfig?.callerNumber}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.reject]}
          onPress={() => {
            stopRingtone();
            setCallState(CALL_STATE.IDLE);
          }}
        >
          <Text style={styles.text}>Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.accept]}
          onPress={() => {
            stopRingtone();
            setCallState(CALL_STATE.ONGOING);
          }}
        >
          <Text style={styles.text}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "white", fontSize: 32, fontWeight: "bold" },
  number: { color: "gray", fontSize: 18, marginTop: 8 },
  actions: {
    flexDirection: "row",
    marginTop: 60,
    gap: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  reject: { backgroundColor: "red" },
  accept: { backgroundColor: "green" },
  text: { color: "white", fontWeight: "bold" },
});
