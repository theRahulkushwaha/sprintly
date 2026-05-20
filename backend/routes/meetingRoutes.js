import express from "express";
import auth from "../middleware/auth.js";
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
} from "../controllers/meetingController.js";

const router = express.Router();

router.get("/", auth, getMeetings);
router.post("/", auth, createMeeting);
router.delete("/:id", auth, deleteMeeting);

export default router;