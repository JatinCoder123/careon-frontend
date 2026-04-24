import React from "react";
import { Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const { width, height } = Dimensions.get("window");

export default function MapViewSection({
  mapRef,
  userLocation,
  destination,
  routes,
  selectedRouteIndex,
  onMapPress,
  decodePolyline,
  routeColors,
}) {
  if (!userLocation) return null;

  return (
    <MapView
      ref={mapRef}
      style={{ width, height }}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={onMapPress}
    >
      {/* USER LOCATION */}
      <Marker coordinate={userLocation} title="You" />

      {/* DESTINATION */}
      {destination && (
        <Marker
          coordinate={destination}
          title="Destination"
          pinColor="green"
        />
      )}

      {/* ROUTES */}
      {routes.map((route, index) => {
        // If a route is selected, hide others
        if (
          selectedRouteIndex !== null &&
          index !== selectedRouteIndex
        ) {
          return null;
        }

        return (
          <Polyline
            key={index}
            coordinates={decodePolyline(
              route.overview_polyline.points
            )}
            strokeWidth={5}
            strokeColor={
              selectedRouteIndex === index
                ? "#00FFAA"
                : routeColors[index % routeColors.length]
            }
          />
        );
      })}
    </MapView>
  );
}
