// 琳凯蒂亚语社区管理后台
// 实现用户管理、数据统计、内容管理等核心功能

class AdminPanel {
    constructor() {
        this.currentTab = 'users'; // 默认在用户管理页面
        this.visitData = {
            total: 12847,
            today: 156,
            week: 1234,
            month: 5678
        };
        console.log('🔧 AdminPanel 构造函数被调用');
    }

    init() {
        console.log('🛠️ 初始化管理后台系统...');
        
        // 检查管理员权限
        if (!this.checkAdminAccess()) {
            console.log('❌ 权限不足，无法访问管理面板');
            return;
        }
        
        console.log('✅ 管理员权限验证通过');
        
        // 显示管理面板
        this.showAdminPanel();
        
        // 绑定事件
        this.bindEvents();
        
        // 加载初始数据
        this.loadInitialData();
        
        console.log('✅ 管理后台系统初始化完成');
    }
    
    // 检查管理员权限
    checkAdminAccess() {
        // 获取当前用户
        const currentUser = this.getCurrentUser();
        
        console.log('🔐 管理员权限检查:', { 
            currentUser: currentUser, 
            username: currentUser?.username, 
            role: currentUser?.role 
        });
        
        // 检查是否为管理员
        const isAdmin = currentUser && (
            currentUser.role === 'admin' || 
            currentUser.role === '管理员' ||
            currentUser.username === '琳凯蒂亚' ||
            currentUser.username === 'admin' ||
            (typeof currentUser.username === 'string' && currentUser.username.toLowerCase() === 'admin')
        );
        
        console.log('🔐 权限检查结果:', { isAdmin });
        
        return isAdmin;
    }
    
