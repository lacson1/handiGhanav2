#!/bin/bash

# Handighana Deployment Script
# This script helps deploy frontend to Vercel and backend to Fly.io

set -e

echo "🚀 Handighana Deployment Assistant"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists vercel; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "   Install with: npm install -g vercel"
    exit 1
else
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
fi

if ! command_exists fly; then
    echo -e "${RED}❌ Fly.io CLI not found${NC}"
    echo "   Install with: curl -L https://fly.io/install.sh | sh"
    exit 1
else
    echo -e "${GREEN}✓ Fly.io CLI installed${NC}"
fi

echo ""
echo "What would you like to deploy?"
echo "1) Backend only (Fly.io)"
echo "2) Frontend only (Vercel)"
echo "3) Both (Backend first, then Frontend)"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔧 Deploying Backend to Fly.io..."
        echo "=================================="
        cd backend
        
        echo "Checking Fly.io authentication..."
        if ! fly auth whoami >/dev/null 2>&1; then
            echo -e "${YELLOW}Not logged in to Fly.io. Please login:${NC}"
            fly auth login
        fi
        
        echo ""
        echo "Starting deployment..."
        fly deploy
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
        echo ""
        echo "Backend URL: https://handighana-backend.fly.dev"
        echo "Health Check: https://handighana-backend.fly.dev/health"
        echo ""
        echo "View logs with: fly logs"
        ;;
        
    2)
        echo ""
        echo "🎨 Deploying Frontend to Vercel..."
        echo "=================================="
        cd frontend
        
        echo "Checking Vercel authentication..."
        if ! vercel whoami >/dev/null 2>&1; then
            echo -e "${YELLOW}Not logged in to Vercel. Please login:${NC}"
            vercel login
        fi
        
        echo ""
        echo "Building and deploying..."
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
        echo ""
        echo "Your app is live! Check the URL provided above."
        ;;
        
    3)
        echo ""
        echo "🚀 Deploying Both (Backend → Frontend)"
        echo "======================================="
        
        # Deploy Backend
        echo ""
        echo "Step 1/2: Deploying Backend..."
        cd backend
        
        if ! fly auth whoami >/dev/null 2>&1; then
            echo -e "${YELLOW}Not logged in to Fly.io. Please login:${NC}"
            fly auth login
        fi
        
        fly deploy
        BACKEND_URL="https://handighana-backend.fly.dev"
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo "Backend URL: $BACKEND_URL"
        
        # Wait a bit for backend to stabilize
        echo ""
        echo "⏳ Waiting 10 seconds for backend to stabilize..."
        sleep 10
        
        # Deploy Frontend
        echo ""
        echo "Step 2/2: Deploying Frontend..."
        cd ../frontend
        
        if ! vercel whoami >/dev/null 2>&1; then
            echo -e "${YELLOW}Not logged in to Vercel. Please login:${NC}"
            vercel login
        fi
        
        vercel --prod
        
        echo ""
        echo -e "${GREEN}🎉 Full deployment complete!${NC}"
        echo ""
        echo "Backend: $BACKEND_URL"
        echo "Frontend: Check Vercel output above"
        echo ""
        echo "⚠️  Don't forget to:"
        echo "1. Update VITE_API_URL in Vercel dashboard to $BACKEND_URL/api"
        echo "2. Update FRONTEND_URL in Fly.io secrets"
        ;;
        
    4)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo "📚 For more details, see DEPLOYMENT_GUIDE.md"
echo ""

