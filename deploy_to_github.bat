@echo off
chcp 65001 >nul
echo ========================================
echo 正在設置 Git 並推送到 GitHub...
echo ========================================
echo.

REM 初始化 Git 倉庫
echo [1/5] 初始化 Git 倉庫...
git init
if %errorlevel% neq 0 (
    echo 錯誤：Git 未安裝或無法初始化
    pause
    exit /b 1
)

REM 添加所有文件
echo [2/5] Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo Error: Failed to add files
    pause
    exit /b 1
)

REM 檢查是否有變更需要提交
git diff --cached --quiet
if %errorlevel% equ 0 (
    git diff --quiet
    if %errorlevel% equ 0 (
        echo No changes to commit. All files are up to date.
        goto :skip_commit
    )
)

REM 創建提交
echo [3/5] Creating commit...
git commit -m "Update: Text RPG Game - %date% %time%"
if %errorlevel% neq 0 (
    echo Warning: No changes to commit or commit failed, continuing...
)

:skip_commit

REM 設置主分支
echo [4/5] 設置主分支...
git branch -M main
if %errorlevel% neq 0 (
    echo 警告：無法重命名分支，繼續...
)

REM 添加遠程倉庫
echo [5/5] 連接到 GitHub 倉庫...
git remote add origin https://github.com/YXChen0323/AnRPG.git
if %errorlevel% neq 0 (
    echo 警告：遠程倉庫可能已存在，嘗試更新...
    git remote set-url origin https://github.com/YXChen0323/AnRPG.git
)

REM 推送到 GitHub
echo.
echo ========================================
echo 正在推送到 GitHub...
echo ========================================
echo.
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo 推送失敗！可能的原因：
    echo 1. 尚未設置 GitHub 認證
    echo 2. 需要輸入用戶名和密碼
    echo.
    echo 解決方法：
    echo 1. 使用 GitHub Desktop（推薦）
    echo 2. 設置 SSH 密鑰
    echo 3. 使用 Personal Access Token
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 成功推送到 GitHub！
echo ========================================
echo.
echo 下一步：啟用 GitHub Pages
echo 1. 訪問：https://github.com/YXChen0323/AnRPG/settings/pages
echo 2. 在 Source 選擇 "Deploy from a branch"
echo 3. 選擇 "main" 分支和 "/ (root)" 資料夾
echo 4. 點擊 Save
echo.
echo 完成後，你的遊戲將在：
echo https://YXChen0323.github.io/AnRPG
echo.
pause

