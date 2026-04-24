import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLocation: null,        // { latitude, longitude }
  destination: null,         // { latitude, longitude }
  routes: [],                // Google Directions routes[]
  selectedRouteIndex: null,  // number | null
  lastFetchedAt: null,       // timestamp (for caching logic)
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    /* ---------------- USER LOCATION ---------------- */
    setUserLocation(state, action) {
      state.userLocation = action.payload;
    },

    /* ---------------- DESTINATION ---------------- */
    setDestination(state, action) {
      state.destination = action.payload;
      state.selectedRouteIndex = null;
    },

    clearDestination(state) {
      state.destination = null;
      state.routes = [];
      state.selectedRouteIndex = null;
      state.lastFetchedAt = null;
    },

    /* ---------------- ROUTES ---------------- */
    setRoutes(state, action) {
      state.routes = action.payload;
      state.lastFetchedAt = Date.now();
    },

    clearRoutes(state) {
      state.routes = [];
      state.selectedRouteIndex = null;
      state.lastFetchedAt = null;
    },

    /* ---------------- ROUTE SELECTION ---------------- */
    selectRoute(state, action) {
      state.selectedRouteIndex = action.payload; // index | null
    },
  },
});

export const routesAction= routesSlice.actions;

export default routesSlice.reducer;
        