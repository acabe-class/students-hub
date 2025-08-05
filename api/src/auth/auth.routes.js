import { Router } from "express";
import { register, login, logout, getCurrentUser } from "./auth.controller.js";
import { authenticateToken } from "../middleware/check-authentication.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authenticateToken, logout);
authRouter.get("/me", authenticateToken, getCurrentUser);

export default authRouter; 