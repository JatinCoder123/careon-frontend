import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { userAction } from "../../store/slices/user.slice";
import * as SecureStore from "expo-secure-store";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  );
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigation();

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: "1",
      name: "Sarah Anderson",
      phone: "+1 234 5678",
      relationship: "Spouse",
    },
    {
      id: "2",
      name: "Michael Anderson",
      phone: "+1 345 6789",
      relationship: "Brother",
    },
  ]);

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: "",
  });

  /* 📸 Pick profile image */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const addContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { ...newContact, id: Date.now().toString() },
    ]);
    setNewContact({ name: "", phone: "", relationship: "" });
    setShowAddContact(false);
  };

  const deleteContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id));
  };
  const handleLogOut = async () => {
    // Implement logout functionality
    dispatch(userAction.logoutUser());
    navigate.replace("Auth");
    await SecureStore.deleteItemAsync("authToken");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: user?.photo ?? profileImage }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
          <Ionicons name="camera" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.card}>
        <InfoRow icon="person-outline" label="Name" value={user?.name} />
        <InfoRow icon="mail-outline" label="Email" value={user?.email} />
        <InfoRow icon="call-outline" label="Phone" value={user?.phone} />
      </View>

      {/* Emergency Contacts */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity onPress={() => setShowAddContact(true)}>
          <Ionicons name="add-circle" size={28} color="#F44336" />
        </TouchableOpacity>
      </View>

      {emergencyContacts.map((contact) => (
        <View key={contact.id} style={styles.contactCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactRelation}>{contact.relationship}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteContact(contact.id)}>
            <Feather name="trash-2" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Contact Modal */}
      <Modal transparent visible={showAddContact} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

            <TextInput
              placeholder="Name"
              style={styles.input}
              value={newContact.name}
              onChangeText={(t) => setNewContact({ ...newContact, name: t })}
            />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              value={newContact.phone}
              onChangeText={(t) => setNewContact({ ...newContact, phone: t })}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Relationship"
              style={styles.input}
              value={newContact.relationship}
              onChangeText={(t) =>
                setNewContact({ ...newContact, relationship: t })
              }
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddContact(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addBtn}
                disabled={
                  !newContact.name ||
                  !newContact.phone ||
                  !newContact.relationship
                }
                onPress={addContact}
              >
                <Text style={{ color: "#fff" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogOut}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* 🔹 Reusable row */
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#F44336" />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 16 },

  header: { paddingVertical: 20 },
  headerTitle: { fontSize: 24, color: "#fff", fontWeight: "700" },

  imageWrapper: { alignItems: "center", marginVertical: 16 },
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
    marginBottom: 16,
    alignItems: "center",
  },
  infoLabel: { color: "#9CA3AF", fontSize: 12 },
  infoValue: { color: "#fff", fontSize: 14 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },

  contactCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactName: { color: "#fff", fontWeight: "600" },
  contactRelation: { color: "#9CA3AF", fontSize: 12 },
  contactPhone: { color: "#E5E7EB", fontSize: 13 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#111827",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { color: "#fff", fontSize: 18, marginBottom: 12 },

  input: {
    backgroundColor: "#1F2937",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },

  modalBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F44336",
    alignItems: "center",
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
  logoutText: { color: "#fff", fontWeight: "600" },
});
