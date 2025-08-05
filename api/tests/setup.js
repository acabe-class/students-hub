import { sequelize } from '../src/database/config/database.js';
import { User, Profile, Track, Cohort, ScholarshipApplication } from '../src/database/models/index.js';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3001';

// Global test utilities
global.testUtils = {
  // Clean up database
  async cleanDatabase() {
    await ScholarshipApplication.destroy({ where: {}, force: true });
    await Profile.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    await Track.destroy({ where: {}, force: true });
    await Cohort.destroy({ where: {}, force: true });
  },

  // Create test user
  async createTestUser(userData = {}) {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      roles: ['student']
    };
    
    return await User.create({ ...defaultUser, ...userData });
  },

  // Create test admin
  async createTestAdmin(adminData = {}) {
    const defaultAdmin = {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'password123',
      roles: ['admin']
    };
    
    return await User.create({ ...defaultAdmin, ...adminData });
  },

  // Create test track
  async createTestTrack(trackData = {}) {
    const defaultTrack = {
      name: 'Test Track',
      description: 'A test track for testing'
    };
    
    return await Track.create({ ...defaultTrack, ...trackData });
  },

  // Create test cohort
  async createTestCohort(cohortData = {}) {
    const defaultCohort = {
      name: 'Test Cohort 2024',
      start_date: new Date('2024-09-01'),
      end_date: new Date('2024-12-31')
    };
    
    return await Cohort.create({ ...defaultCohort, ...cohortData });
  },

  // Create test application
  async createTestApplication(applicationData = {}) {
    const user = await this.createTestUser();
    const track = await this.createTestTrack();
    
    const defaultApplication = {
      user_id: user.id,
      track_id: track.id,
      personal_statement: 'Test personal statement',
      academic_background: 'Test academic background',
      financial_need: 'Test financial need',
      career_goals: 'Test career goals'
    };
    
    return await ScholarshipApplication.create({ ...defaultApplication, ...applicationData });
  }
};

// Setup and teardown
beforeAll(async () => {
  // Sync database for tests
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
});

beforeEach(async () => {
  // Clean database before each test
  await global.testUtils.cleanDatabase();
}); 