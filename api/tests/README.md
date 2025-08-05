# Test Suite Documentation

This directory contains comprehensive tests for the ACA Student Hub API, covering all major functionality including authentication, user management, track/cohort management, and scholarship applications.

## Test Structure

```
tests/
├── setup.js                    # Global test setup and utilities
├── helpers/
│   └── auth.helper.js         # Authentication helper functions
├── integration/               # Integration tests
│   ├── auth.test.js          # Authentication endpoints
│   ├── users.test.js         # User management endpoints
│   ├── tracks.test.js        # Track management endpoints
│   ├── cohorts.test.js       # Cohort management endpoints
│   └── scholarships.test.js  # Scholarship application endpoints
└── unit/                     # Unit tests
    ├── middleware.test.js    # Middleware functions
    └── utils.test.js         # Utility functions
```

## Test Categories

### 1. Integration Tests (`tests/integration/`)

Integration tests verify that the API endpoints work correctly end-to-end, including:
- Database interactions
- Authentication and authorization
- Request/response handling
- Error scenarios

#### Authentication Tests (`auth.test.js`)
- User registration with and without track assignment
- User login with valid/invalid credentials
- JWT token validation
- Current user retrieval
- Logout functionality
- Duplicate email handling
- Input validation

#### User Management Tests (`users.test.js`)
- CRUD operations for users
- Role-based access control
- Profile management
- Password change functionality
- User deletion with cascade
- Authorization checks

#### Track Management Tests (`tracks.test.js`)
- CRUD operations for tracks
- Duplicate name handling
- Input validation
- Authentication requirements
- Error scenarios

#### Cohort Management Tests (`cohorts.test.js`)
- CRUD operations for cohorts
- Date validation (start_date < end_date)
- Duplicate name handling
- Input validation
- Authentication requirements

#### Scholarship Application Tests (`scholarships.test.js`)
- Application submission
- Application review workflow
- Status management (pending, approved, rejected, under_review)
- User-specific application retrieval
- Admin/instructor access control
- Duplicate application prevention
- Application updates and deletion

### 2. Unit Tests (`tests/unit/`)

Unit tests focus on individual functions and components:

#### Middleware Tests (`middleware.test.js`)
- JWT token authentication
- Role-based authorization
- Error handling for invalid tokens
- Token expiration handling
- User permission checks

#### Utility Tests (`utils.test.js`)
- `catchAsync` error wrapper
- `sendResponse` function
- Different response scenarios
- Error propagation

## Test Utilities

### Global Test Utilities (`setup.js`)

The test setup provides global utilities for common testing tasks:

```javascript
global.testUtils = {
  cleanDatabase(),           // Clean all test data
  createTestUser(),          // Create test user
  createTestAdmin(),         // Create test admin
  createTestTrack(),         // Create test track
  createTestCohort(),        // Create test cohort
  createTestApplication()    // Create test application
}
```

### Authentication Helper (`helpers/auth.helper.js`)

Provides authentication utilities for testing:

```javascript
authHelper = {
  generateToken(user),                    // Generate JWT token
  createUserWithPassword(userData),       // Create user with hashed password
  getAuthHeaders(token),                  // Get auth headers for requests
  loginAndGetToken(userData),             // Login and get token
  createAdminAndGetToken(),               // Create admin with token
  createStudentAndGetToken(),             // Create student with token
  createInstructorAndGetToken()           // Create instructor with token
}
```

## Running Tests

### Prerequisites

1. **Database Setup**: Tests use SQLite in-memory database for isolation
2. **Environment Variables**: Test environment is automatically configured
3. **Dependencies**: All required packages must be installed

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run only integration tests
npm run test:integration

# Run only unit tests
npm run test:unit

# Run specific test file
npm test -- auth.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should register"
```

### Test Coverage

The test suite aims for comprehensive coverage:

- **Authentication**: 100% endpoint coverage
- **User Management**: 100% endpoint coverage
- **Track Management**: 100% endpoint coverage
- **Cohort Management**: 100% endpoint coverage
- **Scholarship Applications**: 100% endpoint coverage
- **Middleware**: 100% function coverage
- **Utilities**: 100% function coverage

## Test Data Management

### Database Isolation

Each test runs in isolation:
- Database is reset before each test
- Test data is cleaned up automatically
- No cross-test contamination

### Test Data Creation

Tests create their own data using utility functions:
- No dependency on external data
- Consistent test environment
- Reproducible test results

## Error Scenarios Tested

### Authentication Errors
- Invalid credentials
- Missing tokens
- Expired tokens
- Invalid token format
- Non-existent users

### Authorization Errors
- Insufficient permissions
- Role-based access control
- Unauthorized operations

### Validation Errors
- Invalid input data
- Missing required fields
- Invalid data types
- Business rule violations

### Database Errors
- Duplicate entries
- Foreign key constraints
- Non-existent records
- Cascade operations

## Best Practices

### Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Data
- Use factory functions for test data
- Keep test data minimal and focused
- Clean up after each test

### Assertions
- Test both success and failure scenarios
- Verify response structure and content
- Check database state when relevant
- Test error messages and status codes

### Performance
- Tests run in parallel where possible
- Use in-memory database for speed
- Minimize external dependencies

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm test
    npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure SQLite is available
   - Check file permissions for test database

2. **JWT Token Issues**
   - Verify JWT_SECRET is set in test environment
   - Check token expiration settings

3. **Test Timeouts**
   - Increase timeout for slow operations
   - Check for hanging database connections

4. **Mock Issues**
   - Ensure mocks are properly configured
   - Check import/export statements

### Debug Mode

Run tests with verbose output:

```bash
npm test -- --verbose
```

### Individual Test Debugging

Run a single test with detailed output:

```bash
npm test -- --testNamePattern="should register" --verbose
```

## Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Cover all scenarios** (success, failure, edge cases)
3. **Update this documentation** if adding new test categories
4. **Maintain test coverage** above 90%
5. **Follow existing patterns** for consistency

## Test Reports

After running tests, you can find:

- **Coverage Report**: `coverage/` directory
- **Test Results**: Console output
- **Failed Tests**: Detailed error messages
- **Performance Metrics**: Test execution times 