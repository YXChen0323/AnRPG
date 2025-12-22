# 部署指南 - 永久免費部署你的RPG遊戲

## 🎯 推薦平台（全部免費且永久）

### 1. **GitHub Pages** ⭐ 最推薦
- ✅ 完全免費
- ✅ 永久可用
- ✅ 自訂網址（username.github.io/repo-name）
- ✅ 自動HTTPS
- ✅ 簡單易用

### 2. **Netlify** ⭐ 最簡單
- ✅ 完全免費
- ✅ 拖放即可部署
- ✅ 自動HTTPS
- ✅ 全球CDN加速

### 3. **Vercel**
- ✅ 完全免費
- ✅ 快速部署
- ✅ 自動HTTPS

---

## 📋 方法一：GitHub Pages（推薦）

### 步驟 1：創建 GitHub 帳號
1. 訪問 https://github.com
2. 註冊新帳號（如果還沒有）

### 步驟 2：創建新倉庫
1. 登入 GitHub
2. 點擊右上角「+」→「New repository」
3. 倉庫名稱：`text-rpg-game`（或任何你喜歡的名稱）
4. 選擇「Public」（公開）
5. **不要**勾選「Initialize this repository with a README」
6. 點擊「Create repository」

### 步驟 3：上傳代碼
#### 方法 A：使用 GitHub Desktop（最簡單）
1. 下載安裝 GitHub Desktop：https://desktop.github.com
2. 打開 GitHub Desktop
3. 點擊「File」→「Add Local Repository」
4. 選擇你的遊戲資料夾
5. 點擊「Publish repository」
6. 選擇剛才創建的倉庫

#### 方法 B：使用 Git 命令
在遊戲資料夾中打開終端，執行：
```bash
git init
git add .
git commit -m "Initial commit: Text RPG Game"
git branch -M main
git remote add origin https://github.com/你的用戶名/text-rpg-game.git
git push -u origin main
```

### 步驟 4：啟用 GitHub Pages
1. 在 GitHub 倉庫頁面，點擊「Settings」
2. 左側選單找到「Pages」
3. 在「Source」選擇「Deploy from a branch」
4. 選擇「main」分支和「/ (root)」資料夾
5. 點擊「Save」
6. 等待幾分鐘，你的網站就會在：
   **`https://你的用戶名.github.io/text-rpg-game`**

---

## 📋 方法二：Netlify（最簡單，拖放即可）

### 步驟 1：準備文件
確保你的遊戲資料夾包含：
- index.html
- style.css
- game.js

### 步驟 2：部署
1. 訪問 https://www.netlify.com
2. 註冊/登入（可用 GitHub 帳號登入）
3. 點擊「Add new site」→「Deploy manually」
4. 將整個遊戲資料夾**拖放**到頁面上
5. 等待部署完成（約30秒）
6. 你會得到一個網址，例如：`https://random-name-123456.netlify.app`

### 步驟 3：自訂網址（可選）
1. 在 Netlify 控制台，點擊「Site settings」
2. 找到「Change site name」
3. 改成你喜歡的名稱，例如：`my-rpg-game`
4. 新網址：`https://my-rpg-game.netlify.app`

---

## 📋 方法三：Vercel

### 步驟 1：部署
1. 訪問 https://vercel.com
2. 註冊/登入（可用 GitHub 帳號登入）
3. 點擊「Add New」→「Project」
4. 導入你的 GitHub 倉庫（如果已上傳到 GitHub）
   或點擊「Browse」上傳資料夾
5. 點擊「Deploy」
6. 等待完成，你會得到一個網址

---

## 🎨 自訂網址（進階）

### GitHub Pages 自訂網址
1. 購買一個網域（例如：namecheap.com, godaddy.com）
2. 在 GitHub Pages 設定中添加自訂網域
3. 按照指示設定 DNS

### Netlify 自訂網址
1. 在 Netlify 控制台，點擊「Domain settings」
2. 點擊「Add custom domain」
3. 輸入你的網域
4. 按照指示設定 DNS

---

## ✅ 部署檢查清單

- [ ] 所有文件都已上傳（index.html, style.css, game.js）
- [ ] 在瀏覽器中測試遊戲功能正常
- [ ] 網址可以正常訪問
- [ ] HTTPS 已啟用（自動）

---

## 🆘 常見問題

**Q: 部署後遊戲無法運行？**
A: 檢查瀏覽器控制台（F12）是否有錯誤，確保所有文件路徑正確。

**Q: 如何更新遊戲？**
A: 
- GitHub Pages：更新代碼後 push 到 GitHub，會自動更新
- Netlify：重新拖放文件或連接 Git 倉庫自動部署

**Q: 可以同時使用多個平台嗎？**
A: 可以！你可以部署到多個平台，每個平台都有獨立的網址。

---

## 🎉 完成！

部署完成後，你就可以：
- 分享網址給朋友
- 在任何設備上訪問
- 永久免費使用

祝你遊戲愉快！🎮

