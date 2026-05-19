import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import teamRoutes from "./routes/teamRoutes.js"; 
import organizationRoutes from "./routes/organizationRoutes.js";
import subTaskRoutes from "./routes/subTaskRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/teams", teamRoutes); 
app.use("/api/subtasks", subTaskRoutes);
app.use("/api/organization", organizationRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join-project", (projectId) => {
    socket.join(projectId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongo Error:", err.message);
    process.exit(1);
  });