import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],
  loading: true,
  error: null,
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    getContactRequest: (state, action) => {
      state.contacts = action.payload;
      state.loading = true;
      state.error = null;
    },
    getContactSuccess: (state, action) => {
      state.contacts = action.payload;
      state.loading = false;
      state.error = null;
    },
    getContactFailure: (state, action) => {
      state.contacts = [];
      state.loading = false;
      state.error = action.payload;
    },
    addContact: (state, action) => {
      state.contacts.push(action.payload);
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter(
        (contact) => contact.id !== action.payload,
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const contactsAction = contactsSlice.actions;

export default contactsSlice.reducer;
