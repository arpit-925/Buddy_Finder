import Message from "../models/Message.js";
import Trip from "../models/Trip.js";

/* =========================
   GET MESSAGES
========================= */
export const getMessages = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip.joinedUsers.includes(req.user._id))
      return res.status(403).json({ message: "Access denied" });

    const messages = await Message.find({
      tripId: req.params.tripId,
    }).populate("senderId", "name");

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
    if (!trip.joinedUsers.includes(req.user._id))
      return res.status(403).json({ message: "Access denied" });

    const newMessage = await Message.create({
      tripId,
      senderId: req.user._id,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
