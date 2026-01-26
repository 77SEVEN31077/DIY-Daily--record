# Vercel 部署指南

## 快速部署步驟

### 1. 登入 Vercel（首次使用）
```bash
npx vercel login
```
這會打開瀏覽器，請按照提示完成登入。

### 2. 部署到生產環境
```bash
npx vercel --prod
```

### 3. 之後的更新部署
```bash
npx vercel --prod --yes
```

## 當前項目配置

✅ `vercel.json` 配置文件已準備好
✅ 包含所有最新更新：
   - 「輸入你的暱稱」
   - 「本月打槍王」
   - Service Worker v2
   - Footer 更新

## 部署後

部署成功後，Vercel 會提供：
- 一個自動生成的網址（例如：`your-project.vercel.app`）
- 可以在 Vercel Dashboard 中管理項目
- 可以綁定自訂網域

## 注意事項

- 首次部署需要登入 Vercel 帳號
- 如果沒有 Vercel 帳號，可以在登入時創建
- 部署是免費的（在 Vercel 免費方案範圍內）
