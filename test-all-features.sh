#!/bin/bash

echo "🧪 HandiGhana Feature Testing Script"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is running
echo "Checking backend..."
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:3001${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    echo "   Start it with: cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo "Checking frontend..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running on http://localhost:5173${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is not running${NC}"
    echo "   Start it with: cd frontend && npm run dev"
fi

# Check database migration
echo ""
echo "Checking database migration..."
cd backend
if npx prisma migrate status 2>&1 | grep -q "Database schema is up to date"; then
    echo -e "${GREEN}✅ Database migrations are up to date${NC}"
else
    echo -e "${YELLOW}⚠️  Database migrations may be pending${NC}"
    echo "   Run: npx prisma migrate dev --name add_chat_and_availability"
fi

cd ..

echo ""
echo "===================================="
echo -e "${GREEN}✅ Ready to test!${NC}"
echo ""
echo "Open your browser: http://localhost:5173"
echo ""
echo "Test these features:"
echo "  1. Review snippets on provider cards"
echo "  2. Calendar in booking modal"
echo "  3. Chat button on provider profiles"
echo "  4. Analytics dashboard"
echo ""
echo "See COMPREHENSIVE_TESTING_GUIDE.md for detailed instructions"

