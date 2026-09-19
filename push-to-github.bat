@echo off
title GitHub Login and Push - Sahakar Mandal App
echo ========================================================
echo  GitHub Login ^& Push: Kuldipgodase
echo  Repository: https://github.com/Kuldipgodase/sahkar-mandal-app.git
echo ========================================================
echo.

cd /d "%~dp0"

:: Configure git user
git config user.name "Kuldipgodase"

:: Point origin to the correct repository
git remote set-url origin https://github.com/Kuldipgodase/sahkar-mandal-app.git

echo Step 1: Checking and staging changes...
git add -A
git commit -m "Update Sahakar Mandal App code and branding" 2>nul

echo.
echo Step 2: Pushing code to GitHub...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS! Code pushed to GitHub successfully!
    echo Your Android APK build is now running in GitHub Actions.
    echo Visit: https://github.com/Kuldipgodase/sahkar-mandal-app/actions
    echo ========================================================
) else (
    echo ========================================================
    echo If authentication is needed, opening sign in...
    git credential-manager github login --browser --force --username Kuldipgodase
    git push -u origin main
    echo ========================================================
)

echo.
pause
