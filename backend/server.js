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

const server =
  http.createServer(app);

export const io = new Server(
  server,
  {
    cors: {
      origin:
        "http://localhost:5173",

      credentials: true,
    },
  }
);

app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);

app.use(
  "/api/projects",
  projectRoutes
);

app.use("/api/tasks", taskRoutes);

app.use(
  "/api/workspaces",
  workspaceRoutes
);

/* SOCKET */
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

/* DB */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected"
    );

    server.listen(5000, () => {
      console.log(
        "Server running on port 5000"
      );
    });
  })
  .catch((err) =>
    console.log(err)
  );