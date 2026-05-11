import express from "express";

import auth from "../middleware/auth.js";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  updateColumns,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", auth, getProjects);

router.post("/", auth, createProject);

router.put("/:id", auth, updateProject);

router.delete("/:id", auth, deleteProject);

router.post("/:id/members", auth, addMember);

router.delete(
  "/:id/members/:userId",
  auth,
  removeMember
);

router.put(
  "/:id/columns",
  auth,
  updateColumns
);

export default router;