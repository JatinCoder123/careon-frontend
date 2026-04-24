import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchEmergencyContacts,
  addEmergencyContact,
  removeEmergencyContact,
  clearEmergencyError,
} from "../../store/slices/emergencyContact.slice.js";

export default function EmergencyContactsScreen() {
  const dispatch = useDispatch();

  const { contacts, loading, error } = useSelector(
    (state) => state.contacts
  );

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "",
    priority: "",
  });

  useEffect(() => {
    dispatch(fetchEmergencyContacts());
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(clearEmergencyError());
    }
  }, [error]);

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      relationship: "",
      priority: "",
    });
  };

  const onAddContact = async () => {
    const result = await dispatch(
      addEmergencyContact({
        ...form,
        priority: Number(form.priority),
      })
    );

    if (!result.error) {
      resetForm();
      setShowForm(false);
    }
  };

  const onDelete = (id) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => dispatch(removeEmergencyContact(id)),
        },
      ]
    );
  };

  const maxReached = contacts.length >= 3;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Emergency Contacts</Text>

            <TouchableOpacity
              disabled={maxReached}
              onPress={() => setShowForm(!showForm)}
            >
              <Ionicons
                name={showForm ? "close-circle" : "add-circle"}
                size={30}
                color={maxReached ? "#666" : "#F44336"}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.limitText}>
            {contacts.length}/3 Contacts Added
          </Text>

          {/* Add Form */}
          {showForm && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Add Contact</Text>

              <TextInput
                placeholder="Name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={form.name}
                onChangeText={(text) =>
                  setForm({ ...form, name: text })
                }
              />

              <TextInput
                placeholder="Phone (optional)"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                style={styles.input}
                value={form.phone}
                onChangeText={(text) =>
                  setForm({ ...form, phone: text })
                }
              />

              <TextInput
                placeholder="Email (optional)"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                style={styles.input}
                value={form.email}
                onChangeText={(text) =>
                  setForm({ ...form, email: text })
                }
              />

              <TextInput
                placeholder="Relationship"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={form.relationship}
                onChangeText={(text) =>
                  setForm({ ...form, relationship: text })
                }
              />

              <TextInput
                placeholder="Priority (1 / 2 / 3)"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                style={styles.input}
                value={form.priority}
                onChangeText={(text) =>
                  setForm({ ...form, priority: text })
                }
              />

              <TouchableOpacity
                style={styles.addBtn}
                disabled={loading}
                onPress={onAddContact}
              >
                <Text style={styles.btnText}>
                  {loading ? "Adding..." : "Add Contact"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Contact List */}
          {contacts.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>

                <Text style={styles.sub}>
                  {item.relationship}
                </Text>

                {item.phone ? (
                  <Text style={styles.info}>
                    📞 {item.phone}
                  </Text>
                ) : null}

                {item.email ? (
                  <Text style={styles.info}>
                    ✉️ {item.email}
                  </Text>
                ) : null}

                <Text style={styles.priority}>
                  Priority: {item.priority}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => onDelete(item.id)}
              >
                <Feather
                  name="trash-2"
                  size={20}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          ))}

          {!contacts.length && (
            <Text style={styles.empty}>
              No emergency contacts added yet
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------------------------- */
/* Styles */
/* ---------------------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  container: {
    padding: 16,
    paddingBottom: 60,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },

  limitText: {
    color: "#9CA3AF",
    marginTop: 6,
    marginBottom: 16,
  },

  formCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },

  formTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "#1F2937",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#F44336",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  sub: {
    color: "#9CA3AF",
    marginTop: 2,
  },

  info: {
    color: "#E5E7EB",
    marginTop: 4,
  },

  priority: {
    color: "#FCA5A5",
    marginTop: 6,
    fontWeight: "600",
  },

  empty: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 30,
  },
});