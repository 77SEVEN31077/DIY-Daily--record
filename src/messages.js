import { db, collection, addDoc, query, orderBy, getDocs, Timestamp, deleteDoc, doc, limit, startAfter, getDoc } from './firebase.js';
import { auth } from './firebase.js';

// 分頁設置
const MESSAGES_PER_PAGE = 25;
let lastVisible = null;
let hasMoreMessages = true;
let isLoading = false;

// 顯示/隱藏留言板
export function toggleMessagesSection(show) {
    const messagesSection = document.getElementById('messages-section');
    if (messagesSection) {
        if (show) {
            messagesSection.classList.add('visible');
            // 載入留言
            loadMessages(true);
        } else {
            messagesSection.classList.remove('visible');
        }
    }
}

// 暴露到全局
window.toggleMessagesSection = toggleMessagesSection;

// 提交留言
window.submitMessage = async function() {
    const messageInput = document.getElementById('message-input');
    const errorDiv = document.getElementById('message-error');
    const submitBtn = document.querySelector('.message-submit-btn');
    
    if (!messageInput) return;
    
    const content = messageInput.value.trim();
    const texts = window.getTexts ? window.getTexts() : {};
    
    // 驗證
    if (!content) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['message-empty-error'] || '請輸入留言內容！';
        return;
    }
    
    if (content.length > 500) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['message-too-long'] || '留言長度不能超過500個字元！';
        return;
    }
    
    const user = auth.currentUser;
    if (!user) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['message-auth-error'] || '請先登入！';
        return;
    }
    
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = texts['message-submitting'] || '發送中...';
    
    try {
        // 獲取用戶暱稱（從 localStorage 或使用 email）
        const nickname = localStorage.getItem('wank_nickname') || user.email?.split('@')[0] || '匿名';
        
        await addDoc(collection(db, "messages"), {
            userId: user.uid,
            userEmail: user.email,
            nickname: nickname,
            content: content,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
        
        // 清空輸入框
        messageInput.value = '';
        
        // 重新載入留言（從第一頁開始）
        lastVisible = null;
        hasMoreMessages = true;
        await loadMessages(true);
        
    } catch (error) {
        console.error('發送留言失敗:', error);
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['message-submit-failed'] || '發送失敗，請稍後再試。';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = texts['message-submit'] || '發送留言';
    }
};

// 載入留言
async function loadMessages(reset = false) {
    if (isLoading) return;
    
    const list = document.getElementById('messages-list');
    if (!list) return;
    
    isLoading = true;
    const texts = window.getTexts ? window.getTexts() : {};
    
    try {
        let q;
        
        if (reset || !lastVisible) {
            // 第一頁或重置
            q = query(
                collection(db, "messages"),
                orderBy("createdAt", "desc"),
                limit(MESSAGES_PER_PAGE)
            );
            if (reset) {
                list.innerHTML = '<li class="message-empty">載入中...</li>';
            }
        } else {
            // 載入更多
            q = query(
                collection(db, "messages"),
                orderBy("createdAt", "desc"),
                startAfter(lastVisible),
                limit(MESSAGES_PER_PAGE)
            );
        }
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            if (reset || !lastVisible) {
                list.innerHTML = '<li class="message-empty">' + (texts['messages-empty'] || '還沒有留言，來發表第一條吧！') + '</li>';
                document.getElementById('load-more-container').style.display = 'none';
            } else {
                hasMoreMessages = false;
                document.getElementById('load-more-container').style.display = 'none';
            }
            isLoading = false;
            return;
        }
        
        // 更新 lastVisible
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        lastVisible = lastDoc;
        
        // 檢查是否還有更多
        hasMoreMessages = querySnapshot.docs.length === MESSAGES_PER_PAGE;
        
        // 渲染留言
        if (reset) {
            list.innerHTML = '';
        }
        
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const messageItem = createMessageElement(docSnapshot.id, data);
            list.appendChild(messageItem);
        });
        
        // 顯示/隱藏載入更多按鈕
        if (hasMoreMessages) {
            document.getElementById('load-more-container').style.display = 'block';
        } else {
            document.getElementById('load-more-container').style.display = 'none';
        }
        
    } catch (error) {
        console.error('載入留言失敗:', error);
        list.innerHTML = '<li class="message-empty" style="color: #ff4444;">' + (texts['messages-load-failed'] || '載入失敗，請稍後再試。') + '</li>';
    } finally {
        isLoading = false;
    }
}

// 創建留言元素
function createMessageElement(messageId, data) {
    const li = document.createElement('li');
    li.className = 'message-item';
    li.setAttribute('data-message-id', messageId);
    
    const user = auth.currentUser;
    const isOwnMessage = user && user.uid === data.userId;
    
    // 格式化時間
    const time = data.createdAt?.toDate() || new Date();
    const timeStr = formatTime(time);
    
    const texts = window.getTexts ? window.getTexts() : {};
    
    li.innerHTML = `
        <div class="message-header">
            <span class="message-author">${escapeHtml(data.nickname || data.userEmail || '匿名')}</span>
            <span class="message-time">${timeStr}</span>
        </div>
        <div class="message-content">${escapeHtml(data.content)}</div>
        ${isOwnMessage ? `<div class="message-actions">
            <button class="message-delete-btn" onclick="deleteMessage('${messageId}')">${texts['message-delete'] || '刪除'}</button>
        </div>` : ''}
    `;
    
    return li;
}

// 格式化時間
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const texts = window.getTexts ? window.getTexts() : {};
    
    // 少於1分鐘
    if (diff < 60000) {
        return texts['time-just-now'] || '剛剛';
    }
    
    // 少於1小時
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}${texts['time-minutes-ago'] || '分鐘前'}`;
    }
    
    // 今天
    if (date.toDateString() === now.toDateString()) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // 昨天
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return texts['time-yesterday'] || '昨天';
    }
    
    // 更早的日期
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    if (year === now.getFullYear()) {
        return `${month}/${day} ${hours}:${minutes}`;
    } else {
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }
}

// HTML 轉義
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 刪除留言
window.deleteMessage = async function(messageId) {
    if (!confirm(window.getTexts ? window.getTexts()['message-delete-confirm'] || '確定要刪除這條留言嗎？' : '確定要刪除這條留言嗎？')) {
        return;
    }
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
        const messageDoc = doc(db, "messages", messageId);
        const messageSnap = await getDoc(messageDoc);
        
        if (!messageSnap.exists()) {
            alert('留言不存在');
            return;
        }
        
        const messageData = messageSnap.data();
        if (messageData.userId !== user.uid) {
            alert('您沒有權限刪除此留言');
            return;
        }
        
        await deleteDoc(messageDoc);
        
        // 移除 DOM 元素
        const messageItem = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageItem) {
            messageItem.remove();
        }
        
        // 如果列表為空，顯示提示
        const list = document.getElementById('messages-list');
        if (list && list.children.length === 0) {
            const texts = window.getTexts ? window.getTexts() : {};
            list.innerHTML = '<li class="message-empty">' + (texts['messages-empty'] || '還沒有留言，來發表第一條吧！') + '</li>';
        }
        
    } catch (error) {
        console.error('刪除留言失敗:', error);
        alert('刪除失敗，請稍後再試');
    }
};

// 載入更多留言
window.loadMoreMessages = async function() {
    if (!hasMoreMessages || isLoading) return;
    await loadMessages(false);
};

// 暴露 loadMessages 供外部調用
window.loadMessages = loadMessages;
