@echo off
echo ========================================================
echo   CyberShield AI - GitHub Commit & Push Deployment Utility
echo ========================================================
echo.

set PATH=c:\Users\snayo\Downloads\coding\git-env\cmd;c:\Users\snayo\Downloads\coding\node-env;%PATH%

echo 1. Checking Git Status...
git status

echo.
echo 2. Adding all files to staging...
git add .

echo.
echo 3. Creating commit...
git commit -m "feat: complete CyberShield AI production update & live deployment readiness"

echo.
echo 4. Pushing to GitHub (snayonroy2018-bit/CyberShield-AI)...
git push -u origin main

echo.
echo ========================================================
echo   Push Complete! Project Updated on GitHub Successfully.
echo ========================================================
