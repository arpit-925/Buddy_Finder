import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import {
  registerValidation,
  loginValidation,
} from "../validators/authValidator.js";
import validate from "../middleware/validate.js";
import { updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Auth
router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.get("/me", protect, getMe);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.put("/profile", protect, updateProfile);

export default router;
