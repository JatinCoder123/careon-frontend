import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice.js";
import routesReducer from "./slices/routes.slice.js";
import recordReducer from "./slices/record.slice.js";
import contactReducer from "./slices/emergencyContact.slice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    routes: routesReducer,
    recording: recordReducer,
    contacts: contactReducer,
  },
});

export default store;
