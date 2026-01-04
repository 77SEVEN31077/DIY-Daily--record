# Vercel 重新部署完整指南

## 📋 前置準備

### 1. 確認 GitHub 儲存庫狀態
- 儲存庫：`https://github.com/77SEVEN31077/diy-daily-record`
- 確保所有更改已推送到 GitHub

### 2. 清理 Vercel 舊專案（如果需要）

如果之前有建立過專案但出問題：

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到所有相關的專案（例如：`diy-daily-record-lhlp` 或其他名稱）
3. 進入每個專案的 **Settings** → **General**
4. 滾動到底部，點擊 **Delete Project** 並確認刪除

## 🚀 重新部署步驟

### 步驟 1：登入 Vercel

1. 前往 [vercel.com](https://vercel.com)
2. 點擊右上角 **Sign In**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 存取你的 GitHub 帳號

### 步驟 2：建立新專案

1. 登入後，點擊 **Add New...** → **Project**
2. 在 **Import Git Repository** 區塊中：
   - 找到並選擇 `77SEVEN31077/diy-daily-record`
   - 如果沒看到，點擊 **Adjust GitHub App Permissions** 授權

### 步驟 3：設定專案

在專案設定頁面：

1. **Project Name**：
   - 輸入：`diy-daily-record`（或任何你喜歡的名稱）
   - 如果顯示已存在，可以加後綴：`diy-daily-record-v2`

2. **Framework Preset**：
   - 選擇：**Other** 或 **Other (No Framework)**

3. **Root Directory**：
   - 保持預設：`./`（不需要修改）

4. **Build Command**：
   - **留空**（這是靜態網站，不需要建置）

5. **Output Directory**：
   - **留空**（根目錄就是輸出目錄）

6. **Install Command**：
   - **留空**（沒有使用套件管理器）

7. **Environment Variables**：
   - **不需要設定**（Firebase 配置已經在 `index.html` 中）

### 步驟 4：部署

1. 點擊右下角的 **Deploy** 按鈕
2. 等待部署完成（通常 1-2 分鐘）
3. 部署成功後，你會看到：
   - ✅ 部署成功的訊息
   - 🌐 你的網站網址（例如：`diy-daily-record.vercel.app`）

### 步驟 5：驗證部署

1. 點擊 Vercel 提供的網址，確認網站正常運作
2. 測試功能：
   - 輸入暱稱和時間
   - 點擊「確認紀錄」
   - 檢查排行榜是否正常載入

## ✅ 完成後的自動部署

設定完成後，每次你推送程式碼到 GitHub：

```bash
git add .
git commit -m "更新內容"
git push origin main
```

Vercel 會自動偵測並重新部署你的網站！

## 🔧 常見問題

### Q: 如果專案名稱已存在？
A: 在 Project Name 欄位輸入不同的名稱，例如：`diy-daily-record-v2`

### Q: 部署失敗怎麼辦？
A: 
1. 檢查 Vercel 的部署日誌（點擊失敗的部署）
2. 確認 `vercel.json` 格式正確
3. 確認所有檔案都已推送到 GitHub

### Q: 如何查看部署歷史？
A: 在 Vercel Dashboard 中點擊專案，可以看到所有部署記錄

### Q: 如何設定自訂網域？
A: 在專案的 **Settings** → **Domains** 中新增你的網域

## 📝 重要提醒

- ✅ 資料庫繼續使用 Firebase Firestore（不需要變更）
- ✅ 所有配置都在 `vercel.json` 中
- ✅ 每次 `git push` 會自動觸發部署
- ✅ Vercel 提供免費的 HTTPS 網址

