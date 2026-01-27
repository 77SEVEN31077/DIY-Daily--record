import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from './firebase.js';

// 處理登入
window.handleLogin = async function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    
    // 獲取當前語言的翻譯
    const texts = window.getTexts ? window.getTexts() : {};
    
    errorDiv.style.display = 'none';
    loginBtn.disabled = true;
    loginBtn.textContent = texts['logging-in'] || '登入中...';
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.closeLogin();
        alert(texts['login-success'] || '登入成功！');
    } catch (error) {
        errorDiv.style.display = 'block';
        if (error.code === 'auth/user-not-found') {
            errorDiv.textContent = texts['error-user-not-found'] || '找不到此帳號，請先註冊。';
        } else if (error.code === 'auth/wrong-password') {
            errorDiv.textContent = texts['error-wrong-password'] || '密碼錯誤，請重新輸入。';
        } else if (error.code === 'auth/invalid-email') {
            errorDiv.textContent = texts['error-invalid-email'] || '電子郵件格式不正確。';
        } else {
            errorDiv.textContent = (texts['error-login-failed'] || '登入失敗：') + error.message;
        }
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = texts['login-title'] || '登入';
    }
};

// 處理註冊
window.handleSignup = async function(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const errorDiv = document.getElementById('signupError');
    const signupBtn = document.getElementById('signupBtn');
    
    errorDiv.style.display = 'none';
    
    // 獲取當前語言的翻譯
    const texts = window.getTexts ? window.getTexts() : {};
    
    // 驗證密碼
    if (password !== passwordConfirm) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['error-password-mismatch'] || '兩次輸入的密碼不一致，請重新輸入。';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = texts['error-password-too-short'] || '密碼長度至少需要6個字元。';
        return;
    }
    
    signupBtn.disabled = true;
    signupBtn.textContent = texts['signing-up'] || '註冊中...';
    
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.closeSignup();
        alert(texts['signup-success'] || '註冊成功！歡迎使用！');
    } catch (error) {
        errorDiv.style.display = 'block';
        if (error.code === 'auth/email-already-in-use') {
            errorDiv.textContent = texts['error-email-in-use'] || '此電子郵件已被使用，請直接登入。';
        } else if (error.code === 'auth/invalid-email') {
            errorDiv.textContent = texts['error-invalid-email'] || '電子郵件格式不正確。';
        } else if (error.code === 'auth/weak-password') {
            errorDiv.textContent = texts['error-weak-password'] || '密碼強度不足，請使用更複雜的密碼。';
        } else {
            errorDiv.textContent = (texts['error-signup-failed'] || '註冊失敗：') + error.message;
        }
    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = texts['signup-title'] || '註冊';
    }
};

// 處理登出
window.handleLogout = async function() {
    const texts = window.getTexts ? window.getTexts() : {};
    try {
        await signOut(auth);
        alert(texts['logout-success'] || '已成功登出！');
    } catch (error) {
        alert((texts['logout-failed'] || '登出失敗：') + error.message);
    }
};

// 更新認證 UI
function updateAuthUI(user) {
    const navButtonsGroup = document.querySelector('.nav-buttons-group');
    if (!navButtonsGroup) return;
    
    const texts = window.getTexts ? window.getTexts() : { 'login': '登入', 'signup': '註冊', 'logout': '登出' };
    
    if (user) {
        // 用戶已登入
        const userEmail = user.email;
        navButtonsGroup.innerHTML = `
            <span style="color: var(--text-muted); font-size: 0.75rem; margin-right: 8px;">${userEmail}</span>
            <a href="#" class="nav-link nav-link-signin" onclick="handleLogout(); return false;">${texts['logout']}</a>
        `;
    } else {
        // 用戶未登入
        navButtonsGroup.innerHTML = `
            <a href="#" class="nav-link nav-link-signin" onclick="openLogin(); return false;">${texts['login']}</a>
            <a href="#" class="nav-link nav-link-signup" onclick="openSignup(); return false;">${texts['signup']}</a>
        `;
    }
}

// 監聽認證狀態變化
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    // 顯示/隱藏留言板
    if (window.toggleMessagesSection) {
        window.toggleMessagesSection(!!user);
    }
});

