// 用户个人中心功能实现

// 在文件开头添加对location-data.js的引用检查
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化星空背景
    initStarfield();
    
    // 初始化田历日期
    updateTianCalendar();
    setInterval(updateTianCalendar, 60000); // 每分钟更新一次
    
    // 检查用户登录状态
    checkUserStatus();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化标签页
    initTabs();
    
    // 初始化国家和地区下拉菜单
    initLocationSelectors();
    
    // 如果用户已登录，加载用户信息
    if (window.authSystem && window.authSystem.currentUser) {
        loadUserProfile();
        loadUserAchievements();
        loadUserActivity();
        loadLearningProgress();
        loadFavorites();
        loadLearningHistory();
        loadWordContributions(); // 加载词汇贡献记录
    } else {
        // 如果用户未登录，重定向到首页
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});

// 初始化星空背景
function initStarfield() {
    const starfield = document.getElementById('starfield');
    if (!starfield) return;
    
    starfield.innerHTML = '';
    
    // 创建星星
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        starfield.appendChild(star);
    }
    
    // 添加CSS样式
    if (!document.getElementById('starfield-styles')) {
        const style = document.createElement('style');
        style.id = 'starfield-styles';
        style.textContent = `
            .star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                animation: twinkle 3s infinite;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 更新田历日期
function updateTianCalendar() {
    const tianDateElement = document.getElementById('tianDate');
    if (!tianDateElement) return;
    
    try {
        const tianDate = calculateTianDate();
        let dateString;
        
        if (tianDate.era === '田元前') {
            dateString = `田元前${Math.abs(tianDate.year)}年`;
        } else {
            dateString = `华田${tianDate.year}年${tianDate.month}月${tianDate.day}日`;
        }
        
        tianDateElement.textContent = dateString;
    } catch (error) {
        console.error('田历日期计算错误:', error);
        tianDateElement.textContent = '田历载入失败';
    }
}

// 田历起点：2015年3月21日（公历） - 华田元年1月１日
const TIAN_CALENDAR_EPOCH = new Date(2015, 2, 21); // 月份从0开始，2表示3月

// 田历每月天数：[30,31,31,32,31,31,30,30,30,29,30,30]
const TIAN_MONTH_DAYS = [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30];

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

// 检查用户状态
function checkUserStatus() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (!loginBtn || !registerBtn || !userInfo || !userAvatar || !userName) return;
    
    if (window.authSystem && window.authSystem.currentUser) {
        // 用户已登录
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        
        userAvatar.textContent = window.authSystem.currentUser.avatar || window.authSystem.currentUser.username.charAt(0);
        userName.textContent = window.authSystem.currentUser.username;
    } else {
        // 用户未登录
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // 注册按钮
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // 退出登录
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.authSystem) {
                window.authSystem.logout();
                // 清除用户数据库中的数据
                if (window.userDatabase) {
                    window.userDatabase.clearUserData();
                }
                window.location.href = 'index.html';
            }
        });
    }
    
    // 表单提交事件
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    // 学习设置保存事件
    const saveLearningSettingsBtn = document.getElementById('saveLearningSettings');
    if (saveLearningSettingsBtn) {
        saveLearningSettingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveLearningSettings();
        });
    }
    
    // 预设头像选择事件
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除其他选项的选中状态
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            // 添加当前选项的选中状态
            this.classList.add('selected');
            // 更新头像输入框的值
            document.getElementById('avatar').value = this.getAttribute('data-avatar');
        });
    });
    
    // 文件上传事件
    const avatarUpload = document.getElementById('avatarUpload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            handleAvatarUpload(e);
        });
    }
    
    // 国家/地区选择事件
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            updateProvinceSelector(this.value);
        });
    }
    
    // 省/州选择事件
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) {
        provinceSelect.addEventListener('change', function() {
            updateCitySelector(this.value);
        });
    }
    
    // 收藏项点击事件
    document.addEventListener('click', function(e) {
        // 处理移除收藏
        if (e.target.classList.contains('remove-favorite')) {
            e.stopPropagation();
            removeFavorite(e.target);
        }
        // 处理收藏项点击
        else if (e.target.closest('.favorite-word-card')) {
            const card = e.target.closest('.favorite-word-card');
            viewFavoriteWord(card);
        }
        else if (e.target.closest('.favorite-post-item')) {
            const item = e.target.closest('.favorite-post-item');
            viewFavoritePost(item);
        }
    });
}

// 初始化标签页
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// 切换标签页
function switchTab(tabName) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // 根据标签页执行相应操作
    switch(tabName) {
        case 'learning':
            initLearningChart();
            break;
        case 'contributions':
            loadWordContributions();
            break;
    }
}

// 初始化国家和地区下拉菜单
function initLocationSelectors() {
    // 引入国家数据
    if (typeof LocationData === 'undefined') {
        console.warn('LocationData not found, location selectors will not be initialized');
        return;
    }
    
    const countrySelect = document.getElementById('country');
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    
    if (!countrySelect || !provinceSelect || !citySelect) {
        console.warn('Location selectors not found in DOM');
        return;
    }
    
    // 填充国家下拉菜单
    LocationData.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.flag} ${country.name}`;
        countrySelect.appendChild(option);
    });
    
    // 添加事件监听器
    countrySelect.addEventListener('change', function() {
        updateProvinceSelector(this.value);
    });
    
    provinceSelect.addEventListener('change', function() {
        updateCitySelector(this.value);
    });
}

