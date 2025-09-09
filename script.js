// 琳凯蒂亚语社区网站交互脚本

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeStarfield();
    initializeScrollEffects();
    initializeFloatingElements();
    initializeMagicParticles();
    
    // 初始化新功能
    initializeTianCalendar();
    initializeDailyWord();
    initializeHomepageFeatures();
    initializeCommunityUpdates();
    
    // 立即尝试初始化认证系统，然后多次重试确保状态正确
    initializeAuthSystem();
    
    // 多次重试认证系统初始化，确保跨页面状态正确
    setTimeout(function() {
        initializeAuthSystem();
        console.log('认证系统第一次重试初始化完成');
    }, 100);
    
    setTimeout(function() {
        updateAuthenticationState();
        console.log('认证状态第二次检查完成');
    }, 300);
    
    // 多次尝试更新田历日期，确保所有元素都已加载
    setTimeout(function() {
        updateTianDate();
        console.log('田历日期第一次初始化完成！');
    }, 50);
    
    setTimeout(function() {
        updateTianDate();
        console.log('田历日期第二次初始化完成！');
    }, 200);
    
    setTimeout(function() {
        updateTianDate();
        console.log('田历日期第三次初始化完成！');
    }, 500);
    
    console.log('琳凯蒂亚语社区加载完成！🌟');
});

// 页面完全加载后的额外初始化
window.addEventListener('load', function() {
    console.log('页面完全加载，执行最终初始化...');
    
    // 最后一次确保田历日期和认证系统正常工作
    setTimeout(() => {
        updateTianDate();
        updateAuthenticationState();
        console.log('最终初始化完成！');
    }, 100);
    
    // 额外的认证状态检查，确保跨页面状态保持
    setTimeout(() => {
        forceAuthStateRefresh();
        console.log('强制认证状态刷新完成！');
    }, 500);
});

// 创建动态星空
function initializeStarfield() {
    const starfield = document.getElementById('starfield');
    const numberOfStars = 100;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.position = 'absolute';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.background = getRandomStarColor();
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite alternate`;
        
        starfield.appendChild(star);
    }
}

// 获取随机星星颜色
function getRandomStarColor() {
    const colors = ['#ffd700', '#ffffff', '#00bcd4', '#e1bee7', '#fff9c4'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 平滑滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 初始化滚动效果
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 星空视差效果
        const starfield = document.getElementById('starfield');
        if (starfield) {
            starfield.style.transform = `translateY(${rate}px)`;
        }
        
        // 导航栏背景透明度
        const header = document.querySelector('.header');
        if (header) {
            const opacity = Math.min(scrolled / 100, 0.95);
            header.style.background = `rgba(26, 35, 126, ${opacity})`;
        }
        
        // 元素进入视窗动画
        animateOnScroll();
    });
}

// 滚动时的动画效果
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .coming-soon-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// 初始化元素的初始状态
function initializeFloatingElements() {
    const elements = document.querySelectorAll('.feature-card, .coming-soon-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.6s ease';
    });
}

// 创建魔法粒子效果
function initializeMagicParticles() {
    setInterval(createMagicParticle, 3000);
}

function createMagicParticle() {
    const particle = document.createElement('div');
    particle.className = 'magic-particle-dynamic';
    particle.style.position = 'fixed';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#ffd700';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px #ffd700';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '100';
    
    document.body.appendChild(particle);
    
    // 动画粒子向上飘动
    const animation = particle.animate([
        { 
            transform: 'translateY(0px)', 
            opacity: 0 
        },
        { 
            transform: 'translateY(-100px)', 
            opacity: 1 
        },
        { 
            transform: `translateY(-${window.innerHeight + 100}px)`, 
            opacity: 0 
        }
    ], {
        duration: 5000,
        easing: 'ease-out'
    });
    
    animation.addEventListener('finish', () => {
        particle.remove();
    });
}

// 鼠标移动效果
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    // 让漂浮元素跟随鼠标轻微移动
    const crystals = document.querySelectorAll('.floating-crystal');
    crystals.forEach((crystal, index) => {
        const moveX = (mouseX - 0.5) * 20 * (index + 1);
        const moveY = (mouseY - 0.5) * 20 * (index + 1);
        crystal.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX}deg)`;
    });
});

// 按钮点击效果
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // 创建涟漪效果
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';
        
        // 添加涟漪样式
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple-animation 0.6s linear';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加涟漪动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 响应式导航菜单
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// 特殊效果：双月交汇
function createMoonEffect() {
    const now = new Date();
    const day = now.getDate();
    
    // 每月15日显示特殊的月亮交汇效果
    if (day === 15) {
        const moonEffect = document.createElement('div');
        moonEffect.className = 'moon-overlay';
        moonEffect.style.position = 'fixed';
        moonEffect.style.top = '10%';
        moonEffect.style.right = '10%';
        moonEffect.style.width = '100px';
        moonEffect.style.height = '100px';
        moonEffect.style.background = 'linear-gradient(45deg, #c0c0c0, #ffd700)';
        moonEffect.style.borderRadius = '50%';
        moonEffect.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        moonEffect.style.zIndex = '1001';
        moonEffect.style.animation = 'moon-glow 3s ease-in-out infinite alternate';
        
        document.body.appendChild(moonEffect);
        
        // 3秒后移除效果
        setTimeout(() => {
            moonEffect.remove();
        }, 10000);
    }
}

