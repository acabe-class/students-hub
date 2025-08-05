import { Router } from "express";
import trackRouter from "../track/track.routes.js";
import cohortRouter from "../cohort/cohort.routes.js";
import authRouter from "../auth/auth.routes.js";
import googleAuthRouter from "../auth/google-oauth.routes.js";
import usersRouter from "../users/users.routes.js";
import scholarshipRouter from "../scholarship/scholarship.routes.js";

const appRouter = Router();

// Public routes
appRouter.use("/auth", authRouter);
appRouter.use("/auth/google", googleAuthRouter);

// Protected routes
appRouter.use("/tracks", trackRouter);
appRouter.use("/cohorts", cohortRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/scholarships", scholarshipRouter);

export default appRouter;
