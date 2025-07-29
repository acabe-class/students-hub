import { Router } from "express";
import trackRouter from "../track/track.routes.js";
import cohortRouter from "../cohort/cohort.routes.js";
const appRouter = Router();

appRouter.use("/tracks", trackRouter);
appRouter.use("/cohorts", cohortRouter);

export default appRouter;
