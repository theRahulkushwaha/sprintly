import express from "express";
import auth from "../middleware/auth.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  addReply,
  deleteComment,
} from "../controllers/taskController.js";

const router = express.Router();

/* TASKS */
router.get("/", auth, getTasks);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

/* COMMENTS */
router.post("/:taskId/comments", auth, addComment);
router.delete("/:taskId/comments/:commentId", auth, deleteComment);

/* REPLIES */
router.post("/:taskId/comments/:commentId/replies", auth, addReply);

export default router;