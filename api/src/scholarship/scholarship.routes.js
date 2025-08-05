import { Router } from "express";
import {
  getAllApplications,
  getApplicationById,
  getMyApplications,
  createApplication,
  updateApplication,
  reviewApplication,
  deleteApplication,
  getApplicationsByStatus
} from "./scholarship.controller.js";
import { authenticateToken } from "../middleware/check-authentication.middleware.js";
import { requireAdmin, requireRole } from "../middleware/check-authorization.middleware.js";

const scholarshipRouter = Router();

// Apply authentication to all routes
scholarshipRouter.use(authenticateToken);

// Student routes
scholarshipRouter.get("/my-applications", getMyApplications);
scholarshipRouter.post("/", createApplication);
scholarshipRouter.put("/:id", updateApplication);
scholarshipRouter.delete("/:id", deleteApplication);

// Admin/Instructor routes
scholarshipRouter.get("/", requireRole(["admin", "instructor"]), getAllApplications);
scholarshipRouter.get("/status/:status", requireRole(["admin", "instructor"]), getApplicationsByStatus);
scholarshipRouter.get("/:id", requireRole(["admin", "instructor"]), getApplicationById);
scholarshipRouter.put("/:id/review", requireRole(["admin", "instructor"]), reviewApplication);

export default scholarshipRouter; 