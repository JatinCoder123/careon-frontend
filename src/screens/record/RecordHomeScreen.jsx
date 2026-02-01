import { View, Text, TouchableOpacity } from "react-native";

export default function RecordingHomeScreen({ navigation }) {
  return (
    <View className="flex-1 bg-white px-5 justify-center">
      
      <Text className="text-2xl font-bold text-center mb-10">
        Evidence Recording
      </Text>

      {/* Start Recording */}
      <TouchableOpacity
        className="bg-red-600 py-4 rounded-xl mb-4"
        onPress={() => navigation.navigate("StartRecording")}
      >
        <Text className="text-white text-center text-lg font-semibold">
          ⏺ Start Recording
        </Text>
      </TouchableOpacity>

      {/* Record History */}
      <TouchableOpacity
        className="border border-gray-300 py-4 rounded-xl mb-8"
        onPress={() => navigation.navigate("RecordHistory")}
      >
        <Text className="text-center text-lg font-medium">
          📂 Record History
        </Text>
      </TouchableOpacity>

      {/* Tip */}
      <View className="bg-gray-100 p-4 rounded-xl">
        <Text className="text-sm text-gray-700">
          💡 Tip: You can also start recording using phone sensors like shake or emergency gestures.
        </Text>
      </View>

    </View>
  );
}
