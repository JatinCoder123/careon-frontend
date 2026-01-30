import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Modal,
    Animated,
    Pressable,
} from "react-native";
import { useState, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { signInWithGoogle } from "../../services/googleAuth.service";

export default function LoginScreen() {
    const [phone, setPhone] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    // const { request, response, promptAsync } = useGoogleAuth();
    const handleGoogleLogin = async () => {
        try {
            const userInfo = await signInWithGoogle();
            console.log("GOOGLE USER 👉", userInfo);

            // userInfo.user.email
            // userInfo.idToken → send to backend
        } catch (e) {
            console.log("Google login cancelled or failed");
        }
    };




    const slideAnim = useRef(new Animated.Value(300)).current;

    const openModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = (setter) => {
        Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setter(false));
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require("../../../assets/icon.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>Welcome to CareOn</Text>
            <Text style={styles.subtitle}>Your safety mode starts here</Text>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                    placeholder="Enter mobile number"
                    placeholderTextColor="#6B7280"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                />
            </View>

            {/* Phone Login */}
            <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                    setShowOtpModal(true);
                    openModal();
                }}
            >
                <Text style={styles.primaryBtnText}>Continue with Mobile Number</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
            </View>

            {/* Google Login */}
            <TouchableOpacity
                style={styles.googleBtn}
                // disabled={!request}
                onPress={() => handleGoogleLogin()}
            >
                <AntDesign name="google" size={20} color="#FFFFFF" />
                <Text style={styles.googleBtnText}> Continue with Google</Text>
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footerText}>
                By continuing, you agree to our{" "}
                <Text style={styles.link}>Terms</Text> &{" "}
                <Text style={styles.link}>Privacy Policy</Text>
            </Text>


            {/* 🔐 OTP MODAL */}
            <Modal transparent visible={showOtpModal} animationType="none">
                <Pressable
                    style={styles.overlay}
                    onPress={() => closeModal(setShowOtpModal)}
                >
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            { transform: [{ translateY: slideAnim }] },
                        ]}
                    >
                        <Text style={styles.sheetTitle}>Verify OTP</Text>

                        <TextInput
                            placeholder="Enter OTP"
                            placeholderTextColor="#6B7280"
                            keyboardType="number-pad"
                            maxLength={6}
                            style={styles.otpInput}
                        />

                        <TouchableOpacity style={styles.primaryBtn}>
                            <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Pressable>
            </Modal>
        </View>
    );
}

const COLORS = {
    primary: "#F44336",
    background: "#0B1220",
    textPrimary: "#FFFFFF",
    textSecondary: "#9CA3AF",
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    logo: {
        width: 160,
        height: 160,
        alignSelf: "center",
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
    },
    subtitle: {
        color: "#9CA3AF",
        textAlign: "center",
        marginBottom: 24,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
    },
    countryCode: { color: "#fff", marginRight: 8 },
    input: { color: "#fff", flex: 1 },

    primaryBtn: {
        backgroundColor: "#F44336",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },

    primaryBtnText: { color: "#fff", fontWeight: "600" },

    googleBtn: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#1F2937",
        padding: 14,
        borderRadius: 12,
        justifyContent: "center",
    },

    googleBtnText: { color: "#fff", fontWeight: "600" },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    divider: { flex: 1, height: 1, backgroundColor: "#1F2937" },
    orText: { color: "#9CA3AF", marginHorizontal: 10 },

    /* MODAL */
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },

    bottomSheet: {
        backgroundColor: "#111827",
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    sheetTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },

    otpInput: {
        backgroundColor: "#1F2937",
        borderRadius: 10,
        padding: 12,
        color: "#fff",
        marginBottom: 16,
    },
    footerText: {
        marginTop: 32,
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: "center",
        lineHeight: 18,
    },

    link: {
        color: COLORS.primary,
        fontWeight: "500",
    },
});






// useEffect(() => {
//     if (response?.type === "success") {
//         const { authentication } = response;

//         // 🔐 Google ID token
//         const googleToken = authentication.idToken;

//         handleGoogleLogin(googleToken);
//     }
// }, [response]);

// const handleGoogleLogin = async (googleToken) => {
//     try {
//         // 🔗 Send googleToken to backend
//         // const res = await api.googleLogin(googleToken);

//         const appToken = "APP_JWT_TOKEN"; // from backend

//         await SecureStore.setItemAsync("authToken", appToken);

//         navigation.replace("App");
//     } catch (err) {
//         console.log("Google login failed", err);
//     }
// };