import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import { userAction } from "../../store/slices/user.slice";
import { phoneLogin } from "../../services/auth.service";
import { useNavigation } from "expo-router";

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // 🔹 SEND OTP
  const handleSendOTP = async () => {
    if (!phone.match(/^\+\d{10,15}$/)) {
      Alert.alert("Invalid phone", "Use format +91XXXXXXXXXX");
      return;
    }

    try {
      setLoading(true);

      const confirmResult = await auth().signInWithPhoneNumber(phone);
      setConfirmation(confirmResult);

      Alert.alert("OTP Sent", "Check your SMS");
    } catch (error) {
      console.log("SEND OTP ERROR:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 VERIFY OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await confirmation.confirm(otp);

      // 🔐 Firebase ID Token
      const firebaseToken = await userCredential.user.getIdToken();

      // 🔗 Call backend
      const { token, user } = await phoneLogin(firebaseToken);

      // 🔐 Store backend JWT
      await SecureStore.setItemAsync("authToken", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      // 🚀 Update redux + navigate
      dispatch(userAction.setUser(user));
      navigation.replace("App");

      Alert.alert("Success", "Logged in successfully");
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error);
      Alert.alert("OTP Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!confirmation ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+91XXXXXXXXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            Dev: use Firebase test numbers or real (10 SMS/day)
          </Text>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    color: "#fff",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  hint: {
    marginTop: 10,
    textAlign: "center",
    color: "#888",
    fontSize: 12,
  },
});
