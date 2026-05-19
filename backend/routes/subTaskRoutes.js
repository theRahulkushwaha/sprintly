import express from "express";
import auth from "../middleware/auth.js";
import {
  getSubTasks,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/subTaskController.js";

const router = express.Router();

router.get("/task/:taskId", auth, getSubTasks);
router.post("/task/:taskId", auth, createSubTask);
router.put("/:id", auth, updateSubTask);
router.delete("/:id", auth, deleteSubTask);

export default router;