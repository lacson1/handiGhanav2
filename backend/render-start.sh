#!/bin/sh
set -eu
: "${DATABASE_URL:?Set DATABASE_URL in Render}"
: "${JWT_SECRET:?Set JWT_SECRET in Render}"
: "${SESSION_SECRET:?Set SESSION_SECRET in Render}"

# Opt-in bootstrap for the new empty Render/Neon database only.
# Never modify an existing database's schema automatically.
if [ "${INITIALIZE_EMPTY_DATABASE:-false}" = "true" ]; then
  node scripts/initialize-empty-database.cjs
fi
exec node dist/server.js
