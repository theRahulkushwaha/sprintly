import express from "express";
import auth from "../middleware/auth.js";
import { getTasks, createTask, updateTask, deleteTask, addComment, deleteComment } from "../controllers/taskController.js";

const router = express.Router();
router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.post("/:id/comments", auth, addComment);
router.delete("/:id/comments/:commentId", auth, deleteComment);

export default router;