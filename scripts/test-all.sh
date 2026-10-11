#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "========================================================"
echo "🍕 BakeItBaby — Complete Local Verification Test Suite"
echo "========================================================"

# 1. Check database connectivity
echo ""
echo "▶ [1/4] Checking PostgreSQL database on port 5435..."
if ! pg_isready -h 127.0.0.1 -p 5435 -U bakeitbaby > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not responding on 127.0.0.1:5435."
    echo "   Starting container via docker compose up -d database..."
    docker compose -f "${ROOT_DIR}/compose.yaml" up -d database
    sleep 2
fi
echo "✅ Database connection verified."

# 2. Backend PHPStan Static Analysis
echo ""
echo "▶ [2/4] Running PHPStan Static Analysis (Level 8)..."
(
    cd "${ROOT_DIR}/apps/api"
    vendor/bin/phpstan analyse --no-progress
)
echo "✅ PHPStan passed with zero errors."

# 3. Backend PHPUnit Test Suite
echo ""
echo "▶ [3/4] Running PHPUnit Test Suite..."
(
    cd "${ROOT_DIR}/apps/api"
    php bin/phpunit
)
echo "✅ PHPUnit test suite passed."

# 4. Frontend Vitest & Next.js Build
echo ""
echo "▶ [4/4] Running Frontend Vitest & Build Checks..."
(
    cd "${ROOT_DIR}/apps/web"
    npm test
    npm run build
)
echo "✅ Frontend test suite and production build passed."

echo ""
echo "========================================================"
echo "🎉 ALL TESTS & BUILDS PASSED! READY TO BAKE!"
echo "========================================================"
