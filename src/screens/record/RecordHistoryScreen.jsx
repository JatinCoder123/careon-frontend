import { View, Text, FlatList, TouchableOpacity } from "react-native";

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
    <View className="flex-1 bg-white px-4 pt-4">
      
      <Text className="text-xl font-bold mb-4">
        Record History
      </Text>

      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border border-gray-200 rounded-xl p-4 mb-3"
            onPress={() =>
              navigation.navigate("RecordDetail", { record: item })
            }
          >
            <Text className="font-semibold">
              {item.date} • {item.time}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Duration: {item.duration}
            </Text>
            <Text className="text-xs mt-1 text-blue-600">
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}
