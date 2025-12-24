import { body } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6+ chars"),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty(),
];
