import request from 'supertest';
import { app } from '../../src/app.setup.js';
import { authHelper } from '../helpers/auth.helper.js';
import { User, Profile, Track } from '../../src/database/models/index.js';

describe('User Management Endpoints', () => {
  describe('GET /api/v1/users', () => {
    it('should return all users for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user1 = await global.testUtils.createTestUser();
      const user2 = await global.testUtils.createTestUser({ email: 'user2@example.com' });

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(3); // admin + 2 users
      expect(response.body.data.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: user1.email }),
          expect.objectContaining({ email: user2.email })
        ])
      );
    });

    it('should deny access for non-admin users', async () => {
      const { token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient permissions');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by ID for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user = await global.testUtils.createTestUser();

      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(user.id);
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return user by ID for instructor', async () => {
      const { token } = await authHelper.createInstructorAndGetToken();
      const user = await global.testUtils.createTestUser();

      const response = await request(app)
        .get(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(user.id);
    });

    it('should return 404 for non-existent user', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/v1/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user successfully for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user = await global.testUtils.createTestUser();
      const track = await global.testUtils.createTestTrack();

      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
        track_id: track.id
      };

      const response = await request(app)
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.email).toBe(updateData.email);

      // Verify profile was updated
      const profile = await Profile.findOne({ where: { user_id: user.id } });
      expect(profile.track_id).toBe(track.id);
    });

    it('should return error for duplicate email', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user1 = await global.testUtils.createTestUser();
      const user2 = await global.testUtils.createTestUser({ email: 'user2@example.com' });

      const response = await request(app)
        .put(`/api/v1/users/${user1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: user2.email })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already taken');
    });

    it('should return validation errors for invalid data', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user = await global.testUtils.createTestUser();

      const response = await request(app)
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user successfully for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const user = await global.testUtils.createTestUser();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify user was deleted
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });

    it('should deny access for non-admin users', async () => {
      const { token } = await authHelper.createStudentAndGetToken();
      const user = await global.testUtils.createTestUser();

      const response = await request(app)
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/users/:id/password', () => {
    it('should change password successfully', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .put(`/api/v1/users/${user.id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password changed successfully');
    });

    it('should return error for incorrect current password', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .put(`/api/v1/users/${user.id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should return validation errors for invalid data', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .put(`/api/v1/users/${user.id}/password`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: '',
          newPassword: '123'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/v1/users/:id/profile', () => {
    it('should update profile successfully', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const profileData = {
        bio: 'Updated bio',
        picture_url: 'https://example.com/picture.jpg',
        track_id: track.id
      };

      const response = await request(app)
        .put(`/api/v1/users/${user.id}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.profile.bio).toBe(profileData.bio);
      expect(response.body.data.user.profile.picture_url).toBe(profileData.picture_url);
      expect(response.body.data.user.profile.track_id).toBe(track.id);
    });

    it('should create profile if it does not exist', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const profileData = {
        bio: 'New bio',
        track_id: track.id
      };

      const response = await request(app)
        .put(`/api/v1/users/${user.id}/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.profile).toBeTruthy();
    });
  });
}); 