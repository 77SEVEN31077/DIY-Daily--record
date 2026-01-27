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

// 註冊 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => {
                console.log('Service Worker 註冊成功:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker 註冊失敗:', error);
            });
    });
}
