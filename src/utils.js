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
    const texts = window.getTexts ? window.getTexts() : translations['zh-TW'];
    
    shareBtn.innerText = texts['loading'] || "生成截圖中...";
    try {
        const url = window.location.href;
        const shareText = window.getCurrentLanguage && window.getCurrentLanguage() === 'en' 
            ? `My stats here! ${url}`
            : `我的戰績在此！ ${url}`;
        await navigator.clipboard.writeText(shareText);

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

        shareBtn.innerText = texts['share-btn'];
        shareMsg.innerText = texts['share-success'];
        shareMsg.style.display = 'block';
    } catch (err) {
        alert(texts['share-failed'] || '分享失敗，請手動截圖');
        shareBtn.innerText = texts['share-btn'];
    }
}

// 模態框管理
window.openTerms = function() {
    // 確保內容是最新語言
    const texts = window.getTexts ? window.getTexts() : {};
    const termsModalBody = document.querySelector('#termsModal .modal-body');
    if (termsModalBody && texts['terms-welcome']) {
        termsModalBody.innerHTML = `
            <p>${texts['terms-welcome']}</p>
            
            <p><strong>${texts['terms-1-title']}</strong></p>
            <p>${texts['terms-1-content']}</p>
            
            <p><strong>${texts['terms-2-title']}</strong></p>
            <p>${texts['terms-2-content']}</p>
            
            <p><strong>${texts['terms-3-title']}</strong></p>
            <p>${texts['terms-3-content']}</p>
            
            <p><strong>${texts['terms-4-title']}</strong></p>
            <p>${texts['terms-4-content']}</p>
            
            <p><strong>${texts['terms-5-title']}</strong></p>
            <p>${texts['terms-5-content']}</p>
            
            <p><strong>${texts['terms-6-title']}</strong></p>
            <p>${texts['terms-6-content']}</p>
        `;
    }
    const termsTitle = document.querySelector('#termsModal h3');
    if (termsTitle && texts['terms-title']) {
        termsTitle.textContent = texts['terms-title'];
    }
    document.getElementById('termsModal').style.display = 'block';
};

window.closeTerms = function() {
    document.getElementById('termsModal').style.display = 'none';
};

window.openPrivacy = function() {
    // 確保內容是最新語言
    const texts = window.getTexts ? window.getTexts() : {};
    const privacyModalBody = document.querySelector('#privacyModal .modal-body');
    if (privacyModalBody && texts['privacy-1-title']) {
        privacyModalBody.innerHTML = `
            <p><strong>${texts['privacy-1-title']}</strong></p>
            <p>${texts['privacy-1-content']}</p>
            
            <p><strong>${texts['privacy-2-title']}</strong></p>
            <p>${texts['privacy-2-p1']}</p>
            
            <p>${texts['privacy-2-p2']}</p>
            
            <p>${texts['privacy-2-p3']}</p>
            
            <p>${texts['privacy-2-p4']}</p>
            
            <p>${texts['privacy-2-p5']}</p>
            
            <p>${texts['privacy-2-p6']}</p>
            
            <p style="text-align: right; margin-top: 20px; color: #888;">${texts['privacy-author']}</p>
        `;
    }
    const privacyTitle = document.querySelector('#privacyModal h3');
    if (privacyTitle && texts['privacy-title']) {
        privacyTitle.textContent = texts['privacy-title'];
    }
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
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
};

