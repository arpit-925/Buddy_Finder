import Message from "../models/Message.js";
import Trip from "../models/Trip.js";
import Notification from "../models/Notification.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    const userId = socket.handshake.auth?.userId;
    if (!userId) {
      socket.disconnect();
      return;
    }

    socket.userId = userId;
    socket.join(userId);

    /* JOIN TRIP ROOM */
    socket.on("joinRoom", async ({ tripId }) => {
      if (!tripId) return;

      const trip = await Trip.findById(tripId);
      if (!trip) return;

      const isMember =
        trip.createdBy.toString() === socket.userId ||
        trip.joinedUsers.some((id) => id.toString() === socket.userId);

      if (!isMember) return;

      socket.join(tripId);
    });

    /* SEND MESSAGE */
    socket.on("sendMessage", async ({ tripId, message }) => {
      if (!tripId || !message) return;

      const trip = await Trip.findById(tripId);
      if (!trip) return;

      const isMember =
        trip.createdBy.toString() === socket.userId ||
        trip.joinedUsers.some((id) => id.toString() === socket.userId);

      if (!isMember) return;

      const savedMessage = await Message.create({
        tripId,
        senderId: socket.userId,
        message,
      });

      const populatedMessage = await Message.findById(savedMessage._id)
        .populate("senderId", "name avatar");

      io.to(tripId).emit("receiveMessage", populatedMessage);

      const recipients = [trip.createdBy, ...trip.joinedUsers].filter(
        (id) => id.toString() !== socket.userId
      );

      await Notification.insertMany(
        recipients.map((id) => ({
          userId: id,
          message: "New message in trip chat 💬",
          type: "NEW_MESSAGE",
        }))
      );
    });

    /* TYPING INDICATOR */
    socket.on("typing", ({ tripId }) => {
      socket.to(tripId).emit("userTyping", {
        userId: socket.userId,
      });
    });

    socket.on("stopTyping", ({ tripId }) => {
      socket.to(tripId).emit("userStopTyping", {
        userId: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
};

export default socketHandler;
