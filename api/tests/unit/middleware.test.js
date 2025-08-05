import jwt from 'jsonwebtoken';
import { authenticateToken } from '../../src/middleware/check-authentication.middleware.js';
import { requireRole, requireAdmin, requireInstructor, requireStudent } from '../../src/middleware/check-authorization.middleware.js';
import { User } from '../../src/database/models/user.model.js';

// Mock the database models
jest.mock('../../src/database/models/user.model.js');
jest.mock('../../src/lib/config.lib.js', () => ({
  default: {
    getOrThrow: jest.fn(() => 'test-secret')
  }
}));

describe('Authentication Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token and attach user to request', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        roles: ['student']
      };

      const token = jwt.sign(mockUser, 'test-secret');
      mockReq.headers.authorization = `Bearer ${token}`;

      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id, {
        attributes: { exclude: ['password'] }
      });
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return error for missing token', async () => {
      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token is required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error for invalid token', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error for expired token', async () => {
      const expiredToken = jwt.sign({ id: 'user-id' }, 'test-secret', { expiresIn: '-1h' });
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return error when user not found in database', async () => {
      const token = jwt.sign({ id: 'user-id' }, 'test-secret');
      mockReq.headers.authorization = `Bearer ${token}`;

      User.findByPk = jest.fn().mockResolvedValue(null);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

describe('Authorization Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: {
        id: 'user-id',
        email: 'test@example.com',
        roles: ['student']
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('requireRole', () => {
    it('should allow access for user with required role', () => {
      const middleware = requireRole('student');
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access for user with one of required roles', () => {
      const middleware = requireRole(['admin', 'instructor']);
      mockReq.user.roles = ['instructor'];
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for user without required role', () => {
      const middleware = requireRole('admin');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when user is not authenticated', () => {
      const middleware = requireRole('admin');
      mockReq.user = null;
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for admin user', () => {
      mockReq.user.roles = ['admin'];
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-admin user', () => {
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireInstructor', () => {
    it('should allow access for instructor user', () => {
      mockReq.user.roles = ['instructor'];
      requireInstructor(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-instructor user', () => {
      requireInstructor(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireStudent', () => {
    it('should allow access for student user', () => {
      requireStudent(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for non-student user', () => {
      mockReq.user.roles = ['admin'];
      requireStudent(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 