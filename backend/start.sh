#!/bin/sh
set -e

echo "🚀 Starting HandyGhana Backend..."

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

# Start the server
echo "✅ Starting server..."
exec node dist/server.js

