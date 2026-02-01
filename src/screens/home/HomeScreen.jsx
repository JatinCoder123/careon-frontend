import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  Feather,
} from "@expo/vector-icons";

export default function HomeScreen() {
  const [safetyStatus] = useState("medium"); // safe | medium | risk
  const currentTime = "9:30 PM";

  const statusColor =
    safetyStatus === "safe"
      ? "#22C55E"
      : safetyStatus === "medium"
      ? "#FACC15"
      : "#EF4444";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

      <Text style={styles.subtitle}>Stay safe, you’re not alone ❤️</Text>

      {/* SAFETY STATUS CARD */}
      <View style={[styles.statusCard, { borderColor: statusColor }]}>
        <View>
          <View style={styles.row}>
            <Ionicons name="location" size={16} color={statusColor} />
            <Text style={styles.statusText}>
              Area Safety: {safetyStatus === "safe"
                ? "Safe"
                : safetyStatus === "medium"
                ? "Medium Risk"
                : "High Risk"}
            </Text>
          </View>

          <View style={[styles.row, { marginTop: 6 }]}>
            <Ionicons name="time" size={14} color="#9CA3AF" />
            <Text style={styles.timeText}>Current time: {currentTime}</Text>
          </View>
        </View>

        <View style={[styles.pulseDot, { backgroundColor: statusColor }]} />
      </View>

      {/* SOS BUTTON */}
      <View style={styles.sosWrapper}>
        <TouchableOpacity style={styles.sosButton}>
          <Text style={styles.sosText}>SOS</Text>
          <Text style={styles.sosSub}>Tap to alert</Text>
        </TouchableOpacity>

        <Text style={styles.sosHint}>Long press for silent activation</Text>
      </View>

      {/* CHECK-IN */}
      <View style={styles.checkinCard}>
        <View style={styles.row}>
          <View style={styles.checkIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          </View>
          <View>
            <Text style={styles.checkTitle}>I’m Safe</Text>
            <Text style={styles.checkSub}>Last check-in: 2 hours ago</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkBtn}>
          <Text style={styles.checkBtnText}>Check In</Text>
        </TouchableOpacity>
      </View>

      {/* SAFETY TIP */}
      <View style={styles.tipCard}>
        <Ionicons name="bulb" size={20} color="#60A5FA" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.tipTitle}>Safety Tip</Text>
          <Text style={styles.tipText}>
            It’s late. Consider sharing your live location with a trusted contact.
          </Text>
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.grid}>
        <ActionCard icon="map" color="#60A5FA" title="Safe Routes" subtitle="Find safest path" />
        <ActionCard icon="mic" color="#A78BFA" title="Record Silently" subtitle="Record discreetly" />
        <ActionCard icon="call" color="#22C55E" title="Fake Call" subtitle="Exit situations" />
        <ActionCard icon="people" color="#FB923C" title="Emergency Contacts" subtitle="Who gets alerted" />
      </View>

    </ScrollView>
  );
}

/* 🔹 QUICK ACTION CARD */
function ActionCard({ icon, color, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoRow: { flexDirection: "row", alignItems: "center" },

  logo: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 12,
    marginRight: 8,
  },

  appName: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },

  profile: {
    width: 42,
    height: 42,
    backgroundColor: "#1F2937",
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },

  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },

  subtitle: {
    color: "#9CA3AF",
    marginTop: 6,
    marginBottom: 16,
  },

  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },

  row: { flexDirection: "row", alignItems: "center" },

  statusText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "500",
  },

  timeText: {
    color: "#9CA3AF",
    marginLeft: 6,
    fontSize: 12,
  },

  pulseDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  sosWrapper: { alignItems: "center", marginBottom: 20 },

  sosButton: {
    width: 150,
    height: 150,
    backgroundColor: "#EF4444",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  sosText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
  },

  sosSub: {
    color: "#FEE2E2",
    fontSize: 12,
  },

  sosHint: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 6,
  },

  checkinCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  checkIcon: {
    backgroundColor: "#22C55E20",
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },

  checkTitle: { color: "#fff", fontWeight: "600" },
  checkSub: { color: "#9CA3AF", fontSize: 12 },

  checkBtn: {
    backgroundColor: "#22C55E30",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  checkBtnText: { color: "#22C55E", fontSize: 12 },

  tipCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    marginBottom: 24,
  },

  tipTitle: { color: "#93C5FD", fontSize: 12, fontWeight: "600" },
  tipText: { color: "#E5E7EB", fontSize: 13, marginTop: 2 },

  sectionTitle: {
    color: "#9CA3AF",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "600",
  },

  cardSub: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
});
