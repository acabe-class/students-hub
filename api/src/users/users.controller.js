import bcrypt from "bcrypt";
import { catchAsync, sendResponse } from "../lib/utils.js";
import { UnprocessableEntityError, NotFoundError, ConflictError } from "../lib/errors.lib.js";
import { User } from "../database/models/user.model.js";
import { Profile } from "../database/models/profile.model.js";
import { Track } from "../database/models/track.model.js";
import { updateUserSchema, changePasswordSchema } from "./users.schema.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Profile,
        include: [{ model: Track }]
      }
    ]
  });

  sendResponse(res, 200, "Users data fetched successfully", { users });
});

export const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Profile,
        include: [{ model: Track }]
      }
    ]
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  sendResponse(res, 200, "User data fetched successfully", { user });
});

export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const results = updateUserSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Check if email is being updated and if it's already taken
  if (results.data.email && results.data.email !== user.email) {
    const existingUser = await User.findOne({ where: { email: results.data.email } });
    if (existingUser) {
      throw new ConflictError("Email already taken");
    }
  }

  // Update user
  await user.update(results.data);

  // Update or create profile if track_id is provided
  if (results.data.track_id) {
    const [profile] = await Profile.findOrCreate({
      where: { user_id: user.id },
      defaults: { track_id: results.data.track_id }
    });

    if (profile.track_id !== results.data.track_id) {
      await profile.update({ track_id: results.data.track_id });
    }
  }

  // Get updated user with profile
  const updatedUser = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Profile,
        include: [{ model: Track }]
      }
    ]
  });

  sendResponse(res, 200, "User updated successfully", { user: updatedUser });
});

export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Delete associated profile first
  await Profile.destroy({ where: { user_id: id } });
  
  // Delete user
  await user.destroy();

  sendResponse(res, 204, "User deleted successfully");
});

export const changePassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const results = changePasswordSchema.safeParse(req.body);
  
  if (results.error?.issues) {
    throw new UnprocessableEntityError(
      "The request failed with the following errors",
      results.error.issues
    );
  }

  const { currentPassword, newPassword } = results.data;

  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    throw new UnprocessableEntityError("Current password is incorrect");
  }

  // Hash new password
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await user.update({ password: hashedNewPassword });

  sendResponse(res, 200, "Password changed successfully");
});

export const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { bio, picture_url, track_id } = req.body;

  const user = await User.findByPk(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Update or create profile
  const [profile] = await Profile.findOrCreate({
    where: { user_id: id },
    defaults: { bio, picture_url, track_id }
  });

  await profile.update({ bio, picture_url, track_id });

  // Get updated user with profile
  const updatedUser = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Profile,
        include: [{ model: Track }]
      }
    ]
  });

  sendResponse(res, 200, "Profile updated successfully", { user: updatedUser });
}); 