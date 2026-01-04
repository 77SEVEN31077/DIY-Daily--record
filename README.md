# 打飛機日常紀錄

一個用於追蹤日常紀錄的 PWA 應用程式。

## 技術架構

- **前端託管**: Vercel
- **資料庫**: Firebase Firestore
- **PWA**: 支援離線使用和安裝到主畫面

## 部署說明

### Vercel 部署

1. 在 [Vercel](https://vercel.com) 註冊/登入
2. 點擊 "New Project"
3. 連接你的 GitHub 儲存庫
4. Vercel 會自動偵測設定並部署

### 自動部署

當你推送程式碼到 GitHub 時，Vercel 會自動重新部署：

```bash
git add .
git commit -m "更新內容"
git push
```

### Firebase 設定

資料庫使用 Firebase Firestore，配置在 `index.html` 中的 `firebaseConfig`。

## 本地開發

直接在瀏覽器打開 `index.html` 即可，或使用本地伺服器：

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

## 檔案說明

- `index.html` - 主要應用程式
- `service-worker.js` - PWA Service Worker
- `manifest.json` - PWA 設定
- `vercel.json` - Vercel 部署配置
- `firebase.json` - Firebase 配置（保留用於參考）