import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:tripId", protect, getMessages);
router.post("/send", protect, sendMessage);

export default router;
