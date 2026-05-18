import express from "express";

import auth from "../middleware/auth.js";

import {
  getWorkspaces,
  createWorkspace,
  inviteMember,
} from "../controllers/workspaceController.js";

const router =
  express.Router();

router.get(
  "/",
  auth,
  getWorkspaces
);

router.post(
  "/",
  auth,
  createWorkspace
);

router.post(
  "/:id/invite",
  auth,
  inviteMember
);

export default router;