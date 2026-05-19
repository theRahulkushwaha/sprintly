import express from "express";
import auth from "../middleware/auth.js";
import {
  getWorkspaceTeams,
  getUserTeams,
  getTeamById,
  createWorkspaceTeam,
  updateWorkspaceTeam,
  addTeamMember,
  removeTeamMember,
  assignProjectToTeam,
  removeProjectFromTeam,
  deleteWorkspaceTeam,
  getTeamMembers,
  getTeamProjects,
} from "../controllers/workspaceTeamController.js";

const router = express.Router();

router.get("/", auth, getWorkspaceTeams);
router.get("/my-teams", auth, getUserTeams);
router.get("/:id", auth, getTeamById);
router.get("/:id/members", auth, getTeamMembers);
router.get("/:id/projects", auth, getTeamProjects);
router.post("/", auth, createWorkspaceTeam);
router.put("/:id", auth, updateWorkspaceTeam);
router.post("/:id/members", auth, addTeamMember);
router.delete("/:id/members/:userId", auth, removeTeamMember);
router.post("/:id/projects", auth, assignProjectToTeam);
router.delete("/:id/projects/:projectId", auth, removeProjectFromTeam);
router.delete("/:id", auth, deleteWorkspaceTeam);

export default router;