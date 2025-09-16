// 文化页面交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 确保认证系统正确初始化
    if (typeof initializeAuthSystem === 'function') {
        initializeAuthSystem();
        setTimeout(() => {
            updateAuthenticationState();
        }, 100);
    }
    
    // 标签页切换功能
    const tabLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('.culture-section');
    
    function switchTab(targetTab) {
        // 移除所有活动状态
        tabLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // 添加活动状态到目标元素
        const targetLink = document.querySelector(`[data-tab="${targetTab}"]`);
        const targetSection = document.getElementById(targetTab);
        
        if (targetLink && targetSection) {
            targetLink.classList.add('active');
            targetSection.classList.add('active');
            
            // 特殊处理：当切换到非传说故事标签时，隐藏"未完待续"内容
            if (targetTab !== 'legends') {
                const continuationHook = document.getElementById('continuation');
                if (continuationHook) {
                    continuationHook.style.display = 'none';
                }
                
                // 同时确保所有故事内容都隐藏
                storyContents.forEach(content => content.classList.remove('active'));
                
                // 移除所有故事标签的活动状态
                storyTabs.forEach(tab => tab.classList.remove('active'));
            }
        }
    }
    
    // 点击标签页切换
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
            
            // 更新URL hash
            history.pushState(null, null, `#${targetTab}`);
        });
    });
    
    // 故事标签切换功能
    const storyTabs = document.querySelectorAll('.story-tab');
    const storyContents = document.querySelectorAll('.story-content');
    
    function switchStoryTab(targetStory) {
        // 移除所有活动状态
        storyTabs.forEach(tab => tab.classList.remove('active'));
        storyContents.forEach(content => content.classList.remove('active'));
        
        // 特殊处理"未完待续"标签
        if (targetStory === 'continuation') {
            // 移除所有故事内容的活动状态
            document.querySelectorAll('.story-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加活动状态到目标标签
            const targetTab = document.querySelector(`[data-story="${targetStory}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // 显示继续阅读钩子
            const continuationHook = document.getElementById('continuation');
            if (continuationHook) {
                continuationHook.style.display = 'block';
                // 添加动画效果
                continuationHook.style.opacity = '0';
                continuationHook.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    continuationHook.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    continuationHook.style.opacity = '1';
                    continuationHook.style.transform = 'translateY(0)';
                }, 50);
            }
        } else {
            // 添加活动状态到目标元素
            const targetTab = document.querySelector(`[data-story="${targetStory}"]`);
            const targetContent = document.getElementById(targetStory);
            
            if (targetTab && targetContent) {
                targetTab.classList.add('active');
                targetContent.classList.add('active');
                
                // 添加动画效果
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 50);
            }
            
            // 隐藏继续阅读钩子
            const continuationHook = document.getElementById('continuation');
            if (continuationHook) {
                continuationHook.style.display = 'none';
            }
        }
    }
    
    // 点击故事标签切换
    storyTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetStory = this.getAttribute('data-story');
            
            // 先切换到传说故事标签页（如果不在该页面）
            if (!document.getElementById('legends').classList.contains('active')) {
                switchTab('legends');
                // 等待标签页切换完成后再切换故事
                setTimeout(() => {
                    switchStoryTab(targetStory);
                    scrollToStorySection(targetStory);
                }, 100);
            } else {
                // 已经在传说故事页面，直接切换故事
                switchStoryTab(targetStory);
                scrollToStorySection(targetStory);
            }
        });
    });
    
    // 滚动到故事区域的函数
    function scrollToStorySection(targetStory) {
        setTimeout(() => {
            const targetElement = document.getElementById(targetStory);
            const legendsSection = document.getElementById('legends');
            
            if (targetElement && legendsSection) {
                // 计算偏移量（考虑固定导航栏高度）
                const navbar = document.querySelector('.navbar');
                const cultureNav = document.querySelector('.culture-nav');
                
                let totalOffset = 20; // 基础间距
                if (navbar) totalOffset += navbar.offsetHeight;
                if (cultureNav) totalOffset += cultureNav.offsetHeight;
                
                // 直接使用传说故事区域的位置
                const targetTop = legendsSection.offsetTop;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: Math.max(0, targetTop - totalOffset),
                    behavior: 'smooth'
                });
                
                // 更新URL hash（不触发页面跳转）
                history.replaceState(null, null, `#legends-${targetStory}`);
            }
        }, 200); // 等待动画完成
    }
    
    // 初始化故事标签（默认选中前传）
    if (document.querySelector('.story-tabs')) {
        switchStoryTab('prequel');
    }
    
    // 豆瓣阅读按钮交互
    const doubanBtn = document.getElementById('doubanReadingBtn');
    if (doubanBtn) {
        doubanBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 显示确认对话框
            const confirmed = confirm('📚 您即将进入豆瓣阅读查看《光线传奇之彩虹水晶》完整版小说。\n\n点击“确定”将在新窗口中打开豆瓣阅读网站。');
            
            if (confirmed) {
                // 这里可以替换为实际的豆瓣阅读链接
                const doubanUrl = 'https://read.douban.com/column/71054869/?dcs=search'; // 更换为实际链接
                window.open(doubanUrl, '_blank');
                
                // 添加点击动画效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        // 悬停效果增强
        doubanBtn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.5), 0 0 20px rgba(76, 205, 196, 0.3)';
        });
        
        doubanBtn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
        });
    }
    
    // 处理页面加载时的hash
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    }
    
    // 监听hash变化
    window.addEventListener('hashchange', handleHashChange);
    
    // 页面加载时处理hash
    handleHashChange();
    
    // 彩虹水晶动画
    const crystals = document.querySelectorAll('.crystal');
    crystals.forEach((crystal, index) => {
        crystal.style.animationDelay = `${index * 0.2}s`;
    });
    
    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.geography-card, .society-card, .magic-card, .character-profile');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 星球背景动画
    function createStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: #fff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: twinkle ${Math.random() * 3 + 2}s infinite;
                opacity: ${Math.random() * 0.8 + 0.2};
            `;
            starsContainer.appendChild(star);
        }
    }
    
    // 添加星星闪烁动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        .star {
            box-shadow: 0 0 10px currentColor;
        }
    `;
    document.head.appendChild(style);
    
    createStars();
    
    // 粒子效果
    function createParticles() {
        const particlesContainer = document.querySelector('.floating-particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 215, 0, ${Math.random() * 0.6 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
                pointer-events: none;
            `;
            particlesContainer.appendChild(particle);
        }
    }
    
    // 添加粒子漂浮动画
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(100vh) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);
    
    createParticles();
    
    // 滚动视差效果
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.culture-hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
    
    window.addEventListener('scroll', parallaxEffect);
    
    // 水晶点击效果
    const crystalGems = document.querySelectorAll('.crystal-gem');
    crystalGems.forEach(gem => {
        gem.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'crystalPulse 0.6s ease-out';
            }, 10);
        });
    });
    
    // 添加水晶脉冲动画
    const crystalStyle = document.createElement('style');
    crystalStyle.textContent = `
        @keyframes crystalPulse {
            0% { transform: scale(1); box-shadow: 0 0 15px currentColor; }
            50% { transform: scale(1.5); box-shadow: 0 0 30px currentColor; }
            100% { transform: scale(1); box-shadow: 0 0 15px currentColor; }
        }
    `;
    document.head.appendChild(crystalStyle);
    
    // 角色卡片交互效果
    const characterProfiles = document.querySelectorAll('.character-profile');
    characterProfiles.forEach(profile => {
        profile.addEventListener('click', function() {
            // 添加点击波纹效果
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: 50%;
                top: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加波纹动画
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // 时间线项目滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    // 观察时间线项目
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // 观察传说项目
    const legendItems = document.querySelectorAll('.legend-item');
    legendItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
    
    // 快捷键支持
    document.addEventListener('keydown', function(e) {
        const tabs = ['geography', 'society', 'magic', 'legends', 'characters', 'timeline', 'calendar'];
        let currentIndex = tabs.findIndex(tab => document.getElementById(tab).classList.contains('active'));
        
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            switchTab(tabs[currentIndex - 1]);
        } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            e.preventDefault();
            switchTab(tabs[currentIndex + 1]);
        }
    });
    
    // 田历历法系统
    initTianCalendar();
    
    console.log('琳凯蒂亚文化页面加载完成！✨');
});

// 田历历法系统
function initTianCalendar() {
    // 田历历法规则
    const TIAN_CALENDAR = {
        // 纪元起点：2015年3月21日 = 华田元年1月1日
        EPOCH_YEAR: 2015,
        EPOCH_MONTH: 3, // 3月
        EPOCH_DAY: 21,   // 21日
        
        // 每月天数：30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30
        DAYS_IN_MONTH: [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30],
        
        // 月份名称
        MONTH_NAMES: [
            '一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        
        // 特殊日期
        FESTIVALS: {
            '1-1': { name: '春元节', desc: '象征着万物新生新的朝气' },
            '4-32': { name: '星法节', desc: '纪念星法塔的神圣力量，也是琳凯蒂亚最重要的活动量' },
            '6-3': { name: '彩虹节', desc: '纪念光线使者地球任务开启（20150825）' },
            '7-15': { name: '双月交辉节', desc: '银月金月交叠成彩虹光环' },
            '8-16': { name: '妙可生日', desc: '琳凯蒂亚小公主诞辰，这天全球庆贺' },
            '10-29': { name: '彩虹水晶节', desc: '纪念七颗彩虹水晶的力量' },
            '12-30': { name: '夜夕节', desc: '全球欢迎新年的到来！' }
        }
    };
    
    let currentDisplayYear = null;
    let currentDisplayMonth = null;
    
    // 获取今天的田历日期
    function getTodayTianDate() {
        const today = new Date();
        const tianDate = gregorianToTian(today.getFullYear(), today.getMonth() + 1, today.getDate());
        
        // 确保不存在0年
        if (tianDate.year === 0) {
            tianDate.year = -1;
        }
        
        return tianDate;
    }
    
    // 公历转田历
    function gregorianToTian(gregYear, gregMonth, gregDay) {
        // 计算从纪元起点到目标日期的天数
        const epochDate = new Date(TIAN_CALENDAR.EPOCH_YEAR, TIAN_CALENDAR.EPOCH_MONTH - 1, TIAN_CALENDAR.EPOCH_DAY);
        const targetDate = new Date(gregYear, gregMonth - 1, gregDay);
        const daysDiff = Math.floor((targetDate - epochDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 0) {
            // 纪元前
            return calculateTianDateBefore(Math.abs(daysDiff));
        } else if (daysDiff > 0) {
            // 纪元后
            return calculateTianDateAfter(daysDiff);
        } else {
            // 正好是纪元日
            return { year: 1, month: 1, day: 1 };
        }
    }
    
    // 计算纪元后的田历日期
    function calculateTianDateAfter(days) {
        let year = 1;
        let month = 1;
        let day = 1;
        let remainingDays = days;
        
        while (remainingDays > 0) {
            const daysInCurrentYear = getTianYearDays(year);
            if (remainingDays >= daysInCurrentYear) {
                remainingDays -= daysInCurrentYear;
                year++;
            } else {
                break;
            }
        }
        
        while (remainingDays > 0) {
            const daysInCurrentMonth = getTianMonthDays(year, month);
            if (remainingDays >= daysInCurrentMonth) {
                remainingDays -= daysInCurrentMonth;
                month++;
                if (month > 12) {
                    month = 1;
                    year++;
                }
            } else {
                day += remainingDays;
                break;
            }
        }
        
        return { year, month, day };
    }
    
    // 计算纪元前的田历日期
    function calculateTianDateBefore(days) {
        // 注意：没有0年，前1年直接接续元年
        let year = -1; // 田元前1年
        let month = 12;
        let day = 30; // 12月是30天
        let remainingDays = days;
        
        while (remainingDays > 0) {
            // 计算当前月份的天数
            const daysInCurrentMonth = getTianMonthDays(year, month);
            
            if (remainingDays >= daysInCurrentMonth) {
                remainingDays -= daysInCurrentMonth;
                month--;
                if (month < 1) {
                    month = 12;
                    year--; // 继续向前推年份
                }
            } else {
                day = daysInCurrentMonth - remainingDays + 1;
                remainingDays = 0; // 结束循环
            }
        }
        
        return { year, month, day };
    }
    
    // 获取田历年份的总天数
    function getTianYearDays(year) {
        // 处理0年的情况
        if (year === 0) {
            year = -1;
        }
        
        let totalDays = 0;
        for (let month = 1; month <= 12; month++) {
            totalDays += getTianMonthDays(year, month);
        }
        return totalDays;
    }
    
    // 获取田历月份的天数
    function getTianMonthDays(year, month) {
        // 处理0年的情况
        if (year === 0) {
            year = -1;
        }
        
        if (month === 1 && isLeapYear(year)) {
            return 31; // 闰年的一月是31天
        }
        return TIAN_CALENDAR.DAYS_IN_MONTH[month - 1];
    }
    
    // 判断是否为闰年（简化版，每4年一闰）
    function isLeapYear(year) {
        // 处理0年的情况
        if (year === 0) {
            year = -1;
        }
        
        // 对于负数年份，需要特殊处理
        if (year < 0) {
            // 纪元前的年份，使用绝对值计算
            return Math.abs(year) % 4 === 0;
        }
        return year % 4 === 0;
    }
    
    // 田历转公历（近似计算）
    function tianToGregorian(tianYear, tianMonth, tianDay) {
        // 处理0年的情况
        if (tianYear === 0) {
            tianYear = -1;
        }
        
        // 从纪元起点开始计算
        const epochDate = new Date(TIAN_CALENDAR.EPOCH_YEAR, TIAN_CALENDAR.EPOCH_MONTH - 1, TIAN_CALENDAR.EPOCH_DAY);
        
        if (tianYear > 0) {
            // 纪元后的计算
            return tianToGregorianAfter(epochDate, tianYear, tianMonth, tianDay);
        } else {
            // 纪元前的计算
            return tianToGregorianBefore(epochDate, tianYear, tianMonth, tianDay);
        }
    }
    
    // 计算纪元后的公历日期
    function tianToGregorianAfter(epochDate, tianYear, tianMonth, tianDay) {
        let totalDays = 0;
        
        // 加上完整年份的天数
        for (let y = 1; y < tianYear; y++) {
            totalDays += getTianYearDays(y);
        }
        
        // 加上当年完整月份的天数
        for (let m = 1; m < tianMonth; m++) {
            totalDays += getTianMonthDays(tianYear, m);
        }
        
        // 加上当月的天数（减去1，因为从第1天开始计算）
        totalDays += tianDay - 1;
        
        const resultDate = new Date(epochDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
        return resultDate;
    }
    
    // 计算纪元前的公历日期
    function tianToGregorianBefore(epochDate, tianYear, tianMonth, tianDay) {
        let totalDays = 0;
        
        // 从纪元前1年开始向前计算到指定年份
        for (let y = -1; y > tianYear; y--) {
            totalDays += getTianYearDays(y);
        }
        
        // 加上目标年份中指定月份之前的天数
        for (let m = 12; m > tianMonth; m--) {
            totalDays += getTianMonthDays(tianYear, m);
        }
        
        // 加上目标月份中剩余的天数
        const daysInTargetMonth = getTianMonthDays(tianYear, tianMonth);
        totalDays += daysInTargetMonth - tianDay;
        
        // 从纪元日期减去总天数
        const resultDate = new Date(epochDate.getTime() - (totalDays + 1) * 24 * 60 * 60 * 1000);
        return resultDate;
    }
    
    // 创建日期元素
    function createDayElement(day, isOtherMonth, isToday, year, month) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }
        
        if (isToday) {
            dayElement.classList.add('today');
        }
        
        // 检查是否为特殊日期
        const festivalKey = month + '-' + day;
        if (TIAN_CALENDAR.FESTIVALS[festivalKey]) {
            dayElement.classList.add('festival');
            dayElement.title = TIAN_CALENDAR.FESTIVALS[festivalKey].name + ': ' + TIAN_CALENDAR.FESTIVALS[festivalKey].desc;
        }
        
        // 添加点击事件监听器
        dayElement.addEventListener('click', function() {
            showDateDetails(year, month, day, isOtherMonth);
        });
        
        return dayElement;
    }
    
    // 显示日期详细信息
    function showDateDetails(year, month, day, isOtherMonth) {
        try {
            console.log('显示日期详情:', year, month, day);
            
            // 获取公历日期
            const gregorianDate = tianToGregorian(year, month, day);
            const gregorianYear = gregorianDate.getFullYear();
            const gregorianMonth = gregorianDate.getMonth() + 1;
            const gregorianDay = gregorianDate.getDate();
            
            console.log('公历日期:', gregorianYear, gregorianMonth, gregorianDay);
            
            // 获取农历信息（这里使用真实计算）
            const lunarInfo = getLunarInfo(gregorianYear, gregorianMonth, gregorianDay);
            
            console.log('农历信息:', lunarInfo);
            
            // 获取节气信息
            const solarTerm = getSolarTermInfo(gregorianYear, gregorianMonth, gregorianDay);
            
            // 获取黄帝纪年
            const huangdiYear = LunarCalendar.getHuangdiYear(gregorianYear);
            
            // 获取公历节日信息
            const solarFestival = LunarCalendar.getSolarFestival(gregorianMonth, gregorianDay);
            
            // 构建详细信息HTML
            let detailsHTML = '<div class="date-details-header">' +
                '<h3>日期详情</h3>' +
                '<button class="close-btn" id="closeDateDetails">&times;</button>' +
                '</div>' +
                '<div class="date-info-grid">' +
                '<div class="date-info-item">' +
                '<div class="info-label">田历</div>' +
                '<div class="info-value">' + getTianDateString(year, month, day, isOtherMonth) + '</div>' +
                '</div>' +
                '<div class="date-info-item">' +
                '<div class="info-label">公历</div>' +
                '<div class="info-value">' + gregorianYear + '年' + gregorianMonth + '月' + gregorianDay + '日</div>' +
                '</div>' +
                '<div class="date-info-item">' +
                '<div class="info-label">农历</div>' +
                '<div class="info-value">' + huangdiYear + '年' + (lunarInfo.isLeapMonth ? '闰' : '') + lunarInfo.lunarMonthName + lunarInfo.lunarDayName + '</div>' +
                '</div>' +
                '<div class="date-info-item">' +
                '<div class="info-label">干支与生肖</div>' +
                '<div class="info-value">' + lunarInfo.heavenlyStem + lunarInfo.earthlyBranch + '（' + lunarInfo.zodiac + '）年</div>' +
                '</div>';
            
            if (solarTerm) {
                detailsHTML += '<div class="date-info-item">' +
                    '<div class="info-label">节气</div>' +
                    '<div class="info-value">' + solarTerm.name + '</div>' +
                    '</div>';
            }
            
            // 添加农历节日信息
            if (lunarInfo.festival) {
                detailsHTML += '<div class="date-info-item festival-info">' +
                    '<div class="info-label">农历节日</div>' +
                    '<div class="info-value">' + lunarInfo.festival.name + '</div>' +
                    '<div class="info-desc">' + lunarInfo.festival.desc + '</div>' +
                    '</div>';
            }
            
            // 添加公历节日信息
            if (solarFestival) {
                detailsHTML += '<div class="date-info-item festival-info">' +
                    '<div class="info-label">公历节日</div>' +
                    '<div class="info-value">' + solarFestival.name + '</div>' +
                    '<div class="info-desc">' + solarFestival.desc + '</div>' +
                    '</div>';
            }
            
            // 添加特殊节日信息（田历节日）
            const festivalKey = month + '-' + day;
            if (TIAN_CALENDAR.FESTIVALS[festivalKey]) {
                detailsHTML += '<div class="date-info-item festival-info">' +
                    '<div class="info-label">田历节日</div>' +
                    '<div class="info-value">' + TIAN_CALENDAR.FESTIVALS[festivalKey].name + '</div>' +
                    '<div class="info-desc">' + TIAN_CALENDAR.FESTIVALS[festivalKey].desc + '</div>' +
                    '</div>';
            }
            
            detailsHTML += '</div>';
            
            // 显示模态框
            showDateModal(detailsHTML);
        } catch (error) {
            console.error('显示日期详情时出错:', error);
        }
    }

    // 获取田历日期字符串
    function getTianDateString(year, month, day, isOtherMonth) {
        // 确保不存在0年
        if (year === 0) {
            year = -1;
        }
        
        let yearStr = '';
        if (year < 0) {
            yearStr = '田元前' + Math.abs(year) + '年';
        } else if (year === 1) {
            yearStr = '华田元年';
        } else {
            yearStr = '华田' + year + '年';
        }
        
        return yearStr + month + '月' + day + '日';
    }

    // 获取农历信息（使用真实的农历计算）
    function getLunarInfo(year, month, day) {
        try {
            console.log('计算农历信息:', year, month, day);
            
            // 使用LunarCalendar类计算真实的农历信息
            if (typeof LunarCalendar === 'undefined') {
                console.error('LunarCalendar未定义');
                throw new Error('LunarCalendar未定义');
            }
            
            if (typeof LunarCalendar.solarToLunar !== 'function') {
                console.error('LunarCalendar.solarToLunar不是函数');
                throw new Error('LunarCalendar.solarToLunar不是函数');
            }
            
            const lunarInfo = LunarCalendar.solarToLunar(year, month, day);
            
            console.log('LunarCalendar计算结果:', lunarInfo);
            
            // 获取农历节日信息
            const lunarFestival = LunarCalendar.getLunarFestival(lunarInfo.lunarMonth, lunarInfo.lunarDay);
            
            return {
                lunarYear: lunarInfo.lunarYear,
                lunarMonth: lunarInfo.lunarMonth,
                lunarDay: lunarInfo.lunarDay,
                lunarMonthName: lunarInfo.lunarMonthName,
                lunarDayName: lunarInfo.lunarDayName,
                zodiac: lunarInfo.zodiac,
                heavenlyStem: lunarInfo.heavenlyStem,
                earthlyBranch: lunarInfo.earthlyBranch,
                isLeapMonth: lunarInfo.isLeapMonth,
                festival: lunarFestival
            };
        } catch (error) {
            console.error('计算农历信息时出错:', error);
            // 返回默认值
            return {
                lunarYear: year,
                lunarMonth: month,
                lunarDay: day,
                lunarMonthName: '未知月',
                lunarDayName: '未知日',
                zodiac: '未知',
                heavenlyStem: '未知',
                earthlyBranch: '未知',
                isLeapMonth: false,
                festival: null
            };
        }
    }

    // 获取节气信息
    function getSolarTermInfo(year, month, day) {
        try {
            if (typeof LunarCalendar === 'undefined' || typeof LunarCalendar.getSolarTerm !== 'function') {
                console.error('LunarCalendar或getSolarTerm未定义');
                return null;
            }
            
            return LunarCalendar.getSolarTerm(year, month, day);
        } catch (error) {
            console.error('获取节气信息时出错:', error);
            return null;
        }
    }

    // 显示日期详情模态框
    function showDateModal(content) {
        // 创建模态框元素
        const modal = document.createElement('div');
        modal.className = 'date-details-modal';
        modal.innerHTML = '<div class="date-details-content">' + content + '</div>';
        
        // 添加到页面
        document.body.appendChild(modal);
        
        // 添加关闭事件
        const closeBtn = modal.querySelector('#closeDateDetails');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // ESC键关闭
        function handleEscKey(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscKey);
            }
        }
        
        document.addEventListener('keydown', handleEscKey);
    }
    
    // 初始化日历
    function initCalendar() {
        const today = getTodayTianDate();
        currentDisplayYear = today.year;
        currentDisplayMonth = today.month;
        
        updateCalendarDisplay();
        updateTodayInfo();
        
        // 绑定事件
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        const prevYearBtn = document.getElementById('prevYear');
        const nextYearBtn = document.getElementById('nextYear');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDisplayMonth--;
                if (currentDisplayMonth < 1) {
                    currentDisplayMonth = 12;
                    currentDisplayYear--;
                }
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentDisplayMonth++;
                if (currentDisplayMonth > 12) {
                    currentDisplayMonth = 1;
                    currentDisplayYear++;
                }
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                const today = getTodayTianDate();
                currentDisplayYear = today.year;
                currentDisplayMonth = today.month;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
            });
        }
        
        // 年份切换按钮事件
        if (prevYearBtn) {
            prevYearBtn.addEventListener('click', () => {
                currentDisplayYear--;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
                
                // 添加点击动画效果
                prevYearBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    prevYearBtn.style.transform = '';
                }, 150);
            });
        }
        
        if (nextYearBtn) {
            nextYearBtn.addEventListener('click', () => {
                currentDisplayYear++;
                updateCalendarDisplay();
                updateCurrentYearDisplay();
                
                // 添加点击动画效果
                nextYearBtn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    nextYearBtn.style.transform = '';
                }, 150);
            });
        }
        
        // 初始化年份显示
        updateCurrentYearDisplay();
        
        // 添加键盘快捷键支持（仅在田历标签页激活时）
        document.addEventListener('keydown', function(e) {
            // 检查是否在田历标签页
            const calendarSection = document.getElementById('calendar');
            if (!calendarSection || !calendarSection.classList.contains('active')) {
                return;
            }
            
            // 检查是否在输入框中，如果是则不处理快捷键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key.toLowerCase()) {
                case 'w':
                    e.preventDefault();
                    // 上一年
                    if (prevYearBtn) prevYearBtn.click();
                    break;
                case 's':
                    e.preventDefault();
                    // 下一年
                    if (nextYearBtn) nextYearBtn.click();
                    break;
                case 'a':
                    e.preventDefault();
                    // 上个月
                    if (prevBtn) prevBtn.click();
                    break;
                case 'd':
                    e.preventDefault();
                    // 下个月
                    if (nextBtn) nextBtn.click();
                    break;
                case 'Home':
                case 't':
                case 'T':
                    e.preventDefault();
                    // 回到今天
                    if (todayBtn) todayBtn.click();
                    break;
            }
        });
    }
    
    // 更新日历显示
    function updateCalendarDisplay() {
        updateCalendarTitle();
        updateCalendarDays();
    }
    
    // 更新日历标题
    function updateCalendarTitle() {
        const titleElement = document.getElementById('calendarTitle');
        const subtitleElement = document.getElementById('calendarSubtitle');
        
        if (titleElement && subtitleElement) {
            // 确保不存在0年
            let displayYear = currentDisplayYear;
            if (displayYear === 0) {
                displayYear = -1;
            }
            
            let yearStr = '';
            if (displayYear < 0) {
                yearStr = '田元前' + Math.abs(displayYear) + '年';
            } else if (displayYear === 1) {
                yearStr = '华田元年';
            } else {
                yearStr = '华田' + displayYear + '年';
            }
            
            titleElement.textContent = yearStr + ' ' + TIAN_CALENDAR.MONTH_NAMES[currentDisplayMonth - 1];
            
            // 显示对应的公历日期范围
            const firstDay = tianToGregorian(displayYear, currentDisplayMonth, 1);
            const daysInMonth = getTianMonthDays(displayYear, currentDisplayMonth);
            const lastDay = tianToGregorian(displayYear, currentDisplayMonth, daysInMonth);
            subtitleElement.textContent = '对应公历: ' + firstDay.getFullYear() + '.' + (firstDay.getMonth() + 1) + '.' + firstDay.getDate() + ' - ' + lastDay.getFullYear() + '.' + (lastDay.getMonth() + 1) + '.' + lastDay.getDate();
        }
    }
    
    // 更新日历日期
    function updateCalendarDays() {
        const daysContainer = document.getElementById('calendarDays');
        if (!daysContainer) return;
        
        daysContainer.innerHTML = '';
        
        // 获取当月信息
        const daysInMonth = getTianMonthDays(currentDisplayYear, currentDisplayMonth);
        const firstDayGregorian = tianToGregorian(currentDisplayYear, currentDisplayMonth, 1);
        const firstDayWeek = firstDayGregorian.getDay(); // 0=周日, 1=周一...
        
        // 获取今天的田历日期
        const today = getTodayTianDate();
        
        // 填充上个月的日期
        const prevMonth = currentDisplayMonth === 1 ? 12 : currentDisplayMonth - 1;
        const prevYear = currentDisplayMonth === 1 ? currentDisplayYear - 1 : currentDisplayYear;
        const prevMonthDays = getTianMonthDays(prevYear, prevMonth);
        
        for (let i = firstDayWeek - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayElement = createDayElement(day, true, false, prevYear, prevMonth);
            daysContainer.appendChild(dayElement);
        }
        
        // 填充当月的日期
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = (currentDisplayYear === today.year && 
                           currentDisplayMonth === today.month && 
                           day === today.day);
            const dayElement = createDayElement(day, false, isToday, currentDisplayYear, currentDisplayMonth);
            daysContainer.appendChild(dayElement);
        }
        
        // 填充下个月的日期
        const totalCells = daysContainer.children.length;
        const remainingCells = 42 - totalCells; // 6周 x 7天 = 42个格子
        const nextMonth = currentDisplayMonth === 12 ? 1 : currentDisplayMonth + 1;
        const nextYear = currentDisplayMonth === 12 ? currentDisplayYear + 1 : currentDisplayYear;
        
        for (let day = 1; day <= remainingCells; day++) {
            const dayElement = createDayElement(day, true, false, nextYear, nextMonth);
            daysContainer.appendChild(dayElement);
        }
    }
    
    // 更新今天信息
    function updateTodayInfo() {
        const todayInfoElement = document.getElementById('todayInfo');
        if (!todayInfoElement) return;
        
        const today = getTodayTianDate();
        const todayGregorian = new Date();
        
        // 确保不存在0年
        let displayYear = today.year;
        if (displayYear === 0) {
            displayYear = -1;
        }
        
        let yearStr = '';
        if (displayYear < 0) {
            yearStr = '田元前' + Math.abs(displayYear) + '年';
        } else if (displayYear === 1) {
            yearStr = '华田元年';
        } else {
            yearStr = '华田' + displayYear + '年';
        }
        
        todayInfoElement.innerHTML = '<strong>今天：</strong>' + yearStr + today.month + '月' + today.day + '日<br>' +
            '<strong>公历：</strong>' + todayGregorian.getFullYear() + '年' + (todayGregorian.getMonth() + 1) + '月' + todayGregorian.getDate() + '日';
    }
    
    // 更新当前年份显示
    function updateCurrentYearDisplay() {
        const currentYearElement = document.getElementById('currentYearValue');
        if (!currentYearElement) return;
        
        // 确保不存在0年
        let displayYear = currentDisplayYear;
        if (displayYear === 0) {
            displayYear = -1;
        }
        
        let yearStr = '';
        if (displayYear < 0) {
            yearStr = '田元前' + Math.abs(displayYear) + '年';
        } else if (displayYear === 1) {
            yearStr = '华田元年';
        } else {
            yearStr = '华田' + displayYear + '年';
        }
        
        currentYearElement.textContent = yearStr;
        
        // 添加年份更新动画效果
        currentYearElement.style.transform = 'scale(1.1)';
        currentYearElement.style.opacity = '0.8';
        
        setTimeout(function() {
            currentYearElement.style.transform = 'scale(1)';
            currentYearElement.style.opacity = '1';
        }, 200);
    }
    
    // 只在田历标签页存在时初始化
    if (document.getElementById('calendar')) {
        initCalendar();
    }
}
