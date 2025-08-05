#!/bin/bash

echo "🚀 Starting ACA Student Hub API in development mode..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating example .env file..."
    cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production

# Database Configuration (using SQLite for development)
# DEV_DATABASE_URL=postgresql://username:password@localhost:5432/aca_student_hub_dev

# Email Configuration (optional for development)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM=noreply@acastudenthub.com

# Google OAuth Configuration (optional for development)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3001
EOF
    echo "✅ .env file created with default development settings"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting development server..."
npm run dev 