// 页面加载时检查是否显示月亮效果
setTimeout(createMoonEffect, 2000);

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // 按ESC键回到顶部
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // 按空格键暂停/恢复动画
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        toggleAnimations();
    }
});

// 切换动画状态
let animationsPaused = false;
function toggleAnimations() {
    const animatedElements = document.querySelectorAll('*');
    animationsPaused = !animationsPaused;
    
    animatedElements.forEach(element => {
        if (animationsPaused) {
            element.style.animationPlayState = 'paused';
        } else {
            element.style.animationPlayState = 'running';
        }
    });
}

// =================== 田历历法系统 ===================

// 田历起点：2015年3月21日（公历） - 华田元年1月１日
const TIAN_CALENDAR_EPOCH = new Date(2015, 2, 21); // 月份从0开始，2表示3月

// 田历每月天数：[30,31,31,32,31,31,30,30,30,29,30,30]
const TIAN_MONTH_DAYS = [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30];

// 初始化田历系统
function initializeTianCalendar() {
    // 每分钟更新一次田历日期
    setInterval(updateTianDate, 60000);
    
    // 立即更新田历日期，多次尝试确保成功
    updateTianDate();
    setTimeout(updateTianDate, 10);
    setTimeout(updateTianDate, 100);
    setTimeout(updateTianDate, 300);
    
    console.log('田历系统初始化完成！📅');
}

// 计算是否为闰年（简化版，每4年一次）
function isTianLeapYear(year) {
    return year % 4 === 0;
}

// 获取田历某年的总天数
function getTianYearDays(year) {
    let totalDays = TIAN_MONTH_DAYS.reduce((sum, days) => sum + days, 0); // 365天
    if (isTianLeapYear(year)) {
        totalDays += 1; // 闰年时1月增加一天
    }
    return totalDays;
}

// 计算田历日期
function calculateTianDate() {
    const now = new Date();
    const diffTime = now - TIAN_CALENDAR_EPOCH;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        // 如果是田历纪元前，返回田元前的日期
        return {
            year: 0,
            month: 12,
            day: 30,
            dayOfYear: 0,
            era: '田元前'
        };
    }
    
    let remainingDays = diffDays;
    let year = 1;
    
    // 计算年份
    while (true) {
        const yearDays = getTianYearDays(year);
        if (remainingDays < yearDays) {
            break;
        }
        remainingDays -= yearDays;
        year++;
    }
    
    const dayOfYear = remainingDays + 1;
    
    // 计算月份和日期
    let month = 1;
    let day = remainingDays + 1;
    
    for (let m = 0; m < 12; m++) {
        let monthDays = TIAN_MONTH_DAYS[m];
        // 闰年的１月增加一天
        if (m === 0 && isTianLeapYear(year)) {
            monthDays += 1;
        }
        
        if (day <= monthDays) {
            month = m + 1;
            break;
        }
        day -= monthDays;
    }
    
    return {
        year: year,
        month: month,
        day: day,
        dayOfYear: dayOfYear,
        era: '华田',
        isLeapYear: isTianLeapYear(year)
    };
}

// 更新田历日期显示
function updateTianDate() {
    const tianDateElements = document.querySelectorAll('#tianDate');
    console.log('找到田历元素数量:', tianDateElements.length);
    
    if (tianDateElements.length === 0) {
        console.log('未找到田历日期元素，稍后重试...');
        return;
    }
    
    try {
        const tianDate = calculateTianDate();
        let dateString;
        
        if (tianDate.era === '田元前') {
            dateString = `田元前${Math.abs(tianDate.year)}年`;
        } else {
            dateString = `华田${tianDate.year}年${tianDate.month}月${tianDate.day}日`;
        }
        
        console.log('计算出的田历日期:', dateString);
        
        tianDateElements.forEach((element, index) => {
            element.textContent = dateString;
            console.log(`更新第${index + 1}个田历元素:`, element);
            
            // 添加特殊节日提示
            const festival = getTianFestival(tianDate);
            if (festival) {
                element.title = `今日是：${festival}`;
                element.style.color = '#ffd700';
            } else {
                element.title = tianDate.isLeapYear ? '闰年' : '';
                element.style.color = '';
            }
        });
        
    } catch (error) {
        console.error('田历日期计算错误:', error);
        tianDateElements.forEach(element => {
            element.textContent = '田历载入失败';
        });
    }
}

// 获取田历节日
function getTianFestival(tianDate) {
    const { month, day, era } = tianDate;
    
    if (era === '田元前') return null;
    
    // 定义田历节日
    const festivals = {
        '1-1': '新年节',
        '3-15': '双月交辉节',
        '6-21': '星光节',
        '9-9': '水晶节',
        '12-30': '年末祭'
    };
    
    const key = `${month}-${day}`;
    return festivals[key] || null;
}

// =================== 统一认证系统初始化 ===================

// 统一认证状态更新函数（兼容新旧系统）
function updateAuthenticationState() {
    console.log('执行统一认证状态更新...');
    
    // 優先使用新认证系统
    if (window.authSystem) {
        console.log('使用新认证系统更新UI');
        updateNewAuthUI();
    } else if (typeof updateAuthUI === 'function') {
        console.log('使用旧认证系统更新UI');
        updateAuthUI();
    } else {
        console.log('未找到可用的认证系统');
    }
}

