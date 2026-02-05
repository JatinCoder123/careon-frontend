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
    profilePic: RANDOM_AVATAR,
  });
  useEffect(() => {
    async function loadFakeCallContact() {
      const name = await AsyncStorage.getItem("fakeCallContactName");
      const number = await AsyncStorage.getItem("fakeCallContactNumber");
      const profilePic = await AsyncStorage.getItem(
        "fakeCallContactProfilePic",
      );

      setFakeCallContact({
        name: name || "John Doe",
        number: number || "+1234567890",
        profilePic: profilePic || null,
      });
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
