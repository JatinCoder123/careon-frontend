// components/AlertContactsButton.js

import React, { useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Linking,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
// import * as Battery from "expo-battery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import axios from "axios";
import { USER_API_URL } from "../../../assets/assets";

export default function AlertContactsButton() {
  const timerRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [seconds, setSeconds] = useState(0);

  /* ------------------------------------ */
  /* HOLD START */
  /* ------------------------------------ */
  const startHold = () => {
    setHolding(true);
    setSeconds(0);

    let count = 0;

    const interval = setInterval(() => {
      count++;
      setSeconds(count);
    }, 1000);

    timerRef.current = {
      timeout: setTimeout(() => {
        clearInterval(interval);
        triggerEmergencyAlert();
      }, 3000),
      interval,
    };
  };

  /* ------------------------------------ */
  /* HOLD CANCEL */
  /* ------------------------------------ */
  const stopHold = () => {
    setHolding(false);
    setSeconds(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current.timeout);
      clearInterval(timerRef.current.interval);
    }
  };

  /* ------------------------------------ */
  /* MAIN SOS LOGIC */
  /* ------------------------------------ */
  const triggerEmergencyAlert = async () => {
    try {
      setHolding(false);

      const stored = await AsyncStorage.getItem("emergency_contacts");

      const contacts = stored ? JSON.parse(stored) : [];

      if (!contacts.length) {
        Alert.alert("No Contacts", "Please add emergency contacts first.");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission denied.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;

      const batteryPercent = 40;
      axios
        .post(`${USER_API_URL}/sos/send`, {
          userName: user.name,
          latitude: lat,
          longitude: lng,
          battery: batteryPercent,
          contacts,
        })
        .then(() => {
          console.log("Alert sent");
        })
        .catch((err) => {
          console.log("Alert failed", err);
        });
      Alert.alert("SOS Triggered", "Emergency alerts started.");
    } catch (error) {
      Alert.alert("Failed", "Unable to send emergency alert.");
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, holding && styles.holdingBtn]}
        activeOpacity={0.85}
        onPressIn={startHold}
        onPressOut={stopHold}
      >
        <Ionicons name="warning" size={22} color="#fff" />

        <Text style={styles.text}>
          {holding ? `Hold... ${seconds}/3` : "Hold 3 Sec To Alert Contacts"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff2d2d",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },

  holdingBtn: {
    backgroundColor: "#c62828",
  },

  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
