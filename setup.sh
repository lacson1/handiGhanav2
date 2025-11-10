#!/bin/bash

echo "🚀 Setting up HandyGhana v2..."

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your PostgreSQL connection string"
echo "2. Start PostgreSQL (or run: docker-compose up -d)"
echo "3. Run database migrations: cd backend && npm run prisma:migrate"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "Happy coding! 🎉"

