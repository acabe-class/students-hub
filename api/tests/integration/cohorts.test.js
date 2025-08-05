import request from 'supertest';
import { app } from '../../src/app.setup.js';
import { authHelper } from '../helpers/auth.helper.js';
import { Cohort } from '../../src/database/models/index.js';

describe('Cohort Management Endpoints', () => {
  describe('GET /api/v1/cohorts', () => {
    it('should return all cohorts', async () => {
      const cohort1 = await global.testUtils.createTestCohort();
      const cohort2 = await global.testUtils.createTestCohort({
        name: 'Cohort 2025',
        start_date: new Date('2025-01-01'),
        end_date: new Date('2025-04-30')
      });

      const response = await request(app)
        .get('/api/v1/cohorts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cohorts).toHaveLength(2);
      expect(response.body.data.cohorts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: cohort1.name }),
          expect.objectContaining({ name: cohort2.name })
        ])
      );
    });

    it('should return empty array when no cohorts exist', async () => {
      const response = await request(app)
        .get('/api/v1/cohorts')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cohorts).toHaveLength(0);
    });
  });

  describe('GET /api/v1/cohorts/:id', () => {
    it('should return cohort by ID', async () => {
      const cohort = await global.testUtils.createTestCohort();

      const response = await request(app)
        .get(`/api/v1/cohorts/${cohort.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cohort.id).toBe(cohort.id);
      expect(response.body.data.cohort.name).toBe(cohort.name);
      expect(response.body.data.cohort).toHaveProperty('start_date');
      expect(response.body.data.cohort).toHaveProperty('end_date');
    });

    it('should return 404 for non-existent cohort', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/v1/cohorts/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cohort not found');
    });
  });

  describe('POST /api/v1/cohorts', () => {
    it('should create cohort successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const cohortData = {
        name: 'Fall 2024 Cohort',
        start_date: '2024-09-01T00:00:00.000Z',
        end_date: '2024-12-31T23:59:59.000Z'
      };

      const response = await request(app)
        .post('/api/v1/cohorts')
        .set('Authorization', `Bearer ${token}`)
        .send(cohortData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cohort.name).toBe(cohortData.name);
      expect(response.body.data.cohort).toHaveProperty('id');

      // Verify cohort was created in database
      const cohort = await Cohort.findByPk(response.body.data.cohort.id);
      expect(cohort).toBeTruthy();
      expect(cohort.name).toBe(cohortData.name);
    });

    it('should return error for duplicate cohort name', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const existingCohort = await global.testUtils.createTestCohort();

      const response = await request(app)
        .post('/api/v1/cohorts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: existingCohort.name,
          start_date: '2025-01-01T00:00:00.000Z',
          end_date: '2025-04-30T23:59:59.000Z'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cohort already exists');
    });

    it('should return validation error for end_date before start_date', async () => {
      const { token } = await authHelper.createAdminAndGetToken();

      const response = await request(app)
        .post('/api/v1/cohorts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Invalid Cohort',
          start_date: '2024-12-31T00:00:00.000Z',
          end_date: '2024-09-01T00:00:00.000Z' // End date before start date
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return validation errors for invalid data', async () => {
      const { token } = await authHelper.createAdminAndGetToken();

      const response = await request(app)
        .post('/api/v1/cohorts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '', // Invalid: empty name
          start_date: 'invalid-date', // Invalid: not a valid date
          end_date: 'invalid-date'
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/cohorts')
        .send({
          name: 'Test Cohort',
          start_date: '2024-09-01T00:00:00.000Z',
          end_date: '2024-12-31T23:59:59.000Z'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/cohorts/:id', () => {
    it('should update cohort successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const cohort = await global.testUtils.createTestCohort();

      const updateData = {
        name: 'Updated Cohort Name',
        start_date: '2025-01-01T00:00:00.000Z',
        end_date: '2025-04-30T23:59:59.000Z'
      };

      const response = await request(app)
        .put(`/api/v1/cohorts/${cohort.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cohort.name).toBe(updateData.name);

      // Verify cohort was updated in database
      const updatedCohort = await Cohort.findByPk(cohort.id);
      expect(updatedCohort.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent cohort', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .put(`/api/v1/cohorts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          start_date: '2025-01-01T00:00:00.000Z',
          end_date: '2025-04-30T23:59:59.000Z'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cohort not found');
    });

    it('should return validation error for end_date before start_date', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const cohort = await global.testUtils.createTestCohort();

      const response = await request(app)
        .put(`/api/v1/cohorts/${cohort.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Cohort',
          start_date: '2024-12-31T00:00:00.000Z',
          end_date: '2024-09-01T00:00:00.000Z' // End date before start date
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/cohorts/:id', () => {
    it('should delete cohort successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const cohort = await global.testUtils.createTestCohort();

      const response = await request(app)
        .delete(`/api/v1/cohorts/${cohort.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify cohort was deleted
      const deletedCohort = await Cohort.findByPk(cohort.id);
      expect(deletedCohort).toBeNull();
    });

    it('should return 404 for non-existent cohort', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/v1/cohorts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Cohort not found');
    });

    it('should require authentication', async () => {
      const cohort = await global.testUtils.createTestCohort();

      const response = await request(app)
        .delete(`/api/v1/cohorts/${cohort.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 