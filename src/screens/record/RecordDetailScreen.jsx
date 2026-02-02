import { View, Text, StyleSheet } from "react-native";
import { Video } from "expo-av";

export default function RecordDetailScreen({ route }) {
  const { record } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Recording Details
      </Text>

      {/* Video */}
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: record.videoUri || "" }}
          useNativeControls
          resizeMode="contain"
          style={styles.video}
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          📅 Date: {record.date}
        </Text>

        <Text style={styles.infoText}>
          ⏱ Duration: {record.duration}
        </Text>

        <Text style={styles.infoText}>
          📍 Start Location: Available
        </Text>

        <Text style={styles.infoText}>
          📍 End Location: Available
        </Text>

        <Text style={styles.status}>
          ☁️ Status: {record.status}
        </Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },

  videoContainer: {
    width: "100%",
    height: 260,
    backgroundColor: "#000000",
    borderRadius: 16,
    overflow: "hidden",
  },

  video: {
    width: "100%",
    height: "100%",
  },

  infoContainer: {
    marginTop: 16,
  },

  infoText: {
    fontSize: 14,
    color: "#374151", // gray-700
    marginBottom: 6,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB", // blue-600
    marginTop: 8,
  },
});
