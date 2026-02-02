import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const dummyData = [
  {
    id: "1",
    date: "01 Feb 2026",
    time: "10:12 AM",
    duration: "2m 12s",
    status: "Saved",
  },
  {
    id: "2",
    date: "30 Jan 2026",
    time: "9:45 PM",
    duration: "1m 05s",
    status: "Uploaded",
  },
];

export default function RecordHistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Record History
      </Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("RecordDetail", { record: item })
            }
          >
            <Text style={styles.cardTitle}>
              {item.date} • {item.time}
            </Text>

            <Text style={styles.duration}>
              Duration: {item.duration}
            </Text>

            <Text
              style={[
                styles.status,
                item.status === "Uploaded"
                  ? styles.uploaded
                  : styles.saved,
              ]}
            >
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />

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

  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB", // gray-200
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  duration: {
    fontSize: 14,
    color: "#4B5563", // gray-600
    marginTop: 4,
  },

  status: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },

  uploaded: {
    color: "#2563EB", // blue-600
  },

  saved: {
    color: "#16A34A", // green-600
  },
});
