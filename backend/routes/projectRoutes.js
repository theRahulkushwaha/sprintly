import express from "express";
import auth from "../middleware/auth.js";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();
router.get("/", auth, getProjects);
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
export default router;