import sendEmail from "./utils/sendEmail.js";
import dotenv from "dotenv";

dotenv.config();

sendEmail({
  to: "your_email@gmail.com",
  subject: "Buddy Finder Test Email",
  html: "<h2>Email is working 🎉</h2>",
})
  .then(() => console.log("Email sent successfully"))
  .catch((err) => console.error("Email failed:", err));
