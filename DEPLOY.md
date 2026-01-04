# Vercel 部署指南

## 📋 前置步驟

### 1. 設定 Git 用戶資訊（如果還沒設定）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的email@example.com"
```

### 2. 在 GitHub 建立新儲存庫

1. 前往 [GitHub](https://github.com/new)
2. 建立一個新的儲存庫（例如：`daily-record`）
3. **不要**初始化 README、.gitignore 或 license（我們已經有了）

### 3. 連接本地儲存庫到 GitHub

```bash
# 在專案目錄執行
git remote add origin https://github.com/你的用戶名/儲存庫名稱.git
git branch -M main
git commit -m "Initial commit: 設定 Vercel 部署"
git push -u origin main
```

## 🚀 Vercel 部署步驟

### 1. 登入 Vercel

前往 [vercel.com](https://vercel.com) 並使用 GitHub 帳號登入

### 2. 匯入專案

1. 點擊 **"Add New..."** → **"Project"**
2. 選擇你剛建立的 GitHub 儲存庫
3. Vercel 會自動偵測設定：
   - Framework Preset: **Other**
   - Root Directory: `./` (保持預設)
   - Build Command: 留空（這是靜態網站）
   - Output Directory: 留空

### 3. 環境變數

**不需要設定環境變數**，因為 Firebase 配置已經寫在 `index.html` 中。

### 4. 部署

點擊 **"Deploy"**，等待幾分鐘後就會完成！

## ✅ 完成後

- 你的網站會有一個 Vercel 提供的網址（例如：`your-project.vercel.app`）
- 每次你 `git push` 到 GitHub，Vercel 會自動重新部署
- 資料庫仍然使用 Firebase Firestore，不受影響

## 🔄 更新網站

未來要更新網站時，只需要：

```bash
git add .
git commit -m "更新內容描述"
git push
```

Vercel 會自動偵測並部署新版本！

## 📝 注意事項

- **資料庫**: 繼續使用 Firebase Firestore，配置在 `index.html` 中
- **網址**: Vercel 會提供免費的 HTTPS 網址
- **自訂網域**: 可以在 Vercel 設定中新增自己的網域