// 强制刷新认证状态（解决跨页面状态不同步问题）
function forceAuthStateRefresh() {
    console.log('强制刷新认证状态...');
    
    if (window.authSystem) {
        // 重新从 localStorage 加载用户状态
        const storedUser = localStorage.getItem('linkaitiya_current_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                window.authSystem.currentUser = userData;
                console.log('从 localStorage 重新加载用户状态:', userData.username);
            } catch (error) {
                console.error('用户数据解析错误:', error);
                window.authSystem.currentUser = null;
            }
        } else {
            window.authSystem.currentUser = null;
            console.log('未找到存储的用户数据');
        }
        
        // 强制更新UI
        updateNewAuthUI();
    } else {
        // 针对旧系统的强制刷新
        const savedUser = localStorage.getItem('linkaitiya_user');
        if (savedUser) {
            try {
                currentUser = JSON.parse(savedUser);
                console.log('从 localStorage 重新加载用户状态 (旧系统):', currentUser.username);
            } catch (error) {
                console.error('用户数据解析错误 (旧系统):', error);
                currentUser = null;
            }
        } else {
            currentUser = null;
        }
        
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }
    }
    
    console.log('强制刷新完成');
}

// 初始化认证系统（统一入口）
function initializeAuthSystem() {
    console.log('开始初始化认证系统...');
    
    // 添加全局认证状态监听器
    setupAuthEventListeners();
    
    // 检查认证系统是否已加载
    if (window.authSystem) {
        console.log('新认证系统已加载，使用新系统');
        
        // 验证现有会话
        if (window.authSystem.currentUser) {
            console.log('发现现有用户会话:', window.authSystem.currentUser.username);
            if (!window.authSystem.validateSession()) {
                console.log('会话已过期，清除用户信息');
            }
        }
        
        // 清除旧系统的用户数据，防止冲突
        if (typeof currentUser !== 'undefined') {
            console.log('清除旧系统的用户数据');
            currentUser = null;
        }
        localStorage.removeItem('linkaitiya_user'); // 清除旧系统数据
        
        // 初始化新认证系统
        initializeNewAuth();
    } else {
        console.log('新认证系统未加载，使用旧系统');
        // 降级到旧的认证系统
        initializeAuth();
    }
}

// 设置认证事件监听器
function setupAuthEventListeners() {
    // 监听用户登录事件
    window.addEventListener('userLogin', function(event) {
        console.log('监听到用户登录事件:', event.detail);
        updateAuthenticationState();
    });
    
    // 监听用户退出事件
    window.addEventListener('userLogout', function() {
        console.log('监听到用户退出事件');
        updateAuthenticationState();
    });
    
    // 监听 localStorage 变化（跨标签页同步）
    window.addEventListener('storage', function(event) {
        console.log('检测到 localStorage 变化:', event.key, event.newValue);
        
        // 新认证系统的跨页面同步
        if (event.key === 'linkaitiya_current_user') {
            console.log('检测到跨标签页认证状态变化 (新系统)');
            
            if (window.authSystem) {
                window.authSystem.currentUser = JSON.parse(event.newValue || 'null');
                updateNewAuthUI();
                console.log('新系统跨页面状态已同步');
            }
        }
        
        // 旧认证系统的跨页面同步
        if (event.key === 'linkaitiya_user') {
            console.log('检测到跨标签页认证状态变化 (旧系统)');
            
            if (!window.authSystem) {
                currentUser = JSON.parse(event.newValue || 'null');
                if (typeof updateAuthUI === 'function') {
                    updateAuthUI();
                }
                console.log('旧系统跨页面状态已同步');
            }
        }
    });
    
    // 监听页面可见性变化（当用户切换标签页回来时）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('页面变为可见，刷新认证状态');
            
            // 延迟一点刷新，确保页面完全激活
            setTimeout(() => {
                forceAuthStateRefresh();
            }, 100);
        }
    });
    
    // 监听页面获得焦点（当用户点击页面或切换回来时）
    window.addEventListener('focus', function() {
        console.log('页面获得焦点，检查认证状态');
        setTimeout(() => {
            updateAuthenticationState();
        }, 50);
    });
    
    console.log('认证事件监听器已设置（增强版）');
}

// =================== 新认证系统集成 ===================

// 初始化新认证系统
function initializeNewAuth() {
    // 绑定认证相关事件
    bindNewAuthEvents();
    
    // 更新UI状态
    updateNewAuthUI();
    
    console.log('新认证系统初始化完成！🔐');
}

// 绑定新认证相关事件
function bindNewAuthEvents() {
    // 等待DOM元素加载后再绑定事件
    setTimeout(() => {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutLink = document.getElementById('logoutLink');
        const profileLink = document.getElementById('profileLink');
        
        console.log('绑定新认证事件，找到的按钮:', { loginBtn, registerBtn, logoutLink, profileLink });
        
        if (loginBtn) {
            loginBtn.removeEventListener('click', showNewLoginModal);
            loginBtn.addEventListener('click', showNewLoginModal);
            console.log('绑定登录按钮事件');
        }
        
        if (registerBtn) {
            registerBtn.removeEventListener('click', showNewRegisterModal);
            registerBtn.addEventListener('click', showNewRegisterModal);
            console.log('绑定注册按钮事件');
        }
        
        if (logoutLink) {
            logoutLink.removeEventListener('click', handleNewLogout);
            logoutLink.addEventListener('click', handleNewLogout);
        }
        
        if (profileLink) {
            profileLink.removeEventListener('click', showNewProfile);
            profileLink.addEventListener('click', showNewProfile);
        }
    }, 100);
}

