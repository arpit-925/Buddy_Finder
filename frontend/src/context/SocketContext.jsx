import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        transports: ["websocket"], // 🔥 REQUIRED for Render
        query: { userId: user._id },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
