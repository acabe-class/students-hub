# ACA Student Hub API

A comprehensive REST API for the ACA Student Hub platform, built with Node.js, Express, and Sequelize.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Google OAuth integration
  - Role-based access control (Admin, Instructor, Student)

- **User Management**
  - User registration and login
  - Profile management
  - Password change functionality

- **Track & Cohort Management**
  - CRUD operations for tracks and cohorts
  - Track assignments to users

- **Scholarship Application System**
  - Application submission and management
  - Application review workflow
  - Status tracking

- **Email Notifications**
  - Welcome emails
  - Application status updates
  - Password reset emails

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (with SQLite fallback for development)
- **ORM**: Sequelize
- **Authentication**: JWT, Google OAuth
- **Validation**: Zod
- **Email**: Nodemailer
- **Security**: bcrypt, helmet, cors

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (or SQLite for development)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DEV_DATABASE_URL=postgresql://username:password@localhost:5432/aca_student_hub_dev
   DATABASE_URL=postgresql://username:password@localhost:5432/aca_student_hub_prod

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@acastudenthub.com

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

   # Frontend URL (for password reset links)
   FRONTEND_URL=http://localhost:3001

   # Redis Configuration (for caching and sessions)
   REDIS_URL=redis://localhost:6379

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=5242880
   ```

4. **Database Setup**
   ```bash
   # For PostgreSQL
   createdb aca_student_hub_dev
   
   # Or for SQLite (automatic fallback in development)
   # No setup required
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Google OAuth

- `GET /api/v1/auth/google/url` - Get Google OAuth URL
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/google/token` - Google OAuth with ID token

### Users

- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (Admin only)
- `PUT /api/v1/users/:id/password` - Change password
- `PUT /api/v1/users/:id/profile` - Update profile

### Tracks

- `GET /api/v1/tracks` - Get all tracks
- `GET /api/v1/tracks/:id` - Get track by ID
- `POST /api/v1/tracks` - Create track
- `PUT /api/v1/tracks/:id` - Update track
- `DELETE /api/v1/tracks/:id` - Delete track

### Cohorts

- `GET /api/v1/cohorts` - Get all cohorts
- `GET /api/v1/cohorts/:id` - Get cohort by ID
- `POST /api/v1/cohorts` - Create cohort
- `PUT /api/v1/cohorts/:id` - Update cohort
- `DELETE /api/v1/cohorts/:id` - Delete cohort

### Scholarship Applications

- `GET /api/v1/scholarships` - Get all applications (Admin/Instructor)
- `GET /api/v1/scholarships/my-applications` - Get user's applications
- `GET /api/v1/scholarships/:id` - Get application by ID
- `POST /api/v1/scholarships` - Submit application
- `PUT /api/v1/scholarships/:id` - Update application
- `PUT /api/v1/scholarships/:id/review` - Review application (Admin/Instructor)
- `DELETE /api/v1/scholarships/:id` - Delete application
- `GET /api/v1/scholarships/status/:status` - Get applications by status

## Database Models

### User
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `roles` (Array of Strings)

### Profile
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `bio` (Text)
- `picture_url` (String)
- `track_id` (UUID, Foreign Key)

### Track
- `id` (UUID, Primary Key)
- `name` (String)
- `description` (String)

### Cohort
- `id` (UUID, Primary Key)
- `name` (String, Unique)
- `start_date` (Date)
- `end_date` (Date)

### ScholarshipApplication
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `track_id` (UUID, Foreign Key)
- `personal_statement` (Text)
- `academic_background` (Text)
- `financial_need` (Text)
- `career_goals` (Text)
- `resume_url` (String)
- `transcript_url` (String)
- `status` (Enum: pending, approved, rejected, under_review)
- `reviewer_notes` (Text)
- `reviewed_by` (UUID, Foreign Key)
- `reviewed_at` (Date)

## Error Handling

The API uses a centralized error handling system with the following error types:

- `400 Bad Request` - Invalid request data
- `401 Unauthenticated` - Missing or invalid authentication
- `403 Unauthorized` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server errors

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Input validation with Zod
- Role-based access control

## Development

### Running Tests
```bash
npm test
```

### Database Seeding
```bash
npm run db:seed
```

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

## Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secret
4. Configure SMTP settings
5. Set up Google OAuth credentials
6. Deploy to your preferred hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 