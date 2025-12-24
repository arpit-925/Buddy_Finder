import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Create socket only once
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        auth: {
          userId: user._id, // ✅ SAFE (matches backend)
        },
        withCredentials: true,
        transports: ["websocket", "polling"], // ✅ REQUIRED for Render
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      socketRef.current.on("connect", () => {
        console.log("🟢 Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔴 Socket disconnected");
      });
    }

    return () => {
      // ❌ DO NOT disconnect on rerender
      // socket should persist while user is logged in
    };
  }, [user?._id]);

  // ✅ Disconnect ONLY on logout / app unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
