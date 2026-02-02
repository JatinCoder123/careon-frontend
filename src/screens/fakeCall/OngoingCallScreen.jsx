import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFakeCall, CALL_STATE } from "../../context/fakeCall.context";

export default function OngoingCallScreen() {
  const { callConfig, setCallState, callDuration, setCallDuration } =
    useFakeCall();

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{callConfig?.callerName}</Text>
      <Text style={styles.timer}>
        {Math.floor(callDuration / 60)}:
        {(callDuration % 60).toString().padStart(2, "0")}
      </Text>

      <TouchableOpacity
        style={styles.end}
        onPress={() => setCallState(CALL_STATE.IDLE)}
      >
        <Text style={{ color: "white" }}>End Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "white", fontSize: 28 },
  timer: { color: "gray", marginTop: 10 },
  end: {
    marginTop: 60,
    backgroundColor: "red",
    padding: 20,
    borderRadius: 40,
  },
});
