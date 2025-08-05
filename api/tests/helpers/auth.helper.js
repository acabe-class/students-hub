import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../src/database/models/user.model.js';

export const authHelper = {
  // Generate JWT token for a user
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        roles: user.roles 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },

  // Create user with hashed password
  async createUserWithPassword(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    return await User.create({
      ...userData,
      password: hashedPassword
    });
  },

  // Get auth headers for requests
  getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  },

  // Login and get token
  async loginAndGetToken(userData) {
    const user = await this.createUserWithPassword(userData);
    const token = this.generateToken(user);
    return { user, token };
  },

  // Create admin and get token
  async createAdminAndGetToken(adminData = {}) {
    const defaultAdmin = {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'password123',
      roles: ['admin']
    };
    
    return await this.loginAndGetToken({ ...defaultAdmin, ...adminData });
  },

  // Create student and get token
  async createStudentAndGetToken(studentData = {}) {
    const defaultStudent = {
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
      roles: ['student']
    };
    
    return await this.loginAndGetToken({ ...defaultStudent, ...studentData });
  },

  // Create instructor and get token
  async createInstructorAndGetToken(instructorData = {}) {
    const defaultInstructor = {
      name: 'Test Instructor',
      email: 'instructor@example.com',
      password: 'password123',
      roles: ['instructor']
    };
    
    return await this.loginAndGetToken({ ...defaultInstructor, ...instructorData });
  }
}; 