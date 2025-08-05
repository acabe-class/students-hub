import { Router } from "express";
import { getGoogleAuthUrl, googleAuthCallback, googleAuthWithIdToken } from "./google-oauth.controller.js";

const googleAuthRouter = Router();

googleAuthRouter.get("/url", getGoogleAuthUrl);
googleAuthRouter.get("/callback", googleAuthCallback);
googleAuthRouter.post("/token", googleAuthWithIdToken);

export default googleAuthRouter; 