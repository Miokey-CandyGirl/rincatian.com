// 文化页面交互脚本

document.addEventListener('DOMContentLoaded', function() {
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
            '1-1': { name: '新星元旦', desc: '纪念光线使者地球任务开启' },
            '4-32': { name: '星法塔日', desc: '纪念星法塔的神圣力量' },
            '7-15': { name: '双月交辉节', desc: '银月金月交叠成彩虹光环' },
            '10-29': { name: '彩虹水晶节', desc: '纪念七颗彩虹水晶的力量' }
        }
    };
    
    let currentDisplayYear = null;
    let currentDisplayMonth = null;
    
    // 获取今天的田历日期
    function getTodayTianDate() {
        const today = new Date();
        return gregorianToTian(today.getFullYear(), today.getMonth() + 1, today.getDate());
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
        } else {
            // 纪元后
            return calculateTianDateAfter(daysDiff);
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
        let year = 0; // 纪元前1年
        let month = 12;
        let day = 30; // 12月是30天
        let remainingDays = days;
        
        while (remainingDays > 0) {
            if (remainingDays >= day) {
                remainingDays -= day;
                month--;
                if (month < 1) {
                    month = 12;
                    year--;
                }
                day = getTianMonthDays(year, month);
            } else {
                day -= remainingDays;
                break;
            }
        }
        
        return { year, month, day };
    }
    
    // 获取田历年份的总天数
    function getTianYearDays(year) {
        let totalDays = 0;
        for (let month = 1; month <= 12; month++) {
            totalDays += getTianMonthDays(year, month);
        }
        return totalDays;
    }
    
    // 获取田历月份的天数
    function getTianMonthDays(year, month) {
        if (month === 1 && isLeapYear(year)) {
            return 31; // 闰年的一月是31天
        }
        return TIAN_CALENDAR.DAYS_IN_MONTH[month - 1];
    }
    
    // 判断是否为闰年（简化版，每4年一闰）
    function isLeapYear(year) {
        return year % 4 === 0;
    }
    
    // 田历转公历（近似计算）
    function tianToGregorian(tianYear, tianMonth, tianDay) {
        if (tianYear < 1) {
            // 纪元前的计算较复杂，这里简化处理
            const epochDate = new Date(TIAN_CALENDAR.EPOCH_YEAR, TIAN_CALENDAR.EPOCH_MONTH - 1, TIAN_CALENDAR.EPOCH_DAY);
            return epochDate;
        }
        
        // 计算总天数
        let totalDays = 0;
        
        // 加上完整年份的天数
        for (let y = 1; y < tianYear; y++) {
            totalDays += getTianYearDays(y);
        }
        
        // 加上当年完整月份的天数
        for (let m = 1; m < tianMonth; m++) {
            totalDays += getTianMonthDays(tianYear, m);
        }
        
        // 加上当月的天数
        totalDays += tianDay - 1;
        
        // 从纪元起点开始计算
        const epochDate = new Date(TIAN_CALENDAR.EPOCH_YEAR, TIAN_CALENDAR.EPOCH_MONTH - 1, TIAN_CALENDAR.EPOCH_DAY);
        const resultDate = new Date(epochDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
        
        return resultDate;
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
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDisplayMonth--;
                if (currentDisplayMonth < 1) {
                    currentDisplayMonth = 12;
                    currentDisplayYear--;
                }
                updateCalendarDisplay();
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
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                const today = getTodayTianDate();
                currentDisplayYear = today.year;
                currentDisplayMonth = today.month;
                updateCalendarDisplay();
            });
        }
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
            const yearPrefix = currentDisplayYear < 1 ? '田元前' : '华田';
            const displayYear = currentDisplayYear < 1 ? Math.abs(currentDisplayYear) : currentDisplayYear;
            
            titleElement.textContent = `${yearPrefix}${displayYear}年 ${TIAN_CALENDAR.MONTH_NAMES[currentDisplayMonth - 1]}`;
            
            // 显示对应的公历日期范围
            const firstDay = tianToGregorian(currentDisplayYear, currentDisplayMonth, 1);
            const lastDay = tianToGregorian(currentDisplayYear, currentDisplayMonth, getTianMonthDays(currentDisplayYear, currentDisplayMonth));
            subtitleElement.textContent = `对应公历: ${firstDay.getFullYear()}.${firstDay.getMonth() + 1}.${firstDay.getDate()} - ${lastDay.getFullYear()}.${lastDay.getMonth() + 1}.${lastDay.getDate()}`;
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
        const festivalKey = `${month}-${day}`;
        if (TIAN_CALENDAR.FESTIVALS[festivalKey]) {
            dayElement.classList.add('festival');
            dayElement.title = `${TIAN_CALENDAR.FESTIVALS[festivalKey].name}: ${TIAN_CALENDAR.FESTIVALS[festivalKey].desc}`;
        }
        
        return dayElement;
    }
    
    // 更新今天信息
    function updateTodayInfo() {
        const todayInfoElement = document.getElementById('todayInfo');
        if (!todayInfoElement) return;
        
        const today = getTodayTianDate();
        const todayGregorian = new Date();
        
        const yearPrefix = today.year < 1 ? '田元前' : '华田';
        const displayYear = today.year < 1 ? Math.abs(today.year) : today.year;
        
        todayInfoElement.innerHTML = `
            <strong>今天：</strong>${yearPrefix}${displayYear}年${today.month}月${today.day}日<br>
            <strong>公历：</strong>${todayGregorian.getFullYear()}年${todayGregorian.getMonth() + 1}月${todayGregorian.getDate()}日
        `;
    }
    
    // 只在田历标签页存在时初始化
    if (document.getElementById('calendar')) {
        initCalendar();
    }
}