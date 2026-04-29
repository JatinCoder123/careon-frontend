import { View, Text, TouchableOpacity, StyleSheet, Linking, ActivityIndicator, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";

import {
  handleRecordingSaved,
  requestPermissions,
  startRecording,
  stopRecording,
} from "../../store/slices/record.slice";

/* -------------------- Location helpers -------------------- */

async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

async function getCurrentLocation() {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

/* -------------------- Screen -------------------- */

export default function RecordingHomeScreen({ navigation }) {
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const { isRecording } = useSelector((state) => state.recording);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [isStarting, setIsStarting] = useState(false);

  const waveAnim = useRef(new Animated.Value(1)).current;

  /* -------------------- Ask permission first time -------------------- */

  useEffect(() => {
    if (!cameraPermission) return;

    if (!cameraPermission.granted && cameraPermission.canAskAgain) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  /* -------------------- Recording Animation -------------------- */

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.4,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(1);
    }
  }, [isRecording]);

  /* -------------------- Helpers -------------------- */

  function openAppSettings() {
    Linking.openSettings();
  }

  /* -------------------- Start Recording -------------------- */

  async function handleStartRecording() {
    if (!cameraRef.current) return;

    setIsStarting(true);

    const granted = await requestPermissions();
    if (!granted) {
      setIsStarting(false);
      alert("Camera & microphone permission required");
      return;
    }

    const recordingPromise = cameraRef.current.recordAsync({
      maxDuration: 300,
    });

    dispatch(
      startRecording({
        id: Date.now(),
        startTime: new Date().toISOString(),
        startLocation: await getCurrentLocation(),
      })
    );

    setIsStarting(false);

    const recording = await recordingPromise;

    dispatch(handleRecordingSaved(recording.uri));
  }

  /* -------------------- Stop Recording -------------------- */

  function handleStopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();

      dispatch(
        stopRecording({
          endTime: new Date().toISOString(),
          endLocation: null,
        })
      );
    }
  }

  /* -------------------- Permission UI -------------------- */

  if (!cameraPermission) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to record evidence
        </Text>

        {cameraPermission.canAskAgain ? (
          <TouchableOpacity onPress={requestCameraPermission}>
            <Text style={styles.permissionButton}>Grant Permission</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openAppSettings}>
            <Text style={styles.permissionButton}>
              Open Settings & Enable Permission
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  /* -------------------- Main UI -------------------- */

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" mode="video" />

      <View style={styles.overlay}>
        <Text style={styles.title}>Evidence Recording</Text>

        {/* Loader */}
        {isStarting && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#ff4d6d" />
            <Text style={styles.loaderText}>Starting recording...</Text>
          </View>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Animated.View
              style={[
                styles.waveCircle,
                { transform: [{ scale: waveAnim }] },
              ]}
            />
            <View style={styles.recordDot} />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate("RecordHistory")}
        >
          <Text style={styles.historyButtonText}>📂 Record History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startButton}
          onPress={isRecording ? handleStopRecording : handleStartRecording}
        >
          <Text style={styles.startButtonText}>
            ⏺ {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(22,24,29,1)",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#ebf1fc",
  },

  startButton: {
    backgroundColor: "#681a4e",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  startButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },

  historyButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
  },

  historyButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFFFFF",
  },

  loaderContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  loaderText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 14,
  },

  recordingIndicator: {
    alignItems: "center",
    marginBottom: 20,
  },

  waveCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,0,0,0.2)",
  },

  recordDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "red",
    marginBottom: 6,
  },

  recordingText: {
    color: "#fff",
    fontWeight: "600",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
    paddingHorizontal: 24,
  },

  permissionText: {
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },

  permissionButton: {
    color: "#60A5FA",
    fontSize: 16,
    fontWeight: "600",
  },
});