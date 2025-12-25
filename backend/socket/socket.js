import Message from "../models/Message.js";
import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    /* =====================
       AUTH USER
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
       JOIN TRIP ROOM (SECURE)
    ===================== */
    socket.on("joinRoom", async ({ tripId }) => {
      try {
        if (!tripId) return;

        const trip = await Trip.findById(tripId);
        if (!trip) return;

        const isMember =
          trip.createdBy.toString() === socket.userId ||
          trip.joinedUsers.some(
            (id) => id.toString() === socket.userId
          );

        if (!isMember) {
          console.log("❌ Non-member tried to join trip room");
          return;
        }

        socket.join(tripId);
        console.log(`📍 User joined trip room: ${tripId}`);
      } catch (err) {
        console.error("Join room error:", err.message);
      }
    });

    /* =====================
       SEND MESSAGE
    ===================== */
    socket.on("sendMessage", async ({ tripId, message }) => {
      try {
        if (!tripId || !message) return;

        const trip = await Trip.findById(tripId);
        if (!trip) return;

        // ✅ HOST + JOINED USERS ALLOWED
        const isMember =
          trip.createdBy.toString() === socket.userId ||
          trip.joinedUsers.some(
            (id) => id.toString() === socket.userId
          );

        if (!isMember) {
          console.log("❌ Non-member tried to send message");
          return;
        }

        // 1️⃣ Save message
        const savedMessage = await Message.create({
          tripId,
          senderId: socket.userId,
          message,
        });

        // 2️⃣ Populate sender (IMPORTANT)
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("senderId", "name avatar");

        // 3️⃣ Emit saved + populated message
        io.to(tripId).emit("receiveMessage", populatedMessage);

        // 🔔 Notify other participants (excluding sender)
        const recipients = [
          trip.createdBy,
          ...trip.joinedUsers,
        ].filter((id) => id.toString() !== socket.userId);

        const notifications = recipients.map((userId) => ({
          userId,
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
