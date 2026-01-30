import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
/* Screens */
import HomeScreen from "../screens/home/HomeScreen";
import SoSScreen from "../screens/sos/SoSScreen";
import RecordScreen from "../screens/record/RecordScreen";
import FakeCallScreen from "../screens/fakeCall/FakeCallScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import RoutesScreen from "../screens/routes/RoutesScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => {
          let icon;

          switch (route.name) {
            case "Home":
              icon = (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );
              break;

            case "SOS":
              icon = <AntDesign name="alert" size={size} color={color} />;
              break;

            case "Record":
              icon = (
                <Ionicons
                  name={focused ? "mic" : "mic-outline"}
                  size={size}
                  color={color}
                />
              );
              break;

            case "FakeCall":
              icon = (
                <Ionicons
                  name={focused ? "call" : "call-outline"}
                  size={size}
                  color={color}
                />
              );
              break;

            case "Routes":
              icon = (
                <Ionicons
                  name={focused ? "map" : "map-outline"}
                  size={size}
                  color={color}
                />
              );
              break;

            default:
              icon = null;
          }

          return icon;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />

      <Tab.Screen name="SOS" component={SoSScreen} />
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="FakeCall" component={FakeCallScreen} />
    </Tab.Navigator>
  );
}

/* 🎨 Colors */
const COLORS = {
  primary: "#F44336",
  background: "#0B1220",
  card: "#111827",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  border: "#1F2937",
};

/* 💅 Styles */
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopColor: COLORS.border,
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});
