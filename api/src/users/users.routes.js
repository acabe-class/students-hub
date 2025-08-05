import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
  updateProfile
} from "./users.controller.js";
import { authenticateToken } from "../middleware/check-authentication.middleware.js";
import { requireAdmin, requireRole } from "../middleware/check-authorization.middleware.js";

const usersRouter = Router();

// Apply authentication to all routes
usersRouter.use(authenticateToken);

// Admin only routes
usersRouter.get("/", requireAdmin, getAllUsers);
usersRouter.delete("/:id", requireAdmin, deleteUser);

// User management routes (admin or own user)
usersRouter.get("/:id", requireRole(["admin", "instructor"]), getUserById);
usersRouter.put("/:id", requireRole(["admin", "instructor"]), updateUser);
usersRouter.put("/:id/password", changePassword);
usersRouter.put("/:id/profile", updateProfile);

export default usersRouter; 