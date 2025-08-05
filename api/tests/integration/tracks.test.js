import request from 'supertest';
import { app } from '../../src/app.setup.js';
import { authHelper } from '../helpers/auth.helper.js';
import { Track } from '../../src/database/models/index.js';

describe('Track Management Endpoints', () => {
  describe('GET /api/v1/tracks', () => {
    it('should return all tracks', async () => {
      const track1 = await global.testUtils.createTestTrack();
      const track2 = await global.testUtils.createTestTrack({
        name: 'Backend Development',
        description: 'Server-side development'
      });

      const response = await request(app)
        .get('/api/v1/tracks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tracks).toHaveLength(2);
      expect(response.body.data.tracks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: track1.name }),
          expect.objectContaining({ name: track2.name })
        ])
      );
    });

    it('should return empty array when no tracks exist', async () => {
      const response = await request(app)
        .get('/api/v1/tracks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tracks).toHaveLength(0);
    });
  });

  describe('GET /api/v1/tracks/:id', () => {
    it('should return track by ID', async () => {
      const track = await global.testUtils.createTestTrack();

      const response = await request(app)
        .get(`/api/v1/tracks/${track.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.track.id).toBe(track.id);
      expect(response.body.data.track.name).toBe(track.name);
      expect(response.body.data.track.description).toBe(track.description);
    });

    it('should return 404 for non-existent track', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/api/v1/tracks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Track not found');
    });
  });

  describe('POST /api/v1/tracks', () => {
    it('should create track successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const trackData = {
        name: 'Frontend Development',
        description: 'Client-side development with React and JavaScript'
      };

      const response = await request(app)
        .post('/api/v1/tracks')
        .set('Authorization', `Bearer ${token}`)
        .send(trackData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.track.name).toBe(trackData.name);
      expect(response.body.data.track.description).toBe(trackData.description);
      expect(response.body.data.track).toHaveProperty('id');

      // Verify track was created in database
      const track = await Track.findByPk(response.body.data.track.id);
      expect(track).toBeTruthy();
      expect(track.name).toBe(trackData.name);
    });

    it('should return error for duplicate track name', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const existingTrack = await global.testUtils.createTestTrack();

      const response = await request(app)
        .post('/api/v1/tracks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: existingTrack.name,
          description: 'Different description'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Track already exists');
    });

    it('should return validation errors for invalid data', async () => {
      const { token } = await authHelper.createAdminAndGetToken();

      const response = await request(app)
        .post('/api/v1/tracks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '', // Invalid: empty name
          description: '' // Invalid: empty description
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v1/tracks')
        .send({
          name: 'Test Track',
          description: 'Test Description'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/tracks/:id', () => {
    it('should update track successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const updateData = {
        name: 'Updated Track Name',
        description: 'Updated track description'
      };

      const response = await request(app)
        .put(`/api/v1/tracks/${track.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.track.name).toBe(updateData.name);
      expect(response.body.data.track.description).toBe(updateData.description);

      // Verify track was updated in database
      const updatedTrack = await Track.findByPk(track.id);
      expect(updatedTrack.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent track', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .put(`/api/v1/tracks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          description: 'Updated Description'
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Track not found');
    });

    it('should return validation errors for invalid data', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const response = await request(app)
        .put(`/api/v1/tracks/${track.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          description: ''
        })
        .expect(422);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/v1/tracks/:id', () => {
    it('should delete track successfully', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const track = await global.testUtils.createTestTrack();

      const response = await request(app)
        .delete(`/api/v1/tracks/${track.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);

      // Verify track was deleted
      const deletedTrack = await Track.findByPk(track.id);
      expect(deletedTrack).toBeNull();
    });

    it('should return 404 for non-existent track', async () => {
      const { token } = await authHelper.createAdminAndGetToken();
      const fakeId = '123e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .delete(`/api/v1/tracks/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Track not found');
    });

    it('should require authentication', async () => {
      const track = await global.testUtils.createTestTrack();

      const response = await request(app)
        .delete(`/api/v1/tracks/${track.id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
}); 