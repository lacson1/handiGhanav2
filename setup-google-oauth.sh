#!/bin/bash

# HandiGhana - Google OAuth Setup Helper
# This script helps you configure Google OAuth credentials

echo "🔐 HandiGhana - Google OAuth Setup Helper"
echo "=========================================="
echo ""

# Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please create backend/.env first"
    exit 1
fi

echo "📋 Please have your Google OAuth credentials ready"
echo "If you don't have them yet, follow the guide at:"
echo "https://console.cloud.google.com/"
echo ""
echo "You'll need:"
echo "  1. Google Client ID (ends with .apps.googleusercontent.com)"
echo "  2. Google Client Secret (starts with GOCSPX-)"
echo ""

# Ask for Google Client ID
read -p "Enter your Google Client ID: " CLIENT_ID
if [ -z "$CLIENT_ID" ]; then
    echo "❌ Client ID cannot be empty"
    exit 1
fi

# Ask for Google Client Secret
read -p "Enter your Google Client Secret: " CLIENT_SECRET
if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Client Secret cannot be empty"
    exit 1
fi

# Generate Session Secret
echo ""
echo "🔑 Generating session secret..."
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated: ${SESSION_SECRET:0:20}..."

# Backup existing .env
echo ""
echo "💾 Creating backup of backend/.env..."
cp backend/.env "backend/.env.backup.$(date +%Y%m%d_%H%M%S)"

# Check if Google OAuth variables already exist
if grep -q "GOOGLE_CLIENT_ID=" backend/.env; then
    echo "⚠️  Google OAuth variables already exist in .env"
    read -p "Do you want to update them? (y/n): " UPDATE
    if [ "$UPDATE" != "y" ]; then
        echo "Cancelled."
        exit 0
    fi
    
    # Update existing variables
    sed -i.tmp "s|GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$CLIENT_ID|g" backend/.env
    sed -i.tmp "s|GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$CLIENT_SECRET|g" backend/.env
    sed -i.tmp "s|SESSION_SECRET=.*|SESSION_SECRET=$SESSION_SECRET|g" backend/.env
    rm backend/.env.tmp 2>/dev/null
else
    # Append new variables
    echo "" >> backend/.env
    echo "# Google OAuth Configuration" >> backend/.env
    echo "GOOGLE_CLIENT_ID=$CLIENT_ID" >> backend/.env
    echo "GOOGLE_CLIENT_SECRET=$CLIENT_SECRET" >> backend/.env
    echo "GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback" >> backend/.env
    echo "" >> backend/.env
    echo "# Session Configuration" >> backend/.env
    echo "SESSION_SECRET=$SESSION_SECRET" >> backend/.env
    echo "" >> backend/.env
    echo "# Frontend URL" >> backend/.env
    echo "FRONTEND_URL=http://localhost:5173" >> backend/.env
fi

echo ""
echo "✅ Google OAuth credentials configured!"
echo ""
echo "📝 Next steps:"
echo "  1. Make sure you've added these redirect URIs in Google Cloud Console:"
echo "     - http://localhost:3001/api/auth/google/callback"
echo ""
echo "  2. Restart your backend server:"
echo "     cd backend && npm run dev"
echo ""
echo "  3. Test by visiting: http://localhost:5173/signin"
echo "     and clicking 'Continue with Google'"
echo ""
echo "✨ Setup complete! Check SETUP_GOOGLE_LOGIN.md for detailed instructions."

