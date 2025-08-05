import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnauthenticatedError, ConflictError } from "../lib/errors.lib.js";
import { User } from "../database/models/user.model.js";
import { Profile } from "../database/models/profile.model.js";
import googleOAuthService from "../services/google-oauth.service.js";
import emailService from "../services/email.service.js";
import config from "../lib/config.lib.js";

export const getGoogleAuthUrl = catchAsync(async (req, res) => {
  const authUrl = googleOAuthService.getAuthUrl();
  sendResponse(res, 200, "Google auth URL generated", { authUrl });
});

export const googleAuthCallback = catchAsync(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new UnauthenticatedError("Authorization code is required");
  }

  try {
    // Get tokens from Google
    const tokens = await googleOAuthService.getTokens(code);
    
    // Get user info from Google
    const googleUser = await googleOAuthService.getUserInfo(tokens.access_token);

    // Check if user exists
    let user = await User.findOne({ where: { email: googleUser.email } });

    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 12);
      
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword,
        roles: ["student"]
      });

      // Create profile with Google picture
      await Profile.create({
        user_id: user.id,
        picture_url: googleUser.picture
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roles: user.roles 
      },
      config.getOrThrow("JWT_SECRET"),
      { expiresIn: "7d" }
    );

    // Get user profile
    const profile = await Profile.findOne({ where: { user_id: user.id } });

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      profile,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };

    sendResponse(res, 200, "Google authentication successful", { 
      user: userResponse, 
      token 
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    throw new UnauthenticatedError("Google authentication failed");
  }
});

export const googleAuthWithIdToken = catchAsync(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new UnauthenticatedError("ID token is required");
  }

  try {
    // Verify ID token
    const googleUser = await googleOAuthService.verifyIdToken(idToken);

    // Check if user exists
    let user = await User.findOne({ where: { email: googleUser.email } });

    if (!user) {
      // Create new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36), 12);
      
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: hashedPassword,
        roles: ["student"]
      });

      // Create profile with Google picture
      await Profile.create({
        user_id: user.id,
        picture_url: googleUser.picture
      });

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(user);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roles: user.roles 
      },
      config.getOrThrow("JWT_SECRET"),
      { expiresIn: "7d" }
    );

    // Get user profile
    const profile = await Profile.findOne({ where: { user_id: user.id } });

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      profile,
      created_at: user.createdAt,
      updated_at: user.updatedAt
    };

    sendResponse(res, 200, "Google authentication successful", { 
      user: userResponse, 
      token 
    });

  } catch (error) {
    console.error('Google ID token verification error:', error);
    throw new UnauthenticatedError("Google authentication failed");
  }
}); 