#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "========================================================"
echo "🍕 BakeItBaby — Starting Local Development Environment"
echo "========================================================"

# 1. Start PostgreSQL container on port 5435
echo "▶ Starting PostgreSQL container on port 5435..."
docker compose -f "${ROOT_DIR}/compose.yaml" up -d database

echo "▶ Waiting for database to become ready..."
until pg_isready -h 127.0.0.1 -p 5435 -U bakeitbaby > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Database is ready on 127.0.0.1:5435."

# 2. Run migrations and seed data
echo "▶ Ensuring database migrations and seed data are applied..."
(
    cd "${ROOT_DIR}/apps/api"
    php bin/console doctrine:migrations:migrate --no-interaction
    php bin/console app:seed:flours
    php bin/console app:seed:recipes
)

echo ""
echo "🚀 Services starting:"
echo "   - Backend API: http://127.0.0.1:8001/api/health"
echo "   - Frontend Web: http://localhost:3005"
echo ""

# Start backend in background and frontend in foreground
(
    cd "${ROOT_DIR}/apps/api"
    php -S 127.0.0.1:8001 -t public
) &
API_PID=$!

trap "echo 'Shutting down API...'; kill $API_PID" EXIT INT TERM

(
    cd "${ROOT_DIR}/apps/web"
    npm run dev
)
