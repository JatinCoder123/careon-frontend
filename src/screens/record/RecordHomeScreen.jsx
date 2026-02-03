import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";

import {
  ensureEvidenceDir,
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

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  /* -------------------- Ensure permissions -------------------- */

  useEffect(() => {
    if (!cameraPermission) return;
    if (!cameraPermission.granted) {
      requestCameraPermission();
    }
  }, [cameraPermission]);

  /* -------------------- Start Recording -------------------- */

  async function handleStartRecording() {
    if (!cameraRef.current) {
      console.log("Camera not ready");
      return;
    }

    const granted = await requestPermissions();
    if (!granted) {
      alert("Camera & microphone permission required");
      return;
    }

    // Ensure directory (sync API)
    // await ensureEvidenceDir();

    // Start recording (returns a promise that resolves AFTER stop)
    const recordingPromise = cameraRef.current.startRecording({
      maxDuration: 300, // 5 min safety cap
    });

    dispatch(
      startRecording({
        id: Date.now(),
        startTime: new Date().toISOString(),
        startLocation: await getCurrentLocation(),
      })
    );

    // Wait until recording stops
    const recording = await recordingPromise;

    console.log("Recording saved at:", recording.uri);
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

  /* -------------------- Render -------------------- */

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required
        </Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <Text style={styles.permissionButton}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="video"
      />

      {/* Overlay UI */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Evidence Recording</Text>

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

        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            💡 Tip: Recording is saved securely even if the app closes.
          </Text>
        </View>
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
    padding: 20,
    backgroundColor: "rgba(11,18,32,0.85)",
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

  tipCard: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
  },

  tipText: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
  },

  permissionText: {
    color: "#fff",
    marginBottom: 16,
  },

  permissionButton: {
    color: "#60A5FA",
    fontSize: 16,
  },
});
