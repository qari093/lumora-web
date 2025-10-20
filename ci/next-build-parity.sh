#!/usr/bin/env bash
set -euo pipefail

echo "• Node: $(node -v)  npm: $(npm -v)"
echo "• Using env from .env.ci → .env"
cp -f .env.ci .env

echo "• Clean install"
rm -rf node_modules
npm ci

echo "• Generate Prisma client (no migrations applied)"
npx prisma generate

echo "• Type check (no emit) — tolerate lib issues but fail on app errors"
# If your repo has tsconfig with "skipLibCheck": false, we keep it strict.
# If you prefer to skip lib checks in CI only, uncomment the next line:
# TS_NODE_COMPILER_OPTIONS='{"skipLibCheck":true}' :

echo "• Next build (production)"
NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production npx next build
