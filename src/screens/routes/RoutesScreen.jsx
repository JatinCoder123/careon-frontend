import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { routesAction } from "../../store/slices/routes.slice";

const { width, height } = Dimensions.get("window");

const GOOGLE_API_KEY = "AIzaSyAhBGnIyTLuRzdWppKBJNW9bqLh9Odpp_A";

export default function RoutesScreen() {
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const { userLocation, destination } = useSelector((state) => state.routes);

  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      dispatch(
        routesAction.setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      );
    })();
  }, []);

  useEffect(() => {
    if (userLocation && destination) fetchRoutes();
  }, [destination]);

  // =========================
  // 🔥 FETCH ROUTES + RISK
  // =========================
  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);

      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&alternatives=true&key=${GOOGLE_API_KEY}`;

      const res = await axios.get(url);

      const enrichedRoutes = [];

      for (let route of res.data.routes) {
        const riskData = await calculateRouteRisk(route);

        enrichedRoutes.push({
          ...route,
          ...riskData,
        });
      }

      setRoutes(enrichedRoutes);
      setShowModal(true);

      fitMapToRoutes(enrichedRoutes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  // =========================
  // 🧠 RISK CALCULATION
  // =========================
  const calculateRouteRisk = async (route) => {
    let trafficScore = 0;
    let peopleScore = 0;

    const steps = route.legs[0].steps;

    // sample every 3 steps
    for (let i = 0; i < steps.length; i += 3) {
      const step = steps[i];

      // 🚗 Traffic
      const base = step.duration.value;
      const traffic = step.duration_in_traffic?.value || base;
      const ratio = traffic / base;
      trafficScore += ratio;

      // 👥 People density (Places API)
      try {
        const lat = step.start_location.lat;
        const lng = step.start_location.lng;

        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=200&key=${GOOGLE_API_KEY}`;

        const placesRes = await axios.get(placesUrl);

        const count = placesRes.data.results.length;

        if (count < 5) peopleScore += 3;
        else if (count < 10) peopleScore += 1;
      } catch (e) { }
    }

    const totalRisk = trafficScore * 2 + peopleScore;

    return {
      trafficScore: trafficScore.toFixed(2),
      peopleScore,
      riskScore: totalRisk.toFixed(2),
    };
  };

  // =========================
  // 🎯 FIT MAP
  // =========================
  const fitMapToRoutes = (routes) => {
    const points = [];

    routes.forEach((route) => {
      route.legs[0].steps.forEach((step) => {
        points.push({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        });
      });
    });

    mapRef.current?.fitToCoordinates(points, {
      edgePadding: { top: 100, bottom: 100, left: 50, right: 50 },
      animated: true,
    });
  };

  // =========================
  // 🎨 RISK COLOR
  // =========================
  const getRouteColor = (risk) => {
    if (risk < 20) return "#2ecc71"; // safe
    if (risk < 50) return "#f39c12"; // medium
    return "#e74c3c"; // risky
  };

  // =========================
  // 🔍 POLYLINE DECODE
  // =========================
  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* SEARCH */}
      <View style={styles.searchBox}>
        <SearchBar
          onPlaceSelected={(place) =>
            dispatch(routesAction.setDestination(place))
          }
          apiKey={GOOGLE_API_KEY}
        />
      </View>

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={(e) => {
          console.log("LONG PRESS WORKS");
        }}
        onPress={(e) => {
          console.log("MAP CLICKED");
          const coord = e.nativeEvent.coordinate;
          console.log("HIi")

          dispatch(routesAction.setDestination(coord));

          // reset selected route when new destination picked
          setSelectedRouteIndex(null);
        }}
      >
        <Marker coordinate={userLocation} title="You" />

        {destination && <Marker coordinate={destination} pinColor="blue" />}

        {routes.map((route, index) => {
          if (selectedRouteIndex !== null && selectedRouteIndex !== index)
            return null;

          return (
            <Polyline
              key={index}
              coordinates={decodePolyline(route.overview_polyline.points)}
              strokeWidth={6}
              strokeColor={getRouteColor(route.riskScore)}
            />
          );
        })}
      </MapView>

      {/* 🧾 MODAL */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <Text style={styles.title}>🧭 Choose Route</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {routes.map((route, index) => {
                const riskColor = getRouteColor(route.riskScore);

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.card,
                      { borderColor: riskColor }
                    ]}
                    onPress={() => {
                      setSelectedRouteIndex(index);
                      setShowModal(false);
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={styles.routeTitle}>
                        Route {index + 1}
                      </Text>
                      <View style={[styles.badge, { backgroundColor: riskColor }]}>
                        <Text style={styles.badgeText}>
                          {route.riskScore}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.cardText}>
                      🚗 Traffic: {route.trafficScore}
                    </Text>

                    <Text style={styles.cardText}>
                      👥 People Density: {route.peopleScore}
                    </Text>

                    <Text style={[styles.cardText, { color: riskColor }]}>
                      ⚠️ Risk Level: {route.riskScore < 20 ? "Safe" : route.riskScore < 50 ? "Moderate" : "High"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOADER */}
      {loadingRoutes && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Analyzing routes...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  routeTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cardText: {
    color: "#ccc",
    marginTop: 4,
  },

  closeBtn: {
    marginTop: 10,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
  searchBox: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  card: {
    padding: 15,
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
  },

  loadingText: { color: "#fff", marginTop: 10 },
});