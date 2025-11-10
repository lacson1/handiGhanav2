#!/bin/bash

# HandiGhana Production Deployment Script
# This script deploys both frontend and backend

set -e  # Exit on error

echo "🚀 ============================================"
echo "   HandiGhana Production Deployment"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root${NC}"
    exit 1
fi

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}📋 Step 1: Checking Prerequisites${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Fly.io CLI
if command_exists flyctl; then
    echo -e "${GREEN}✅ Fly.io CLI installed${NC}"
else
    echo -e "${RED}❌ Fly.io CLI not found${NC}"
    echo "Install with: curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check/Install Vercel CLI
if command_exists vercel; then
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    if sudo npm install -g vercel; then
        echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    else
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        echo "Please install manually:"
        echo "  sudo npm install -g vercel"
        echo ""
        echo "Or install without sudo (user-local):"
        echo "  npm install -g vercel --prefix ~/.local"
        echo "  export PATH=~/.local/bin:\$PATH"
        exit 1
    fi
fi

# Check if logged in to Fly.io
if ! flyctl auth whoami &>/dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Fly.io${NC}"
    echo "Logging in..."
    flyctl auth login
fi

echo ""
echo -e "${BLUE}🎯 Deployment Options${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1) Deploy Backend Only (Fly.io)"
echo "2) Deploy Frontend Only (Vercel)"
echo "3) Deploy Both (Recommended)"
echo "4) Exit"
echo ""
read -p "Choose an option (1-4): " choice

case $choice in
    1)
        DEPLOY_BACKEND=true
        DEPLOY_FRONTEND=false
        ;;
    2)
        DEPLOY_BACKEND=false
        DEPLOY_FRONTEND=true
        ;;
    3)
        DEPLOY_BACKEND=true
        DEPLOY_FRONTEND=true
        ;;
    4)
        echo "Deployment cancelled"
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

# ==========================================
# BACKEND DEPLOYMENT
# ==========================================

if [ "$DEPLOY_BACKEND" = true ]; then
    echo ""
    echo -e "${BLUE}🚀 Step 2: Deploying Backend to Fly.io${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd backend
    
    # Build TypeScript
    echo "📦 Building backend..."
    npm run build
    
    # Deploy to Fly.io
    echo "🚀 Deploying to Fly.io..."
    flyctl deploy
    
    BACKEND_URL=$(flyctl info --json | grep -o '"Hostname":"[^"]*"' | cut -d'"' -f4)
    if [ -z "$BACKEND_URL" ]; then
        BACKEND_URL="handighana-backend.fly.dev"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo -e "${GREEN}   URL: https://${BACKEND_URL}${NC}"
    echo ""
    
    # Check if secrets are set
    echo -e "${YELLOW}⚠️  Important: Make sure these secrets are set:${NC}"
    echo ""
    flyctl secrets list
    echo ""
    read -p "Do you need to set/update secrets? (y/n): " update_secrets
    
    if [ "$update_secrets" = "y" ]; then
        echo ""
        echo "Set secrets with:"
        echo "  flyctl secrets set DATABASE_URL='your-database-url'"
        echo "  flyctl secrets set JWT_SECRET='\$(openssl rand -base64 32)'"
        echo "  flyctl secrets set SESSION_SECRET='\$(openssl rand -hex 32)'"
        echo "  flyctl secrets set FRONTEND_URL='https://your-frontend-url'"
        echo ""
        read -p "Press Enter when secrets are set..."
    fi
    
    # Run migrations
    read -p "Run database migrations? (y/n): " run_migrations
    if [ "$run_migrations" = "y" ]; then
        echo "📊 Running migrations..."
        flyctl ssh console -C "npx prisma migrate deploy"
    fi
    
    # Health check
    echo "🏥 Health check..."
    sleep 3
    if curl -s "https://${BACKEND_URL}/health" | grep -q "ok"; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
    else
        echo -e "${RED}⚠️  Backend health check failed${NC}"
        echo "Check logs with: flyctl logs"
    fi
    
    cd ..
fi

# ==========================================
# FRONTEND DEPLOYMENT
# ==========================================

if [ "$DEPLOY_FRONTEND" = true ]; then
    echo ""
    echo -e "${BLUE}🌐 Step 3: Deploying Frontend to Vercel${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    cd frontend
    
    # Check if VITE_API_URL needs to be set
    echo ""
    if [ "$DEPLOY_BACKEND" = true ]; then
        echo -e "${YELLOW}📝 Backend URL: https://${BACKEND_URL}/api${NC}"
        API_URL="https://${BACKEND_URL}/api"
    else
        read -p "Enter your backend API URL (e.g., https://handighana-backend.fly.dev/api): " API_URL
    fi
    
    # Set environment variable for Vercel
    echo "Setting VITE_API_URL environment variable..."
    vercel env add VITE_API_URL production <<EOF
${API_URL}
EOF
    
    # Deploy to Vercel
    echo ""
    echo "🚀 Deploying to Vercel..."
    echo "   (This may open a browser for authentication)"
    vercel --prod
    
    echo ""
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    
    # Get Vercel URL
    FRONTEND_URL=$(vercel inspect --wait | grep -o 'https://[^[:space:]]*' | head -1)
    if [ -z "$FRONTEND_URL" ]; then
        echo "   Check your Vercel dashboard for the URL"
    else
        echo -e "${GREEN}   URL: ${FRONTEND_URL}${NC}"
    fi
    
    cd ..
    
    # Update backend CORS if backend was deployed
    if [ "$DEPLOY_BACKEND" = true ] && [ -n "$FRONTEND_URL" ]; then
        echo ""
        echo -e "${YELLOW}📝 Updating backend CORS settings...${NC}"
        cd backend
        flyctl secrets set FRONTEND_URL="${FRONTEND_URL}"
        flyctl apps restart handighana-backend
        cd ..
    fi
fi

# ==========================================
# SUMMARY
# ==========================================

echo ""
echo -e "${GREEN}🎉 ============================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

if [ "$DEPLOY_BACKEND" = true ]; then
    echo -e "${BLUE}📊 Backend:${NC}"
    echo "   URL: https://${BACKEND_URL}"
    echo "   API: https://${BACKEND_URL}/api"
    echo "   Health: https://${BACKEND_URL}/health"
    echo "   Logs: flyctl logs -a handighana-backend"
    echo ""
fi

if [ "$DEPLOY_FRONTEND" = true ]; then
    echo -e "${BLUE}🌐 Frontend:${NC}"
    if [ -n "$FRONTEND_URL" ]; then
        echo "   URL: ${FRONTEND_URL}"
    else
        echo "   Check Vercel dashboard for URL"
    fi
    echo "   Dashboard: https://vercel.com/dashboard"
    echo ""
fi

echo -e "${BLUE}📚 Next Steps:${NC}"
echo "   1. Test the app in production"
echo "   2. Set up custom domain (optional)"
echo "   3. Monitor logs for any issues"
echo "   4. Set up monitoring/analytics"
echo ""

echo -e "${BLUE}🛠️  Useful Commands:${NC}"
echo "   Backend logs:  flyctl logs -a handighana-backend"
echo "   Backend SSH:   flyctl ssh console -a handighana-backend"
echo "   Backend restart: flyctl apps restart handighana-backend"
echo "   Frontend logs: vercel logs"
echo "   Frontend redeploy: cd frontend && vercel --prod"
echo ""

echo -e "${GREEN}✨ Your app is now live! 🚀${NC}"
