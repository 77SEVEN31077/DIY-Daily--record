// 語言切換下拉菜單
window.toggleLanguageDropdown = function(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('language-dropdown');
    const themeDropdown = document.getElementById('theme-dropdown');
    const btn = document.getElementById('language-toggle-btn');
    
    // 關閉其他下拉菜單
    if (themeDropdown) themeDropdown.classList.remove('show');
    
    // 切換當前下拉菜單
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (btn) btn.setAttribute('aria-expanded', dropdown.classList.contains('show'));
    }
};

// 選擇語言
window.selectLanguage = function(lang) {
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        
        // 更新活動狀態
        const items = dropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick')?.includes(lang)) {
                item.classList.add('active');
            }
        });
    }
    
    // 保存語言設置
    localStorage.setItem('language', lang);
    
    // 這裡可以實現語言切換邏輯
    // 目前先顯示提示
    const langNames = {
        'zh-TW': '繁體中文',
        'en': 'English',
        'zh-CN': '简体中文'
    };
    // alert('語言已切換為：' + (langNames[lang] || lang));
};

// 點擊外部關閉下拉菜單
document.addEventListener('click', function(event) {
    const languageDropdown = document.getElementById('language-dropdown');
    const languageBtn = document.getElementById('language-toggle-btn');
    
    if (languageDropdown && languageBtn && !languageBtn.contains(event.target) && !languageDropdown.contains(event.target)) {
        languageDropdown.classList.remove('show');
        languageBtn.setAttribute('aria-expanded', 'false');
    }
});