// 更新省/州下拉菜单
function updateProvinceSelector(countryCode) {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    
    if (!provinceSelect || !citySelect) return;
    
    // 清空现有的选项
    provinceSelect.innerHTML = '<option value="">请选择省/州</option>';
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    
    // 根据国家代码填充省/州选项
    switch (countryCode) {
        case 'RC': // 田国
            LocationData.rincatia.provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
            break;
        case 'CN': // 中国
            LocationData.china.provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.code;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            });
            break;
        case 'JP': // 日本
            LocationData.japan.prefectures.forEach(prefecture => {
                const option = document.createElement('option');
                option.value = prefecture.code;
                option.textContent = prefecture.name;
                provinceSelect.appendChild(option);
            });
            break;
        case 'KR': // 韩国
            LocationData.korea.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.code;
                option.textContent = city.name;
                provinceSelect.appendChild(option);
            });
            break;
        case 'US': // 美国
            LocationData.usa.states.forEach(state => {
                const option = document.createElement('option');
                option.value = state.code;
                option.textContent = state.name;
                provinceSelect.appendChild(option);
            });
            break;
        default:
            // 对于其他国家，可以添加默认选项或保持为空
            break;
    }
}

// 更新城市下拉菜单
function updateCitySelector(provinceCode) {
    const citySelect = document.getElementById('city');
    
    if (!citySelect) return;
    
    // 清空现有的选项
    citySelect.innerHTML = '<option value="">请选择城市</option>';
    
    // 根据省/州代码填充城市选项（以中国为例）
    if (LocationData.china.cities[provinceCode]) {
        LocationData.china.cities[provinceCode].forEach(city => {
            const option = document.createElement('option');
            option.value = city.code;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
    if (LocationData.rincatia.cities[provinceCode]) {
        LocationData.rincatia.cities[provinceCode].forEach(city => {
            const option = document.createElement('option');
            option.value = city.code;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
}

// 加载用户信息
function loadUserProfile() {
    if (!window.authSystem || !window.authSystem.currentUser) return;
    
    const user = window.authSystem.currentUser;
    const communityUser = window.communitySystem ? window.communitySystem.currentUser : null;
    
    // 从用户数据库获取用户资料
    let userProfile = {};
    if (window.userDatabase) {
        userProfile = window.userDatabase.getUserProfile() || {};
    }
    
    // 更新基本信息
    document.getElementById('profileAvatar').textContent = user.avatar || user.username.charAt(0);
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('userRank').textContent = user.rank || '见习光线使者';
    
    // 格式化日期
    if (user.joinDate) {
        const joinDate = new Date(user.joinDate);
        document.getElementById('joinDate').textContent = joinDate.toLocaleDateString('zh-CN');
    }
    
    if (user.lastLogin) {
        const lastLogin = new Date(user.lastLogin);
        document.getElementById('lastLogin').textContent = lastLogin.toLocaleDateString('zh-CN');
    }
    
    // 更新统计数据
    if (communityUser) {
        document.getElementById('totalPoints').textContent = communityUser.points || 0;
        document.getElementById('wordsLearned').textContent = Math.floor(communityUser.points / 10) || 0;
        document.getElementById('postsCount').textContent = communityUser.posts || 0;
        document.getElementById('repliesCount').textContent = communityUser.replies || 0;
    }
    
    // 填充表单数据
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('avatar').value = user.avatar || '';
    if (userProfile.bio) {
        document.getElementById('bio').value = userProfile.bio;
    }
    
    // 填充国家和地区信息
    if (userProfile.country) {
        document.getElementById('country').value = userProfile.country;
        // 触发省/州下拉菜单更新
        updateProvinceSelector(userProfile.country);
    }
    
    if (userProfile.province) {
        setTimeout(() => {
            document.getElementById('province').value = userProfile.province;
            // 触发城市下拉菜单更新
            updateCitySelector(userProfile.province);
        }, 100);
    }
    
    if (userProfile.city) {
        setTimeout(() => {
            document.getElementById('city').value = userProfile.city;
        }, 200);
    }
    
    // 加载学习设置
    loadLearningSettings();
    
    // 设置预设头像选中状态
    if (user.avatar) {
        const selectedAvatar = document.querySelector(`.avatar-option[data-avatar="${user.avatar}"]`);
        if (selectedAvatar) {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            selectedAvatar.classList.add('selected');
        }
    }
}

// 加载用户成就
function loadUserAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    // 获取用户数据
    const communityUser = window.communitySystem ? window.communitySystem.currentUser : null;
    const userPoints = communityUser ? communityUser.points : 0;
    const userPosts = communityUser ? communityUser.posts : 0;
    const userReplies = communityUser ? communityUser.replies : 0;
    
    // 成就数据
    const achievements = [
        {
            id: 'newbie',
            title: '初来乍到',
            description: '完成第一次注册',
            icon: '🌟',
            unlocked: true,
            progress: '已解锁'
        },
        {
            id: 'learner',
            title: '勤学',
            description: '学习100个词汇',
            icon: '📚',
            unlocked: userPoints >= 1000,
            progress: userPoints >= 1000 ? '已解锁' : `${Math.min(userPoints / 10, 100)}/100`
        },
        {
            id: 'social',
            title: '社交达人',
            description: '发布10条社区动态',
            icon: '💬',
            unlocked: userPosts >= 10,
            progress: userPosts >= 10 ? '已解锁' : `${userPosts}/10`
        },
        {
            id: 'active',
            title: '活跃用户',
            description: '参与50次社区讨论',
            icon: '👥',
            unlocked: (userPosts + userReplies) >= 50,
            progress: (userPosts + userReplies) >= 50 ? '已解锁' : `${userPosts + userReplies}/50`
        },
        {
            id: 'explorer',
            title: '星球探索',
            description: '完成所有文化学习',
            icon: '🌎',
            unlocked: userPoints >= 2000,
            progress: userPoints >= 2000 ? '已解锁' : '待解锁'
        },
        {
            id: 'master',
            title: '语言大师',
            description: '精通所有语法规则',
            icon: '👑',
            unlocked: userPoints >= 5000,
            progress: userPoints >= 5000 ? '已解锁' : '待解锁'
        },
        {
            id: 'contributor',
            title: '贡献者',
            description: '添加50个词汇到词典',
            icon: '➕',
            unlocked: false,
            progress: '待解锁'
        },
        {
            id: 'champion',
            title: '光线使者',
            description: '连续学习30天',
            icon: '🏆',
            unlocked: false,
            progress: '待解锁'
        }
    ];
    
    // 清空现有内容
    achievementsGrid.innerHTML = '';
    
    // 创建成就卡片
    achievements.forEach(achievement => {
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
            <div class="achievement-progress">${achievement.progress}</div>
        `;
        achievementsGrid.appendChild(card);
    });
}

// 加载用户活动
function loadUserActivity() {
    // 这里可以加载用户的帖子和回复
    // 由于需要与社区系统的集成，暂时显示示例内容
    console.log('加载用户活动...');
    
    // 模拟加载用户帖子
    const userPostsContainer = document.getElementById('userPosts');
    if (userPostsContainer) {
        // 模拟数据
        const posts = [
            { title: '琳凯蒂亚语学习心得分享', date: '2025-01-10', replies: 5 },
            { title: '关于动词变位的疑问', date: '2025-01-08', replies: 12 },
            { title: '推荐几本好的语言学习书籍', date: '2025-01-05', replies: 8 }
        ];
        
        if (posts.length > 0) {
            userPostsContainer.innerHTML = '';
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.className = 'favorite-post-item';
                postItem.innerHTML = `
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <span class="post-replies">${post.replies} 回复</span>
                    </div>
                `;
                userPostsContainer.appendChild(postItem);
            });
        }
    }
    
    // 模拟加载用户回复
    const userRepliesContainer = document.getElementById('userReplies');
    if (userRepliesContainer) {
        // 模拟数据
        const replies = [
            { content: '我也有同样的疑问，期待高手解答', post: '关于动词变位的疑问', date: '2025-01-10' },
            { content: '感谢分享，很有帮助', post: '琳凯蒂亚语学习心得分享', date: '2025-01-09' },
            { content: '这本书我也在看，推荐！', post: '推荐几本好的语言学习书籍', date: '2025-01-06' }
        ];
        
        if (replies.length > 0) {
            userRepliesContainer.innerHTML = '';
            replies.forEach(reply => {
                const replyItem = document.createElement('div');
                replyItem.className = 'favorite-post-item';
                replyItem.innerHTML = `
                    <div class="post-title">${reply.content}</div>
                    <div class="post-meta">
                        <span class="post-topic">回复于: ${reply.post}</span>
                        <span class="post-date">${reply.date}</span>
                    </div>
                `;
                userRepliesContainer.appendChild(replyItem);
            });
        }
    }
}

// 更新个人资料
function updateProfile() {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('请先登录');
        return;
    }
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const avatar = document.getElementById('avatar').value;
    const bio = document.getElementById('bio').value;
    
    // 获取国家和地区信息
    const country = document.getElementById('country').value;
    const province = document.getElementById('province').value;
    const city = document.getElementById('city').value;
    
    try {
        // 更新认证系统中的用户资料
        window.authSystem.updateProfile({
            username: username,
            email: email,
            avatar: avatar
        });
        
        // 保存用户资料到用户数据库
        if (window.userDatabase) {
            window.userDatabase.saveUserProfile({
                bio: bio,
                country: country,
                province: province,
                city: city
            });
        }
        
        alert('个人资料更新成功！');
        window.location.reload();
    } catch (error) {
        alert('更新失败：' + error.message);
    }
}

// 修改密码
function changePassword() {
    if (!window.authSystem || !window.authSystem.currentUser) {
        alert('请先登录');
        return;
    }
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 验证输入
    if (!oldPassword || !newPassword || !confirmPassword) {
        alert('请填写所有密码字段');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('新密码和确认密码不一致');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('新密码至少需要6个字符');
        return;
    }
    
    try {
        // 修改密码
        window.authSystem.changePassword(oldPassword, newPassword);
        alert('密码修改成功！');
        
        // 清空表单
        document.getElementById('passwordForm').reset();
    } catch (error) {
        alert('修改失败：' + error.message);
    }
}

// 加载学习进度
function loadLearningProgress() {
    // 获取用户数据
    const communityUser = window.communitySystem ? window.communitySystem.currentUser : null;
    if (!communityUser) return;
    
    // 模拟学习进度数据
    const vocabularyLearned = Math.min(communityUser.points / 2, 850); // 假设最多1000词汇
    const vocabularyTotal = 1000;
    const vocabularyPercent = Math.round((vocabularyLearned / vocabularyTotal) * 100);
    
    const grammarLearned = Math.min(communityUser.points / 50, 85); // 假设最多100个语法规则
    const grammarTotal = 100;
    const grammarPercent = Math.round((grammarLearned / grammarTotal) * 100);
    
    // 更新词汇进度
    document.getElementById('vocabularyProgressFill').style.width = `${vocabularyPercent}%`;
    document.getElementById('vocabularyProgressText').textContent = `${vocabularyLearned}/${vocabularyTotal} 词汇`;
    document.getElementById('vocabularyProgressPercent').textContent = `${vocabularyPercent}%`;
    
    // 更新语法进度
    document.getElementById('grammarProgressFill').style.width = `${grammarPercent}%`;
    document.getElementById('grammarProgressText').textContent = `${grammarLearned}/${grammarTotal} 语法规则`;
    document.getElementById('grammarProgressPercent').textContent = `${grammarPercent}%`;
    
    // 更新每日学习目标
    document.getElementById('todayLearned').textContent = Math.floor(communityUser.points / 100);
    document.getElementById('dailyGoal').textContent = '10'; // 默认目标
    document.getElementById('streakDays').textContent = '5'; // 模拟连续天数
}

// 初始化学习图表
function initLearningChart() {
    const canvas = document.getElementById('learningChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置样式
    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    
    // 绘制图表背景
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // 垂直网格线
    for (let i = 0; i <= 7; i++) {
        const x = (canvas.width / 7) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // 水平网格线
    for (let i = 0; i <= 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // 绘制学习数据线
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // 模拟数据点
    const dataPoints = [20, 35, 30, 50, 65, 60, 80];
    const pointSpacing = canvas.width / (dataPoints.length - 1);
    
    for (let i = 0; i < dataPoints.length; i++) {
        const x = i * pointSpacing;
        const y = canvas.height - (dataPoints[i] / 100) * canvas.height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // 绘制数据点
    ctx.fillStyle = '#4ecdc4';
    for (let i = 0; i < dataPoints.length; i++) {
        const x = i * pointSpacing;
        const y = canvas.height - (dataPoints[i] / 100) * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加标签
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    for (let i = 0; i < days.length; i++) {
        const x = i * pointSpacing;
        ctx.fillText(days[i], x, canvas.height - 5);
    }
}

// 加载收藏内容
function loadFavorites() {
    // 从用户数据库获取收藏数据
    let favoriteWords = [];
    let favoritePosts = [];
    
    if (window.userDatabase) {
        const favorites = window.userDatabase.getUserFavorites();
        // 分离词汇和帖子收藏
        favoriteWords = favorites.filter(item => item.type === 'word');
        favoritePosts = favorites.filter(item => item.type === 'post');
    } else {
        // 如果没有用户数据库，使用模拟数据
        favoriteWords = [
            { id: 'word1', word: 'linkaitiya', meaning: '琳凯蒂亚语', type: '名词' },
            { id: 'word2', word: 'beautiful', meaning: '美丽的', type: '形容词' },
            { id: 'word3', word: 'sose', meaning: '学习', type: '动词' },
            { id: 'word4', word: 'mun', meaning: '月亮', type: '名词' },
            { id: 'word5', word: 'kaitiya', meaning: '星球', type: '名词' },
            { id: 'word6', word: 'nim', meaning: '双', type: '数词' }
        ];
        
        favoritePosts = [
            { id: 'post1', title: '琳凯蒂亚语的语序问题', author: '星辰管理员', date: '2025-01-06' },
            { id: 'post2', title: '如何记住复杂的代词变格？', author: '光线使者', date: '2025-01-05' },
            { id: 'post3', title: '双月历法的计算方法', author: '琳凯蒂亚', date: '2025-01-04' },
            { id: 'post4', title: 'AI翻译的准确性问题', author: '语言学者', date: '2025-01-03' }
        ];
    }
    
    // 获取收藏的词汇
    const favoriteWordsContainer = document.getElementById('favoriteWords');
    if (favoriteWordsContainer) {
        if (favoriteWords.length > 0) {
            favoriteWordsContainer.innerHTML = '';
            favoriteWords.forEach(word => {
                const wordCard = document.createElement('div');
                wordCard.className = 'favorite-word-card';
                wordCard.dataset.id = word.id;
                wordCard.innerHTML = `
                    <div class="remove-favorite" title="取消收藏">×</div>
                    <div class="word-main">${word.word}</div>
                    <div class="word-type">${word.type}</div>
                    <div class="word-meaning">${word.meaning}</div>
                `;
                favoriteWordsContainer.appendChild(wordCard);
            });
        }
    }
    
    // 获取收藏的帖子
    const favoritePostsContainer = document.getElementById('favoritePosts');
    if (favoritePostsContainer) {
        if (favoritePosts.length > 0) {
            favoritePostsContainer.innerHTML = '';
            favoritePosts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.className = 'favorite-post-item';
                postItem.dataset.id = post.id;
                postItem.innerHTML = `
                    <div class="remove-favorite" title="取消收藏">×</div>
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">
                        <span class="post-author">${post.author}</span>
                        <span class="post-date">${post.date}</span>
                    </div>
                `;
                favoritePostsContainer.appendChild(postItem);
            });
        }
    }
}

// 查看收藏的词汇详情
function viewFavoriteWord(card) {
    const word = card.querySelector('.word-main').textContent;
    alert(`查看词汇详情: ${word}\n\n这里可以跳转到词典页面查看该词汇的详细信息。`);
    // 实际项目中可以跳转到词典页面查看该词汇
    // window.location.href = `dictionary.html?word=${encodeURIComponent(word)}`;
}

// 查看收藏的帖子详情
function viewFavoritePost(item) {
    const title = item.querySelector('.post-title').textContent;
    alert(`查看帖子详情: ${title}\n\n这里可以跳转到社区页面查看该帖子的详细内容。`);
    // 实际项目中可以跳转到社区页面查看该帖子
    // window.location.href = `community.html?post=${encodeURIComponent(title)}`;
}

// 移除收藏
function removeFavorite(removeBtn) {
    const container = removeBtn.closest('.favorite-word-card, .favorite-post-item');
    if (container) {
        const itemId = container.dataset.id;
        const type = container.classList.contains('favorite-word-card') ? '词汇' : '帖子';
        const title = container.querySelector('.word-main, .post-title').textContent;
        
        if (confirm(`确定要取消收藏"${title}"这个${type}吗？`)) {
            // 从用户数据库中移除收藏
            if (window.userDatabase) {
                window.userDatabase.removeFavorite(itemId);
            }
            
            container.style.transform = 'scale(0)';
            container.style.opacity = '0';
            setTimeout(() => {
                container.remove();
                // 检查是否为空
                const parent = container.parentElement;
                if (parent && parent.children.length === 0) {
                    parent.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon">${type === '词汇' ? '❤️' : '📌'}</div>
                            <div class="empty-text">您还没有收藏任何${type}</div>
                        </div>
                    `;
                }
            }, 300);
        }
    }
}

// 加载学习历史
function loadLearningHistory() {
    // 从用户数据库获取学习历史
    let history = [];
    if (window.userDatabase) {
        history = window.userDatabase.getLearningHistory();
    }
    
    // 分离词汇和语法历史
    const wordHistory = history.filter(item => item.type === 'word');
    const grammarHistory = history.filter(item => item.type === 'grammar');
    
    // 显示词汇历史
    const wordHistoryContainer = document.getElementById('wordHistory');
    if (wordHistoryContainer) {
        if (wordHistory.length > 0) {
            wordHistoryContainer.innerHTML = '';
            wordHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-word">${item.word || item.content}</div>
                    <div class="history-meaning">${item.meaning || '已学习'}</div>
                    <div class="history-date">${new Date(item.date).toLocaleDateString('zh-CN')}</div>
                    <div class="history-status ${item.status || 'mastered'}">${item.status === 'learning' ? '学习中' : '已掌握'}</div>
                `;
                wordHistoryContainer.appendChild(historyItem);
            });
        }
    }
    
    // 显示语法历史
    const grammarHistoryContainer = document.getElementById('grammarHistory');
    if (grammarHistoryContainer) {
        if (grammarHistory.length > 0) {
            grammarHistoryContainer.innerHTML = '';
            grammarHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-rule">${item.rule || item.content}</div>
                    <div class="history-meaning">${item.description || '已学习'}</div>
                    <div class="history-date">${new Date(item.date).toLocaleDateString('zh-CN')}</div>
                    <div class="history-status ${item.status || 'mastered'}">${item.status === 'learning' ? '学习中' : '已掌握'}</div>
                `;
                grammarHistoryContainer.appendChild(historyItem);
            });
        }
    }
}

