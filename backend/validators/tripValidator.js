import { body } from "express-validator";

export const createTripValidation = [
  body("destination")
    .notEmpty()
    .withMessage("Destination is required"),

  body("startDate")
    .isISO8601()
    .withMessage("Valid start date required"),

  body("endDate")
    .isISO8601()
    .withMessage("Valid end date required"),

  body("maxPeople")
    .isInt({ min: 1 })
    .withMessage("Max people must be at least 1"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),
];