// 更新新认证UI
function updateNewAuthUI() {
    console.log('开始更新新认证UI...');
    
    // 确保认证系统已加载
    if (!window.authSystem) {
        console.log('认证系统未加载，跳过UI更新');
        return;
    }
    
    // 获取所有相关元素（多次尝试获取）
    let authButtons = document.querySelector('.auth-buttons');
    let userInfo = document.getElementById('userInfo');
    let userAvatar = document.getElementById('userAvatar');
    let userName = document.getElementById('userName');
    
    // 如果初次未找到元素，稍后再试
    if (!authButtons || !userInfo) {
        console.log('首次未找到认证UI元素，100ms后重试...');
        setTimeout(() => {
            authButtons = document.querySelector('.auth-buttons');
            userInfo = document.getElementById('userInfo');
            userAvatar = document.getElementById('userAvatar');
            userName = document.getElementById('userName');
            
            if (!authButtons || !userInfo) {
                console.log('第二次仍未找到认证UI元素，放弃更新');
                return;
            }
            
            // 执行实际的UI更新
            performAuthUIUpdate(authButtons, userInfo, userAvatar, userName);
        }, 100);
        return;
    }
    
    // 执行实际的UI更新
    performAuthUIUpdate(authButtons, userInfo, userAvatar, userName);
}

// 执行实际的认证UI更新
function performAuthUIUpdate(authButtons, userInfo, userAvatar, userName) {
    console.log('执行实际的认证UI更新...');
    console.log('找到的元素:', { 
        authButtons: !!authButtons, 
        userInfo: !!userInfo, 
        userAvatar: !!userAvatar, 
        userName: !!userName 
    });
    console.log('当前用户:', window.authSystem.currentUser);
    
    // 验证会话有效性
    if (window.authSystem.currentUser && !window.authSystem.validateSession()) {
        console.log('会话已过期，清除用户状态');
        window.authSystem.currentUser = null;
        localStorage.removeItem('linkaitiya_current_user');
    }
    
    if (window.authSystem.currentUser) {
        // 已登录状态 - 隐藏登录注册按钮容器，显示用户信息
        if (authButtons) {
            authButtons.style.display = 'none';
            console.log('✅ 隐藏登录注册按钮');
        }
        if (userInfo) {
            userInfo.style.display = 'flex';
            console.log('✅ 显示用户信息容器');
        }
        
        if (userAvatar) {
            userAvatar.textContent = window.authSystem.currentUser.avatar;
            console.log('✅ 设置用户头像:', window.authSystem.currentUser.avatar);
        }
        if (userName) {
            userName.textContent = window.authSystem.currentUser.username;
            console.log('✅ 设置用户名:', window.authSystem.currentUser.username);
        }
        
        // 显示管理员链接（如果是管理员）
        const adminNav = document.getElementById('adminNav');
        if (adminNav) {
            if (window.authSystem.isAdmin() || 
                window.authSystem.currentUser.role === '管理员' ||
                window.authSystem.currentUser.username === '琳凯蒂亚') {
                adminNav.style.display = 'block';
                console.log('✅ 显示管理员链接');
            } else {
                adminNav.style.display = 'none';
                console.log('➖ 隐藏管理员链接（非管理员）');
            }
        }
        
        console.log('✅ 用户已登录，显示用户信息');
    } else {
        // 未登录状态 - 显示登录注册按钮容器，隐藏用户信息
        if (authButtons) {
            authButtons.style.display = 'flex';
            console.log('✅ 显示登录注册按钮');
        }
        if (userInfo) {
            userInfo.style.display = 'none';
            console.log('✅ 隐藏用户信息容器');
        }
        
        // 隐藏管理员链接
        const adminNav = document.getElementById('adminNav');
        if (adminNav) {
            adminNav.style.display = 'none';
            console.log('➖ 隐藏管理员链接（未登录）');
        }
        
        console.log('✅ 用户未登录，显示登录注册按钮');
    }
    
    // 更新词典页面权限（如果在词典页面）
    if (typeof updatePermissions === 'function') {
        updatePermissions();
        console.log('✅ 更新词典页面权限');
    }
    
    console.log('✅ 认证UI更新完成');
}

