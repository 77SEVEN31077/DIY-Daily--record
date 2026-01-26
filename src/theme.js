// 主題切換功能 - 完全按照參考網站 doit.ykers.top 的實現方式
(function() {
    const attribute = 'class';
    const storageKey = 'theme';
    const defaultValue = 'system';
    const themes = ['light', 'dark'];
    const enableSystem = true;
    const enableColorScheme = true;
    
    const root = document.documentElement;
    
    function applyTheme(theme) {
        // 移除所有主題類
        themes.forEach(t => {
            root.classList.remove(t);
            root.removeAttribute('data-theme');
        });
        
        // 應用新主題
        if (theme === 'system' && enableSystem) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const actualTheme = prefersDark ? 'dark' : 'light';
            root.classList.add(actualTheme);
            root.setAttribute('data-theme', actualTheme);
            if (enableColorScheme) {
                root.style.colorScheme = actualTheme;
            }
        } else {
            root.classList.add(theme);
            root.setAttribute('data-theme', theme);
            if (enableColorScheme && themes.includes(theme)) {
                root.style.colorScheme = theme;
            }
        }
    }
    
    // 初始化主題
    let savedTheme = defaultValue;
    try {
        savedTheme = localStorage.getItem(storageKey) || defaultValue;
    } catch (e) {}
    
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // 如果沒有保存的主題，使用系統主題
        if (enableSystem) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        } else {
            applyTheme(defaultValue);
        }
    }
    
    // 監聽系統主題變化
    if (enableSystem) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const currentTheme = localStorage.getItem(storageKey) || defaultValue;
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });
    }
    
    // 主題切換函數
    let currentTheme = localStorage.getItem(storageKey) || defaultValue;
    
    function updateThemeIcon() {
        const themeIcon = document.getElementById('theme-icon');
        if (!themeIcon) return;
        
        if (currentTheme === 'light') {
            // 太陽圖標（淺色模式時顯示太陽）
            themeIcon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>';
        } else if (currentTheme === 'dark') {
            // 月亮圖標（深色模式時顯示月亮）
            themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>';
        } else {
            // 系統圖標
            themeIcon.innerHTML = '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle>';
        }
    }
    
    // 更新主題下拉菜單的活動狀態
    function updateThemeDropdownActive() {
        setTimeout(() => {
            const dropdown = document.getElementById('theme-dropdown');
            if (!dropdown) return;
            
            const items = dropdown.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.classList.remove('active');
                const itemTheme = item.getAttribute('data-theme');
                if (itemTheme === currentTheme) {
                    item.classList.add('active');
                }
            });
        }, 100);
    }
    
    // 暴露函數到全局
    window.applyTheme = function(theme) {
        applyTheme(theme);
        currentTheme = theme;
        try {
            localStorage.setItem(storageKey, theme);
        } catch (e) {}
        updateThemeIcon();
        updateThemeDropdownActive();
    };
    
    // 主題切換下拉菜單
    window.toggleThemeDropdown = function(event) {
        event.stopPropagation();
        const dropdown = document.getElementById('theme-dropdown');
        const languageDropdown = document.getElementById('language-dropdown');
        const btn = document.getElementById('theme-toggle-btn');
        
        // 關閉其他下拉菜單
        if (languageDropdown) languageDropdown.classList.remove('show');
        
        // 切換當前下拉菜單
        if (dropdown) {
            dropdown.classList.toggle('show');
            if (btn) btn.setAttribute('aria-expanded', dropdown.classList.contains('show'));
        }
    };
    
    // 選擇主題
    window.selectTheme = function(theme) {
        const dropdown = document.getElementById('theme-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            
            // 更新活動狀態
            const items = dropdown.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.classList.remove('active');
                const itemTheme = item.getAttribute('data-theme');
                if (itemTheme === theme) {
                    item.classList.add('active');
                }
            });
        }
        
        // 應用主題
        if (window.applyTheme) {
            window.applyTheme(theme);
        } else {
            // 如果 applyTheme 還沒準備好，直接設置主題
            const root = document.documentElement;
            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                root.classList.remove('light', 'dark');
                root.classList.add(prefersDark ? 'dark' : 'light');
            } else {
                root.setAttribute('data-theme', theme);
                root.classList.remove('light', 'dark', 'system');
                root.classList.add(theme);
            }
            localStorage.setItem('theme', theme);
            
            // 更新圖標
            setTimeout(() => {
                const themeIcon = document.getElementById('theme-icon');
                if (themeIcon) {
                    if (theme === 'light') {
                        themeIcon.innerHTML = '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>';
                    } else if (theme === 'dark') {
                        themeIcon.innerHTML = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>';
                    } else {
                        themeIcon.innerHTML = '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle>';
                    }
                }
            }, 100);
        }
    };
    
    // 初始化圖標
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateThemeIcon();
            updateThemeDropdownActive();
        });
    } else {
        updateThemeIcon();
        updateThemeDropdownActive();
    }
    
    // 點擊外部關閉下拉菜單
    document.addEventListener('click', function(event) {
        const themeDropdown = document.getElementById('theme-dropdown');
        const themeBtn = document.getElementById('theme-toggle-btn');
        
        if (themeDropdown && themeBtn && !themeBtn.contains(event.target) && !themeDropdown.contains(event.target)) {
            themeDropdown.classList.remove('show');
            themeBtn.setAttribute('aria-expanded', 'false');
        }
    });
})();
