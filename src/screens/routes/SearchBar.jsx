import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";

const COLLAPSED_WIDTH = 44;
const EXPANDED_WIDTH = 350;

export default function SearchBar({ onPlaceSelected, apiKey }) {
  const [open, setOpen] = useState(false);

  const widthAnim = useRef(new Animated.Value(COLLAPSED_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const openSearch = () => {
    setOpen(true);
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: EXPANDED_WIDTH,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const closeSearch = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(widthAnim, {
        toValue: COLLAPSED_WIDTH,
        duration: 250,
        delay: 100,
        useNativeDriver: false,
      }),
    ]).start(() => setOpen(false));
  };

  return (
    <Animated.View style={[styles.container, { width: widthAnim }]}>
      {/* LEFT ICON */}
      <TouchableOpacity onPress={open ? closeSearch : openSearch} style={styles.icon}>
        <Ionicons name={open ? "close" : "search"} size={22} color="#fff" />
      </TouchableOpacity>

      {/* INPUT */}
      {open && (
        <Animated.View style={{ flex: 1, opacity: opacityAnim }}>
          <GooglePlacesAutocomplete
            placeholder="Search destination"
            fetchDetails
            onPress={(data, details) => {
              onPlaceSelected({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
              closeSearch();
            }}
            query={{
              key: apiKey,
              language: "en",
              components: "country:in",
            }}
            enablePoweredByContainer={false}
            debounce={300}
            minLength={2}
            styles={{
              container: { flex: 0 },
              textInput: styles.input,
              listView: { backgroundColor: "#fff", zIndex: 20 },
            }}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  icon:{
    backgroundColor: "#12193c",
    alignItems: "center",
    justifyContent: "center",
    width: COLLAPSED_WIDTH,
    height: COLLAPSED_WIDTH,
    padding: 8,
    borderRadius: 10, 
  },
  container: {
    flexDirection: "row",
    // justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
  },
  listView: {
    backgroundColor: "#812020",
    borderRadius: 10,
    zIndex: 20,
    marginTop: 5,
  },
});
