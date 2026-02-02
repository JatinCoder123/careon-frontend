import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
/* Navigators */
import AppTabs from "./AppTabs";

/* Screens */
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useFakeCall, CALL_STATE } from "../context/fakeCall.context";
import OngoingCallScreen from "../screens/fakeCall/OngoingCallScreen";
import IncomingCallScreen from "../screens/fakeCall/IncomingCallScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const { user } = useSelector((state) => state.user);
  const { setCallState, callState } = useFakeCall();
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const action = response.actionIdentifier;

        if (action === "ACCEPT_CALL") {
          setCallState(CALL_STATE.ONGOING);
        }

        if (action === "DECLINE_CALL") {
          setCallState(CALL_STATE.IDLE);
        }
      },
    );

    return () => sub.remove();
  }, []);
  if (callState === CALL_STATE.RINGING) {
    return <IncomingCallScreen />;
  }
  if (callState === CALL_STATE.ONGOING) {
    return <OngoingCallScreen />;
  }
  return (
    <Stack.Navigator>
      {/* Tabs with custom header */}
      <Stack.Screen
        name="Tabs"
        component={AppTabs}
        options={({ navigation }) => ({
          headerTitle: "",
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logo}
              />
              <Text style={styles.appName}>CareOn</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate("Profile")}
            >
              {user?.photo ? (
                <Image
                  source={{ uri: user.photo }}
                  style={styles.profileImage}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color={COLORS.textPrimary}
                />
              )}
            </TouchableOpacity>
          ),
        })}
      />

      {/* Profile Screen */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerShown: false,
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.textPrimary,
        }}
      />
    </Stack.Navigator>
  );
}

/* 🎨 Colors */
const COLORS = {
  primary: "#F44336",
  background: "#0B1220",
  card: "#111827",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
};

/* 💅 Styles */
const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 4,
    borderRadius: 6,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  appName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  profileBtn: {
    marginRight: 12,
  },
});
