import Message from "../models/Message.js";
import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🔹 Join personal room for notifications
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId);
    }

    /* =====================
       JOIN TRIP ROOM
    ===================== */
    socket.on("joinRoom", ({ tripId }) => {
      socket.join(tripId);
      console.log(`User joined trip room ${tripId}`);
    });

    /* =====================
       SEND MESSAGE
    ===================== */
    socket.on("sendMessage", async ({ tripId, senderId, message }) => {
      try {
        const trip = await Trip.findById(tripId);
        if (!trip) return;

        // Security check
        if (!trip.joinedUsers.some(id => id.toString() === senderId)) return;

        // Save message
        const newMessage = await Message.create({
          tripId,
          senderId,
          message,
        });

        // Emit message to trip room
        io.to(tripId).emit("receiveMessage", newMessage);

        // 🔔 Create & emit notifications to other users
        for (const memberId of trip.joinedUsers) {
          if (memberId.toString() !== senderId) {
            // Save notification in DB
            await Notification.create({
              userId: memberId,
              message: "New message in trip chat 💬",
              type: "NEW_MESSAGE",
            });

            // Emit notification in real-time
            io.to(memberId.toString()).emit("notification", {
              message: "New message in trip chat 💬",
              tripId,
            });
          }
        }
      } catch (error) {
        console.log("Socket error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;
