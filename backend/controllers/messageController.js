import Message from "../models/Message.js";
import Trip from "../models/Trip.js";

/* =========================
   GET MESSAGES
========================= */
export const getMessages = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // ✅ HOST OR JOINED USER
    const isMember =
      trip.createdBy.toString() === req.user._id.toString() ||
      trip.joinedUsers.some(
        (id) => id.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      tripId: req.params.tripId,
    })
      .populate("senderId", "name avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   SEND MESSAGE
========================= */
export const sendMessage = async (req, res) => {
  try {
    const { tripId, message } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // ✅ SAME CHECK AS getMessages (FIXED)
    const isMember =
      trip.createdBy.toString() === req.user._id.toString() ||
      trip.joinedUsers.some(
        (id) => id.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newMessage = await Message.create({
      tripId,
      senderId: req.user._id,
      message,
    });

    // ✅ Return populated message (needed for UI + 👑 badge)
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "name avatar");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
