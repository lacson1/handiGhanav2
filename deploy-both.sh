#!/bin/bash

# Deploy both Frontend and Backend
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploying HandyGhana (Backend + Frontend)${NC}"
echo "=========================================="
echo ""

# Step 1: Deploy Backend
echo -e "${YELLOW}Step 1/2: Deploying Backend to Fly.io...${NC}"
cd backend

echo "Deploying backend..."
fly deploy

echo ""
echo -e "${GREEN}✅ Backend deployed!${NC}"
echo "Backend URL: https://handighana-backend.fly.dev"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Set these secrets after deployment:${NC}"
echo "  fly secrets set DATABASE_URL='your-database-url'"
echo "  fly secrets set JWT_SECRET='$(openssl rand -base64 32)'"
echo "  fly secrets set FRONTEND_URL='https://your-app.vercel.app'"
echo "  fly secrets set NODE_ENV='production'"
echo "  fly secrets set SESSION_SECRET='$(openssl rand -hex 32)'"
echo "  fly secrets set GOOGLE_CLIENT_ID='your-google-client-id'"
echo "  fly secrets set GOOGLE_CLIENT_SECRET='your-google-client-secret'"
echo "  fly secrets set GOOGLE_CALLBACK_URL='https://handighana-backend.fly.dev/api/auth/google/callback'"
echo ""

# Wait for backend to stabilize
echo "⏳ Waiting 10 seconds for backend to stabilize..."
sleep 10

# Step 2: Deploy Frontend
echo ""
echo -e "${YELLOW}Step 2/2: Deploying Frontend to Vercel...${NC}"
cd ../frontend

echo "Deploying frontend..."
vercel --prod

echo ""
echo -e "${GREEN}✅ Frontend deployed!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Set environment variable in Vercel:${NC}"
echo "  VITE_API_URL = https://handighana-backend.fly.dev/api"
echo ""
echo "You can set it via:"
echo "  vercel env add VITE_API_URL production"
echo "  (Enter: https://handighana-backend.fly.dev/api)"
echo "  vercel --prod"
echo ""

echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Set backend secrets (see above)"
echo "2. Set VITE_API_URL in Vercel"
echo "3. Update FRONTEND_URL in Fly.io with your Vercel URL"
echo "4. Run database migrations: fly ssh console -C 'npx prisma migrate deploy'"
echo "5. Test your deployment!"

