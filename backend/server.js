import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

/* =========================
   ALLOWED ORIGINS
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

/* =========================
   SOCKET.IO
========================= */

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

/* =========================
   CORS
========================= */

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS not allowed")
      );
    },

    credentials: true,
  })
);

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/workspaces", workspaceRoutes);

/* =========================
   SOCKET EVENTS
========================= */

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "join-project",
    (projectId) => {
      socket.join(projectId);
    }
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User disconnected"
      );
    }
  );
});

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected"
    );

    const PORT =
      process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  })
  .catch((err) =>
    console.log(err)
  );