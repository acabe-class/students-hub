import request from 'supertest';
import { app } from '../../src/app.setup.js';
import { authHelper } from '../helpers/auth.helper.js';
import { ScholarshipApplication, User, Track } from '../../src/database/models/index.js';

describe('Scholarship Application Endpoints', () => {
  describe('POST /api/v1/scholarships', () => {
    it('should submit application successfully', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const applicationData = {
        track_id: track.id,
        personal_statement: 'I am passionate about technology and want to pursue a career in software development. I believe this program will provide me with the skills and knowledge needed to succeed in the industry.',
        academic_background: 'I have a strong academic background in computer science with a focus on web development and programming fundamentals.',
        financial_need: 'I come from a low-income family and would greatly benefit from financial assistance to pursue this educational opportunity.',
        career_goals: 'My goal is to become a full-stack developer and eventually start my own technology company focused on solving real-world problems.'
      };

      const response = await request(app)
        .post('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application).toHaveProperty('id');
      expect(response.body.data.application.user_id).toBe(user.id);
      expect(response.body.data.application.track_id).toBe(track.id);
      expect(response.body.data.application.status).toBe('pending');

      // Verify application was created in database
      const application = await ScholarshipApplication.findByPk(response.body.data.application.id);
      expect(application).toBeTruthy();
      expect(application.personal_statement).toBe(applicationData.personal_statement);
    });

    it('should return error for duplicate application', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const applicationData = {
        track_id: track.id,
        personal_statement: 'Test statement',
        academic_background: 'Test background',
        financial_need: 'Test need',
        career_goals: 'Test goals'
      };

      // Submit first application
      await request(app)
        .post('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData)
        .expect(201);

      // Try to submit second application
      const response = await request(app)
        .post('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .send(applicationData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You already have a pending application');
    });

    it('should return validation errors for invalid data', async () => {
      const { token } = await authHelper.createStudentAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const invalidData = {
        track_id: track.id,
        personal_statement: 'Too short', // Invalid: too short
        academic_background: 'Short', // Invalid: too short
        financial_need: 'Short', // Invalid: too short
        career_goals: 'Short' // Invalid: too short
      };

      const response = await request(app)
        .post('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const track = await global.testUtils.createTestTrack();

      const response = await request(app)
        .post('/api/v1/scholarships')
        .send({
          track_id: track.id,
          personal_statement: 'Test statement',
          academic_background: 'Test background',
          financial_need: 'Test need',
          career_goals: 'Test goals'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/scholarships/my-applications', () => {
    it('should return user applications', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication({ user_id: user.id });

      const response = await request(app)
        .get('/api/v1/scholarships/my-applications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(1);
      expect(response.body.data.applications[0].id).toBe(application.id);
    });

    it('should return empty array when user has no applications', async () => {
      const { token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .get('/api/v1/scholarships/my-applications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/scholarships/my-applications')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/scholarships', () => {
    it('should return all applications for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const application1 = await global.testUtils.createTestApplication();
      const application2 = await global.testUtils.createTestApplication();

      const response = await request(app)
        .get('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(2);
      expect(response.body.data.applications).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: application1.id }),
          expect.objectContaining({ id: application2.id })
        ])
      );
    });

    it('should return all applications for instructor', async () => {
      const { token } = await authHelper.createInstructorAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const response = await request(app)
        .get('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(1);
    });

    it('should deny access for students', async () => {
      const { token } = await authHelper.createStudentAndGetToken();

      const response = await request(app)
        .get('/api/v1/scholarships')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient permissions');
    });
  });

  describe('GET /api/v1/scholarships/:id', () => {
    it('should return application by ID for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const response = await request(app)
        .get(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.id).toBe(application.id);
      expect(response.body.data.application).toHaveProperty('applicant');
      expect(response.body.data.application).toHaveProperty('track');
    });

    it('should return 404 for non-existent application', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/v1/scholarships/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Application not found');
    });
  });

  describe('PUT /api/v1/scholarships/:id', () => {
    it('should update application successfully', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication({ user_id: user.id });

      const updateData = {
        personal_statement: 'Updated personal statement with more details about my passion for technology and my goals in the software development field.',
        academic_background: 'Updated academic background with more information about my studies and achievements.'
      };

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.personal_statement).toBe(updateData.personal_statement);
      expect(response.body.data.application.academic_background).toBe(updateData.academic_background);
    });

    it('should not allow updates for non-pending applications', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication({ 
        user_id: user.id,
        status: 'approved'
      });

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          personal_statement: 'Updated statement'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cannot update application that is not pending');
    });

    it('should not allow users to update other users applications', async () => {
      const { token } = await authHelper.createStudentAndGetToken();
      const otherUser = await global.testUtils.createTestUser({ email: 'other@example.com' });
      const application = await global.testUtils.createTestApplication({ user_id: otherUser.id });

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          personal_statement: 'Updated statement'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only update your own applications');
    });
  });

  describe('PUT /api/v1/scholarships/:id/review', () => {
    it('should review application successfully for admin', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const reviewData = {
        status: 'approved',
        reviewer_notes: 'Excellent application with strong academic background and clear career goals.'
      };

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.status).toBe(reviewData.status);
      expect(response.body.data.application.reviewer_notes).toBe(reviewData.reviewer_notes);
      expect(response.body.data.application).toHaveProperty('reviewed_at');
    });

    it('should review application successfully for instructor', async () => {
      const { token } = await authHelper.createInstructorAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const reviewData = {
        status: 'rejected',
        reviewer_notes: 'Application does not meet the required criteria.'
      };

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application.status).toBe(reviewData.status);
    });

    it('should deny access for students', async () => {
      const { token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'approved',
          reviewer_notes: 'Test notes'
        })
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Insufficient permissions');
    });

    it('should return validation errors for invalid review data', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const application = await global.testUtils.createTestApplication();

      const response = await request(app)
        .put(`/api/v1/scholarships/${application.id}/review`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'invalid_status',
          reviewer_notes: 'Short' // Too short
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/scholarships/:id', () => {
    it('should delete application successfully', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication({ user_id: user.id });

      const response = await request(app)
        .delete(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify application was deleted
      const deletedApplication = await ScholarshipApplication.findByPk(application.id);
      expect(deletedApplication).toBeNull();
    });

    it('should not allow deletion of non-pending applications', async () => {
      const { user, token } = await authHelper.createStudentAndGetToken();
      const application = await global.testUtils.createTestApplication({ 
        user_id: user.id,
        status: 'approved'
      });

      const response = await request(app)
        .delete(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cannot delete application that is not pending');
    });

    it('should not allow users to delete other users applications', async () => {
      const { token } = await authHelper.createStudentAndGetToken();
      const otherUser = await global.testUtils.createTestUser({ email: 'other@example.com' });
      const application = await global.testUtils.createTestApplication({ user_id: otherUser.id });

      const response = await request(app)
        .delete(`/api/v1/scholarships/${application.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You can only delete your own applications');
    });
  });

  describe('GET /api/v1/scholarships/status/:status', () => {
    it('should return applications by status', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const pendingApp = await global.testUtils.createTestApplication({ status: 'pending' });
      const approvedApp = await global.testUtils.createTestApplication({ status: 'approved' });
      const rejectedApp = await global.testUtils.createTestApplication({ status: 'rejected' });

      const response = await request(app)
        .get('/api/v1/scholarships/status/pending')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(1);
      expect(response.body.data.applications[0].id).toBe(pendingApp.id);
    });

    it('should return empty array for status with no applications', async () => {
      const { token } = await authHelper.createAdminAndGetToken();

      const response = await request(app)
        .get('/api/v1/scholarships/status/approved')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.applications).toHaveLength(0);
    });
  });
}); 