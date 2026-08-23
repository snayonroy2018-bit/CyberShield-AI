@echo off
title CyberShield AI Shutdown
cls
echo ====================================================================
echo 🛡️  CyberShield AI - Stopping All Services
echo ====================================================================
echo.

taskkill /FI "WINDOWTITLE eq CyberShield AI Microservice (Port 8000)*" /F /T 2>nul
taskkill /FI "WINDOWTITLE eq CyberShield Backend (Port 5000)*" /F /T 2>nul
taskkill /FI "WINDOWTITLE eq CyberShield Frontend (Port 3000)*" /F /T 2>nul

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do taskkill /PID %%a /F 2>nul

echo.
echo ✅ CyberShield AI services have been stopped.
echo ====================================================================
ping 127.0.0.1 -n 3 >nul