// 多語言翻譯對象
export const translations = {
    'zh-TW': {
        'title': '打飛機紀錄',
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
        'no-records': '本月尚無戰績',
        'load-failed': '排行榜加載失敗',
        'synced': '已同步',
        'times': '次',
        'you': '(你)',
        'alert-nickname': '請輸入暱稱！',
        'alert-time': '請選擇時間！',
        'alert-success': '紀錄成功！要注意身體喔。',
        'alert-sync-failed': '同步失敗，請檢查網路或 Firebase 規則。',
        'share-failed': '分享失敗，請手動截圖',
        'login': '登入',
        'signup': '註冊',
        'logout': '登出',
        'terms': '服務條款',
        'privacy': '隱私政策',
        'terms-title': '服務條款',
        'privacy-title': '隱私政策',
        'login-title': '登入',
        'signup-title': '註冊',
        'email': '電子郵件',
        'password': '密碼',
        'confirm-password': '確認密碼',
        'email-placeholder': '請輸入您的電子郵件',
        'password-placeholder': '請輸入您的密碼',
        'password-min': '請輸入密碼（至少6個字元）',
        'password-confirm-placeholder': '請再次輸入密碼',
        'no-account': '還沒有帳號？',
        'has-account': '已有帳號？',
        'signup-link': '立即註冊',
        'login-link': '立即登入',
        'footer-agreement': '使用此網站即表示您同意',
        'footer-and': '並已閱讀',
        'synced': '已同步',
        'logging-in': '登入中...',
        'signing-up': '註冊中...',
        'login-success': '登入成功！',
        'signup-success': '註冊成功！歡迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失敗：',
        'error-user-not-found': '找不到此帳號，請先註冊。',
        'error-wrong-password': '密碼錯誤，請重新輸入。',
        'error-invalid-email': '電子郵件格式不正確。',
        'error-login-failed': '登入失敗：',
        'error-password-mismatch': '兩次輸入的密碼不一致，請重新輸入。',
        'error-password-too-short': '密碼長度至少需要6個字元。',
        'error-email-in-use': '此電子郵件已被使用，請直接登入。',
        'error-weak-password': '密碼強度不足，請使用更複雜的密碼。',
        'error-signup-failed': '註冊失敗：',
        'messages-title': '留言板',
        'message-input-placeholder': '輸入你的留言...',
        'message-submit': '發送留言',
        'message-submitting': '發送中...',
        'message-empty-error': '請輸入留言內容！',
        'message-too-long': '留言長度不能超過500個字元！',
        'message-auth-error': '請先登入！',
        'message-submit-failed': '發送失敗，請稍後再試。',
        'messages-empty': '還沒有留言，來發表第一條吧！',
        'messages-load-failed': '載入失敗，請稍後再試。',
        'message-delete': '刪除',
        'message-delete-confirm': '確定要刪除這條留言嗎？',
        'load-more': '載入更多',
        'time-just-now': '剛剛',
        'time-minutes-ago': '分鐘前',
        'time-yesterday': '昨天',
        'forgot-password': '忘記密碼？',
        'forgot-password-title': '忘記密碼',
        'forgot-password-description': '請輸入您的電子郵件地址，我們將發送密碼重設連結給您。',
        'forgot-password-submit': '發送重設連結',
        'sending': '發送中...',
        'reset-email-sent': '密碼重設連結已發送到您的電子郵件，請檢查您的收件箱。',
        'reset-email-failed': '發送失敗：',
        'error-too-many-requests': '請求過於頻繁，請稍後再試。',
        'back-to-login': '返回登入',
        'update-available': '有新版本可用，是否立即更新？',
        'update-now': '立即更新',
        'update-later': '稍後',
        'terms-welcome': '歡迎使用本網站。使用本網站即表示您同意遵守以下服務條款：',
        'terms-1-title': '1. 服務說明',
        'terms-1-content': '本網站提供個人追蹤記錄服務，僅供個人使用及娛樂目的。',
        'terms-2-title': '2. 使用者責任',
        'terms-2-content': '使用者應確保所提供資訊的真實性，並對其使用本網站的行為負責。請適度操作，注意身體健康。',
        'terms-3-title': '3. 隱私保護',
        'terms-3-content': '我們重視您的隱私，相關隱私政策請參閱「隱私政策」頁面。',
        'terms-4-title': '4. 免責聲明',
        'terms-4-content': '本網站僅用於個人追蹤，只有娛樂價值，不提供其他額外服務。網站不對使用者的任何行為或後果負責。',
        'terms-5-title': '5. 服務變更',
        'terms-5-content': '我們保留隨時修改或終止服務的權利，恕不另行通知。',
        'terms-6-title': '6. 條款修改',
        'terms-6-content': '我們保留隨時修改本服務條款的權利，修改後的條款將在網站上公布。',
        'privacy-1-title': '1. 網站起源',
        'privacy-1-content': '純粹為了打飛機而生',
        'privacy-2-title': '2. 關於打飛機的意義',
        'privacy-2-p1': '目前這個時代，"打飛機" 被歸納為是一個很 "低級" 的詞彙。甚至戀愛、約炮和嫖娼都比打飛機顯得要 "高級"，經常打飛機的人還會被貼上 "Loser" 的標籤。',
        'privacy-2-p2': '但是打飛機其實是解決性慾成本最低的方式。',
        'privacy-2-p3': '你不打飛機，你就得通過戀愛、約炮、或者嫖娼去解決你的性慾，但是這三者無論是從時間、精神、或金錢層面去看，成本都遠遠高於打飛機。所以，打飛機實際上是在以最高效的方式來解決自己的性慾。',
        'privacy-2-p4': '"自己自足" 在任何領域都屬於 "高級" 的詞彙，但是到了 "解決性慾" 這件事情上，自給自足反而成了一個 "低級" 詞彙。所以我覺得，目前這個時代，世人對於 "打飛機" 這件事情有著嚴重的價值錯判。',
        'privacy-2-p5': 'AI 帶來的信息爆炸時代開始逐漸把 "效率主義" 推向主流，而 "打飛機" 這個在 "解決性慾" 領域中最有 "效率" 的解決方案可能會被大家重新正視和定位。',
        'privacy-2-p6': '未來會有越來越多的人選擇打飛機，整個世界會迎來一次屬於打飛機的大牛市，進入全民打飛機的時代。到時候你跟別人說你打飛機，別人會覺得你很時尚，你很高級。',
        'privacy-author': '-殺破狼(X:@wolfyxbt)'
    },
    'en': {
        'title': 'DIY Record',
        'subtitle': 'Ready for today?',
        'record-title': 'Record Your Every Time',
        'nickname-label': 'Your Nickname',
        'nickname-placeholder': 'Enter your nickname...',
        'time-label': 'Time',
        'confirm-btn': 'Confirm Record',
        'history-title': 'Your Recent Records',
        'rank-title': 'Top 30 This Month',
        'loading': 'Loading...',
        'share-btn': 'Share Your Stats 📸',
        'share-success': 'Screenshot generated, link copied!',
        'no-records': 'No records this month',
        'load-failed': 'Failed to load leaderboard',
        'synced': 'Synced',
        'times': 'times',
        'you': '(You)',
        'alert-nickname': 'Please enter nickname!',
        'alert-time': 'Please select time!',
        'alert-success': 'Record successful! Take care of your health.',
        'alert-sync-failed': 'Sync failed, please check network or Firebase rules.',
        'share-failed': 'Share failed, please screenshot manually',
        'login': 'Sign In',
        'signup': 'Sign Up',
        'logout': 'Sign Out',
        'terms': 'Terms of Service',
        'privacy': 'Privacy Policy',
        'terms-title': 'Terms of Service',
        'privacy-title': 'Privacy Policy',
        'login-title': 'Sign In',
        'signup-title': 'Sign Up',
        'email': 'Email',
        'password': 'Password',
        'confirm-password': 'Confirm Password',
        'email-placeholder': 'Enter your email',
        'password-placeholder': 'Enter your password',
        'password-min': 'Enter password (at least 6 characters)',
        'password-confirm-placeholder': 'Enter password again',
        'no-account': "Don't have an account?",
        'has-account': 'Already have an account?',
        'signup-link': 'Sign up now',
        'login-link': 'Sign in now',
        'footer-agreement': 'By using this website, you agree to',
        'footer-and': 'and have read',
        'synced': 'Synced',
        'logging-in': 'Signing in...',
        'signing-up': 'Signing up...',
        'login-success': 'Sign in successful!',
        'signup-success': 'Sign up successful! Welcome!',
        'logout-success': 'Signed out successfully!',
        'logout-failed': 'Sign out failed: ',
        'error-user-not-found': 'Account not found, please sign up first.',
        'error-wrong-password': 'Wrong password, please try again.',
        'error-invalid-email': 'Invalid email format.',
        'error-login-failed': 'Sign in failed: ',
        'error-password-mismatch': 'Passwords do not match, please try again.',
        'error-password-too-short': 'Password must be at least 6 characters.',
        'error-email-in-use': 'This email is already in use, please sign in.',
        'error-weak-password': 'Password is too weak, please use a stronger password.',
        'error-signup-failed': 'Sign up failed: ',
        'messages-title': 'Message Board',
        'message-input-placeholder': 'Enter your message...',
        'message-submit': 'Send Message',
        'message-submitting': 'Sending...',
        'message-empty-error': 'Please enter message content!',
        'message-too-long': 'Message cannot exceed 500 characters!',
        'message-auth-error': 'Please sign in first!',
        'message-submit-failed': 'Failed to send, please try again later.',
        'messages-empty': 'No messages yet, be the first to post!',
        'messages-load-failed': 'Failed to load, please try again later.',
        'message-delete': 'Delete',
        'message-delete-confirm': 'Are you sure you want to delete this message?',
        'load-more': 'Load More',
        'time-just-now': 'Just now',
        'time-minutes-ago': ' minutes ago',
        'time-yesterday': 'Yesterday',
        'forgot-password': 'Forgot password?',
        'forgot-password-title': 'Forgot Password',
        'forgot-password-description': 'Please enter your email address, and we will send you a password reset link.',
        'forgot-password-submit': 'Send Reset Link',
        'sending': 'Sending...',
        'reset-email-sent': 'Password reset link has been sent to your email. Please check your inbox.',
        'reset-email-failed': 'Failed to send: ',
        'error-too-many-requests': 'Too many requests. Please try again later.',
        'back-to-login': 'Back to Sign In',
        'update-available': 'A new version is available. Update now?',
        'update-now': 'Update Now',
        'update-later': 'Later',
        'terms-welcome': 'Welcome to this website. By using this website, you agree to comply with the following terms of service:',
        'terms-1-title': '1. Service Description',
        'terms-1-content': 'This website provides personal tracking and recording services for personal use and entertainment purposes only.',
        'terms-2-title': '2. User Responsibilities',
        'terms-2-content': 'Users should ensure the authenticity of the information provided and are responsible for their use of this website. Please use in moderation and take care of your health.',
        'terms-3-title': '3. Privacy Protection',
        'terms-3-content': 'We value your privacy. Please refer to the "Privacy Policy" page for related privacy policies.',
        'terms-4-title': '4. Disclaimer',
        'terms-4-content': 'This website is for personal tracking only and has entertainment value only. It does not provide any other additional services. The website is not responsible for any user actions or consequences.',
        'terms-5-title': '5. Service Changes',
        'terms-5-content': 'We reserve the right to modify or terminate the service at any time without prior notice.',
        'terms-6-title': '6. Terms Modification',
        'terms-6-content': 'We reserve the right to modify these terms of service at any time. Modified terms will be published on the website.',
        'privacy-1-title': '1. Website Origin',
        'privacy-1-content': 'Created purely for masturbation',
        'privacy-2-title': '2. About the Meaning of Masturbation',
        'privacy-2-p1': 'In this era, "masturbation" is categorized as a very "low-class" term. Even dating, hookups, and prostitution seem more "high-class" than masturbation, and people who frequently masturbate are labeled as "Losers".',
        'privacy-2-p2': 'However, masturbation is actually the lowest-cost way to satisfy sexual desires.',
        'privacy-2-p3': 'If you don\'t masturbate, you have to satisfy your sexual desires through dating, hookups, or prostitution. But from the perspectives of time, mental energy, or money, the costs of these three are far higher than masturbation. So, masturbation is actually the most efficient way to satisfy your own sexual desires.',
        'privacy-2-p4': '"Self-sufficiency" is a "high-class" term in any field, but when it comes to "satisfying sexual desires", self-sufficiency becomes a "low-class" term. So I think that in this era, people have a serious misjudgment of the value of "masturbation".',
        'privacy-2-p5': 'The information explosion era brought by AI is gradually pushing "efficiency-ism" into the mainstream, and "masturbation", the most "efficient" solution in the field of "satisfying sexual desires", may be re-examined and repositioned by everyone.',
        'privacy-2-p6': 'In the future, more and more people will choose to masturbate. The whole world will usher in a bull market for masturbation, entering an era of universal masturbation. When you tell others that you masturbate, they will think you are fashionable and sophisticated.',
        'privacy-author': '-殺破狼(X:@wolfyxbt)'
    },
    'zh-CN': {
        'title': '打飞机记录',
        'subtitle': '今天来一发？',
        'record-title': '记下你的每一次',
        'nickname-label': '你的昵称',
        'nickname-placeholder': '输入你的昵称...',
        'time-label': '时间',
        'confirm-btn': '确认记录',
        'history-title': '你的近期战绩',
        'rank-title': '本月打枪王 (Top 30)',
        'loading': '加载中...',
        'share-btn': '分享你的战绩 📸',
        'share-success': '截图已生成，链接已复制！',
        'no-records': '本月尚无战绩',
        'load-failed': '排行榜加载失败',
        'synced': '已同步',
        'times': '次',
        'you': '(你)',
        'alert-nickname': '请输入昵称！',
        'alert-time': '请选择时间！',
        'alert-success': '记录成功！要注意身体喔。',
        'alert-sync-failed': '同步失败，请检查网络或 Firebase 规则。',
        'share-failed': '分享失败，请手动截图',
        'login': '登录',
        'signup': '注册',
        'logout': '登出',
        'terms': '服务条款',
        'privacy': '隐私政策',
        'terms-title': '服务条款',
        'privacy-title': '隐私政策',
        'login-title': '登录',
        'signup-title': '注册',
        'email': '电子邮件',
        'password': '密码',
        'confirm-password': '确认密码',
        'email-placeholder': '请输入您的电子邮件',
        'password-placeholder': '请输入您的密码',
        'password-min': '请输入密码（至少6个字符）',
        'password-confirm-placeholder': '请再次输入密码',
        'no-account': '还没有账号？',
        'has-account': '已有账号？',
        'signup-link': '立即注册',
        'login-link': '立即登录',
        'footer-agreement': '使用此网站即表示您同意',
        'footer-and': '并已阅读',
        'synced': '已同步',
        'logging-in': '登录中...',
        'signing-up': '注册中...',
        'login-success': '登录成功！',
        'signup-success': '注册成功！欢迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失败：',
        'error-user-not-found': '找不到此账号，请先注册。',
        'error-wrong-password': '密码错误，请重新输入。',
        'error-invalid-email': '电子邮件格式不正确。',
        'error-login-failed': '登录失败：',
        'error-password-mismatch': '两次输入的密码不一致，请重新输入。',
        'error-password-too-short': '密码长度至少需要6个字符。',
        'error-email-in-use': '此电子邮件已被使用，请直接登录。',
        'error-weak-password': '密码强度不足，请使用更复杂的密码。',
        'error-signup-failed': '注册失败：',
        'messages-title': '留言板',
        'message-input-placeholder': '输入你的留言...',
        'message-submit': '发送留言',
        'message-submitting': '发送中...',
        'message-empty-error': '请输入留言内容！',
        'message-too-long': '留言长度不能超过500个字符！',
        'message-auth-error': '请先登录！',
        'message-submit-failed': '发送失败，请稍后再试。',
        'messages-empty': '还没有留言，来发表第一条吧！',
        'messages-load-failed': '加载失败，请稍后再试。',
        'message-delete': '删除',
        'message-delete-confirm': '确定要删除这条留言吗？',
        'load-more': '加载更多',
        'time-just-now': '刚刚',
        'time-minutes-ago': '分钟前',
        'time-yesterday': '昨天',
        'forgot-password': '忘记密码？',
        'forgot-password-title': '忘记密码',
        'forgot-password-description': '请输入您的电子邮件地址，我们将发送密码重设链接给您。',
        'forgot-password-submit': '发送重设链接',
        'sending': '发送中...',
        'reset-email-sent': '密码重设链接已发送到您的电子邮件，请检查您的收件箱。',
        'reset-email-failed': '发送失败：',
        'error-too-many-requests': '请求过于频繁，请稍后再试。',
        'back-to-login': '返回登录',
        'update-available': '有新版本可用，是否立即更新？',
        'update-now': '立即更新',
        'update-later': '稍后',
        'terms-welcome': '欢迎使用本网站。使用本网站即表示您同意遵守以下服务条款：',
        'terms-1-title': '1. 服务说明',
        'terms-1-content': '本网站提供个人追踪记录服务，仅供个人使用及娱乐目的。',
        'terms-2-title': '2. 使用者责任',
        'terms-2-content': '使用者应确保所提供信息的真实性，并对其使用本网站的行为负责。请适度操作，注意身体健康。',
        'terms-3-title': '3. 隐私保护',
        'terms-3-content': '我们重视您的隐私，相关隐私政策请参阅「隐私政策」页面。',
        'terms-4-title': '4. 免责声明',
        'terms-4-content': '本网站仅用于个人追踪，只有娱乐价值，不提供其他额外服务。网站不对使用者的任何行为或后果负责。',
        'terms-5-title': '5. 服务变更',
        'terms-5-content': '我们保留随时修改或终止服务的权利，恕不另行通知。',
        'terms-6-title': '6. 条款修改',
        'terms-6-content': '我们保留随时修改本服务条款的权利，修改后的条款将在网站上公布。',
        'privacy-1-title': '1. 网站起源',
        'privacy-1-content': '纯粹为了打飞机而生',
        'privacy-2-title': '2. 关于打飞机的意义',
        'privacy-2-p1': '目前这个时代，"打飞机" 被归纳为是一个很 "低级" 的词汇。甚至恋爱、约炮和嫖娼都比打飞机显得要 "高级"，经常打飞机的人还会被贴上 "Loser" 的标签。',
        'privacy-2-p2': '但是打飞机其实是解决性欲成本最低的方式。',
        'privacy-2-p3': '你不打飞机，你就得通过恋爱、约炮、或者嫖娼去解决你的性欲，但是这三者无论从时间、精神、或金钱层面去看，成本都远远高于打飞机。所以，打飞机实际上是在以最高效的方式来解决自己的性欲。',
        'privacy-2-p4': '"自己自足" 在任何领域都属于 "高级" 的词汇，但是到了 "解决性欲" 这件事情上，自给自足反而成了一个 "低级" 词汇。所以我觉得，目前这个时代，世人对于 "打飞机" 这件事情有着严重的价值错判。',
        'privacy-2-p5': 'AI 带来的信息爆炸时代开始逐渐把 "效率主义" 推向主流，而 "打飞机" 这个在 "解决性欲" 领域中最有 "效率" 的解决方案可能会被大家重新正视和定位。',
        'privacy-2-p6': '未来会有越来越多的人选择打飞机，整个世界会迎来一次属于打飞机的大牛市，进入全民打飞机的时代。到时候你跟别人说你打飞机，别人会觉得你很时尚，你很高級。',
        'privacy-author': '-殺破狼(X:@wolfyxbt)'
    }
};

