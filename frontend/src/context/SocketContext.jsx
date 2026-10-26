import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [systemFrozen, setSystemFrozen] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    let s = null;
    try {
      s = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        timeout: 5000
      });

      s.on("connect", () => {
        setConnected(true);
      });

      s.on("disconnect", () => {
        setConnected(false);
      });

      s.on("systemState", (data) => {
        if (data && typeof data.frozen === "boolean") {
          setSystemFrozen(data.frozen);
        }
      });

      s.on("circuitBreakerAlert", (data) => {
        if (data && typeof data.frozen === "boolean") {
          setSystemFrozen(data.frozen);
        }
      });

      s.on("systemAlert", (alertData) => {
        setActiveAlert(alertData);
        setTimeout(() => setActiveAlert(null), 8000);
      });

      setSocket(s);
    } catch {
      setConnected(false);
    }

    return () => {
      if (s) s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, systemFrozen, activeAlert, setActiveAlert }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
