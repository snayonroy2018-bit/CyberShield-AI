@echo off
title CyberShield AI Launcher
cls
echo ====================================================================
echo 🛡️  CyberShield AI - Starting System Services
echo ====================================================================
echo.

:: Set environment PATH to include node-env for node & npm execution
set "PATH=%~dp0node-env;%PATH%"

echo [1/3] Launching Python AI Engine (Port 8000)...
start "CyberShield AI Microservice (Port 8000)" /min cmd /k "cd /d "%~dp0" && python python-ai/app.py"

echo [2/3] Launching Backend Server (Port 5000)...
start "CyberShield Backend (Port 5000)" /min cmd /k "cd /d "%~dp0server" && node index.js"

echo [3/3] Launching Frontend Client (Port 3000)...
start "CyberShield Frontend (Port 3000)" /min cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ====================================================================
echo ✅ All CyberShield AI services launched successfully!
echo 🌐 Opening http://localhost:3000 in your browser...
echo ====================================================================
echo.

ping 127.0.0.1 -n 3 >nul
start http://localhost:3000

echo (You can close this window now. Use stop_app.bat whenever you want to close the app.)