// 显示新登录模态框
function showNewLoginModal() {
    const modal = createNewModal('新登录', `
        <div style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 15px;">🌟 欢迎来到琳凯蒂亚语社区！</p>
            <p style="margin-bottom: 20px;">请输入您的光线使者信息：</p>
            <input type="text" id="newLoginUsername" placeholder="用户名或邮箱" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="password" id="newLoginPassword" placeholder="密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <button onclick="performNewLogin()" style="background: linear-gradient(45deg, #ffd700, #00bcd4); color: #1a237e; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">进入星球</button>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #888;">还没有账号？<a href="#" onclick="closeModal(); showNewRegisterModal();" style="color: #ffd700;">立即注册</a></p>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 显示新注册模态框
function showNewRegisterModal() {
    const modal = createNewModal('成为光线使者', `
        <div style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 15px;">✨ 成为光线使者！</p>
            <p style="margin-bottom: 20px;">加入琳凯蒂亚星球的探索之旅：</p>
            <input type="text" id="newRegUsername" placeholder="选择你的使者名" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="email" id="newRegEmail" placeholder="星际邮箱" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="password" id="newRegPassword" placeholder="设置密码" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="password" id="newRegConfirmPassword" placeholder="确认密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <button onclick="performNewRegister()" style="background: linear-gradient(45deg, #7b1fa2, #00bcd4); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">开始冒险</button>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #888;">已有账号？<a href="#" onclick="closeModal(); showNewLoginModal();" style="color: #ffd700;">立即登录</a></p>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 创建新模态框
function createNewModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'new-modal';
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
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a237e, #3f51b5); padding: 0; border-radius: 10px; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
            <div style="background: linear-gradient(45deg, #ffd700, #00bcd4); padding: 15px; border-radius: 10px 10px 0 0; color: #1a237e; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>${title}</span>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #1a237e;">&times;</button>
            </div>
            <div style="color: white;">${content}</div>
        </div>
    `;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

// 关闭模态框
function closeModal() {
    const modals = document.querySelectorAll('.new-modal');
    modals.forEach(modal => modal.remove());
}

// 执行新登录
async function performNewLogin() {
    const username = document.getElementById('newLoginUsername').value.trim();
    const password = document.getElementById('newLoginPassword').value;
    
    if (!username || !password) {
        alert('请填写完整的登录信息！');
        return;
    }
    
    try {
        const result = await window.authSystem.login({ username, password });
        
        if (result.success) {
            closeModal();
            
            // 立即更新UI并强制刷新
            updateAuthenticationState();
            setTimeout(() => {
                forceAuthStateRefresh();
            }, 100);
            
            // 显示欢迎消息
            showNewWelcomeMessage(result.message);
            
            // 触发全局事件，通知其他组件更新
            window.dispatchEvent(new CustomEvent('userLogin', {
                detail: { user: window.authSystem.currentUser }
            }));
            
            console.log('登录成功，已更新UI并触发事件');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('登录失败：' + error.message);
    }
}

// 执行新注册
async function performNewRegister() {
    const username = document.getElementById('newRegUsername').value.trim();
    const email = document.getElementById('newRegEmail').value.trim();
    const password = document.getElementById('newRegPassword').value;
    const confirmPassword = document.getElementById('newRegConfirmPassword').value;
    
    if (!username || !email || !password || !confirmPassword) {
        alert('请填写完整的注册信息！');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }
    
    try {
        const result = await window.authSystem.register({ username, email, password });
        
        if (result.success) {
            closeModal();
            
            // 立即更新UI并强制刷新
            updateAuthenticationState();
            setTimeout(() => {
                forceAuthStateRefresh();
            }, 100);
            
            // 显示欢迎消息
            showNewWelcomeMessage(result.message);
            
            // 触发全局事件，通知其他组件更新
            window.dispatchEvent(new CustomEvent('userLogin', {
                detail: { user: window.authSystem.currentUser }
            }));
            
            console.log('注册成功，已更新UI并触发事件');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('注册失败：' + error.message);
    }
}

// 处理新退出登录
function handleNewLogout() {
    if (confirm('确定要退出登录吗？')) {
        const result = window.authSystem.logout();
        
        // 立即更新UI并强制刷新
        updateAuthenticationState();
        setTimeout(() => {
            forceAuthStateRefresh();
        }, 100);
        
        // 显示消息
        showNewWelcomeMessage(result.message);
        
        // 触发全局事件，通知其他组件更新
        window.dispatchEvent(new CustomEvent('userLogout'));
        
        console.log('退出登录成功，已更新UI并触发事件');
    }
}

// 显示新个人资料
function showNewProfile() {
    if (!window.authSystem.currentUser) return;
    
    const user = window.authSystem.currentUser;
    const joinDate = new Date(user.joinDate).toLocaleDateString('zh-CN');
    const tianDate = calculateTianDate();
    
    const modal = createNewModal('个人中心', `
        <div style="padding: 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #ffd700, #7b1fa2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; color: white;">
                ${user.avatar}
            </div>
            <h3 style="color: #ffd700; margin-bottom: 10px;">${user.username}</h3>
            <p style="color: #00bcd4; margin-bottom: 15px;">${user.rank}</p>
            <div style="text-align: left; margin-top: 20px;">
                <p><strong>邮箱：</strong> ${user.email}</p>
                <p><strong>角色：</strong> ${user.role}</p>
                <p><strong>加入日期：</strong> ${joinDate}</p>
                <p><strong>当前田历：</strong> 华田${tianDate.year}年${tianDate.month}月${tianDate.day}日</p>
            </div>
            ${(user.role === 'admin' || user.role === '管理员' || user.username === '琳凯蒂亚') ? 
                '<div style="margin-top: 20px;"><a href="admin.html" style="background: #ff9800; color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; display: inline-block;">管理后台</a></div>' : 
                ''}
            <div style="margin-top: 20px;">
                <button onclick="handleNewLogout(); closeModal();" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">退出登录</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 显示新欢迎消息
function showNewWelcomeMessage(message) {
    const welcome = document.createElement('div');
    welcome.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ffd700, #00bcd4);
        color: #1a237e;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        font-weight: bold;
        max-width: 300px;
        animation: slideInRight 0.5s ease-out;
    `;
    
    welcome.textContent = message;
    document.body.appendChild(welcome);
    
    // 3秒后自动消失
    setTimeout(() => {
        welcome.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => welcome.remove(), 500);
    }, 3000);
}

// 用户认证状态
let currentUser = null;

// 初始化认证系统
function initializeAuth() {
    console.log('初始化认证系统...');
    
    // 检查本地存储的用户信息
    const savedUser = localStorage.getItem('linkaitiya_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            console.log('发现已保存的用户信息:', currentUser);
        } catch (error) {
            console.error('用户信息解析错误:', error);
            localStorage.removeItem('linkaitiya_user');
        }
    }
    
    // 绑定认证按钮事件
    bindAuthEvents();
    
    // 更新UI，稍后再次尝试确保元素已加载
    setTimeout(updateAuthUI, 50);
    setTimeout(updateAuthUI, 200);
    setTimeout(updateAuthUI, 500);
    
    console.log('用户认证系统初始化完成！🔐');
}

// 绑定认证相关事件
function bindAuthEvents() {
    // 等待DOM元素加载后再绑定事件
    setTimeout(() => {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutLink = document.getElementById('logoutLink');
        const profileLink = document.getElementById('profileLink');
        
        console.log('绑定认证事件，找到的按钮:', { loginBtn, registerBtn, logoutLink, profileLink });
        
        if (loginBtn) {
            // 移除旧的事件监听器
            loginBtn.removeEventListener('click', showLoginModal);
            loginBtn.addEventListener('click', showLoginModal);
            console.log('绑定登录按钮事件');
        }
        
        if (registerBtn) {
            registerBtn.removeEventListener('click', showRegisterModal);
            registerBtn.addEventListener('click', showRegisterModal);
            console.log('绑定注册按钮事件');
        }
        
        if (logoutLink) {
            logoutLink.removeEventListener('click', logout);
            logoutLink.addEventListener('click', logout);
        }
        
        if (profileLink) {
            profileLink.removeEventListener('click', showProfile);
            profileLink.addEventListener('click', showProfile);
        }
    }, 100);
}

// 显示登录模态框
function showLoginModal() {
    // 创建简单的登录提示
    const modal = createModal('登录', `
        <div style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 15px;">🌟 欢迎来到琳凯蒂亚语社区！</p>
            <p style="margin-bottom: 20px;">请输入您的光线使者信息：</p>
            <input type="text" id="loginUsername" placeholder="用户名" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="password" id="loginPassword" placeholder="密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <button onclick="performLogin()" style="background: linear-gradient(45deg, #ffd700, #00bcd4); color: #1a237e; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">进入星球</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 显示注册模态框
function showRegisterModal() {
    const modal = createModal('注册', `
        <div style="text-align: center; padding: 20px;">
            <p style="margin-bottom: 15px;">✨ 成为光线使者！</p>
            <p style="margin-bottom: 20px;">加入琳凯蒂亚星球的探索之旅：</p>
            <input type="text" id="regUsername" placeholder="选择你的使者名" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="email" id="regEmail" placeholder="星际邮箱" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <input type="password" id="regPassword" placeholder="设置密码" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px;">
            <button onclick="performRegister()" style="background: linear-gradient(45deg, #7b1fa2, #00bcd4); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">开始冒险</button>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 创建模态框
function createModal(title, content) {
    const modal = document.createElement('div');
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
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #1a237e, #3f51b5); padding: 0; border-radius: 10px; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
            <div style="background: linear-gradient(45deg, #ffd700, #00bcd4); padding: 15px; border-radius: 10px 10px 0 0; color: #1a237e; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
                <span>${title}</span>
                <button onclick="this.closest('div[style*="fixed"]').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #1a237e;">&times;</button>
            </div>
            <div style="color: white;">${content}</div>
        </div>
    `;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// 执行登录
function performLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('请填写完整的登录信息！');
        return;
    }
    
    // 简单的模拟登录
    currentUser = {
        username: username,
        email: `${username}@linkaitiya.star`,
        avatar: username.charAt(0).toUpperCase(),
        rank: '初级光线使者',
        joinDate: new Date().toISOString()
    };
    
    // 保存到本地存储
    localStorage.setItem('linkaitiya_user', JSON.stringify(currentUser));
    
    // 更新UI
    updateAuthUI();
    
    // 关闭模态框
    document.querySelector('div[style*="fixed"]').remove();
    
    // 显示欢迎消息
    showWelcomeMessage(`欢迎回来，${username}！🌟`);
}

// 执行注册
function performRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    
    if (!username || !email || !password) {
        alert('请填写完整的注册信息！');
        return;
    }
    
    if (!email.includes('@')) {
        alert('请输入有效的邮箱地址！');
        return;
    }
    
    // 简单的模拟注册
    currentUser = {
        username: username,
        email: email,
        avatar: username.charAt(0).toUpperCase(),
        rank: '见习光线使者',
        joinDate: new Date().toISOString()
    };
    
    // 保存到本地存储
    localStorage.setItem('linkaitiya_user', JSON.stringify(currentUser));
    
    // 更新UI
    updateAuthUI();
    
    // 关闭模态框
    document.querySelector('div[style*="fixed"]').remove();
    
    // 显示欢迎消息
    showWelcomeMessage(`欢迎加入琳凯蒂亚星球，${username}！✨`);
}

// 更新认证UI
function updateAuthUI() {
    console.log('更新认证UI（旧系统），当前用户:', currentUser);
    
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    console.log('找到的元素 (旧系统):', { authButtons: !!authButtons, userInfo: !!userInfo, userAvatar: !!userAvatar, userName: !!userName });
    
    if (currentUser) {
        // 已登录状态
        if (authButtons) {
            authButtons.style.display = 'none';
            console.log('隐藏登录注册按钮 (旧系统)');
        }
        
        if (userInfo) {
            userInfo.style.display = 'flex';
            console.log('显示用户信息 (旧系统)');
        }
        
        if (userAvatar) {
            userAvatar.textContent = currentUser.avatar;
            userAvatar.title = currentUser.rank;
            console.log('设置用户头像 (旧系统):', currentUser.avatar);
        }
        
        if (userName) {
            userName.textContent = currentUser.username;
            console.log('设置用户名 (旧系统):', currentUser.username);
        }
        
        console.log('用户已登录 (旧系统)，显示用户信息');
    } else {
        // 未登录状态
        if (authButtons) {
            authButtons.style.display = 'flex';
            console.log('显示登录注册按钮 (旧系统)');
        }
        
        if (userInfo) {
            userInfo.style.display = 'none';
            console.log('隐藏用户信息 (旧系统)');
        }
        
        console.log('用户未登录 (旧系统)，显示登录注册按钮');
    }
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('linkaitiya_user');
    updateAuthUI();
    showWelcomeMessage('您已退出琳凯蒂亚星球，期待您的再次光临！👋');
}

// 显示个人中心
function showProfile() {
    if (!currentUser) return;
    
    const joinDate = new Date(currentUser.joinDate).toLocaleDateString('zh-CN');
    const tianDate = calculateTianDate();
    
    const modal = createModal('个人中心', `
        <div style="padding: 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(45deg, #ffd700, #7b1fa2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; color: white;">
                ${currentUser.avatar}
            </div>
            <h3 style="color: #ffd700; margin-bottom: 10px;">${currentUser.username}</h3>
            <p style="color: #00bcd4; margin-bottom: 15px;">${currentUser.rank}</p>
            <div style="text-align: left; margin-top: 20px;">
                <p><strong>邮箱：</strong> ${currentUser.email}</p>
                <p><strong>加入日期：</strong> ${joinDate}</p>
                <p><strong>当前田历：</strong> 田历${tianDate.year}年${tianDate.month}月${tianDate.day}日</p>
            </div>
            <div style="margin-top: 20px;">
                <button onclick="logout(); this.closest('div[style*="fixed"]').remove();" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">退出登录</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// 显示欢迎消息
function showWelcomeMessage(message) {
    const welcome = document.createElement('div');
    welcome.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #ffd700, #00bcd4);
        color: #1a237e;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        font-weight: bold;
        max-width: 300px;
        animation: slideInRight 0.5s ease-out;
    `;
    
    welcome.textContent = message;
    document.body.appendChild(welcome);
    
    // 3秒后自动消失
    setTimeout(() => {
        welcome.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => welcome.remove(), 500);
    }, 3000);
}

// 添加动画样式
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(authStyle);

// ===============================
// 新增：首页特有功能
// ===============================

// 初始化每日一词功能
function initializeDailyWord() {
    const dailyWords = [
        {
            linkaitiya: 'link',
            pronunciation: '[liŋk]',
            chinese: '光，光线',
            type: '名词',
            example: 'link beautiful',
            exampleChinese: '美丽的光线'
        },
        {
            linkaitiya: 'kaitiya',
            pronunciation: '[kaɪˈtiːja]',
            chinese: '星球，世界',
            type: '名词',
            example: 'beautiful kaitiya',
            exampleChinese: '美丽的星球'
        },
        {
            linkaitiya: 'beautiful',
            pronunciation: '[bjuːˈtɪfol]',
            chinese: '美丽的',
            type: '形容词',
            example: 'beautiful nim mun',
            exampleChinese: '美丽的双月'
        },
        {
            linkaitiya: 'sose',
            pronunciation: '[soːseː]',
            chinese: '学习',
            type: '动词',
            example: 'wi sose linkaitiya',
            exampleChinese: '我学习琳凯蒂亚语'
        },
        {
            linkaitiya: 'mun',
            pronunciation: '[muːn]',
            chinese: '月亮',
            type: '名词',
            example: 'nim mun shine',
            exampleChinese: '双月闪耀'
        }
    ];
    
    // 获取今天的词汇（基于日期的简单随机）
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const wordIndex = dayOfYear % dailyWords.length;
    const todayWord = dailyWords[wordIndex];
    
    // 更新页面元素
    updateDailyWordDisplay(todayWord);
    
    // 绑定事件
    const refreshBtn = document.getElementById('refreshWordBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            const randomIndex = Math.floor(Math.random() * dailyWords.length);
            updateDailyWordDisplay(dailyWords[randomIndex]);
            
            // 添加刷新动画
            const card = document.querySelector('.daily-word-card');
            if (card) {
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            }
        });
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            window.location.href = 'dictionary.html';
        });
    }
    
    // 更新日期显示
    const wordDateElement = document.getElementById('wordDate');
    if (wordDateElement) {
        const formatDate = today.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        wordDateElement.textContent = formatDate;
    }
}

