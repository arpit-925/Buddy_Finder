import Message from "../models/Message.js";
import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /* =====================
       AUTH USER (SAFE)
    ===================== */
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
      console.log("❌ Unauthorized socket connection");
      socket.disconnect();
      return;
    }

    socket.userId = userId;
    socket.join(userId); // personal room
    console.log(`👤 User room joined: ${userId}`);

    /* =====================
       JOIN TRIP ROOM
    ===================== */
    socket.on("joinRoom", async ({ tripId }) => {
      if (!tripId) return;

      socket.join(tripId);
      console.log(`📍 User joined trip room: ${tripId}`);
    });

    /* =====================
       SEND MESSAGE
    ===================== */
    socket.on("sendMessage", async ({ tripId, message }) => {
      try {
        if (!tripId || !message) return;

        const trip = await Trip.findById(tripId);
        if (!trip) return;

        // ✅ SECURITY CHECK
        const isMember = trip.joinedUsers.some(
          (id) => id.toString() === socket.userId
        );
        if (!isMember) return;

        // Save message
        const newMessage = await Message.create({
          tripId,
          senderId: socket.userId,
          message,
        });

        // Emit message to room
        io.to(tripId).emit("receiveMessage", newMessage);

        // Prepare notifications (non-blocking)
        const notifications = trip.joinedUsers
          .filter((id) => id.toString() !== socket.userId)
          .map((memberId) => ({
            userId: memberId,
            message: "New message in trip chat 💬",
            type: "NEW_MESSAGE",
          }));

        if (notifications.length) {
          await Notification.insertMany(notifications);

          notifications.forEach((n) => {
            io.to(n.userId.toString()).emit("notification", {
              message: n.message,
              tripId,
            });
          });
        }
      } catch (error) {
        console.error("🔥 Socket error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

export default socketHandler;
