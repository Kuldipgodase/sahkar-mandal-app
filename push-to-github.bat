@echo off
title GitHub Login and Push - Sahakar Mandal App
echo ========================================================
echo  GitHub Login ^& Push: Kuldipgodase
echo  Repository: https://github.com/Kuldipgodase/lokmanya-mandal-app.git
echo ========================================================
echo.

cd /d "%~dp0"

:: Configure git user
git config user.name "Kuldipgodase"

:: Point origin to the correct repository
git remote set-url origin https://github.com/Kuldipgodase/lokmanya-mandal-app.git

echo Step 1: Opening your browser to sign in to GitHub...
echo A browser window will open automatically right now.
echo Please click "Authorize" or sign in to account: Kuldipgodase
echo.

git credential-manager github login --browser --force --username Kuldipgodase

echo.
echo Step 2: Pushing code to GitHub...
echo.

git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo SUCCESS! Code pushed to GitHub successfully!
    echo Your Android APK build is now running in GitHub Actions.
    echo Visit: https://github.com/Kuldipgodase/lokmanya-mandal-app/actions
    echo ========================================================
) else (
    echo ========================================================
    echo Push was not completed.
    echo Make sure:
    echo 1. The repository 'lokmanya-mandal-app' is created on github.com
    echo 2. You authorized the sign-in in your browser
    echo ========================================================
)

echo.
pause
