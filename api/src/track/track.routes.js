import { Router } from "express";
import {
    getAllTracks,
    getTrackById,
    createTrack,
    updateTrack,
    deleteTrack,
} from "./track.controller.js";
const trackRouter = Router();

trackRouter.get( "/", getAllTracks );
trackRouter.get( "/:id", getTrackById );
trackRouter.post( "/", createTrack );
trackRouter.put( "/:id", updateTrack );
trackRouter.delete( "/:id", deleteTrack );

export default trackRouter;