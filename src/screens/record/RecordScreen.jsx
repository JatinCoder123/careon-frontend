import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecordingHomeScreen from "./RecordHomeScreen";
import RecordHistoryScreen from "./RecordHistoryScreen";
import RecordDetailScreen from "./RecordDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tabs with custom header */}
      <Stack.Screen
        name="Home"
        component={RecordingHomeScreen}
      />
      <Stack.Screen
        name="RecordHistory"
        component={RecordHistoryScreen}
      />
      <Stack.Screen
        name="Details"
        component={RecordDetailScreen}
      />
    </Stack.Navigator>
  );
}


