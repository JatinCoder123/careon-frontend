import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice.js";
import contactsReducer from "./slices/emergencyContact.slice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactsReducer,
  },
});

export default store;
