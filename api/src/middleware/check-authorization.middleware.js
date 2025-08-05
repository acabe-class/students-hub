import { UnauthorizedError } from "../lib/errors.lib.js";

export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = Array.isArray(requiredRoles) 
      ? requiredRoles.some(role => userRoles.includes(role))
      : userRoles.includes(requiredRoles);

    if (!hasRequiredRole) {
      return next(new UnauthorizedError("Insufficient permissions"));
    }

    next();
  };
};

export const requireAdmin = requireRole("admin");
export const requireInstructor = requireRole("instructor");
export const requireStudent = requireRole("student");
