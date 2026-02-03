import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice.js";
import contactsReducer from "./slices/emergencyContact.slice.js";
import recordingReducer from "./slices/record.slice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactsReducer,
    recording: recordingReducer,
  },
});

export default store;
