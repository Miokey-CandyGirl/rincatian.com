// GitHub Pages兼容的Supabase认证系统
// 使用传统script标签加载，不使用ES6模块

(function() {
    'use strict';
    
    // 等待Supabase和配置加载完成
    function initializeAuth() {
        if (!window.supabaseClient) {
            console.log('等待Supabase客户端加载...');
            setTimeout(initializeAuth, 100);
            return;
        }

        class GitHubPagesAuthSystem {
            constructor() {
                this.supabase = window.supabaseClient;
                this.TABLES = window.TABLES;
                this.currentUser = null;
                this.initializeAuth();
            }

            // 初始化认证系统
            async initializeAuth() {
                console.log('🔐 初始化GitHub Pages认证系统...');
                
                // 检查现有会话
                const { data: { session }, error } = await this.supabase.auth.getSession();
                
                if (session && session.user) {
                    await this.loadUserProfile(session.user.id);
                }

                // 监听认证状态变化
                this.supabase.auth.onAuthStateChange(async (event, session) => {
                    console.log('认证状态变化:', event, session);
                    
                    if (event === 'SIGNED_IN' && session) {
                        await this.loadUserProfile(session.user.id);
                    } else if (event === 'SIGNED_OUT') {
                        this.currentUser = null;
                        this.updateUI();
                    }
                });
            }

            // 用户注册
            async register(userData) {
                try {
                    // 1. 在Supabase Auth中注册用户
                    const { data: authData, error: authError } = await this.supabase.auth.signUp({
                        email: userData.email,
                        password: userData.password
                    });

                    if (authError) {
                        return window.handleSupabaseError(authError);
                    }

                    // 2. 在用户表中创建档案
                    const userProfile = {
                        auth_id: authData.user.id,
                        username: userData.username,
                        email: userData.email,
                        avatar: userData.username.charAt(0).toUpperCase(),
                        role: userData.role || 'user',
                        rank: this.getRankByRole(userData.role || 'user'),
                        permissions: this.getPermissionsByRole(userData.role || 'user'),
                        status: 'active',
                        profile: {
                            learningProgress: 0,
                            studyGroups: [],
                            achievements: [],
                            preferences: {}
                        }
                    };

                    const { data: profileData, error: profileError } = await this.supabase
                        .from(this.TABLES.USERS)
                        .insert([userProfile])
                        .select()
                        .single();

                    if (profileError) {
                        // 如果档案创建失败，删除auth用户
                        await this.supabase.auth.admin.deleteUser(authData.user.id);
                        return window.handleSupabaseError(profileError);
                    }

                    this.currentUser = profileData;
                    this.updateUI();

                    return window.createSuccessResponse(profileData, '注册成功！欢迎您加入琳凯蒂亚星球！');

                } catch (error) {
                    console.error('注册错误:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 用户登录
            async login(credentials) {
                try {
                    const { data, error } = await this.supabase.auth.signInWithPassword({
                        email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@linkaitiya.com`,
                        password: credentials.password
                    });

                    if (error) {
                        return window.handleSupabaseError(error);
                    }

                    await this.loadUserProfile(data.user.id);
                    
                    return window.createSuccessResponse(this.currentUser, `欢迎回来，${this.currentUser.username}！`);

                } catch (error) {
                    console.error('登录错误:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 用户登出
            async logout() {
                try {
                    const { error } = await this.supabase.auth.signOut();
                    
                    if (error) {
                        return window.handleSupabaseError(error);
                    }

                    this.currentUser = null;
                    this.updateUI();
                    
                    return window.createSuccessResponse(null, '已安全退出');

                } catch (error) {
                    console.error('登出错误:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 加载用户档案
            async loadUserProfile(authId) {
                try {
                    const { data, error } = await this.supabase
                        .from(this.TABLES.USERS)
                        .select('*')
                        .eq('auth_id', authId)
                        .single();

                    if (error) {
                        console.error('加载用户档案失败:', error);
                        return null;
                    }

                    this.currentUser = data;
                    this.updateUI();
                    
                    // 更新最后登录时间
                    await this.updateLastLogin(data.id);
                    
                    return data;

                } catch (error) {
                    console.error('加载用户档案错误:', error);
                    return null;
                }
            }

            // 更新最后登录时间
            async updateLastLogin(userId) {
                try {
                    await this.supabase
                        .from(this.TABLES.USERS)
                        .update({ last_login: new Date().toISOString() })
                        .eq('id', userId);
                } catch (error) {
                    console.error('更新最后登录时间失败:', error);
                }
            }

            // 验证当前会话
            async validateSession() {
                const { data: { session }, error } = await this.supabase.auth.getSession();
                
                if (error || !session) {
                    this.currentUser = null;
                    this.updateUI();
                    return false;
                }

                if (!this.currentUser) {
                    await this.loadUserProfile(session.user.id);
                }

                return true;
            }

            // 检查权限
            hasPermission(permission) {
                if (!this.currentUser) return false;

                // 管理员拥有所有权限
                if (this.isAdmin()) return true;

                return this.currentUser.permissions.includes(permission);
            }

            // 检查是否为管理员
            isAdmin() {
                if (!this.currentUser) return false;
                
                return (
                    this.currentUser.role === 'admin' || 
                    this.currentUser.role === '管理员' ||
                    this.currentUser.username === '琳凯蒂亚'
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

            // 更新UI（保持与原系统的兼容性）
            updateUI() {
                // 触发全局事件通知UI更新
                if (this.currentUser) {
                    window.dispatchEvent(new CustomEvent('userLogin', {
                        detail: { user: this.currentUser }
                    }));
                } else {
                    window.dispatchEvent(new CustomEvent('userLogout'));
                }

                // 直接调用UI更新函数（如果存在）
                if (typeof updateNewAuthUI === 'function') {
                    updateNewAuthUI();
                }
                if (typeof updateAuthenticationState === 'function') {
                    updateAuthenticationState();
                }
            }
        }

        // 创建全局实例（替代原有的 window.authSystem）
        window.authSystem = new GitHubPagesAuthSystem();
        console.log('🔐 GitHub Pages认证系统已加载！');
    }

    // 开始初始化
    initializeAuth();
})();