# Firestore 安全規則設置指南

## ⚠️ 重要：需要設置 Firestore 安全規則

為了讓留言板功能正常工作，您需要在 Firebase Console 中設置 Firestore 安全規則。

## 📋 設置步驟

1. **訪問 Firebase Console**
   - 前往：https://console.firebase.google.com/project/diy-daily-record/firestore/rules

2. **設置以下安全規則**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 記錄集合：所有人可讀寫（現有規則）
    match /records/{document=**} {
      allow read, write: if true;
    }
    
    // 留言集合：僅已認證用戶可讀寫，只能刪除自己的留言
    match /messages/{messageId} {
      // 讀取：僅已認證用戶
      allow read: if request.auth != null;
      
      // 創建：僅已認證用戶
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.content is string
        && request.resource.data.content.size() > 0
        && request.resource.data.content.size() <= 500;
      
      // 更新：不允許（留言不能編輯）
      allow update: if false;
      
      // 刪除：僅留言作者
      allow delete: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🔒 規則說明

1. **messages 集合規則**：
   - `read`: 僅已認證用戶可讀取
   - `create`: 僅已認證用戶可創建，且必須是自己的 userId，內容長度 1-500 字元
   - `update`: 不允許更新（留言不能編輯）
   - `delete`: 僅留言作者可刪除

2. **安全性**：
   - 防止未登入用戶訪問留言
   - 防止用戶偽造 userId
   - 防止用戶刪除他人留言
   - 限制留言長度

## ✅ 驗證規則

設置完成後，測試以下場景：
1. ✅ 未登入用戶無法看到留言
2. ✅ 登入用戶可以發送留言
3. ✅ 登入用戶可以刪除自己的留言
4. ✅ 登入用戶無法刪除他人的留言

## 🆘 如果遇到問題

如果留言功能無法正常工作，請檢查：
1. Firestore 安全規則是否已設置
2. 規則語法是否正確
3. 用戶是否已正確登入
4. 瀏覽器控制台是否有錯誤訊息
