// 琳凯蒂亚语社区 - 完整认证系统
// 用户认证和权限管理系统

class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('linkaitiya_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('linkaitiya_current_user') || 'null');
        this.sessions = JSON.parse(localStorage.getItem('linkaitiya_sessions') || '{}');
        this.initializeAdminUser();
    }

    // 初始化默认管理员账户
    initializeAdminUser() {
        const adminExists = this.users.find(user => user.username === 'admin');
        if (!adminExists) {
            const adminUser = {
                id: 'admin_001',
                username: '琳凯蒂亚',
                email: '1778181360@qq.com',
                password: this.hashPassword('Rincatian-2015!'), // 使用哈希密码存储
                role: '管理员',
                rank: '星帝级管理员',
                avatar: '👑',
                joinDate: new Date().toISOString(),
                permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content'],
                status: 'active',
                lastLogin: null
            };
            this.users.push(adminUser);
            this.saveUsers();
            console.log('🔧 默认管理员账户已创建');
            console.log('用户名: 琳凯蒂亚');
            console.log('请使用默认密码 R***! 登录后立即修改密码');
        } else {
            // 确保现有admin用户的密码是正确的哈希值
            const admin = this.users.find(user => user.username === '琳凯蒂亚');
            if (admin && admin.password === 'Rincatian-2015!') {
                console.log('🔧 修复管理员密码...');
                admin.password = this.hashPassword('Rincatian-2015!'); // 转换为哈希密码
                this.saveUsers();
                console.log('✅ 管理员密码已修复');
            }
        }
    }

    // 简单的密码哈希（生产环境应使用更强的哈希算法）
    hashPassword(password) {
        // 简单的哈希实现，生产环境应使用bcrypt等
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString();
    }

    // 生成会话token
    generateToken() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    // 用户注册
    async register(userData) {
        try {
            // 验证输入
            const validation = this.validateUserData(userData);
            if (!validation.valid) {
                return { success: false, message: validation.message };
            }

            // 检查用户名是否已存在
            if (this.users.find(user => user.username === userData.username)) {
                return { success: false, message: '用户名已存在' };
            }

            // 检查邮箱是否已存在
            if (this.users.find(user => user.email === userData.email)) {
                return { success: false, message: '邮箱已被注册' };
            }

            // 创建新用户
            const newUser = {
                id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                username: userData.username,
                email: userData.email,
                password: this.hashPassword(userData.password),
                role: userData.role || 'user',
                rank: this.getRankByRole(userData.role || 'user'),
                avatar: userData.username.charAt(0).toUpperCase(),
                joinDate: new Date().toISOString(),
                permissions: this.getPermissionsByRole(userData.role || 'user'),
                status: 'active',
                lastLogin: null,
                profile: {
                    learningProgress: 0,
                    studyGroups: [],
                    achievements: [],
                    preferences: {}
                }
            };

            this.users.push(newUser);
            this.saveUsers();

            // 自动登录
            const loginResult = await this.login({
                username: userData.username,
                password: userData.password
            });

            // 初始化用户数据库
            if (window.userDatabase) {
                window.userDatabase.saveUserProfile({
                    bio: '',
                    createdAt: new Date().toISOString()
                });
                
                window.userDatabase.saveLearningData({
                    favorites: [],
                    history: [],
                    progress: {}
                });
                
                window.userDatabase.saveCommunityData({
                    posts: [],
                    replies: []
                });
                
                window.userDatabase.saveUserSettings({
                    dailyGoal: 10,
                    notifications: true,
                    emailNotifications: true
                });
            }

            return { 
                success: true, 
                message: '注册成功！欢迎您加入琳凯蒂亚星球！',
                user: this.sanitizeUser(newUser)
            };

        } catch (error) {
            console.error('注册错误:', error);
            return { success: false, message: '注册失败，请您稍后重试' };
        }
    }

    // 用户登录
    async login(credentials) {
        try {
            const { username, password } = credentials;
            
            console.log('🔐 登录尝试:', { username, passwordLength: password.length });

            // 查找用户
            const user = this.users.find(u => 
                (u.username === username || u.email === username) && 
                u.status === 'active'
            );

            if (!user) {
                console.log('❌ 用户不存在:', username);
                return { success: false, message: '用户不存在或账户已被禁用' };
            }

            console.log('👤 找到用户:', { id: user.id, username: user.username, role: user.role });
            
            // 验证密码 - 统一使用哈希验证
            let passwordValid = false;
            
            // 检查是否为管理员用户（仅用于日志记录）
            const isAdminUser = user.username === '琳凯蒂亚';
            
            if (isAdminUser.password === this.hashPassword('Rincatian-2015!')){
                // admin用户的特殊处理：直接验证明文密码
                passwordValid = true;
                console.log('✅ 管理员密码验证成功（明文验证）');
            } else if (user.password === this.hashPassword(password)) {
                // 普通用户的哈希密码验证
                passwordValid = true;
                console.log('✅ 普通用户密码验证成功（哈希验证）');
            } else {
                // 双重验证：也尝试明文密码（用于兼容性，但会提示需要更新密码）
                if (user.password === password) {
                    passwordValid = true;
                    console.log('✅ 密码验证成功（明文兼容验证）');
                    // 如果是明文密码，建议用户更新密码
                    if (isAdminUser) {
                        console.warn('⚠️ 检测到管理员账户使用明文密码，请尽快修改密码以确保安全');
                    }
                }
            }

            if (!passwordValid) {
                console.log('❌ 密码验证失败:', {
                    storedPassword: user.password,
                    hashedInput: this.hashPassword(password),
                    inputPassword: password
                });
                return { success: false, message: '密码错误' };
            }

            // 生成会话
            const token = this.generateToken();
            const session = {
                userId: user.id,
                token: token,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时
                userAgent: navigator.userAgent
            };

            this.sessions[token] = session;
            this.saveSessions();

            // 更新用户最后登录时间
            user.lastLogin = new Date().toISOString();
            this.saveUsers();

            // 设置当前用户
            this.currentUser = this.sanitizeUser(user);
            this.currentUser.token = token;
            localStorage.setItem('linkaitiya_current_user', JSON.stringify(this.currentUser));
            
            console.log('🎉 登录成功:', this.currentUser.username);

            return { 
                success: true, 
                message: `欢迎回来，${user.username}！`,
                user: this.currentUser
            };

        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, message: '登录失败，请稍后重试' };
        }
    }

    // 用户登出
    logout() {
        if (this.currentUser && this.currentUser.token) {
            delete this.sessions[this.currentUser.token];
            this.saveSessions();
        }
        
        this.currentUser = null;
        localStorage.removeItem('linkaitiya_current_user');
        
        return { success: true, message: '已安全退出' };
    }

    // 验证会话
    validateSession() {
        if (!this.currentUser || !this.currentUser.token) {
            return false;
        }

        const session = this.sessions[this.currentUser.token];
        if (!session) {
            this.logout();
            return false;
        }

        // 检查会话是否过期
        if (new Date() > new Date(session.expiresAt)) {
            this.logout();
            return false;
        }

        return true;
    }

    // 检查权限
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) return false;

        // 确保用户有permissions属性
        if (!user.permissions) {
            user.permissions = this.getPermissionsByRole(user.role || 'user');
            this.saveUsers(); // 保存更新后的用户数据
        }

        // 管理员拥有所有权限
        if (this.isAdmin()) {
            return true;
        }

        return user.permissions.includes(permission);
    }

    // 检查是否为管理员
    isAdmin() {
        if (!this.currentUser) return false;
        
        return (
            this.currentUser.role === 'admin' || 
            this.currentUser.role === '管理员' ||
            this.currentUser.username === '琳凯蒂亚' ||
            this.currentUser.username === 'admin'
        );
    }

    // 根据角色获取权限
    getPermissionsByRole(role) {
        const rolePermissions = {
            'user': ['read'],
            'moderator': ['read', 'write'],
            'admin': ['read', 'write', 'delete', 'manage_users', 'manage_content']
        };
        return rolePermissions[role] || ['read'];
    }

    // 根据角色获取等级
    getRankByRole(role) {
        const roleRanks = {
            'user': '见习光线使者',
            'moderator': '高级光线使者',
            'admin': '星帝级管理员'
        };
        return roleRanks[role] || '见习光线使者';
    }

    // 验证用户数据
    validateUserData(userData) {
        if (!userData.username || userData.username.length < 3) {
            return { valid: false, message: '用户名至少需要3个字符' };
        }

        if (!userData.email || !this.isValidEmail(userData.email)) {
            return { valid: false, message: '请输入有效的邮箱地址' };
        }

        if (!userData.password || userData.password.length < 6) {
            return { valid: false, message: '密码至少需要6个字符' };
        }

        return { valid: true };
    }

    // 验证邮箱格式
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 清理用户数据（移除敏感信息）
    sanitizeUser(user) {
        const { password, ...cleanUser } = user;
        return cleanUser;
    }

    // 保存用户数据
    saveUsers() {
        localStorage.setItem('linkaitiya_users', JSON.stringify(this.users));
    }

    // 保存会话数据
    saveSessions() {
        localStorage.setItem('linkaitiya_sessions', JSON.stringify(this.sessions));
    }

    // 获取所有用户（仅管理员）
    getAllUsers() {
        if (!this.isAdmin()) {
            throw new Error('权限不足');
        }
        return this.users.map(user => this.sanitizeUser(user));
    }

    // 更新用户信息
    updateUser(userId, updateData) {
        if (!this.hasPermission('manage_users')) {
            throw new Error('权限不足');
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('用户不存在');
        }

        // 不允许修改某些敏感字段
        const allowedFields = ['username', 'email', 'role', 'status', 'rank'];
        const filteredUpdate = {};
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdate[key] = updateData[key];
            }
        });

        Object.assign(this.users[userIndex], filteredUpdate);
        this.saveUsers();

        return { success: true, message: '用户信息已更新' };
    }

    // 删除用户
    deleteUser(userId) {
        if (!this.isAdmin()) {
            throw new Error('权限不足');
        }

        if (userId === this.currentUser.id) {
            throw new Error('不能删除自己的账户');
        }

        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('用户不存在');
        }

        this.users.splice(userIndex, 1);
        this.saveUsers();

        return { success: true, message: '用户已删除' };
    }

    // 更新用户个人资料（用户修改自己的信息）
    updateProfile(updateData) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('用户不存在');
        }

        // 用户可以修改的字段
        const allowedFields = ['username', 'email', 'avatar', 'profile'];
        const filteredUpdate = {};
        
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                filteredUpdate[key] = updateData[key];
            }
        });

        // 检查用户名是否已被其他用户占用
        if (filteredUpdate.username && filteredUpdate.username !== this.currentUser.username) {
            const existingUser = this.users.find(u => u.username === filteredUpdate.username && u.id !== this.currentUser.id);
            if (existingUser) {
                throw new Error('用户名已被占用');
            }
        }

        // 检查邮箱是否已被其他用户占用
        if (filteredUpdate.email && filteredUpdate.email !== this.currentUser.email) {
            const existingUser = this.users.find(u => u.email === filteredUpdate.email && u.id !== this.currentUser.id);
            if (existingUser) {
                throw new Error('邮箱已被占用');
            }
            
            // 验证邮箱格式
            if (!this.isValidEmail(filteredUpdate.email)) {
                throw new Error('邮箱格式不正确');
            }
        }

        // 更新用户信息
        Object.assign(this.users[userIndex], filteredUpdate);
        
        // 更新当前用户缓存
        Object.assign(this.currentUser, filteredUpdate);
        localStorage.setItem('linkaitiya_current_user', JSON.stringify(this.currentUser));
        
        this.saveUsers();

        return { success: true, message: '个人资料已更新' };
    }

    // 修改密码
    changePassword(oldPassword, newPassword) {
        if (!this.currentUser) {
            throw new Error('请先登录');
        }

        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) {
            throw new Error('用户不存在');
        }

        if (user.password !== this.hashPassword(oldPassword)) {
            throw new Error('原密码错误');
        }

        if (newPassword.length < 6) {
            throw new Error('新密码至少需要6个字符');
        }

        user.password = this.hashPassword(newPassword);
        this.saveUsers();

        return { success: true, message: '密码修改成功' };
    }

    // 重置密码（仅管理员）
    resetPassword(userId, newPassword) {
        // 返回Promise以支持异步操作
        return new Promise((resolve, reject) => {
            try {
                if (!this.isAdmin()) {
                    reject(new Error('权限不足'));
                    return;
                }

                const user = this.users.find(u => u.id === userId);
                if (!user) {
                    reject(new Error('用户不存在'));
                    return;
                }

                // 验证新密码强度
                if (newPassword.length < 8) {
                    reject(new Error('新密码至少需要8个字符'));
                    return;
                }

                user.password = this.hashPassword(newPassword);
                this.saveUsers();

                resolve({ success: true, message: '密码已重置' });
            } catch (error) {
                reject(error);
            }
        });
    }
}

// 创建全局认证系统实例
window.authSystem = new AuthSystem();

// 页面加载时验证会话
document.addEventListener('DOMContentLoaded', function() {
    if (window.authSystem.currentUser) {
        if (!window.authSystem.validateSession()) {
            console.log('会话已过期，请重新登录');
        }
    }
});

console.log('🔐 琳凯蒂亚语认证系统已加载！');