@echo off
chcp 65001 >nul
color 0B
title Kairo Studio - Starting All Services

echo.
echo ═══════════════════════════════════════════════════════
echo        🚀 Kairo Studio - Starting All Services
echo ═══════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python 3.9+
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

REM Check uv
where uv >nul 2>&1
if errorlevel 1 (
    echo ⚠️ uv not found, installing...
    pip install uv
)

echo.
echo ───────────────────────────────────────────────────────
echo 📦 Checking dependencies...
echo ───────────────────────────────────────────────────────

REM Install backend dependencies
cd backend
echo 📦 Installing backend dependencies...
uv sync --frozen 2>nul || uv sync
cd ..

REM Install frontend dependencies
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ═══════════════════════════════════════════════════════
echo                 🏃 Starting Services
echo ═══════════════════════════════════════════════════════
echo.

REM Start Backend API
echo 🔥 Starting Backend API ^(http://localhost:8000^)
echo    API Docs: http://localhost:8000/docs
start "Kairo Studio - Backend" cmd /k "cd /d %~dp0backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

REM Start Frontend
echo.
echo 🎨 Starting Frontend ^(http://localhost:3000^)
start "Kairo Studio - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ═══════════════════════════════════════════════════════
echo              ✅ All Services Starting!
echo ═══════════════════════════════════════════════════════
echo.
echo   Backend API:  http://localhost:8000
echo   API Docs:    http://localhost:8000/docs
echo   Frontend:    http://localhost:3000
echo.
echo ⚠️  Note: Celery skipped ^(Redis not available^)
echo.
echo Press any key to exit...
pause >nul