// 更新每日一词显示
function updateDailyWordDisplay(word) {
    const elements = {
        linkaitiya: document.getElementById('dailyWordLinkaitiya'),
        pronunciation: document.getElementById('dailyWordPronunciation'),
        chinese: document.getElementById('dailyWordChinese'),
        type: document.getElementById('dailyWordType'),
        example: document.getElementById('dailyWordExample'),
        exampleChinese: document.getElementById('dailyWordExampleChinese')
    };
    
    Object.keys(elements).forEach(key => {
        if (elements[key] && word[key]) {
            elements[key].textContent = word[key];
        }
    });
}

// 初始化首页特有功能
function initializeHomepageFeatures() {
    // 初始化学习路径动画
    const pathSteps = document.querySelectorAll('.path-step');
    pathSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.6s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, index * 200);
    });
    
    // 初始化成就系统
    initializeAchievements();
}

// 初始化成就系统
function initializeAchievements() {
    const achievements = [
        { id: 'newcomer', name: '初来乍到', unlocked: true, progress: 1, max: 1 },
        { id: 'learner', name: '勤学者', unlocked: false, progress: 45, max: 100 },
        { id: 'social', name: '社交达人', unlocked: false, progress: 3, max: 10 },
        { id: 'consistent', name: '光线使者', unlocked: false, progress: 12, max: 30 },
        { id: 'master', name: '语言大师', unlocked: false, progress: 0, max: 1 },
        { id: 'explorer', name: '星球探索者', unlocked: false, progress: 0, max: 1 }
    ];
    
    // 更新成就显示
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach((card, index) => {
        const achievement = achievements[index];
        if (achievement) {
            const progressElement = card.querySelector('.achievement-progress');
            if (progressElement && !achievement.unlocked) {
                if (achievement.progress > 0) {
                    progressElement.textContent = `${achievement.progress}/${achievement.max}`;
                }
            }
        }
    });
}

