@echo off
echo 🍎 Food Inventory - Quick Start
echo ══════════════════════════════════
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Installing...
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js found: %NODE_VERSION%

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

echo.
echo 🚀 Starting server...
echo.
call npm start
pause
