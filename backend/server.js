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



dotenv.config();
connectDB();

const app = express();

/* ======================
   CORS (FIRST)
====================== */
app.use(
  cors({
    origin: ["http://localhost:5173",
    "https://buddyfinder-du2b.vercel.app"
    ],
    // credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
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
    crossOriginResourcePolicy: false,
  })
);

app.use("/api/users", userRoutes);

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
app.use("/api/trips", tripRoutes);
app.use("/api/messages", messageRoutes);

/* ======================
   SERVER + SOCKET
====================== */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://buddyfinder-du2b.vercel.app",
    ],
    methods: ["GET", "POST"],
  },

  transports: ["websocket"],   // 🔥 IMPORTANT
  allowEIO3: true,             // 🔥 IMPORTANT
  pingTimeout: 60000,
  pingInterval: 25000,
});


socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
