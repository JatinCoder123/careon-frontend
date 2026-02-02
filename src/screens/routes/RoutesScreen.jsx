import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const GOOGLE_API_KEY = "AIzaSyAhBGnIyTLuRzdWppKBJNW9bqLh9Odpp_A";

export default function RoutesScreen() {
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  /* --------------------------------------------------
     1️⃣ GET USER LOCATION
  ---------------------------------------------------*/
  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  /* --------------------------------------------------
     2️⃣ FETCH ROUTES WHEN DESTINATION CHANGES
  ---------------------------------------------------*/
  useEffect(() => {
    if (userLocation && destination) {
      fetchRoutes();
    }
  }, [destination]);

  /* --------------------------------------------------
     3️⃣ FETCH MULTIPLE ROUTES
  ---------------------------------------------------*/
  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);

      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&alternatives=true&key=${GOOGLE_API_KEY}`;

      const response = await axios.get(url);

      if (response.data.routes.length) {
        setRoutes(response.data.routes);
        fitMapToRoutes(response.data.routes);
      }
    } catch (error) {
      console.log("Route error:", error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  /* --------------------------------------------------
     4️⃣ FIT MAP TO ROUTES
  ---------------------------------------------------*/
  const fitMapToRoutes = (routes) => {
    const points = [];

    routes.forEach((route) => {
      route.legs[0].steps.forEach((step) => {
        points.push({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        });
        points.push({
          latitude: step.end_location.lat,
          longitude: step.end_location.lng,
        });
      });
    });

    mapRef.current?.fitToCoordinates(points, {
      edgePadding: {
        top: 150,
        bottom: 150,
        left: 50,
        right: 50,
      },
      animated: true,
    });
  };

  /* --------------------------------------------------
     5️⃣ POLYLINE DECODER
  ---------------------------------------------------*/
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

  const routeColors = ["#1E90FF", "#32CD32", "#FF4500"];

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔍 DESTINATION INPUT */}
      <View style={styles.searchBox}>
        <GooglePlacesAutocomplete
          placeholder="Where are you going?"
          fetchDetails
          onPress={(data, details) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
          styles={{
            textInput: styles.searchInput,
          }}
        />
      </View>

      {/* 🗺️ MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => {
          setDestination(e.nativeEvent.coordinate);
        }}
      >
        {/* USER */}
        <Marker coordinate={userLocation} title="You" />

        {/* DESTINATION */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="red"
          />
        )}

        {/* ROUTES */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            coordinates={decodePolyline(
              route.overview_polyline.points
            )}
            strokeWidth={5}
            strokeColor={routeColors[index % routeColors.length]}
          />
        ))}
      </MapView>
    </View>
  );
}

/* --------------------------------------------------
   STYLES
---------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
  searchBox: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
