// 工具函數

// 初始化時間輸入框
export function initTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('record-time').value = now.toISOString().slice(0, 16);
}

// 分享與截圖功能
export async function shareStats() {
    const captureArea = document.getElementById('capture-area');
    const shareMsg = document.getElementById('share-msg');
    const shareBtn = document.querySelector('.btn-share');
    
    shareBtn.innerText = "生成截圖中...";
    try {
        const url = window.location.href;
        await navigator.clipboard.writeText(`我的戰績在此！ ${url}`);

        document.querySelector('.no-capture').style.display = 'none';
        const canvas = await html2canvas(captureArea, {
            backgroundColor: "#000000",
            scale: 2
        });
        document.querySelector('.no-capture').style.display = 'block';

        const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement('a');
        link.download = `my-stats-${Date.now()}.jpg`;
        link.href = jpgDataUrl;
        link.click();

        shareBtn.innerText = "一鍵分享你的戰績 📸";
        shareMsg.innerText = "連結已複製，截圖已下載！";
        shareMsg.style.display = 'block';
    } catch (err) {
        alert('分享失敗，請手動截圖');
        shareBtn.innerText = "一鍵分享你的戰績 📸";
    }
}

// 模態框管理
window.openTerms = function() {
    document.getElementById('termsModal').style.display = 'block';
};

window.closeTerms = function() {
    document.getElementById('termsModal').style.display = 'none';
};

window.openPrivacy = function() {
    document.getElementById('privacyModal').style.display = 'block';
};

window.closePrivacy = function() {
    document.getElementById('privacyModal').style.display = 'none';
};

// 點擊模態框外部關閉
window.onclick = function(event) {
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target == termsModal) {
        termsModal.style.display = 'none';
    }
    if (event.target == privacyModal) {
        privacyModal.style.display = 'none';
    }
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
};

// 多語言翻譯對象
export const texts = {
    // 繁體中文文本
    'title': '打飛機日常紀錄',
    'subtitle': '今天來一發？',
    'record-title': '記下你的每一次',
    'nickname-label': '你的暱稱',
    'nickname-placeholder': '輸入你的暱稱...',
    'time-label': '時間',
    'confirm-btn': '確認紀錄',
    'history-title': '你的近期戰績',
    'rank-title': '本月打槍王 (Top 30)',
    'loading': '載入中...',
    'share-btn': '分享你的戰績 📸',
    'share-success': '截圖已生成，連結已複製！',
    'about-btn': '關於',
    'disclaimer': '免責聲明：此網站僅用於個人追蹤，只有娛樂價值，不提供其他額外服務。請適度操作，注意身體健康。',
    'about-title': '關於此網站',
    'about-p1': '目前這個時代，"打飛機" 被歸納為是一個很 "低級" 的詞彙。甚至戀愛、約炮和嫖娼都比打飛機顯得要 "高級"，經常打飛機的人還會被貼上 "Loser" 的標籤。',
    'about-p2': '但是打飛機其實是解決性慾成本最低的方式。',
    'about-p3': '你不打飛機，你就得通過戀愛、約炮、或者嫖娼去解決你的性慾，但是這三者無論是從時間、精神、或金錢層面去看，成本都遠遠高於打飛機。所以，打飛機實際上是在以最高效的方式來解決自己的性慾。',
    'about-p4': '"自己自足" 在任何領域都屬於 "高級" 的詞彙，但是到了 "解決性慾" 這件事情上，自給自足反而成了一個 "低級" 詞彙。所以我覺得，目前這個時代，世人對於 "打飛機" 這件事情有著嚴重的價值錯判。',
    'about-p5': 'AI 帶來的信息爆炸時代開始逐漸把 "效率主義" 推向主流，而 "打飛機" 這個在 "解決性慾" 領域中最有 "效率" 的解決方案可能會被大家重新正視和定位。',
    'about-p6': '未來會有越來越多的人選擇打飛機，整個世界會迎來一次屬於打飛機的大牛市，進入全民打飛機的時代。到時候你跟別人說你打飛機，別人會覺得你很時尚，你很高級。',
    'no-records': '本月尚無戰績',
    'load-failed': '排行榜加載失敗',
    'synced': '已同步',
    'times': '次',
    'you': '(你)',
    'alert-nickname': '請輸入暱稱！',
    'alert-time': '請選擇時間！',
    'alert-success': '紀錄成功！要注意身體喔。',
    'alert-sync-failed': '同步失敗，請檢查網路或 Firebase 規則。',
    'share-failed': '分享失敗，請手動截圖'
};

// 將語言相關變數暴露到全局，供模塊腳本使用
window.texts = texts;