// 當前語言（默認為繁體中文）
let currentLanguage = 'zh-TW';

// 獲取當前語言的翻譯文本
export function getTexts(lang = null) {
    const langToUse = lang || currentLanguage;
    return translations[langToUse] || translations['zh-TW'];
}

// 設置當前語言
export function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageTexts();
        return true;
    }
    return false;
}

// 獲取當前語言
export function getCurrentLanguage() {
    return currentLanguage;
}

// 更新頁面文字
function updatePageTexts() {
    const texts = getTexts();
    const html = document.documentElement;
    
    // 更新 HTML lang 屬性（影響日曆等原生控件）
    html.setAttribute('lang', currentLanguage);
    
    // 更新 datetime-local 輸入框的語言（通過設置 lang 屬性）
    const timeInput = document.getElementById('record-time');
    if (timeInput) {
        timeInput.setAttribute('lang', currentLanguage);
    }
    
    // 更新標題
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleElement.textContent = `${texts['title']} - ${texts['subtitle']}`;
    }
    
    // 更新導航欄
    const navTitle = document.querySelector('.nav-left a');
    if (navTitle) {
        navTitle.textContent = texts['title'];
    }
    
    // 更新主標題
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.textContent = texts['title'];
    }
    
    // 更新副標題
    const h2 = document.querySelector('h2');
    if (h2) {
        h2.textContent = texts['subtitle'];
    }
    
    // 更新表單標籤和按鈕
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) {
        sectionTitles[0].textContent = texts['record-title'];
    }
    
    const nicknameLabel = document.querySelector('.form-group:first-of-type label');
    if (nicknameLabel) {
        nicknameLabel.textContent = texts['nickname-label'];
    }
    
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.placeholder = texts['nickname-placeholder'];
    }
    
    const timeLabel = document.querySelectorAll('.form-group label')[1];
    if (timeLabel) {
        timeLabel.textContent = texts['time-label'];
    }
    
    const confirmBtn = document.querySelector('.btn[onclick="addRecord()"]');
    if (confirmBtn) {
        confirmBtn.textContent = texts['confirm-btn'];
    }
    
    // 更新歷史標題
    if (sectionTitles.length > 1) {
        const historySection = document.getElementById('history-section');
        if (historySection && historySection.querySelector('.section-title')) {
            historySection.querySelector('.section-title').textContent = texts['history-title'];
        }
    }
    
    // 更新排行榜標題
    if (sectionTitles.length > 2) {
        sectionTitles[sectionTitles.length - 2].textContent = texts['rank-title'];
    }
    
    // 更新留言板標題
    const messagesTitle = document.getElementById('messages-title');
    if (messagesTitle) {
        messagesTitle.textContent = texts['messages-title'] || '留言板';
    }
    
    // 更新留言輸入框 placeholder
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.placeholder = texts['message-input-placeholder'] || '輸入你的留言...';
    }
    
    // 更新發送按鈕（只在非發送狀態時更新）
    const messageSubmitBtn = document.querySelector('.message-submit-btn');
    if (messageSubmitBtn) {
        const currentText = messageSubmitBtn.textContent;
        if (!currentText.includes('發送中') && !currentText.includes('Sending') && !currentText.includes('发送中')) {
            messageSubmitBtn.textContent = texts['message-submit'] || '發送留言';
        }
    }
    
    // 更新載入更多按鈕
    const loadMoreBtn = document.querySelector('.message-load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = texts['load-more'] || '載入更多';
    }
    
    // 更新分享按鈕
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.textContent = texts['share-btn'];
    }
    
    // 更新登入/註冊按鈕
    const loginLink = document.querySelector('.nav-link-signin');
    if (loginLink) {
        loginLink.textContent = texts['login'];
    }
    
    const signupLink = document.querySelector('.nav-link-signup');
    if (signupLink) {
        signupLink.textContent = texts['signup'];
    }
    
    // 更新模態框標題
    const loginTitle = document.querySelector('#loginModal h3');
    if (loginTitle) {
        loginTitle.textContent = texts['login-title'];
    }
    
    const signupTitle = document.querySelector('#signupModal h3');
    if (signupTitle) {
        signupTitle.textContent = texts['signup-title'];
    }
    
    // 更新表單標籤
    const loginEmailLabel = document.querySelector('#loginForm label[for="loginEmail"]');
    if (loginEmailLabel) {
        loginEmailLabel.textContent = texts['email'];
    }
    
    const loginPasswordLabel = document.querySelector('#loginForm label[for="loginPassword"]');
    if (loginPasswordLabel) {
        loginPasswordLabel.textContent = texts['password'];
    }
    
    const signupEmailLabel = document.querySelector('#signupForm label[for="signupEmail"]');
    if (signupEmailLabel) {
        signupEmailLabel.textContent = texts['email'];
    }
    
    const signupPasswordLabel = document.querySelector('#signupForm label[for="signupPassword"]');
    if (signupPasswordLabel) {
        signupPasswordLabel.textContent = texts['password'];
    }
    
    const signupPasswordConfirmLabel = document.querySelector('#signupForm label[for="signupPasswordConfirm"]');
    if (signupPasswordConfirmLabel) {
        signupPasswordConfirmLabel.textContent = texts['confirm-password'];
    }
    
    // 更新輸入框 placeholder
    const loginEmailInput = document.getElementById('loginEmail');
    if (loginEmailInput) {
        loginEmailInput.placeholder = texts['email-placeholder'];
    }
    
    const loginPasswordInput = document.getElementById('loginPassword');
    if (loginPasswordInput) {
        loginPasswordInput.placeholder = texts['password-placeholder'];
    }
    
    const signupEmailInput = document.getElementById('signupEmail');
    if (signupEmailInput) {
        signupEmailInput.placeholder = texts['email-placeholder'];
    }
    
    const signupPasswordInput = document.getElementById('signupPassword');
    if (signupPasswordInput) {
        signupPasswordInput.placeholder = texts['password-min'];
    }
    
    const signupPasswordConfirmInput = document.getElementById('signupPasswordConfirm');
    if (signupPasswordConfirmInput) {
        signupPasswordConfirmInput.placeholder = texts['password-confirm-placeholder'];
    }
    
    // 更新按鈕文字
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = texts['login-title'];
    }
    
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.textContent = texts['signup-title'];
    }
    
    // 更新頁腳
    const footerLinks = document.querySelectorAll('.footer-link');
    if (footerLinks.length >= 2) {
        footerLinks[0].textContent = texts['terms'];
        footerLinks[1].textContent = texts['privacy'];
    }
    
    const footerText = document.querySelector('.footer');
    if (footerText) {
        const footerContent = footerText.innerHTML;
        if (footerContent.includes('使用此網站')) {
            footerText.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <span style="color: var(--text-muted);">@ 2025 打飛機  ｜  </span>
                    <a href="https://x.com/77seven31077" target="_blank" rel="noopener noreferrer" class="footer-x-link" style="display: inline-block; vertical-align: middle;">
                        <svg class="footer-x-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="var(--text-muted)"/>
                        </svg>
                    </a>
                </div>
                ${texts['footer-agreement']}<a href="#" onclick="openTerms(); return false;" class="footer-link">${texts['terms']}</a>${texts['footer-and']}<a href="#" onclick="openPrivacy(); return false;" class="footer-link">${texts['privacy']}</a>
            `;
        }
    }
    
    // 更新主題下拉菜單文字
    const themeItems = document.querySelectorAll('#theme-dropdown .dropdown-item span');
    if (themeItems.length >= 3) {
        if (currentLanguage === 'en') {
            themeItems[0].textContent = 'Light Mode';
            themeItems[1].textContent = 'Dark Mode';
            themeItems[2].textContent = 'System';
        } else if (currentLanguage === 'zh-CN') {
            themeItems[0].textContent = '浅色模式';
            themeItems[1].textContent = '深色模式';
            themeItems[2].textContent = '系统设置';
        } else {
            themeItems[0].textContent = '淺色模式';
            themeItems[1].textContent = '深色模式';
            themeItems[2].textContent = '系統設定';
        }
    }
    
    // 更新登入/註冊模態框中的連結文字
    const loginModalLinks = document.querySelectorAll('#loginModal a');
    loginModalLinks.forEach(link => {
        if (link.textContent.includes('還沒有帳號') || link.textContent.includes("Don't have")) {
            const parent = link.parentElement;
            if (parent) {
                parent.innerHTML = `${texts['no-account']} <a href="#" onclick="closeLogin(); openSignup(); return false;" style="color: var(--highlight); text-decoration: underline;">${texts['signup-link']}</a>`;
            }
        }
        if (link.textContent.includes('忘記密碼') || link.textContent.includes('Forgot password')) {
            link.textContent = texts['forgot-password'] || '忘記密碼？';
        }
    });
    
    // 更新忘記密碼模態框
    const forgotPasswordTitle = document.querySelector('#forgotPasswordModal h3');
    if (forgotPasswordTitle) {
        forgotPasswordTitle.textContent = texts['forgot-password-title'] || '忘記密碼';
    }
    
    const forgotPasswordDescription = document.querySelector('#forgotPasswordModal .modal-body p');
    if (forgotPasswordDescription && forgotPasswordDescription.textContent.includes('請輸入您的電子郵件')) {
        forgotPasswordDescription.textContent = texts['forgot-password-description'] || '請輸入您的電子郵件地址，我們將發送密碼重設連結給您。';
    }
    
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    if (forgotPasswordBtn) {
        const currentText = forgotPasswordBtn.textContent;
        if (!currentText.includes('發送中') && !currentText.includes('Sending') && !currentText.includes('发送中')) {
            forgotPasswordBtn.textContent = texts['forgot-password-submit'] || '發送重設連結';
        }
    }
    
    const backToLoginLink = document.querySelector('#forgotPasswordModal .modal-body p:last-child a');
    if (backToLoginLink) {
        backToLoginLink.textContent = texts['back-to-login'] || '返回登入';
    }
    
    const signupModalLinks = document.querySelectorAll('#signupModal a');
    signupModalLinks.forEach(link => {
        if (link.textContent.includes('已有帳號') || link.textContent.includes('Already have')) {
            const parent = link.parentElement;
            if (parent) {
                parent.innerHTML = `${texts['has-account']} <a href="#" onclick="closeSignup(); openLogin(); return false;" style="color: var(--highlight); text-decoration: underline;">${texts['login-link']}</a>`;
            }
        }
    });
    
    // 重新渲染歷史記錄以更新"已同步"文字
    if (typeof window.renderLocalHistory === 'function') {
        window.renderLocalHistory();
    }
    
    // 重新載入排行榜以更新文字
    if (typeof window.loadLeaderboard === 'function') {
        window.loadLeaderboard();
    }
    
    // 更新服務條款模態框內容
    const termsModalBody = document.querySelector('#termsModal .modal-body');
    if (termsModalBody) {
        termsModalBody.innerHTML = `
            <p>${texts['terms-welcome']}</p>
            
            <p><strong>${texts['terms-1-title']}</strong></p>
            <p>${texts['terms-1-content']}</p>
            
            <p><strong>${texts['terms-2-title']}</strong></p>
            <p>${texts['terms-2-content']}</p>
            
            <p><strong>${texts['terms-3-title']}</strong></p>
            <p>${texts['terms-3-content']}</p>
            
            <p><strong>${texts['terms-4-title']}</strong></p>
            <p>${texts['terms-4-content']}</p>
            
            <p><strong>${texts['terms-5-title']}</strong></p>
            <p>${texts['terms-5-content']}</p>
            
            <p><strong>${texts['terms-6-title']}</strong></p>
            <p>${texts['terms-6-content']}</p>
        `;
    }
    
    // 更新服務條款標題
    const termsTitle = document.querySelector('#termsModal h3');
    if (termsTitle) {
        termsTitle.textContent = texts['terms-title'];
    }
    
    // 更新隱私政策模態框內容
    const privacyModalBody = document.querySelector('#privacyModal .modal-body');
    if (privacyModalBody) {
        privacyModalBody.innerHTML = `
            <p><strong>${texts['privacy-1-title']}</strong></p>
            <p>${texts['privacy-1-content']}</p>
            
            <p><strong>${texts['privacy-2-title']}</strong></p>
            <p>${texts['privacy-2-p1']}</p>
            
            <p>${texts['privacy-2-p2']}</p>
            
            <p>${texts['privacy-2-p3']}</p>
            
            <p>${texts['privacy-2-p4']}</p>
            
            <p>${texts['privacy-2-p5']}</p>
            
            <p>${texts['privacy-2-p6']}</p>
            
            <p style="text-align: right; margin-top: 20px; color: #888;">${texts['privacy-author']}</p>
        `;
    }
    
    // 更新隱私政策標題
    const privacyTitle = document.querySelector('#privacyModal h3');
    if (privacyTitle) {
        privacyTitle.textContent = texts['privacy-title'];
    }
}

// 初始化語言
export function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'zh-TW';
    setLanguage(savedLang);
}

// 將 texts 暴露為當前語言的翻譯（向後兼容）
export const texts = translations['zh-TW'];

// 將語言相關變數暴露到全局，供模塊腳本使用
window.texts = texts;
window.getTexts = getTexts;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updatePageTexts = updatePageTexts;
