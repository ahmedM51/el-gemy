@echo off
echo ========================================================
echo   El Gemy Barber Lounge - Local Setup & Start
echo ========================================================
echo.

echo [1/3] Installing dependencies...
call npm install --legacy-peer-deps

echo [2/3] Building production bundle...
call npm run build

echo [3/3] Starting development server on http://localhost:3000 ...
call npm run dev
