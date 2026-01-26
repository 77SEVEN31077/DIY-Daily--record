# 打飛機日常紀錄

一個使用 Node.js + Vite 構建的日常記錄網站。

## 技術棧

- **Node.js** - 運行環境
- **Vite** - 構建工具
- **Firebase** - 後端服務（Firestore、Authentication）
- **Vanilla JavaScript** - 前端框架
- **PWA** - 漸進式網頁應用

## 項目結構

```
.
├── src/              # 源代碼目錄
│   ├── main.js      # 主入口文件
│   ├── styles.css   # 樣式文件
│   ├── firebase.js  # Firebase 配置
│   ├── auth.js      # 認證功能
│   ├── theme.js     # 主題切換
│   ├── language.js  # 語言切換
│   ├── records.js   # 記錄功能
│   ├── leaderboard.js # 排行榜
│   └── utils.js     # 工具函數
├── public/          # 靜態資源
│   ├── manifest.json
│   ├── service-worker.js
│   ├── icon-192.png
│   └── icon-512.png
├── index.html       # HTML 模板
├── package.json     # 項目配置
├── vite.config.js   # Vite 配置
└── firebase.json    # Firebase 配置
```

## 開發

### 安裝依賴

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開發伺服器將在 `http://localhost:3000` 啟動。

### 構建生產版本

```bash
npm run build
```

構建後的文件將輸出到 `dist/` 目錄。

### 預覽生產版本

```bash
npm run preview
```

## 部署

### 部署到 Firebase

```bash
npm run deploy:firebase
```

或手動構建後部署：

```bash
npm run build
firebase deploy
```

### 部署到 Vercel

```bash
npm run deploy:vercel
```

或手動構建後部署：

```bash
npm run build
vercel --prod
```

## 功能模組

- **認證系統** (`src/auth.js`) - 用戶登入、註冊、登出
- **主題切換** (`src/theme.js`) - 淺色/深色/系統主題
- **語言切換** (`src/language.js`) - 多語言支持
- **記錄功能** (`src/records.js`) - 新增和查看記錄
- **排行榜** (`src/leaderboard.js`) - 顯示本月排行榜
- **工具函數** (`src/utils.js`) - 分享、截圖等功能

## 注意事項

- 確保 Firebase 配置正確（`src/firebase.js`）
- 構建前確保所有依賴已安裝
- 部署前運行 `npm run build` 構建生產版本