// 開啟登入模態框
window.openLogin = function() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginForm').reset();
};

// 關閉登入模態框
window.closeLogin = function() {
    document.getElementById('loginModal').style.display = 'none';
};

// 開啟註冊模態框
window.openSignup = function() {
    document.getElementById('signupModal').style.display = 'block';
    document.getElementById('signupError').style.display = 'none';
    document.getElementById('signupForm').reset();
};

// 關閉註冊模態框
window.closeSignup = function() {
    document.getElementById('signupModal').style.display = 'none';
};

// 開啟忘記密碼模態框
window.openForgotPassword = function() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'block';
        // 清空表單和訊息
        const form = document.getElementById('forgotPasswordForm');
        if (form) form.reset();
        const errorDiv = document.getElementById('forgotPasswordError');
        const successDiv = document.getElementById('forgotPasswordSuccess');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }
};

// 關閉忘記密碼模態框
window.closeForgotPassword = function() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// 處理忘記密碼
window.handleForgotPassword = async function(event) {
    if (event) {
        event.preventDefault();
    }
    
    const emailInput = document.getElementById('forgotPasswordEmail');
    const errorDiv = document.getElementById('forgotPasswordError');
    const successDiv = document.getElementById('forgotPasswordSuccess');
    const submitBtn = document.getElementById('forgotPasswordBtn');
    
    if (!emailInput) {
        console.error('找不到 forgotPasswordEmail 輸入框');
        return;
    }
    
    const email = emailInput.value.trim();
    const texts = window.getTexts ? window.getTexts() : {};
    
    // 驗證電子郵件
    if (!email) {
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = texts['error-invalid-email'] || '請輸入電子郵件地址。';
        }
        return;
    }
    
    // 隱藏之前的訊息
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
    
    // 禁用按鈕並顯示發送中
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = texts['sending'] || '發送中...';
    }
    
    try {
        console.log('發送密碼重設郵件到:', email);
        await sendPasswordResetEmail(auth, email);
        console.log('密碼重設郵件發送成功');
        
        // 顯示成功訊息
        if (successDiv) {
            successDiv.style.display = 'block';
            successDiv.textContent = texts['reset-email-sent'] || '密碼重設連結已發送到您的電子郵件，請檢查您的收件箱。';
        }
        
        // 清空輸入框
        emailInput.value = '';
        
        // 顯示成功提示視窗
        const message = texts['reset-email-sent'] || '密碼重設連結已發送到您的電子郵件，請檢查您的收件箱。';
        showSuccessModal(message);
        
    } catch (error) {
        console.error('發送密碼重設郵件失敗:', error);
        
        if (errorDiv) {
            errorDiv.style.display = 'block';
            if (error.code === 'auth/user-not-found') {
                errorDiv.textContent = texts['error-user-not-found'] || '找不到此帳號，請先註冊。';
            } else if (error.code === 'auth/invalid-email') {
                errorDiv.textContent = texts['error-invalid-email'] || '電子郵件格式不正確。';
            } else if (error.code === 'auth/too-many-requests') {
                errorDiv.textContent = texts['error-too-many-requests'] || '請求過於頻繁，請稍後再試。';
            } else {
                errorDiv.textContent = (texts['reset-email-failed'] || '發送失敗：') + error.message;
            }
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = texts['forgot-password-submit'] || '發送重設連結';
        }
    }
};

// 顯示成功提示視窗
function showSuccessModal(message) {
    // 創建提示視窗
    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--input-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        max-width: 90%;
        width: 400px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageText.style.cssText = `
        color: var(--text-color);
        font-size: 0.95rem;
        margin: 0 0 20px 0;
        line-height: 1.6;
    `;
    
    const okButton = document.createElement('button');
    const texts = window.getTexts ? window.getTexts() : {};
    okButton.textContent = texts['ok'] || '確定';
    okButton.className = 'btn';
    okButton.onclick = function() {
        document.body.removeChild(modal);
    };
    
    content.appendChild(messageText);
    content.appendChild(okButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.onclick = function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
}
