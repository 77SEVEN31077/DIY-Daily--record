import { db, collection, query, where, orderBy, getDocs, Timestamp } from './firebase.js';

// 取得當前月份的第一天 (用於過濾本月排行榜)
const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

// 核心功能：讀取真實排行榜
window.loadLeaderboard = async function() {
    console.log('loadLeaderboard函數被調用');
    let t = { loading: '載入中...', you: '(你)', times: '次', 'no-records': '本月尚無戰績', 'load-failed': '排行榜加載失敗' };
    try {
        const list = document.getElementById('rank-list');
        if (!list) { console.error('找不到rank-list元素！'); return; }
        list.innerHTML = '<li class="rank-item" style="justify-content:center">載入中...</li>';
        
        let maxWait = 20;
        while (!window.texts && maxWait > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            maxWait--;
        }
        
        if (window.texts) {
            t = window.texts;
        }
        
        try {
            const startOfMonth = getStartOfMonth();
            const q = query(
                collection(db, "records"),
                where("time", ">=", Timestamp.fromDate(startOfMonth)),
                orderBy("time", "desc")
            );
            
            const querySnapshot = await getDocs(q);
            const stats = {};
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const nickname = data.nickname || '匿名';
                stats[nickname] = (stats[nickname] || 0) + 1;
            });
            
            const sorted = Object.entries(stats)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 30);
            
            const myName = localStorage.getItem('wank_nickname');
            
            if (sorted.length === 0) {
                list.innerHTML = `<li class="rank-item" style="justify-content:center; color:#444">${t['no-records']}</li>`;
            } else {
                list.innerHTML = sorted.map((user, index) => {
                    const isMe = user.name === myName;
                    const highlight = isMe ? 'border-bottom: 1px solid white;' : '';
                    const isTop3 = index < 3 ? 'top-3' : '';
                    return `<li class="rank-item"><span style="${highlight}"><span class="rank-badge ${isTop3}">#${index + 1}</span>${user.name}${isMe ? (t.you || '(你)') : ''}</span><span>${user.count} ${t.times || '次'}</span></li>`;
                }).join('');
            }
        } catch (e) {
            console.error('排行榜加載錯誤:', e);
            const errorMsg = e.message || e.toString();
            const errorText = (t && t['load-failed']) ? t['load-failed'] : '排行榜加載失敗';
            if (list) {
                list.innerHTML = `<li class="rank-item" style="justify-content:center; color:red">${errorText}<br><small style="color:#666; font-size:0.7rem;">${errorMsg}</small></li>`;
            }
        }
    } catch (outerError) {
        console.error('外層錯誤:', outerError);
        const list = document.getElementById('rank-list');
        if (list) {
            list.innerHTML = '<li class="rank-item" style="justify-content:center; color:red">排行榜加載失敗</li>';
        }
    }
};