// 初始化社区动态
function initializeCommunityUpdates() {
    // 动态加载统计数据
    updateStatistics();
    
    // 动态加载热门话题
    loadHotTopics();
    
    // 动态加载最新更新
    loadLatestNews();
}

// 更新统计数据
function updateStatistics() {
    // 模拟数据，实际中可以从 localStorage 或 API 获取
    const stats = {
        totalWords: 1247 + Math.floor(Math.random() * 100),
        totalUsers: 356 + Math.floor(Math.random() * 50),
        todayActive: 42 + Math.floor(Math.random() * 20)
    };
    
    // 动画更新数字
    animateCounter('totalWords', 0, stats.totalWords, 2000);
    animateCounter('totalUsers', 0, stats.totalUsers, 2500);
    animateCounter('todayActive', 0, stats.todayActive, 1500);
}

// 数字动画效果
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = Date.now();
    const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };
    
    updateCounter();
}

// 加载热门话题
function loadHotTopics() {
    const topics = [
        { title: '琳凯蒂亚语的语序问题', replies: 23 },
        { title: '如何记住复杂的代词变格？', replies: 18 },
        { title: '双月历法的计算方法', replies: 15 },
        { title: 'AI翻译的准确性问题', replies: 12 },
        { title: '初学者应该从哪里开始？', replies: 9 }
    ];
    
    const container = document.getElementById('hotTopics');
    if (container) {
        container.innerHTML = topics.map(topic => `
            <div class="topic-item">
                <span class="topic-title">${topic.title}</span>
                <span class="topic-replies">${topic.replies}回复</span>
            </div>
        `).join('');
        
        // 添加点击事件
        container.addEventListener('click', function(e) {
            const topicItem = e.target.closest('.topic-item');
            if (topicItem) {
                window.location.href = 'community.html';
            }
        });
    }
}

