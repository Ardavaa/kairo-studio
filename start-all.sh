#!/bin/bash
# Kairo Studio - Start All Services
# Usage: ./start-all.sh [options]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Defaults
SKIP_CELERY=false
SKIP_FRONTEND=false
CLEAN_PORTS=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-celery)
            SKIP_CELERY=true
            shift
            ;;
        --skip-frontend)
            SKIP_FRONTEND=true
            shift
            ;;
        --no-clean)
            CLEAN_PORTS=false
            shift
            ;;
        --help|-h)
            cat << 'EOF'
Kairo Studio - Start All Services

Usage: ./start-all.sh [options]

Options:
  --skip-celery    Skip Celery worker
  --skip-frontend  Skip frontend
  --no-clean       Do not auto-free occupied ports (3000, 8000)
  --help           Show this help

Services:
  - Backend API (FastAPI on port 8000)
  - Celery Worker (background tasks)
  - Frontend (Next.js on port 3000)
EOF
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        🚀 Kairo Studio - Starting All Services${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

# Check Python (python3, python, or py)
PYTHON_BIN=""
if command -v python3 &> /dev/null; then
    PYTHON_BIN="python3"
elif command -v python &> /dev/null; then
    PYTHON_BIN="python"
elif command -v py &> /dev/null; then
    PYTHON_BIN="py"
else
    echo -e "${RED}❌ Python not found! Please install Python 3.9+${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found! Please install Node.js 18+${NC}"
    exit 1
fi

# Check uv
if ! command -v uv &> /dev/null; then
    echo -e "${YELLOW}⚠️ uv not found, installing via $PYTHON_BIN...${NC}"
    $PYTHON_BIN -m pip install uv
fi

# Clean up stale ports if enabled
if $CLEAN_PORTS && command -v npx &> /dev/null; then
    echo -e "${YELLOW}🧹 Clearing stale processes on ports 3000 & 8000...${NC}"
    npx --yes kill-port 3000 8000 >/dev/null 2>&1 || true
fi

# Check Redis
check_redis() {
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

if $SKIP_CELERY; then
    echo -e "${YELLOW}⚠️ Celery worker SKIPPED (--skip-celery)${NC}"
else
    if check_redis; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️ Redis not running - Celery will be skipped${NC}"
        SKIP_CELERY=true
    fi
fi

echo ""
echo -e "${BLUE}─────────────────────────────────────────────────${NC}"
echo -e "${BLUE}📦 Checking dependencies...${NC}"
echo -e "${BLUE}─────────────────────────────────────────────────${NC}"

# Install backend dependencies
if [ -f "$BACKEND_DIR/pyproject.toml" ]; then
    echo -e "${GREEN}📦 Checking backend dependencies...${NC}"
    cd "$BACKEND_DIR"
    uv sync --frozen 2>/dev/null || uv sync
fi

# Install frontend dependencies
if [ ! -d "$FRONTEND_DIR/node_modules" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
    echo -e "${GREEN}📦 Installing frontend dependencies...${NC}"
    cd "$FRONTEND_DIR"
    npm install
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                 🏃 Starting Services${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""

IS_WINDOWS=false
case "$(uname -s 2>/dev/null)" in
    *MINGW*|*MSYS*|*CYGWIN*) IS_WINDOWS=true ;;
esac

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    if [ "$IS_WINDOWS" = true ]; then
        if [ ! -z "$BACKEND_PID" ]; then taskkill //F //T //PID $BACKEND_PID 2>/dev/null || kill -9 $BACKEND_PID 2>/dev/null || true; fi
        if [ ! -z "$CELERY_PID" ]; then taskkill //F //T //PID $CELERY_PID 2>/dev/null || kill -9 $CELERY_PID 2>/dev/null || true; fi
        if [ ! -z "$FRONTEND_PID" ]; then taskkill //F //T //PID $FRONTEND_PID 2>/dev/null || kill -9 $FRONTEND_PID 2>/dev/null || true; fi
        npx --yes kill-port 3000 8000 2>/dev/null || true
    else
        if [ ! -z "$BACKEND_PID" ]; then kill $BACKEND_PID 2>/dev/null || true; fi
        if [ ! -z "$CELERY_PID" ]; then kill $CELERY_PID 2>/dev/null || true; fi
        if [ ! -z "$FRONTEND_PID" ]; then kill $FRONTEND_PID 2>/dev/null || true; fi
    fi
    echo -e "${GREEN}✅ All services stopped${NC}"
}

trap cleanup EXIT INT TERM

# Start Backend API
echo -e "${GREEN}🔥 Starting Backend API (http://localhost:8000)${NC}"
echo -e "${GREEN}   API Docs: http://localhost:8000/docs${NC}"
cd "$BACKEND_DIR"
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

sleep 2

# Start Celery Worker
if ! $SKIP_CELERY; then
    echo ""
    echo -e "${GREEN}⚡ Starting Celery Worker${NC}"
    cd "$BACKEND_DIR"
    uv run celery -A app.core.celery_app worker --loglevel=info &
    CELERY_PID=$!
fi

# Start Frontend
if ! $SKIP_FRONTEND; then
    echo ""
    echo -e "${GREEN}🎨 Starting Frontend (http://localhost:3000)${NC}"
    cd "$FRONTEND_DIR"
    npm run dev &
    FRONTEND_PID=$!
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BLUE}              ✅ All Services Running!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}  Backend API:  ${NC}http://localhost:8000"
echo -e "${GREEN}  API Docs:     ${NC}http://localhost:8000/docs"
if ! $SKIP_CELERY; then
echo -e "${GREEN}  Celery:       ${NC}Running (background tasks)"
fi
if ! $SKIP_FRONTEND; then
echo -e "${GREEN}  Frontend:     ${NC}http://localhost:3000"
fi
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

wait
