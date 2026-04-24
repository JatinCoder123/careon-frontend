import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SoSScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="construct-outline" size={68} color="#ff4d4d" />

      <Text style={styles.title}>SOS Feature</Text>
      <Text style={styles.subtitle}>Coming Soon</Text>

      <Text style={styles.description}>
        We’re building a powerful safety feature for you.
        Stay tuned — help will always be just one tap away.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06121f", // deep dark
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff4d4d", // alert red
    marginTop: 6,
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    color: "#9CA3AF", // soft gray
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
});
