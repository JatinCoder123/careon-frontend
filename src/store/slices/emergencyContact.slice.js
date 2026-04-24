import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "emergency_contacts";

/* ------------------------------------------
   Helpers
------------------------------------------ */
const saveContactsToStorage = async (contacts) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

const getStoredContacts = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

/* ------------------------------------------
   Async Actions
------------------------------------------ */

// Get contacts from local storage
export const fetchEmergencyContacts = createAsyncThunk(
  "contacts/fetchEmergencyContacts",
  async (_, { rejectWithValue }) => {
    try {
      const contacts = await getStoredContacts();
      return contacts;
    } catch (error) {
      return rejectWithValue("Failed to load emergency contacts");
    }
  },
);

// Add contact
export const addEmergencyContact = createAsyncThunk(
  "contacts/addEmergencyContact",
  async (contact, { getState, rejectWithValue }) => {
    try {
      const state = getState().contacts;
      const contacts = state.contacts;

      // Max 3 contacts
      if (contacts.length >= 3) {
        return rejectWithValue("Only 3 emergency contacts allowed");
      }

      // Validation
      if (!contact.name?.trim()) {
        return rejectWithValue("Name is required");
      }

      if (!contact.relationship?.trim()) {
        return rejectWithValue("Relationship is required");
      }

      // Either email or phone required
      if (!contact.phone?.trim() && !contact.email?.trim()) {
        return rejectWithValue("Phone or Email is required");
      }

      // Unique priority
      const priorityExists = contacts.some(
        (item) => item.priority === contact.priority,
      );

      if (priorityExists) {
        return rejectWithValue("Each contact must have different priority");
      }

      const newContact = {
        id: Date.now().toString(),
        name: contact.name.trim(),
        relationship: contact.relationship.trim(),
        phone: contact.phone?.trim() || "",
        email: contact.email?.trim() || "",
        priority: contact.priority,
      };

      const updatedContacts = [...contacts, newContact];
      await saveContactsToStorage(updatedContacts);

      return newContact;
    } catch (error) {
      return rejectWithValue("Failed to add contact");
    }
  },
);

// Remove contact
export const removeEmergencyContact = createAsyncThunk(
  "contacts/removeEmergencyContact",
  async (id, { getState, rejectWithValue }) => {
    try {
      const contacts = getState().contacts.contacts;

      const updatedContacts = contacts.filter((item) => item.id !== id);

      await saveContactsToStorage(updatedContacts);

      return id;
    } catch (error) {
      return rejectWithValue("Failed to remove contact");
    }
  },
);

/* ------------------------------------------
   Initial State
------------------------------------------ */
const initialState = {
  contacts: [],
  loading: false,
  error: null,
};

/* ------------------------------------------
   Slice
------------------------------------------ */
const emergencySlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    clearEmergencyError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* Fetch */
      .addCase(fetchEmergencyContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchEmergencyContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Add */
      .addCase(addEmergencyContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmergencyContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts.push(action.payload);
      })
      .addCase(addEmergencyContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Remove */
      .addCase(removeEmergencyContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeEmergencyContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = state.contacts.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(removeEmergencyContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmergencyError } = emergencySlice.actions;

export default emergencySlice.reducer;
