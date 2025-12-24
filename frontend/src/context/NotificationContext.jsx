import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  
  const socketContext = useSocket();
  const socket = socketContext?.socket; // ✅ SAFE
  
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return; // ✅ CRITICAL GUARD

    const handleNotification = (data) => {
      setNotifications((prev) => [
        { ...data, read: false, id: Date.now() },
        ...prev,
      ]);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () =>
  useContext(NotificationContext);
