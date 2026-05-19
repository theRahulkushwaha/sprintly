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
  getProjectById,
  getProjectMembers,
  leaveProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.get("/:id/members", auth, getProjectMembers);
router.post("/", auth, createProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.post("/:id/members", auth, addMember);
router.delete("/:id/members/:userId", auth, removeMember);
router.put("/:id/columns", auth, updateColumns);
router.post("/:id/leave", auth, leaveProject);

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