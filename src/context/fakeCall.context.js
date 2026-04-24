import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const FakeCallContext = createContext();

export const CALL_STATE = {
  IDLE: "IDLE",
  RINGING: "RINGING",
  ONGOING: "ONGOING",
};
const RANDOM_AVATAR =
  "https://i.pravatar.cc/300?img=" + Math.floor(Math.random() * 70);
export function FakeCallProvider({ children }) {
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [callConfig, setCallConfig] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [fakeCallContact, setFakeCallContact] = useState({
    name: "John Doe",
    number: "+1234567890",
    profilePic: "https://i.pravatar.cc/300?img=4",
  });
 useEffect(() => {
  async function loadFakeCallContact() {
    try {
      const stored = await AsyncStorage.getItem("FakeCallContact");

      if (stored) {
        setFakeCallContact(JSON.parse(stored));
      } else {
        setFakeCallContact({
          name: "John Doe",
          number: "+1234567890",
          profilePic: RANDOM_AVATAR,
        });
      }
    } catch (error) {
      console.log("Error loading contact:", error);
    }
  }

  loadFakeCallContact();
}, []);

  return (
    <FakeCallContext.Provider
      value={{
        callState,
        setCallState,
        callConfig,
        setCallConfig,
        callDuration,
        setCallDuration,
        fakeCallContact,
        setFakeCallContact,
      }}
    >
      {children}
    </FakeCallContext.Provider>
  );
}

export const useFakeCall = () => useContext(FakeCallContext);