// 加载最新更新
function loadLatestNews() {
    const news = [
        { date: '2025-01-06', content: '新增50个魔法相关词汇' },
        { date: '2025-01-05', content: 'AI翻译功能正式上线' },
        { date: '2025-01-04', content: '语法练习系统优化更新' },
        { date: '2025-01-03', content: '社区讨论功能增强' },
        { date: '2025-01-02', content: '用户成就系统上线' }
    ];
    
    const container = document.getElementById('latestNews');
    if (container) {
        container.innerHTML = news.map(item => `
            <div class="news-item">
                <div class="news-date">${item.date}</div>
                <div class="news-content">${item.content}</div>
            </div>
        `).join('');
    }
}

// ===============================
// 快速工具功能
// ===============================

// 打开翻译器
function openTranslator() {
    // 可以打开一个模态框或跳转到社区的翻译功能
    window.location.href = 'community.html#translation';
}

// 打开发音指南
function openPronunciation() {
    window.location.href = 'grammar.html#phonetics';
}

// 打开田历转换
function openCalendar() {
    window.location.href = 'culture.html#calendar';
}

// 打开随机词汇
function openRandomWord() {
    window.location.href = 'dictionary.html';
}

// ===============================
// 交互动画增强
// ===============================

// 增强滚动动画
function enhanceScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll(
        '.path-step, .daily-word-card, .update-section, .tool-card, .achievement-card'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 页面加载后启动增强动画
setTimeout(() => {
    enhanceScrollAnimations();
}, 1000);

console.log('🌟 首页特有功能初始化完成！');