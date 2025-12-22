# GitHub 部署步驟指南

## 🚀 快速部署到 GitHub Pages

你的 GitHub 倉庫：https://github.com/YXChen0323/AnRPG

### 方法一：使用腳本（推薦）

1. **雙擊運行** `deploy_to_github.bat`
2. 如果出現認證問題，請看下面的解決方法

### 方法二：手動使用 Git 命令

在項目資料夾中打開終端（PowerShell 或 CMD），執行：

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 創建提交
git commit -m "Initial commit: Text RPG Game"

# 設置主分支
git branch -M main

# 連接遠程倉庫
git remote add origin https://github.com/YXChen0323/AnRPG.git

# 推送到 GitHub
git push -u origin main
```

### 方法三：使用 GitHub Desktop（最簡單）

1. **下載安裝 GitHub Desktop**
   - 訪問：https://desktop.github.com
   - 下載並安裝

2. **設置倉庫**
   - 打開 GitHub Desktop
   - 點擊「File」→「Add Local Repository」
   - 選擇你的遊戲資料夾：`C:\Users\11400865_陳雲祥\workspace\Me\webgame\ANrpg`
   - 如果提示不是 Git 倉庫，點擊「create a repository」

3. **發布到 GitHub**
   - 點擊「Publish repository」
   - 確保倉庫名稱是：`AnRPG`
   - 確保用戶名是：`YXChen0323`
   - 點擊「Publish Repository」

---

## 🔐 認證問題解決

如果推送時要求輸入用戶名和密碼：

### 使用 Personal Access Token（推薦）

1. **創建 Token**
   - 訪問：https://github.com/settings/tokens
   - 點擊「Generate new token (classic)」
   - 勾選 `repo` 權限
   - 點擊「Generate token」
   - **複製 Token**（只顯示一次！）

2. **使用 Token 推送**
   - 用戶名：輸入你的 GitHub 用戶名
   - 密碼：**貼上剛才複製的 Token**（不是 GitHub 密碼！）

### 使用 SSH（進階）

1. 生成 SSH 密鑰
2. 添加到 GitHub
3. 使用 SSH URL：`git@github.com:YXChen0323/AnRPG.git`

---

## 🌐 啟用 GitHub Pages

推送完成後，啟用 GitHub Pages：

1. **訪問設置頁面**
   - 前往：https://github.com/YXChen0323/AnRPG/settings/pages

2. **配置 Pages**
   - 在「Source」部分，選擇「Deploy from a branch」
   - Branch 選擇：`main`
   - Folder 選擇：`/ (root)`
   - 點擊「Save」

3. **等待部署**
   - 通常需要 1-2 分鐘
   - 頁面會顯示你的網站 URL

4. **訪問你的遊戲**
   - 網址：**https://YXChen0323.github.io/AnRPG**
   - 記住這個網址，可以分享給朋友！

---

## ✅ 部署檢查清單

- [ ] 代碼已推送到 GitHub
- [ ] GitHub Pages 已啟用
- [ ] 網站可以正常訪問
- [ ] 遊戲功能正常運行

---

## 🔄 更新遊戲

之後如果要更新遊戲：

### 使用 GitHub Desktop
1. 修改代碼
2. 在 GitHub Desktop 中點擊「Commit to main」
3. 點擊「Push origin」

### 使用 Git 命令
```bash
git add .
git commit -m "更新描述"
git push
```

GitHub Pages 會自動更新（可能需要幾分鐘）

---

## 🆘 常見問題

**Q: 推送時要求認證怎麼辦？**
A: 使用 Personal Access Token（見上方說明）

**Q: 網站顯示 404？**
A: 
- 確認 GitHub Pages 已啟用
- 確認分支是 `main` 不是 `master`
- 等待幾分鐘讓部署完成

**Q: 如何更改網址？**
A: 
- 更改倉庫名稱會改變網址
- 或使用自訂網域（進階功能）

---

## 🎉 完成！

部署完成後，你的遊戲就可以：
- ✅ 永久免費在線
- ✅ 任何人都可以訪問
- ✅ 自動 HTTPS 加密
- ✅ 全球 CDN 加速

享受你的在線遊戲吧！🎮

