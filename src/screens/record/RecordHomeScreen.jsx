import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RecordingHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Evidence Recording
      </Text>

      {/* Start Recording */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate("StartRecording")}
      >
        <Text style={styles.startButtonText}>
          ⏺ Start Recording
        </Text>
      </TouchableOpacity>

      {/* Record History */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("RecordHistory")}
      >
        <Text style={styles.historyButtonText}>
          📂 Record History
        </Text>
      </TouchableOpacity>

      {/* Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipText}>
          💡 Tip: You can also start recording using phone sensors like shake or emergency gestures.
        </Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    color: "#111827",
  },

  startButton: {
    backgroundColor: "#DC2626", // red-600
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  startButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  historyButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
  },

  historyButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
  },

  tipCard: {
    backgroundColor: "#F3F4F6", // gray-100
    padding: 16,
    borderRadius: 16,
  },

  tipText: {
    fontSize: 14,
    color: "#374151", // gray-700
  },
});
