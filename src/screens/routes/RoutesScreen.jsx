import  { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Dimensions, Platform, ActivityIndicator } from "react-native";import MapView, { Marker, Polyline } from "react-native-maps";
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
  const { userLocation, destination, routes } = useSelector(
    (state) => state.routes,
  );
  const [loadingRoutes, setLoadingRoutes] = useState(false);


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      dispatch(
        routesAction.setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }),
      );
    })();
  }, []);

  useEffect(() => {
    if (userLocation && destination) {
      fetchRoutes();
    }
  }, [destination]);

 
  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);

      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const dest = `${destination.latitude},${destination.longitude}`;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&alternatives=true&key=${GOOGLE_API_KEY}`;

      const response = await axios.get(url);

      if (response.data.routes.length) {
        dispatch(routesAction.setRoutes(response.data.routes));
        fitMapToRoutes(response.data.routes);
      }
    } catch (error) {
      console.log("Route error:", error);
    } finally {
      setLoadingRoutes(false);
    }
  };

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
        <SearchBar
          onPlaceSelected={(place) =>
            dispatch(routesAction.setDestination(place))
          }
          apiKey={GOOGLE_API_KEY}
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
          dispatch(routesAction.setDestination(e.nativeEvent.coordinate));
        }}
      >
        {/* USER */}
        <Marker coordinate={userLocation} title="You" />

        {/* DESTINATION */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="blue"
          />
        )}

        {/* ROUTES */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            coordinates={decodePolyline(route.overview_polyline.points)}
            strokeWidth={5}
            strokeColor={routeColors[index % routeColors.length]}
          />
        ))}
      </MapView>
       {loadingRoutes && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Finding best routes...</Text>
        </View>
      )}
    </View>
  );
}

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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
   loaderOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
