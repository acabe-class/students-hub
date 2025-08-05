import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "../lib/errors.lib.js";
import * as userService from "../users/users.service.js";
import config from "../lib/config.lib.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new UnauthenticatedError("Access token is required");
    }

    const decoded = jwt.verify(token, config.getOrThrow("JWT_SECRET"));
    
    // Get user from database to ensure they still exist
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      throw new UnauthenticatedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new UnauthenticatedError("Invalid token"));
    } else if (error.name === 'TokenExpiredError') {
      next(new UnauthenticatedError("Token expired"));
    } else {
      next(error);
    }
  }
};
