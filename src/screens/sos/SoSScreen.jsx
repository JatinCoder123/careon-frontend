import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertContactsButton from "./AlertContactsButton";

const GOOGLE_API_KEY = "AIzaSyAhBGnIyTLuRzdWppKBJNW9bqLh9Odpp_A";

export default function SoSScreen() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = async () => {
    try {
      const cachedHospitals = await AsyncStorage.getItem("hospitals");
      const cachedPolice = await AsyncStorage.getItem("policeStations");
      const cachedLocation = await AsyncStorage.getItem("userLocation");

      if (cachedHospitals && cachedPolice && cachedLocation) {
        setHospitals(JSON.parse(cachedHospitals));
        setPoliceStations(JSON.parse(cachedPolice));
        setLocation(JSON.parse(cachedLocation));
        setLoading(false);
      } else {
        getLocationAndData();
      }
    } catch (err) {
      console.log(err);
      getLocationAndData();
    }
  };

  const getLocationAndData = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const locationData = { latitude, longitude };

      setLocation(locationData);

      await AsyncStorage.setItem("userLocation", JSON.stringify(locationData));

      await fetchNearbyPlaces(latitude, longitude);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyPlaces = async (lat, lng) => {
    const radius = 5000;

    const hospitalURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=hospital&key=${GOOGLE_API_KEY}`;

    const policeURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=police&key=${GOOGLE_API_KEY}`;

    const hospitalRes = await fetch(hospitalURL);
    const hospitalData = await hospitalRes.json();

    const policeRes = await fetch(policeURL);
    const policeData = await policeRes.json();

    setHospitals(hospitalData.results || []);
    setPoliceStations(policeData.results || []);

    await AsyncStorage.setItem(
      "hospitals",
      JSON.stringify(hospitalData.results || []),
    );
    await AsyncStorage.setItem(
      "policeStations",
      JSON.stringify(policeData.results || []),
    );
  };

  const openDial = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const openMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <Ionicons name="location" size={22} color="#ff4d4d" />

        <View style={{ flex: 1 }}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.address}>{item.vicinity}</Text>
        </View>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() =>
            openMaps(item.geometry.location.lat, item.geometry.location.lng)
          }
        >
          <Ionicons name="navigate" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callButton, { marginLeft: 6 }]}
          onPress={() => openDial("112")}
        >
          <Ionicons name="call" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff4d4d" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Finding nearby emergency services...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AlertContactsButton />
      <Text style={styles.section}>Nearby Hospitals</Text>

      <FlatList
        data={hospitals.slice(0, 5)}
        keyExtractor={(item) => item.place_id}
        renderItem={renderCard}
      />

      <Text style={styles.section}>Nearby Police Stations</Text>

      <FlatList
        data={policeStations.slice(0, 5)}
        keyExtractor={(item) => item.place_id}
        renderItem={renderCard}
      />

      <TouchableOpacity style={styles.refresh} onPress={getLocationAndData}>
        <Ionicons name="refresh" size={20} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 6 }}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06121f",
    padding: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 10,
  },

  section: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#0f1d2b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  placeName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  address: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  callButton: {
    backgroundColor: "#ff4d4d",
    padding: 10,
    borderRadius: 8,
  },

  loader: {
    flex: 1,
    backgroundColor: "#06121f",
    justifyContent: "center",
    alignItems: "center",
  },

  refresh: {
    flexDirection: "row",
    backgroundColor: "#1f2e40",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
});
