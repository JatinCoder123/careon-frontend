import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import { Directory, File } from "expo-file-system";

import AsyncStorage from "@react-native-async-storage/async-storage";

// const evidenceDir = new Directory(Paths.cache, "evidence");

// export function ensureEvidenceDir() {
//   evidenceDir.create({ intermediates: true });
// }

export async function requestPermissions() {
  const camera = await Camera.requestCameraPermissionsAsync();
  const mic = await Camera.requestMicrophonePermissionsAsync();

  return camera.status === "granted" && mic.status === "granted";
}

const initialState = {
  isRecording: false,

  current: {
    id: null,
    startTime: null,
    endTime: null,
    startLocation: null,
    endLocation: null,
    videoUri: null,
    status: "idle", // idle | recording | saved | error
  },

  history: [],
  error: null,
};

const recordingSlice = createSlice({
  name: "recording",
  initialState,

  reducers: {
    // 🔴 Start recording
    startRecording(state, action) {
      state.isRecording = true;
      state.current = {
        id: action.payload.id,
        startTime: action.payload.startTime,
        startLocation: action.payload.startLocation,
        endTime: null,
        endLocation: null,
        videoUri: null,
        status: "recording",
      };
      state.error = null;
    },

    // ⏹ Stop recording
    stopRecording(state, action) {
      state.isRecording = false;
      state.current.endTime = action.payload.endTime;
      state.current.endLocation = action.payload.endLocation;
      state.current.status = "saved";
    },

    // 📂 Save to history
    addRecordingToHistory(state, action) {
      state.history.unshift(action.payload);
      state.current = initialState.current;
    },

    // ☁️ Mark as uploaded
    markRecordingUploaded(state, action) {
      const record = state.history.find((r) => r.id === action.payload);
      if (record) {
        record.status = "uploaded";
      }
    },

    // ❌ Error handling
    recordingError(state, action) {
      state.isRecording = false;
      state.error = action.payload;
      state.current.status = "error";
    },

    // 🧹 Reset everything (optional)
    resetRecordingState() {
      return initialState;
    },
  },
});
export function handleRecordingSaved(tempUri) {
  return async (dispatch, getState) => {
    // console.log("H")
    // await ensureEvidenceDir();
    // console.log("I")

    // const fileName = `evidence_${Date.now()}.mp4`;
    // const videoFile = evidenceDir.createFile(fileName);

    // await videoFile.moveFrom(tempUri);

    // final URI (use this for DB / Redux / history)
    // const finalUri = videoFile.uri;

    // console.log("Saved at:", finalUri);
    const existing =
      JSON.parse(await AsyncStorage.getItem("record_history")) || [];
    const data = {
      ...getState().recording.current,
      videoUri: tempUri,
    };

    existing.unshift(data);
    dispatch(addRecordingToHistory(data));

    await AsyncStorage.setItem("record_history", JSON.stringify(existing));
  };

  // save metadata here
}

export const {
  startRecording,
  stopRecording,
  addRecordingToHistory,
  markRecordingUploaded,
  recordingError,
  resetRecordingState,
} = recordingSlice.actions;

export default recordingSlice.reducer;
