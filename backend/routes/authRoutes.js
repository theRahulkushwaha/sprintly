import express from "express";
import { register, login, changePassword, updateUserRole, getUsers } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.put("/password", auth, changePassword);
router.put("/users/:userId/role", auth, updateUserRole);
router.get("/users", auth, getUsers);
export default router;