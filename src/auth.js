import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase.js';

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
