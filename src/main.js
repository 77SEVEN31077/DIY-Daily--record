// 主入口文件
import './styles.css';
import './firebase.js';
import './theme.js';
import './language.js';
import './auth.js';
import { initTime, shareStats, initLanguage } from './utils.js';
import { renderLocalHistory } from './records.js';
import './leaderboard.js';
import './messages.js';

// 將 shareStats 暴露到全局
window.shareStats = shareStats;

// 初始化頁面
window.addEventListener('DOMContentLoaded', () => {
    // 初始化語言（必須在其他初始化之前）
    initLanguage();
    
    initTime();
    const savedName = localStorage.getItem('wank_nickname');
    if (savedName) document.getElementById('nickname').value = savedName;
    
    renderLocalHistory();
    // 等待loadLeaderboard函數可用
    let waitCount = 0;
    const checkLoadLeaderboard = setInterval(() => {
        waitCount++;
        if (typeof window.loadLeaderboard === 'function') {
            clearInterval(checkLoadLeaderboard);
            window.loadLeaderboard();
        } else if (waitCount > 50) {
            clearInterval(checkLoadLeaderboard);
            console.error('loadLeaderboard函數在5秒後仍未定義');
        }
    }, 100);
});

// 註冊 Service Worker 並處理更新
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker 註冊成功:', registration.scope);
                
                // 檢查 Service Worker 更新
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // 有新版本可用，提示用戶更新
                                showUpdateNotification();
                            }
                        });
                    }
                });
                
                // 定期檢查更新（每小時一次）
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);
            })
            .catch((error) => {
                console.log('Service Worker 註冊失敗:', error);
            });
        
        // 監聽 Service Worker 控制器變化
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                // 當新 Service Worker 激活時，重新載入頁面
                window.location.reload();
            }
        });
    });
}

// 顯示更新通知
function showUpdateNotification() {
    const texts = window.getTexts ? window.getTexts() : {};
    const updateText = texts['update-available'] || '有新版本可用，是否立即更新？';
    const updateBtn = texts['update-now'] || '立即更新';
    const updateLater = texts['update-later'] || '稍後';
    
    // 創建更新提示
    const updateBanner = document.createElement('div');
    updateBanner.id = 'update-banner';
    updateBanner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--input-bg);
        border: 1px solid var(--border-color);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 90%;
        text-align: center;
        color: var(--text-color);
        font-size: 0.9rem;
    `;
    updateBanner.innerHTML = `
        <p style="margin: 0 0 10px 0;">${updateText}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="updateServiceWorker()" style="
                background: var(--highlight);
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
            ">${updateBtn}</button>
            <button onclick="document.getElementById('update-banner').remove()" style="
                background: transparent;
                color: var(--text-muted);
                border: 1px solid var(--border-color);
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
            ">${updateLater}</button>
        </div>
    `;
    document.body.appendChild(updateBanner);
}

// 更新 Service Worker
window.updateServiceWorker = function() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
};
