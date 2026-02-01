import React, { createContext, useContext, useState } from "react";

const FakeCallContext = createContext();

export const CALL_STATE = {
  IDLE: "IDLE",
  RINGING: "RINGING",
  ONGOING: "ONGOING",
};

export  function FakeCallProvider({ children }) {
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [callConfig, setCallConfig] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  return (
    <FakeCallContext.Provider
      value={{
        callState,
        setCallState,
        callConfig,
        setCallConfig,
        callDuration,
        setCallDuration,
      }}
    >
      {children}
    </FakeCallContext.Provider>
  );
}

export const useFakeCall = () => useContext(FakeCallContext);
