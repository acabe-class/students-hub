import { Router } from "express";
import {
    getAllCohorts,
    getCohortById,
    createCohort,
    updateCohort,
    deleteCohort,
} from "./cohort.controller.js";

const cohortRouter = Router();

cohortRouter.get( "/", getAllCohorts );
cohortRouter.get( "/:id", getCohortById );
cohortRouter.post( "/", createCohort );
cohortRouter.put( "/:id", updateCohort );
cohortRouter.delete( "/:id", deleteCohort );

export default cohortRouter;
