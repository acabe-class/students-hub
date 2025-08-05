import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnprocessableEntityError, UnauthenticatedError, ConflictError } from "../lib/errors.lib.js";
import { User } from "../database/models/user.model.js";
import { Profile } from "../database/models/profile.model.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import config from "../lib/config.lib.js";

export const register = catchAsync(async (req, res) => {
  const results = registerSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const { name, email, password, track_id } = results.data;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    roles: ["student"]
  });

  // Create profile
  if (track_id) {
    await Profile.create({
      user_id: user.id,
      track_id
    });
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

  // Remove password from response
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };

  sendResponse(res, 201, "User registered successfully", { 
    user: userResponse, 
    token 
  });
});

export const login = catchAsync(async (req, res) => {
  const results = loginSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const { email, password } = results.data;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new UnauthenticatedError("Invalid email or password");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid email or password");
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

  sendResponse(res, 200, "Login successful", { 
    user: userResponse, 
    token 
  });
});

export const logout = catchAsync(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token. However, we can implement token blacklisting
  // if needed for additional security.
  
  sendResponse(res, 200, "Logout successful");
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  // Get user profile
  const profile = await Profile.findOne({ 
    where: { user_id: user.id },
    include: [{ model: require("../database/models/track.model.js").Track, as: 'track' }]
  });

  const userResponse = {
    ...user.toJSON(),
    profile
  };

  sendResponse(res, 200, "Current user data fetched successfully", { 
    user: userResponse 
  });
}); 