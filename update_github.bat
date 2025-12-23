@echo off
chcp 65001 >nul
echo ========================================
echo Updating and pushing to GitHub...
echo ========================================
echo.

REM Check if there are changes
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo Checking for changes...
    git add .
    
    REM Check if there are staged changes
    git diff --cached --quiet
    if %errorlevel% neq 0 (
        echo Creating commit...
        git commit -m "Update: Text RPG Game - %date% %time%"
    ) else (
        echo No changes to commit.
    )
) else (
    echo No changes detected.
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Push failed! Possible reasons:
    echo 1. GitHub authentication not set up
    echo 2. Need to enter username and password
    echo.
    echo Solutions:
    echo 1. Use GitHub Desktop (recommended)
    echo 2. Set up SSH key
    echo 3. Use Personal Access Token
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo Successfully pushed to GitHub!
echo ========================================
echo.
echo Your game is available at:
echo https://YXChen0323.github.io/AnRPG
echo.
pause

