import express from "express";
import auth from "../middleware/auth.js";
import {
  getTeams,
  getUserTeams,
  createTeam,
  addTeamMember,
  removeTeamMember,
  assignProjectToTeam,
  deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", auth, getTeams);
router.get("/my-teams", auth, getUserTeams);
router.post("/", auth, createTeam);
router.post("/:id/members", auth, addTeamMember);
router.delete("/:id/members/:userId", auth, removeTeamMember);
router.post("/:id/projects", auth, assignProjectToTeam);
router.delete("/:id", auth, deleteTeam);

export default router;