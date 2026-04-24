import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecordHistoryScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  console.log("RECORD SCREEN");
  useEffect(() => {
    (async () => {
      const record = await AsyncStorage.getItem("record_history");
      const parsed = record ? JSON.parse(record) : [];
      setRecords(parsed);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record History</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("RecordDetail", { record: item })
            }
          >
            <Text style={styles.cardTitle}>{item.startTime}</Text>

            <Text style={styles.duration}>Duration: {item.endTime}</Text>

            <Text
              style={[
                styles.status,
                item.status === "Uploaded" ? styles.uploaded : styles.saved,
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
