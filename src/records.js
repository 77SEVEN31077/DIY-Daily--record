import { db, collection, addDoc, Timestamp } from './firebase.js';

// 渲染個人本地歷史 (保留 LocalStorage 方便快速查看)
export function renderLocalHistory() {
    const records = JSON.parse(localStorage.getItem('wank_records') || '[]');
    const list = document.getElementById('history-list');
    const section = document.getElementById('history-section');
    
    if (records.length > 0) {
        section.style.display = 'block';
        list.innerHTML = records.sort((a,b) => new Date(b.time) - new Date(a.time))
            .slice(0, 10) // 只顯示最近10筆
            .map(rec => {
                const dateObj = new Date(rec.time);
                const dateStr = `${dateObj.getFullYear()}/${String(dateObj.getMonth()+1).padStart(2,'0')}/${String(dateObj.getDate()).padStart(2,'0')} ${String(dateObj.getHours()).padStart(2,'0')}:${String(dateObj.getMinutes()).padStart(2,'0')}`;
                return `<li class="history-item"><span>${dateStr}</span><span style="color:#666">已同步</span></li>`;
            }).join('');
    }
}

// 核心功能：新增紀錄到 Firebase
window.addRecord = async function() {
    const nicknameInput = document.getElementById('nickname');
    const timeInput = document.getElementById('record-time');
    const nickname = nicknameInput.value.trim();
    const time = timeInput.value;
    const t = window.texts || {};

    if (!nickname) return alert(t['alert-nickname'] || '請輸入暱稱！');
    if (!time) return alert(t['alert-time'] || '請選擇時間！');

    try {
        // 1. 存到 Firebase
        await addDoc(collection(db, "records"), {
            nickname: nickname,
            time: Timestamp.fromDate(new Date(time)),
            createdAt: Timestamp.now()
        });

        // 2. 存到本地緩存
        const localRecords = JSON.parse(localStorage.getItem('wank_records') || '[]');
        localRecords.push({ time: time });
        localStorage.setItem('wank_records', JSON.stringify(localRecords));
        localStorage.setItem('wank_nickname', nickname);

        alert(t['alert-success'] || '紀錄成功！要注意身體喔。');
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
    } catch (e) {
        console.error(e);
        alert(t['alert-sync-failed'] || '同步失敗，請檢查網路或 Firebase 規則。');
    }
};
