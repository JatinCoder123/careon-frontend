import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  /* 📸 Pick profile image */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      // upload later
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: user.photo }} style={styles.profileImage} />

        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.card}>
        <InfoRow icon="person-outline" label="Name" value={user.name} />

        <InfoRow icon="mail-outline" label="Email" value={user.email} />

        <InfoRow icon="call-outline" label="Phone" value={user.phone} />

        {/* NEW ROW */}
        <TouchableOpacity
          style={styles.arrowRow}
          onPress={() => navigation.navigate("EmergencyContacts")}
        >
          <View style={styles.leftRow}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#F44336"
            />

            <View>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>
                Manage your emergency contacts
              </Text>
            </View>
          </View>

          <Feather name="chevron-right" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* Reusable Row */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#F44336" />

    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 16,
  },

  imageWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 20,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  infoLabel: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  infoValue: {
    color: "#fff",
    fontSize: 14,
  },

  /* New Row */
  arrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingTop: 14,
    marginTop: 4,
  },

  leftRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});
