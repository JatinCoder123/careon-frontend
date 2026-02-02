import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";

import { useFakeCall, CALL_STATE } from "../../context/fakeCall.context";
import { showFakeCallNotification,scheduleFakeCall } from "../../services/fakeCall.service";

const RANDOM_AVATAR =
  "https://i.pravatar.cc/300?img=" + Math.floor(Math.random() * 70);

export default function FakeCallSetupScreen() {
  const { setCallConfig, setCallState } = useFakeCall();

  const [callerName, setCallerName] = useState("Mom ❤️");
  const [callerNumber, setCallerNumber] = useState("+91 XXXXXXXX");
  const [delay, setDelay] = useState(10);
  const [profilePic, setProfilePic] = useState(RANDOM_AVATAR);

  /* ---------------- PICK IMAGE ---------------- */
  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  }

  /* ---------------- PICK CONTACT ---------------- */
  async function pickContact() {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Contacts access is needed");
      return;
    }

    const contact = await Contacts.presentFormAsync(null, {
      fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
    });

    if (contact?.name) {
      setCallerName(contact.name);
      if (contact.phoneNumbers?.length) {
        setCallerNumber(contact.phoneNumbers[0].number);
      }
    }
  }

  /* ---------------- SCHEDULE CALL ---------------- */
  function handleSchedule() {
    setCallConfig({
      callerName,
      callerNumber,
      profilePic,
    });

    scheduleFakeCall(delay, () => {
      showFakeCallNotification({
        callerName,
        callerNumber,
        profilePic,
      });
      setCallState(CALL_STATE.RINGING);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fake Call</Text>

      {/* PROFILE SECTION */}
      <View style={styles.profileRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />

          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Ionicons name="camera" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={pickContact}>
          <Ionicons name="person-add" size={22} color="white" />
          <Text style={styles.contactText}>Pick Contact</Text>
        </TouchableOpacity>
      </View>

      {/* NAME */}
      <Text style={styles.label}>Caller Name</Text>
      <TextInput
        value={callerName}
        onChangeText={setCallerName}
        style={styles.input}
      />

      {/* NUMBER */}
      <Text style={styles.label}>Caller Number</Text>
      <TextInput
        value={callerNumber}
        onChangeText={setCallerNumber}
        style={styles.input}
        keyboardType="phone-pad"
      />

      {/* DELAY */}
      <Text style={styles.label}>Call After</Text>
      <View style={styles.delayRow}>
        {[0, 10, 30, 60].map((sec) => (
          <TouchableOpacity
            key={sec}
            style={[styles.delayBtn, delay === sec && styles.delayActive]}
            onPress={() => setDelay(sec)}
          >
            <Text style={styles.delayText}>
              {sec === 0 ? "Now" : `${sec}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SUBMIT */}
      <TouchableOpacity style={styles.scheduleBtn} onPress={handleSchedule}>
        <Text style={styles.scheduleText}>Schedule Fake Call</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },

  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0f62fe",
    padding: 6,
    borderRadius: 20,
  },

  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  contactText: {
    color: "white",
    fontWeight: "600",
  },

  label: {
    color: "gray",
    marginTop: 20,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#111",
    color: "white",
    padding: 14,
    borderRadius: 10,
  },
  delayRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  delayBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: "#222",
    borderRadius: 10,
  },
  delayActive: {
    backgroundColor: "#0f62fe",
  },
  delayText: {
    color: "white",
    fontWeight: "600",
  },
  scheduleBtn: {
    marginTop: 40,
    backgroundColor: "#0f62fe",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  scheduleText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
