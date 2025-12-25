import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import socketHandler from "./socket/socket.js";
import userRoutes from "./routes/userRoutes.js";
import sendEmail from "./utils/sendEmail.js"; // ✅ ADD THIS

dotenv.config();
connectDB();

const app = express();

/* ======================
   CORS
====================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://buddyfinder-du2b.vercel.app",
  "https://buddy-finder-mh40.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/* ======================
   BODY PARSER
====================== */
app.use(express.json());

/* ======================
   SECURITY
====================== */
app.use(
  helmet({
    contentSecurityPolicy:false,
    crossOriginResourcePolicy: false,
  })
);

/* ======================
   RATE LIMIT
====================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => req.method === "OPTIONS",
});
app.use(limiter);

/* ======================
   ROUTES
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/messages", messageRoutes);

/* ======================
   TEST EMAIL ROUTE (TEMP)
====================== */
app.get("/api/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "arpitmishra0925@gmail.com",
      subject: "Buddy Finder Test Email",
      html: "<h1>Email system works 🎉</h1>",
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Test email failed:", error.message);
    res.status(500).json({ message: "Email failed" });
  }
});

/* ======================
   SERVER + SOCKET.IO
====================== */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

/* ======================
   SOCKET HANDLER
====================== */
socketHandler(io);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