// 加载词汇贡献记录
function loadWordContributions() {
    console.log('加载词汇贡献记录...');
    
    // 获取当前用户ID
    const currentUser = window.authSystem && window.authSystem.currentUser;
    if (!currentUser) {
        console.log('用户未登录');
        return;
    }
    
    try {
        // 从localStorage获取所有单词申请记录
        let allRequests = JSON.parse(localStorage.getItem('linkaitiya_word_requests') || '[]');
        
        // 筛选出当前用户的申请记录
        const userRequests = allRequests.filter(request => request.requestedBy === currentUser.id);
        
        // 按时间倒序排列
        userRequests.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
        
        // 显示申请记录
        const contributionsContainer = document.getElementById('wordContributions');
        if (contributionsContainer) {
            if (userRequests.length > 0) {
                contributionsContainer.innerHTML = '';
                userRequests.forEach(request => {
                    const contributionItem = document.createElement('div');
                    contributionItem.className = 'history-item';
                    
                    // 构建词性信息
                    const typeInfo = request.type ? `<div class="word-type">词性：${request.type}</div>` : '';
                    
                    // 构建理由信息
                    const reasonInfo = request.reason ? `<div class="request-reason">申请理由：${request.reason}</div>` : '';
                    
                    contributionItem.innerHTML = `
                        <div class="history-header">
                            <div class="history-word">${request.linkaitiya}</div>
                            <div class="history-status ${request.status === 'approved' ? 'mastered' : request.status === 'rejected' ? 'rejected' : 'learning'}">
                                ${request.status === 'approved' ? '已通过' : request.status === 'rejected' ? '已拒绝' : '待审核'}
                            </div>
                        </div>
                        <div class="history-meaning">${request.chinese}</div>
                        ${typeInfo}
                        ${reasonInfo}
                        <div class="history-date">${new Date(request.requestedAt).toLocaleDateString('zh-CN')}</div>
                    `;
                    contributionsContainer.appendChild(contributionItem);
                });
            } else {
                contributionsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📝</div>
                        <div class="empty-text">您还没有贡献任何词汇</div>
                    </div>
                `;
            }
        }
        
        // 更新统计信息
        updateContributionStats(userRequests);
    } catch (error) {
        console.error('加载词汇贡献记录失败:', error);
        // 显示错误信息
        const contributionsContainer = document.getElementById('wordContributions');
        if (contributionsContainer) {
            contributionsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">❌</div>
                    <div class="empty-text">加载词汇贡献记录时出错</div>
                </div>
            `;
        }
    }
}

// 更新贡献统计信息
function updateContributionStats(requests) {
    const total = requests.length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const pending = requests.filter(r => r.status === 'pending').length;
    const added = approved; // 已通过的申请视为已添加
    
    // 更新页面元素
    document.getElementById('totalContributions').textContent = total;
    document.getElementById('approvedContributions').textContent = approved;
    document.getElementById('pendingContributions').textContent = pending;
    document.getElementById('totalWordsAdded').textContent = added;
}

// 加载学习设置
function loadLearningSettings() {
    // 从用户数据库获取学习设置
    let settings = {};
    if (window.userDatabase) {
        settings = window.userDatabase.getUserSettings();
    }
    
    // 应用设置到表单
    document.getElementById('dailyGoalSetting').value = settings.dailyGoal || '10';
    document.getElementById('notificationsSetting').checked = settings.notifications !== false; // 默认开启
    document.getElementById('emailNotificationsSetting').checked = settings.emailNotifications !== false; // 默认开启
}

// 保存学习设置
function saveLearningSettings() {
    const dailyGoal = document.getElementById('dailyGoalSetting').value;
    const notifications = document.getElementById('notificationsSetting').checked;
    const emailNotifications = document.getElementById('emailNotificationsSetting').checked;
    
    // 保存到用户数据库
    if (window.userDatabase) {
        window.userDatabase.saveUserSettings({
            dailyGoal: dailyGoal,
            notifications: notifications,
            emailNotifications: emailNotifications
        });
    }
    
    alert(`学习设置已保存：\n每日目标：${dailyGoal}个词汇\n学习提醒：${notifications ? '开启' : '关闭'}\n邮件通知：${emailNotifications ? '开启' : '关闭'}`);
}

// 处理头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        event.target.value = '';
        return;
    }
    
    // 检查文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        event.target.value = '';
        return;
    }
    
    // 显示预览
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        previewImage.src = e.target.result;
        preview.style.display = 'block';
        
        // 这里可以添加上传到服务器的逻辑
        // 在实际项目中，你可能需要将图片上传到服务器并获取URL
        console.log('头像文件已选择:', file.name);
    };
    reader.readAsDataURL(file);
}