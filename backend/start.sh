#!/bin/sh
set -e

echo "🚀 Starting HandyGhana Backend..."

# Apply the database schema. `migrate deploy` exits successfully and does
# nothing when there are no migration files, so only use it once they exist;
# until then sync the schema with `db push`, which refuses destructive changes.
if [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "📊 Running database migrations..."
  npx prisma migrate deploy
else
  echo "📊 Syncing database schema..."
  npx prisma db push --skip-generate
fi

# Start the server
echo "✅ Starting server..."
exec node dist/server.js

