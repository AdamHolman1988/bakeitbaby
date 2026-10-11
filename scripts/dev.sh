#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "========================================================"
echo "🍕 BakeItBaby — Spouštění vývojového prostředí"
echo "========================================================"

# 1. Start PostgreSQL container on port 5435
echo "▶ [1/4] Spouštím PostgreSQL kontejner (port 5435)..."
docker compose -f "${ROOT_DIR}/compose.yaml" up -d database

echo "▶ Čekám na připravenost databáze..."
until pg_isready -h 127.0.0.1 -p 5435 -U bakeitbaby > /dev/null 2>&1; do
    sleep 1
done
echo "✅ Databáze běží na 127.0.0.1:5435."

# 2. Run migrations and seed data
echo "▶ [2/4] Kontrola migrací a výchozích dat (mouky & recepty)..."
(
    cd "${ROOT_DIR}/apps/api"
    php bin/console doctrine:migrations:migrate --no-interaction > /dev/null 2>&1 || true
    php bin/console app:seed:flours > /dev/null 2>&1 || true
    php bin/console app:seed:recipes > /dev/null 2>&1 || true
)
echo "✅ Databáze je aktuální."

# 3. Start Backend API
echo "▶ [3/4] Spouštím Symfony API na http://127.0.0.1:8001..."
# Kill any leftover PHP server on 8001
fuser -k 8001/tcp > /dev/null 2>&1 || true

(
    cd "${ROOT_DIR}/apps/api"
    php -S 127.0.0.1:8001 -t public
) > /dev/null 2>&1 &
API_PID=$!

cleanup() {
    echo ""
    echo "🛑 Ukončuji procesy BakeItBaby..."
    kill $API_PID > /dev/null 2>&1 || true
    fuser -k 8001/tcp > /dev/null 2>&1 || true
    fuser -k 3005/tcp > /dev/null 2>&1 || true
    echo "👋 Vše čistě ukončeno."
    exit 0
}

trap cleanup EXIT INT TERM

# 4. Background browser opener
open_browser() {
    echo "▶ Čekám na spuštění webu na http://localhost:3005..."
    for i in {1..30}; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3005 2>/dev/null | grep -q "200\|304\|307"; then
            echo "🌐 Web je připraven! Otevírám Firefox..."
            export DISPLAY="${DISPLAY:-:0.0}"
            if command -v firefox > /dev/null 2>&1; then
                firefox http://localhost:3005 > /dev/null 2>&1 &
            else
                xdg-open http://localhost:3005 > /dev/null 2>&1 &
            fi
            return 0
        fi
        sleep 1
    done
    echo "⚠️  Web neodpověděl v limitu, zkuste otevřít http://localhost:3005 ručně."
}

open_browser &

# 5. Start Frontend Web (Turbopack)
echo "▶ [4/4] Spouštím Next.js web (Turbopack) na http://localhost:3005..."
echo "========================================================"
echo "🚀 Aplikace běží:"
echo "   - Web: http://localhost:3005"
echo "   - API: http://127.0.0.1:8001/api/health"
echo "   (Pro ukončení stiskněte Ctrl+C)"
echo "========================================================"

cd "${ROOT_DIR}/apps/web"
npm run dev
