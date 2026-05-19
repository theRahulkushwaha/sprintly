import express from "express";
import auth from "../middleware/auth.js";
import { getOrganization, updateOrganization } from "../controllers/organizationController.js";

const router = express.Router();

router.get("/", auth, getOrganization);
router.put("/", auth, updateOrganization);

export default router;