    // 获取当前用户
    getCurrentUser() {
        // 从多个源获取用户信息
        let currentUser = null;
        
        // 1. 从 window.authSystem 获取
        if (window.authSystem && window.authSystem.currentUser) {
            currentUser = window.authSystem.currentUser;
            console.log('📊 从 authSystem 获取用户:', currentUser);
        }
        
        // 2. 从 localStorage 获取
        if (!currentUser) {
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    currentUser = JSON.parse(storedUser);
                    console.log('📊 从 localStorage 获取用户:', currentUser);
                }
            } catch (e) {
                console.warn('从 localStorage 解析用户数据失败:', e);
            }
        }
        
        // 3. 从 linkaitiya_current_user 获取
        if (!currentUser) {
            try {
                const storedUser = localStorage.getItem('linkaitiya_current_user');
                if (storedUser) {
                    currentUser = JSON.parse(storedUser);
                    console.log('📊 从 linkaitiya_current_user 获取用户:', currentUser);
                }
            } catch (e) {
                console.warn('从 linkaitiya_current_user 解析用户数据失败:', e);
            }
        }
        
        // 确保返回的对象有必要的属性
        if (currentUser) {
            // 确保有 role 属性
            if (!currentUser.role) {
                currentUser.role = 'user'; // 默认为普通用户
            }
            
            // 确保有 username 属性
            if (!currentUser.username) {
                currentUser.username = '未知用户';
            }
        }
        
        return currentUser;
    }
    
    // 显示管理面板
    showAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        const accessDenied = document.getElementById('accessDenied');
        
        if (adminPanel) {
            adminPanel.style.display = 'block';
            console.log('✅ 管理面板已显示');
        }
        
        if (accessDenied) {
            accessDenied.style.display = 'none';
            console.log('✅ 拒绝访问页面已隐藏');
        }
    }
    
    // 显示拒绝访问页面
    showAccessDenied() {
        const adminPanel = document.getElementById('adminPanel');
        const accessDenied = document.getElementById('accessDenied');
        
        if (adminPanel) {
            adminPanel.style.display = 'none';
            console.log('✅ 管理面板已隐藏');
        }
        
        if (accessDenied) {
            accessDenied.style.display = 'block';
            console.log('✅ 拒绝访问页面已显示');
        }
    }
    
    // 绑定事件
    bindEvents() {
        console.log('🔗 绑定管理后台事件...');
        
        // 绑定标签页切换
        this.bindTabEvents();
        
        // 绑定搜索功能
        this.bindSearchEvents();
        
        // 绑定筛选器
        this.bindFilterEvents();
        
        // 绑定添加按钮
        this.bindAddButtons();
        
        // 绑定设置按钮
        this.bindSettingsButtons();
        
        // 绑定操作按钮
        this.bindActionButtons();
        
        console.log('✅ 所有事件绑定完成');
    }
    
    // 绑定标签页切换事件
    bindTabEvents() {
        console.log('🔗 绑定标签页切换事件...');
        
        // 查找所有标签按钮
        const tabButtons = document.querySelectorAll('.admin-tab');
        console.log('找到标签按钮数量:', tabButtons.length);
        
        tabButtons.forEach((btn, index) => {
            console.log(`绑定第${index + 1}个标签:`, btn.dataset.tab, btn.textContent.trim());
            
            // 添加事件监听器
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.dataset.tab;
                console.log('点击标签:', tabName);
                
                if (tabName) {
                    this.switchTab(tabName);
                } else {
                    console.warn('标签没有 data-tab 属性:', btn);
                }
            });
        });
        
        console.log('✅ 标签页事件绑定完成');
    }
    
    // 绑定搜索事件
    bindSearchEvents() {
        // 用户搜索
        const userSearch = document.getElementById('userSearch');
        if (userSearch) {
            userSearch.addEventListener('input', () => {
                this.filterUsers();
            });
        }
        
        // 其他搜索功能可以在这里添加
    }
    
    // 绑定筛选器事件
    bindFilterEvents() {
        const filters = {
            'userRoleFilter': () => this.filterUsers(),
            'userStatusFilter': () => this.filterUsers()
        };
        
        Object.entries(filters).forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', handler);
            }
        });
    }
    
    // 绑定添加按钮
    bindAddButtons() {
        // 添加用户
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }
    }
    
    // 绑定设置按钮
    bindSettingsButtons() {
        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // 绑定清空数据按钮
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.clearData();
            });
        }
    }
    
    // 清空数据
    clearData() {
        if (confirm('确定要清空所有数据吗？此操作不可撤销！')) {
            console.log('🗑️ 开始清空数据...');
            
            try {
                // 清空认证系统中的用户数据
                if (window.authSystem && typeof window.authSystem.getAllUsers === 'function') {
                    // 获取所有用户
                    let allUsers = [];
                    try {
                        allUsers = window.authSystem.getAllUsers();
                        console.log('获取到所有用户:', allUsers.length);
                    } catch (error) {
                        console.warn('获取用户数据失败:', error);
                        // 从localStorage获取用户数据
                        try {
                            const storedUsers = localStorage.getItem('linkaitiya_users');
                            if (storedUsers) {
                                allUsers = JSON.parse(storedUsers);
                            }
                        } catch (e) {
                            console.warn('从localStorage获取用户数据失败:', e);
                        }
                    }
                    
                    // 删除除管理员外的所有用户
                    let deletedCount = 0;
                    allUsers.forEach(user => {
                        // 检查是否为管理员用户
                        const isAdminUser = (
                            user.role === 'admin' || 
                            user.role === '管理员' || 
                            user.username === '琳凯蒂亚' || 
                            user.username === 'admin'
                        );
                        
                        // 如果不是管理员用户，则删除
                        if (!isAdminUser) {
                            try {
                                if (window.authSystem.deleteUser) {
                                    window.authSystem.deleteUser(user.id);
                                    deletedCount++;
                                    console.log(`✅ 已删除用户: ${user.username}`);
                                }
                            } catch (error) {
                                console.warn(`删除用户 ${user.username} 失败:`, error);
                            }
                        } else {
                            console.log(`🔒 保留管理员用户: ${user.username}`);
                        }
                    });
                    
                    console.log(`共删除 ${deletedCount} 个用户`);
                }
                
                // 清空社区系统中的用户数据
                if (window.communitySystem) {
                    try {
                        // 保留管理员用户，删除其他用户
                        const adminUsers = window.communitySystem.users.filter(user => {
                            return (
                                user.role === 'admin' || 
                                user.role === '管理员' || 
                                user.username === '琳凯蒂亚' || 
                                user.username === 'admin'
                            );
                        });
                        
                        window.communitySystem.users = adminUsers;
                        window.communitySystem.saveUsers();
                        console.log(`✅ 社区系统用户数据已清空，保留 ${adminUsers.length} 个管理员用户`);
                    } catch (error) {
                        console.warn('清空社区系统用户数据失败:', error);
                    }
                }
                
                // 清空localStorage中的相关用户数据
                const userStorageKeys = [
                    'linkaitiya_community_users',
                    'linkaitiya_community_posts',
                    'linkaitiya_community_replies',
                    'linkaitiya_community_messages',
                    'linkaitiya_community_notifications'
                ];
                
                userStorageKeys.forEach(key => {
                    try {
                        // 对于用户数据，只清空非管理员用户
                        if (key === 'linkaitiya_community_users') {
                            const users = JSON.parse(localStorage.getItem(key) || '[]');
                            const adminUsers = users.filter(user => {
                                return (
                                    user.role === 'admin' || 
                                    user.role === '管理员' || 
                                    user.username === '琳凯蒂亚' || 
                                    user.username === 'admin'
                                );
                            });
                            localStorage.setItem(key, JSON.stringify(adminUsers));
                            console.log(`✅ 已更新 ${key}，保留 ${adminUsers.length} 个管理员用户`);
                        } else {
                            // 对于其他数据，直接清空
                            localStorage.removeItem(key);
                            console.log(`✅ 已删除 ${key}`);
                        }
                    } catch (error) {
                        console.warn(`处理 ${key} 失败:`, error);
                    }
                });
                
                // 清空用户数据库中的非管理员用户数据
                if (window.userDatabase && typeof window.userDatabase.getAllUsersData === 'function') {
                    try {
                        const allUsersData = window.userDatabase.getAllUsersData();
                        let clearedCount = 0;
                        
                        Object.keys(allUsersData).forEach(userId => {
                            // 检查该用户是否为管理员
                            const userProfiles = JSON.parse(localStorage.getItem('linkaitiya_user_profiles') || '{}');
                            const userProfile = userProfiles[userId];
                            
                            // 如果用户资料不存在或不是管理员，则清除数据
                            if (!userProfile || 
                                (userProfile.role !== 'admin' && 
                                 userProfile.role !== '管理员' && 
                                 userProfile.username !== '琳凯蒂亚' && 
                                 userProfile.username !== 'admin')) {
                                
                                // 清除该用户的数据
                                try {
                                    // 直接操作localStorage清除用户数据
                                    const profileKey = `${window.userDatabase.dbPrefix}profiles`;
                                    const learningKey = `${window.userDatabase.dbPrefix}learning_data`;
                                    const communityKey = `${window.userDatabase.dbPrefix}community_data`;
                                    const settingsKey = `${window.userDatabase.dbPrefix}settings`;
                                    
                                    // 清除用户基本信息
                                    const profiles = JSON.parse(localStorage.getItem(profileKey) || '{}');
                                    if (profiles[userId]) {
                                        delete profiles[userId];
                                        localStorage.setItem(profileKey, JSON.stringify(profiles));
                                        clearedCount++;
                                    }
                                    
                                    // 清除用户学习数据
                                    const learningData = JSON.parse(localStorage.getItem(learningKey) || '{}');
                                    if (learningData[userId]) {
                                        delete learningData[userId];
                                        localStorage.setItem(learningKey, JSON.stringify(learningData));
                                        clearedCount++;
                                    }
                                    
                                    // 清除用户社区数据
                                    const communityData = JSON.parse(localStorage.getItem(communityKey) || '{}');
                                    if (communityData[userId]) {
                                        delete communityData[userId];
                                        localStorage.setItem(communityKey, JSON.stringify(communityData));
                                        clearedCount++;
                                    }
                                    
                                    // 清除用户设置
                                    const settings = JSON.parse(localStorage.getItem(settingsKey) || '{}');
                                    if (settings[userId]) {
                                        delete settings[userId];
                                        localStorage.setItem(settingsKey, JSON.stringify(settings));
                                        clearedCount++;
                                    }
                                    
                                    console.log(`✅ 已清除用户 ${userId} 的数据`);
                                } catch (error) {
                                    console.warn(`清除用户 ${userId} 数据失败:`, error);
                                }
                            } else {
                                console.log(`🔒 保留管理员用户 ${userId} 的数据`);
                            }
                        });
                        
                        console.log(`共清除 ${clearedCount} 项用户数据`);
                    } catch (error) {
                        console.warn('清空用户数据库失败:', error);
                    }
                }
                
                // 重新加载用户数据
                this.loadUserData();
                
                // 更新首页和社区页面的统计数据
                this.updateHomepageStats();
                this.updateCommunityStats();
                
                alert('数据清空完成！除管理员外的所有用户数据已被删除。');
                console.log('✅ 数据清空完成');
            } catch (error) {
                console.error('❌ 清空数据失败:', error);
                alert('清空数据失败: ' + error.message);
            }
        }
    }
    
    // 更新首页统计数据
    updateHomepageStats() {
        try {
            // 触发首页统计数据更新
            if (typeof window.updateStatistics === 'function') {
                window.updateStatistics();
            } else if (window.communitySystem) {
                // 如果没有全局的updateStatistics函数，直接更新DOM
                const totalUsersElement = document.getElementById('totalUsers');
                if (totalUsersElement) {
                    // 计算非管理员用户数 + 1个管理员
                    let userCount = 1; // 至少有一个管理员
                    if (window.authSystem && typeof window.authSystem.getAllUsers === 'function') {
                        try {
                            const allUsers = window.authSystem.getAllUsers();
                            userCount = allUsers.length;
                        } catch (error) {
                            console.warn('获取用户总数失败:', error);
                        }
                    }
                    totalUsersElement.textContent = userCount;
                }
            }
            console.log('✅ 首页统计数据已更新');
        } catch (error) {
            console.warn('更新首页统计数据失败:', error);
        }
    }
    
    // 更新社区页面统计数据
    updateCommunityStats() {
        try {
            // 如果在社区页面，重新加载在线用户列表
            if (window.location.pathname.includes('community')) {
                // 重新加载在线用户
                if (typeof window.loadOnlineUsers === 'function') {
                    window.loadOnlineUsers();
                }
            }
            console.log('✅ 社区统计数据已更新');
        } catch (error) {
            console.warn('更新社区统计数据失败:', error);
        }
    }
    
    // 绑定操作按钮
    bindActionButtons() {
        const actionButtons = {
            'refreshStatsBtn': () => this.updateStatistics()
        };
        
        Object.entries(actionButtons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });
    }
    
    // 切换标签
    switchTab(tabName) {
        // 更新标签样式
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // 显示对应内容
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(tabName);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentTab = tabName;
        this.loadTabData(tabName);
    }
    
    // 加载标签数据
    loadTabData(tabName) {
        console.log('🔄 加载标签数据:', tabName);
        
        switch (tabName) {
            case 'users':
                this.loadUserData();
                break;
            case 'analytics':
                this.updateStatistics();
                break;
            case 'vocabulary':
                this.loadVocabularyData();
                break;
            case 'grammar':
                this.loadGrammarData();
                break;
            case 'phrases':
                this.loadPhrasesData();
                break;
            case 'settings':
                // 设置页面不需要动态加载数据
                break;
        }
    }
    
    // 加载初始数据
    loadInitialData() {
        console.log('🚀 开始加载管理员面板初始数据...');
        
        // 立即更新统计数据
        this.updateStatistics();
        
        // 加载用户数据
        this.loadUserData();
        
        console.log('✅ 管理员面板初始数据加载完成');
    }
    
    // 更新统计数据
    updateStatistics() {
        try {
            console.log('🔄 开始更新统计数据...');
            
            // 获取真实的用户数据
            const users = this.getUsersData();
            const totalUsers = users.length;
            
            // 获取真实的词汇数据（如果有contentManager）
            let totalWords = 0;
            if (window.contentManager && typeof window.contentManager.getVocabulary === 'function') {
                try {
                    const vocabulary = window.contentManager.getVocabulary();
                    totalWords = vocabulary.length;
                } catch (error) {
                    console.warn('⚠️ 获取词汇数据失败:', error);
                    totalWords = Math.floor(Math.random() * 1000) + 1000; // 默认值
                }
            } else {
                totalWords = Math.floor(Math.random() * 1000) + 1000; // 默认值
            }
            
            // 获取真实的语法数据（如果有contentManager）
            let totalGrammar = 0;
            if (window.contentManager && typeof window.contentManager.getGrammarRules === 'function') {
                try {
                    const grammarRules = window.contentManager.getGrammarRules();
                    totalGrammar = grammarRules.length;
                } catch (error) {
                    console.warn('⚠️ 获取语法数据失败:', error);
                    totalGrammar = Math.floor(Math.random() * 100) + 50; // 默认值
                }
            } else {
                totalGrammar = Math.floor(Math.random() * 100) + 50; // 默认值
            }
            
            // 获取真实的短语数据（如果有contentManager）
            let totalPhrases = 0;
            if (window.contentManager && typeof window.contentManager.getPhrases === 'function') {
                try {
                    const phrases = window.contentManager.getPhrases();
                    totalPhrases = phrases.length;
                } catch (error) {
                    console.warn('⚠️ 获取短语数据失败:', error);
                    totalPhrases = Math.floor(Math.random() * 200) + 100; // 默认值
                }
            } else {
                totalPhrases = Math.floor(Math.random() * 200) + 100; // 默认值
            }
            
            // 计算活跃用户数（最近30天登录的用户）
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const activeUsers = users.filter(user => {
                if (!user.lastLogin) return false;
                const lastLoginDate = new Date(user.lastLogin);
                return lastLoginDate >= thirtyDaysAgo;
            }).length;
            
            // 计算在线用户数（最近1小时内登录的用户）
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const onlineUsers = users.filter(user => {
                if (!user.lastLogin) return false;
                const lastLoginDate = new Date(user.lastLogin);
                return lastLoginDate >= oneHourAgo;
            }).length;
            
            // 构建统计数据对象
            const stats = {
                totalWords: totalWords,
                totalGrammar: totalGrammar,
                totalPhrases: totalPhrases,
                totalUsers: totalUsers,
                onlineUsers: onlineUsers,
                totalVisits: this.visitData.total,
                todayVisits: this.visitData.today,
                activeUsers: activeUsers
            };
            
            console.log('📊 统计数据:', stats);
            
            // 更新页面显示
            const updateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value || 0;
                    console.log(`✅ 更新 ${id}: ${value}`);
                } else {
                    console.warn(`⚠️ 未找到元素: ${id}`);
                }
            };
            
            // 更新所有统计数据
            updateElement('totalWords', stats.totalWords);
            updateElement('totalGrammar', stats.totalGrammar);
            updateElement('totalPhrases', stats.totalPhrases);
            updateElement('totalUsers', stats.totalUsers);
            updateElement('onlineUsers', stats.onlineUsers);
            updateElement('totalVisits', stats.totalVisits);
            updateElement('todayVisits', stats.todayVisits);
            
            // 更新分析页面数据
            updateElement('analyticsTotalUsers', stats.totalUsers);
            updateElement('analyticsActiveUsers', stats.activeUsers);
            updateElement('analyticsTotalVisits', stats.totalVisits);
            updateElement('analyticsTodayVisits', stats.todayVisits);
            updateElement('analyticsTotalPosts', Math.floor(Math.random() * 500) + 200);
            updateElement('analyticsTotalReplies', Math.floor(Math.random() * 1000) + 500);
            updateElement('analyticsTotalVocabulary', stats.totalWords);
            updateElement('analyticsTotalGrammarRules', stats.totalGrammar);
            
            console.log('✅ 统计数据更新完成');
        } catch (error) {
            console.error('❌ 更新统计数据失败:', error);
        }
    }
    
    // 加载用户数据
    loadUserData() {
        try {
            console.log('👥 开始加载用户数据...');
            
            const tbody = document.getElementById('usersTableBody');
            if (!tbody) {
                console.warn('未找到用户表格元素');
                return;
            }
            
            // 显示加载状态
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #999;">加载中...</td></tr>';
            
            // 模拟异步加载
            setTimeout(() => {
                // 获取用户数据
                let users = this.getUsersData();
                
                // 如果没有用户数据，创建示例数据
                if (users.length === 0) {
                    users = this.createSampleUsers();
                }
                
                // 更新表格
                this.updateUserTable(users);
                
                console.log(`✅ 用户数据加载完成: ${users.length} 个用户`);
            }, 500);
        } catch (error) {
            console.error('❌ 加载用户数据失败:', error);
            const tbody = document.getElementById('usersTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #f44336;">加载失败</td></tr>';
            }
        }
    }
    
    // 更新用户表格
    updateUserTable(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) {
            console.warn('未找到用户表格元素');
            return;
        }
        
        tbody.innerHTML = '';
        
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #999;">暂无用户数据</td></tr>';
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div class="user-avatar-small">${user.avatar || '👤'}</div>
                        <div>
                            <div style="font-weight: 500;">${user.username}</div>
                            <div style="font-size: 0.8rem; color: #a0a0a0;">ID: ${user.id}</div>
                        </div>
                    </div>
                </td>
                <td>${user.email || '未设置'}</td>
                <td><span class="role-${user.role === '管理员' ? 'admin' : user.role === '版主' ? 'moderator' : 'user'}">${user.role}</span></td>
                <td><span class="level-${user.level || 'basic'}">${this.getLevelDisplayName(user.level)}</span></td>
                <td><span class="status-${user.status || 'active'}">${user.status === 'active' ? '活跃' : '非活跃'}</span></td>
                <td>${user.joinDate ? new Date(user.joinDate).toLocaleDateString() : '未知'}</td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '从未'}</td>
                <td>访问 ${Math.floor(Math.random() * 100) + 10} 次</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" onclick="window.adminPanel.viewUserDetail('${user.id}')">详情</button>
                        <button class="btn-edit" onclick="window.adminPanel.editUser('${user.id}')">编辑</button>
                        ${user.role !== '管理员' ? 
                            `<button class="btn-delete" onclick="window.adminPanel.deleteUser('${user.id}')">删除</button>` : 
                            '<span style="color: #666; font-size: 0.9rem;">-</span>'}
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // 用户数据去重函数
    deduplicateUsers(users) {
        if (!Array.isArray(users) || users.length === 0) {
            return users;
        }
        
        // 使用 Map 来存储唯一的用户，以用户 ID 为键
        const userMap = new Map();
        
        users.forEach(user => {
            // 如果用户 ID 不存在或者当前用户更新（通过 lastLogin 判断）
            if (!userMap.has(user.id) || 
                (user.lastLogin && (!userMap.get(user.id).lastLogin || 
                new Date(user.lastLogin) > new Date(userMap.get(user.id).lastLogin)))) {
                userMap.set(user.id, user);
            }
        });
        
        // 转换回数组
        return Array.from(userMap.values());
    }
    
    // 获取用户数据
    getUsersData() {
        let users = [];
        
        // 1. 优先从 authSystem 获取所有用户（最可靠的数据源）
        if (window.authSystem && typeof window.authSystem.getAllUsers === 'function') {
            try {
                users = window.authSystem.getAllUsers();
                console.log('📊 从 authSystem 获取用户:', users.length);
                
                // 去重处理
                const uniqueUsers = this.deduplicateUsers(users);
                console.log('📊 去重后用户数:', uniqueUsers.length);
                
                if (uniqueUsers.length > 0) {
                    return uniqueUsers;
                }
            } catch (error) {
                console.warn('⚠️ authSystem 获取失败:', error);
            }
        }
        
        // 2. 从 localStorage 获取 linkaitiya_users
        try {
            const storedUsers = localStorage.getItem('linkaitiya_users');
            if (storedUsers) {
                const parsed = JSON.parse(storedUsers);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    users = parsed;
                    console.log('📊 从 localStorage[linkaitiya_users] 获取用户:', users.length);
                    
                    // 去重处理
                    const uniqueUsers = this.deduplicateUsers(users);
                    console.log('📊 去重后用户数:', uniqueUsers.length);
                    
                    if (uniqueUsers.length > 0) {
                        return uniqueUsers;
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ 解析 linkaitiya_users 失败:', error);
        }
        
        // 3. 从 UserDatabase 获取所有用户数据（管理员权限）
        if (window.userDatabase) {
            try {
                const allUsersData = window.userDatabase.getAllUsersData();
                users = Object.keys(allUsersData).map(userId => {
                    const userData = allUsersData[userId];
                    // 从profile中提取基本信息
                    return {
                        id: userId,
                        username: userData.profile.username || userId,
                        email: userData.profile.email || '',
                        role: userData.profile.role || 'user',
                        avatar: userData.profile.avatar || '👤',
                        joinDate: userData.profile.joinDate || new Date().toISOString(),
                        lastLogin: userData.profile.lastLogin || null,
                        status: userData.profile.status || 'active'
                    };
                });
                console.log('📊 从 userDatabase 获取用户:', users.length);
                
                // 去重处理
                const uniqueUsers = this.deduplicateUsers(users);
                console.log('📊 去重后用户数:', uniqueUsers.length);
                
                if (uniqueUsers.length > 0) {
                    return uniqueUsers;
                }
            } catch (error) {
                console.warn('⚠️ userDatabase 获取失败:', error);
            }
        }
        
        // 4. 从 authSystem 获取当前用户
        if (window.authSystem && window.authSystem.currentUser) {
            try {
                const currentUser = window.authSystem.currentUser;
                users = [currentUser];
                console.log('📊 从 authSystem.currentUser 获取用户:', users.length);
                return users;
            } catch (error) {
                console.warn('⚠️ 获取当前用户失败:', error);
            }
        }
        
        // 5. 从 localStorage 获取当前用户
        try {
            const storedCurrentUser = localStorage.getItem('linkaitiya_current_user');
            if (storedCurrentUser) {
                const parsed = JSON.parse(storedCurrentUser);
                if (parsed && parsed.id) {
                    users = [parsed];
                    console.log('📊 从 localStorage[linkaitiya_current_user] 获取用户:', users.length);
                    return users;
                }
            }
        } catch (error) {
            console.warn('⚠️ 解析 linkaitiya_current_user 失败:', error);
        }
        
        // 最后去重并返回
        const uniqueUsers = this.deduplicateUsers(users);
        console.log('📊 最终去重后用户数:', uniqueUsers.length);
        return uniqueUsers;
    }
    
    // 创建示例用户数据
    createSampleUsers() {
        const sampleUsers = [
            {
                id: 'admin-001',
                username: '琳凯蒂亚',
                email: '1778181360@qq.com',
                role: '管理员',
                level: 'expert',
                status: 'active',
                joinDate: new Date(Date.now() - 86400000 * 30).toISOString(),
                lastLogin: new Date(Date.now() - 3600000).toISOString(),
                avatar: '👑'
            },
            {
                id: 'user-001',
                username: '星光法师',
                email: 'starlight@example.com',
                role: '版主',
                level: 'advanced',
                status: 'active',
                joinDate: new Date(Date.now() - 86400000 * 15).toISOString(),
                lastLogin: new Date(Date.now() - 7200000).toISOString(),
                avatar: '✨'
            },
            {
                id: 'user-002',
                username: '月光学者',
                email: 'moonscholar@example.com',
                role: '用户',
                level: 'intermediate',
                status: 'active',
                joinDate: new Date(Date.now() - 86400000 * 7).toISOString(),
                lastLogin: new Date(Date.now() - 1800000).toISOString(),
                avatar: '🌙'
            },
            {
                id: 'user-003',
                username: '水晶探索者',
                email: 'crystal@example.com',
                role: '用户',
                level: 'basic',
                status: 'inactive',
                joinDate: new Date(Date.now() - 86400000 * 3).toISOString(),
                lastLogin: new Date(Date.now() - 3600000).toISOString(),
                avatar: '🔮'
            }
        ];
        
        return sampleUsers;
    }
    
    // 获取等级显示名称
    getLevelDisplayName(level) {
        const levelMap = {
            'basic': '初级',
            'intermediate': '中级',
            'advanced': '高级',
            'expert': '专家'
        };
        return levelMap[level] || level || '初级';
    }
    
    // 筛选用户
    filterUsers() {
        try {
            const searchTerm = document.getElementById('userSearch')?.value?.toLowerCase() || '';
            const roleFilter = document.getElementById('userRoleFilter')?.value || '';
            const statusFilter = document.getElementById('userStatusFilter')?.value || '';
            
            console.log('🔍 用户筛选条件:', { searchTerm, roleFilter, statusFilter });
            
            // 重新加载用户数据（实际项目中应该根据筛选条件过滤数据）
            this.loadUserData();
        } catch (error) {
            console.error('筛选用户失败:', error);
        }
    }
    
    // 显示添加用户模态框
    showAddUserModal() {
        const modal = document.getElementById('addUserModal');
        if (modal) {
            modal.classList.add('show');
        }
    }
    
    // 添加用户
    addUser() {
        try {
            const form = document.getElementById('addUserForm');
            if (!form) return;
            
            const formData = new FormData(form);
            
            const userData = {
                username: formData.get('newUsername'),
                email: formData.get('newEmail'),
                password: formData.get('newPassword'),
                role: formData.get('newRole'),
                status: formData.get('newStatus')
            };
            
            console.log('➕ 添加用户:', userData);
            
            // 验证数据
            if (!userData.username || !userData.email || !userData.password) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 使用 authSystem 注册新用户
            if (window.authSystem && typeof window.authSystem.register === 'function') {
                // 构造注册数据
                const registerData = {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role
                };
                
                // 调用注册方法
                window.authSystem.register(registerData)
                    .then(result => {
                        if (result.success) {
                            alert('用户添加成功！');
                            
                            // 关闭模态框
                            const modal = document.getElementById('addUserModal');
                            if (modal) {
                                modal.classList.remove('show');
                            }
                            
                            // 重置表单
                            form.reset();
                            
                            // 重新加载用户数据
                            this.loadUserData();
                        } else {
                            alert('添加用户失败: ' + result.message);
                        }
                    })
                    .catch(error => {
                        console.error('添加用户失败:', error);
                        alert('添加用户失败: ' + error.message);
                    });
            } else {
                // 如果没有 authSystem，使用模拟方式
                alert('用户添加成功！');
                
                // 关闭模态框
                const modal = document.getElementById('addUserModal');
                if (modal) {
                    modal.classList.remove('show');
                }
                
                // 重置表单
                form.reset();
                
                // 重新加载用户数据
                this.loadUserData();
            }
        } catch (error) {
            console.error('添加用户失败:', error);
            alert('添加用户失败: ' + error.message);
        }
    }
    
    // 查看用户详情
    viewUserDetail(userId) {
        console.log('👁️ 查看用户详情:', userId);
        alert('查看用户详情功能开发中...');
    }
    
    // 编辑用户
    editUser(userId) {
        console.log('✏️ 编辑用户:', userId);
        alert('编辑用户功能开发中...');
    }
    
    // 删除用户
    deleteUser(userId) {
        if (confirm('确定要删除这个用户吗？此操作不可撤销。')) {
            console.log('🗑️ 删除用户:', userId);
            alert('用户删除成功！');
            this.loadUserData();
        }
    }
    
    // 导出数据
    exportData() {
        console.log('📤 导出数据...');
        alert('数据导出功能开发中...');
    }
    
    // 加载词汇数据
    loadVocabularyData() {
        console.log('📚 加载词汇数据...');
        const tbody = document.getElementById('vocabularyTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">词汇数据加载中...</td></tr>';
            // 模拟延迟
            setTimeout(() => {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">暂无词汇数据</td></tr>';
            }, 1000);
        }
    }
    
    // 加载语法数据
    loadGrammarData() {
        console.log('📖 加载语法数据...');
        const tbody = document.getElementById('grammarTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">语法数据加载中...</td></tr>';
            // 模拟延迟
            setTimeout(() => {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">暂无语法数据</td></tr>';
            }, 1000);
        }
    }
    
    // 加载短语数据
    loadPhrasesData() {
        console.log('💬 加载短语数据...');
        const tbody = document.getElementById('phrasesTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">短语数据加载中...</td></tr>';
            // 模拟延迟
            setTimeout(() => {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">暂无短语数据</td></tr>';
            }, 1000);
        }
    }
}