import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTrip,
  updateTrip,
  deleteTrip,
  joinTrip,
  handleJoinRequest,
  getAllTrips,
  getTripById,
} from "../controllers/tripController.js";
import { createTripValidation } from "../validators/tripValidator.js";
import validate from "../middleware/validate.js";

const router = express.Router();

/* =========================
   TRIP ROUTES
========================= */

// 🌍 PUBLIC ROUTES
router.get("/", getAllTrips);          // Explore Trips
router.get("/:id", getTripById);       // Trip Details

// 🔐 PROTECTED ROUTES
router.post("/create", protect, createTripValidation, validate, createTrip);
router.put("/:id", protect, updateTrip);        // ✏️ Edit
router.delete("/:id", protect, deleteTrip);     // 🗑️ Delete

router.post("/join/:id", protect, joinTrip);
router.put("/request/:id", protect, handleJoinRequest);

export default router;
