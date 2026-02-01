import { View, Text } from "react-native";
import { Video } from "expo-av";

export default function RecordDetailScreen({ route }) {
  const { record } = route.params;

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      
      <Text className="text-xl font-bold mb-4">
        Recording Details
      </Text>

      {/* Video */}
      <Video
        source={{ uri: record.videoUri || "" }}
        useNativeControls
        resizeMode="contain"
        className="w-full h-64 rounded-xl bg-black"
      />

      {/* Info */}
      <View className="mt-4 space-y-2">
        <Text>📅 Date: {record.date}</Text>
        <Text>⏱ Duration: {record.duration}</Text>
        <Text>📍 Start Location: Available</Text>
        <Text>📍 End Location: Available</Text>
        <Text className="text-blue-600">
          ☁️ Status: {record.status}
        </Text>
      </View>

    </View>
  );
}
