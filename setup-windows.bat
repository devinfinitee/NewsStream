@echo off
echo ========================================
echo Infinite News Stream - Windows Setup
echo ========================================
echo.

echo Step 1: Cleaning old files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
if exist dist rmdir /s /q dist
echo Done!
echo.

echo Step 2: Clearing npm cache...
call npm cache clean --force
echo Done!
echo.

echo Step 3: Installing dependencies...
echo This may take a few minutes...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo.
    echo Try these alternatives:
    echo 1. Install Bun: https://bun.sh
    echo    Then run: bun install
    echo.
    echo 2. Use pnpm:
    echo    Run: npm i -g pnpm
    echo    Then: pnpm install
    echo.
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Or double-click: start-dev.bat
echo.
pause
