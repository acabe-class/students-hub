import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testTrack = {
  name: 'Test Track',
  description: 'A test track for API testing'
};

const testCohort = {
  name: 'Test Cohort 2024',
  start_date: '2024-09-01T00:00:00.000Z',
  end_date: '2024-12-31T23:59:59.000Z'
};

let authToken = null;
let userId = null;
let trackId = null;
let cohortId = null;

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered successfully');
    authToken = registerResponse.data.data.token;
    userId = registerResponse.data.data.user.id;

    // Test 2: Login
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully');

    // Test 3: Get current user
    console.log('\n3. Testing get current user...');
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current user retrieved successfully');

    // Test 4: Create a track
    console.log('\n4. Testing track creation...');
    const trackResponse = await axios.post(`${API_BASE_URL}/tracks`, testTrack, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Track created successfully');
    trackId = trackResponse.data.data.track.id;

    // Test 5: Get all tracks
    console.log('\n5. Testing get all tracks...');
    const tracksResponse = await axios.get(`${API_BASE_URL}/tracks`);
    console.log('✅ Tracks retrieved successfully');

    // Test 6: Create a cohort
    console.log('\n6. Testing cohort creation...');
    const cohortResponse = await axios.post(`${API_BASE_URL}/cohorts`, testCohort, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Cohort created successfully');
    cohortId = cohortResponse.data.data.cohort.id;

    // Test 7: Get all cohorts
    console.log('\n7. Testing get all cohorts...');
    const cohortsResponse = await axios.get(`${API_BASE_URL}/cohorts`);
    console.log('✅ Cohorts retrieved successfully');

    // Test 8: Submit a scholarship application
    console.log('\n8. Testing scholarship application submission...');
    const applicationData = {
      track_id: trackId,
      personal_statement: 'I am passionate about technology and want to pursue a career in software development. I believe this program will provide me with the skills and knowledge needed to succeed in the industry.',
      academic_background: 'I have a strong academic background in computer science with a focus on web development and programming fundamentals.',
      financial_need: 'I come from a low-income family and would greatly benefit from financial assistance to pursue this educational opportunity.',
      career_goals: 'My goal is to become a full-stack developer and eventually start my own technology company focused on solving real-world problems.'
    };

    const applicationResponse = await axios.post(`${API_BASE_URL}/scholarships`, applicationData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Scholarship application submitted successfully');

    // Test 9: Get user's applications
    console.log('\n9. Testing get user applications...');
    const myApplicationsResponse = await axios.get(`${API_BASE_URL}/scholarships/my-applications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User applications retrieved successfully');

    console.log('\n🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- User registration and authentication: ✅');
    console.log('- Track management: ✅');
    console.log('- Cohort management: ✅');
    console.log('- Scholarship application system: ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔍 Error details:', error.response?.status, error.response?.statusText);
  }
}

// Run the tests
testAPI(); 