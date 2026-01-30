import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
export default function SplashScreen() {
  const navigation = useNavigation();


  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = async () => {
    try {
      // const token = await SecureStore.getItemAsync("authToken");
      const token = true;

      setTimeout(() => {
        if (token) {
          // ✅ User already logged in
          navigation.replace("App");
        } else {
          // ❌ Not logged in
          navigation.replace("Auth");
        }
      }, 2000); // splash duration
    } catch (error) {
      navigation.replace("Auth");
    }
  };
  return (
    <ImageBackground
      source={require("../../../assets/splash-icon.jpg")}
      style={styles.background}
      resizeMode="contain"
    >
      {/* Dark overlay for readability */}
      <View style={styles.overlay}>
        {/* App Name */}

        {/* Tagline */}
        <Text style={styles.tagline}>Care on. Worries off.</Text>

        {/* Loader */}
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 32 }}
        />
      </View>
    </ImageBackground>
  );
}

const COLORS = {
  primary: "#F44336",
  background: "#0B1220",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.textPrimary,
  },
  overlay: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    paddingVertical: 80,
    marginBottom: 40,
    paddingHorizontal: 24,
  },

  tagline: {
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
