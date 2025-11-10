#!/bin/bash

# HandiGhana - Google OAuth Status Checker
# This script checks if Google OAuth is configured correctly

echo "🔍 Checking Google OAuth Configuration..."
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found"
    echo "   Create the file first"
    exit 1
fi

# Load environment variables
source backend/.env 2>/dev/null || true

# Check GOOGLE_CLIENT_ID
echo "1. Checking GOOGLE_CLIENT_ID..."
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "   ❌ Not configured"
else
    echo "   ✅ Configured: ${GOOGLE_CLIENT_ID:0:20}..."
fi

# Check GOOGLE_CLIENT_SECRET
echo ""
echo "2. Checking GOOGLE_CLIENT_SECRET..."
if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "   ❌ Not configured"
else
    echo "   ✅ Configured: ${GOOGLE_CLIENT_SECRET:0:15}..."
fi

# Check GOOGLE_CALLBACK_URL
echo ""
echo "3. Checking GOOGLE_CALLBACK_URL..."
if [ -z "$GOOGLE_CALLBACK_URL" ]; then
    echo "   ⚠️  Not set (will use default)"
    echo "   Default: http://localhost:3001/api/auth/google/callback"
else
    echo "   ✅ Configured: $GOOGLE_CALLBACK_URL"
fi

# Check SESSION_SECRET
echo ""
echo "4. Checking SESSION_SECRET..."
if [ -z "$SESSION_SECRET" ]; then
    echo "   ❌ Not configured"
else
    echo "   ✅ Configured: ${SESSION_SECRET:0:20}..."
fi

# Check FRONTEND_URL
echo ""
echo "5. Checking FRONTEND_URL..."
if [ -z "$FRONTEND_URL" ]; then
    echo "   ⚠️  Not set (will use default)"
    echo "   Default: http://localhost:5173"
else
    echo "   ✅ Configured: $FRONTEND_URL"
fi

# Check if backend is running
echo ""
echo "6. Checking backend server..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   ✅ Backend server is running on port 3001"
    
    # Check if Google OAuth is initialized
    echo ""
    echo "7. Checking OAuth initialization..."
    if [ -f "backend/backend.log" ]; then
        if grep -q "✓ Google OAuth configured" backend/backend.log; then
            echo "   ✅ Google OAuth is initialized"
        elif grep -q "⚠ Google OAuth not configured" backend/backend.log; then
            echo "   ❌ Google OAuth not initialized"
            echo "   Check backend logs for details"
        fi
    fi
else
    echo "   ❌ Backend server is not running"
    echo "   Start it with: cd backend && npm run dev"
fi

# Check if frontend is running
echo ""
echo "8. Checking frontend server..."
if lsof -i :5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend server is running on port 5173"
else
    echo "   ❌ Frontend server is not running"
    echo "   Start it with: cd frontend && npm run dev"
fi

# Final summary
echo ""
echo "=========================================="
if [ -n "$GOOGLE_CLIENT_ID" ] && [ -n "$GOOGLE_CLIENT_SECRET" ] && [ -n "$SESSION_SECRET" ]; then
    echo "✅ Configuration Complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Make sure backend is running: cd backend && npm run dev"
    echo "  2. Visit: http://localhost:5173/signin"
    echo "  3. Click 'Continue with Google' to test"
    echo ""
    echo "📖 For detailed setup guide, see: SETUP_GOOGLE_LOGIN.md"
else
    echo "⚠️  Configuration Incomplete"
    echo ""
    echo "To configure Google OAuth, run:"
    echo "  ./setup-google-oauth.sh"
    echo ""
    echo "Or manually add these variables to backend/.env:"
    echo "  - GOOGLE_CLIENT_ID"
    echo "  - GOOGLE_CLIENT_SECRET"
    echo "  - SESSION_SECRET"
    echo "  - GOOGLE_CALLBACK_URL"
    echo "  - FRONTEND_URL"
    echo ""
    echo "📖 For detailed instructions, see: SETUP_GOOGLE_LOGIN.md"
fi

