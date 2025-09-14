// Supabase认证系统 - 替代原有的auth-system.js
import { supabase, TABLES, handleSupabaseError, createSuccessResponse } from '../config/supabase.js'

class SupabaseAuthSystem {
    constructor() {
        this.currentUser = null
        this.initializeAuth()
    }

    // 初始化认证系统
    async initializeAuth() {
        // 检查现有会话
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (session && session.user) {
            await this.loadUserProfile(session.user.id)
        }

        // 监听认证状态变化
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('认证状态变化:', event, session)
            
            if (event === 'SIGNED_IN' && session) {
                await this.loadUserProfile(session.user.id)
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null
                this.updateUI()
            }
        })
    }

    // 用户注册
    async register(userData) {
        try {
            // 1. 在Supabase Auth中注册用户
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            })

            if (authError) {
                return handleSupabaseError(authError)
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
            }

            const { data: profileData, error: profileError } = await supabase
                .from(TABLES.USERS)
                .insert([userProfile])
                .select()
                .single()

            if (profileError) {
                // 如果档案创建失败，删除auth用户
                await supabase.auth.admin.deleteUser(authData.user.id)
                return handleSupabaseError(profileError)
            }

            this.currentUser = profileData
            this.updateUI()

            return createSuccessResponse(profileData, '注册成功！欢迎您加入琳凯蒂亚星球！')

        } catch (error) {
            console.error('注册错误:', error)
            return handleSupabaseError(error)
        }
    }

    // 用户登录
    async login(credentials) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@linkaitiya.com`,
                password: credentials.password
            })

            if (error) {
                return handleSupabaseError(error)
            }

            await this.loadUserProfile(data.user.id)
            
            return createSuccessResponse(this.currentUser, `欢迎回来，${this.currentUser.username}！`)

        } catch (error) {
            console.error('登录错误:', error)
            return handleSupabaseError(error)
        }
    }

    // 用户登出
    async logout() {
        try {
            const { error } = await supabase.auth.signOut()
            
            if (error) {
                return handleSupabaseError(error)
            }

            this.currentUser = null
            this.updateUI()
            
            return createSuccessResponse(null, '已安全退出')

        } catch (error) {
            console.error('登出错误:', error)
            return handleSupabaseError(error)
        }
    }

    // 加载用户档案
    async loadUserProfile(authId) {
        try {
            const { data, error } = await supabase
                .from(TABLES.USERS)
                .select('*')
                .eq('auth_id', authId)
                .single()

            if (error) {
                console.error('加载用户档案失败:', error)
                return null
            }

            this.currentUser = data
            this.updateUI()
            
            // 更新最后登录时间
            await this.updateLastLogin(data.id)
            
            return data

        } catch (error) {
            console.error('加载用户档案错误:', error)
            return null
        }
    }

    // 更新最后登录时间
    async updateLastLogin(userId) {
        try {
            await supabase
                .from(TABLES.USERS)
                .update({ last_login: new Date().toISOString() })
                .eq('id', userId)
        } catch (error) {
            console.error('更新最后登录时间失败:', error)
        }
    }

    // 验证当前会话
    async validateSession() {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
            this.currentUser = null
            this.updateUI()
            return false
        }

        if (!this.currentUser) {
            await this.loadUserProfile(session.user.id)
        }

        return true
    }

    // 检查权限
    hasPermission(permission) {
        if (!this.currentUser) return false

        // 管理员拥有所有权限
        if (this.isAdmin()) return true

        return this.currentUser.permissions.includes(permission)
    }

    // 检查是否为管理员
    isAdmin() {
        if (!this.currentUser) return false
        
        return (
            this.currentUser.role === 'admin' || 
            this.currentUser.role === '管理员' ||
            this.currentUser.username === '琳凯蒂亚'
        )
    }

    // 根据角色获取权限
    getPermissionsByRole(role) {
        const rolePermissions = {
            'user': ['read'],
            'moderator': ['read', 'write'],
            'admin': ['read', 'write', 'delete', 'manage_users', 'manage_content']
        }
        return rolePermissions[role] || ['read']
    }

    // 根据角色获取等级
    getRankByRole(role) {
        const roleRanks = {
            'user': '见习光线使者',
            'moderator': '高级光线使者',
            'admin': '星帝级管理员'
        }
        return roleRanks[role] || '见习光线使者'
    }

    // 获取所有用户（仅管理员）
    async getAllUsers() {
        if (!this.isAdmin()) {
            throw new Error('权限不足')
        }

        const { data, error } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`获取用户列表失败: ${error.message}`)
        }

        return data
    }

    // 更新用户信息
    async updateUser(userId, updateData) {
        if (!this.hasPermission('manage_users')) {
            throw new Error('权限不足')
        }

        if (userId === this.currentUser.id && updateData.role) {
            throw new Error('不能修改自己的角色')
        }

        const { data, error } = await supabase
            .from(TABLES.USERS)
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            throw new Error(`更新用户失败: ${error.message}`)
        }

        return createSuccessResponse(data, '用户信息已更新')
    }

    // 删除用户
    async deleteUser(userId) {
        if (!this.isAdmin()) {
            throw new Error('权限不足')
        }

        if (userId === this.currentUser.id) {
            throw new Error('不能删除自己的账户')
        }

        // 获取用户的auth_id
        const { data: userData } = await supabase
            .from(TABLES.USERS)
            .select('auth_id')
            .eq('id', userId)
            .single()

        if (userData && userData.auth_id) {
            // 删除Auth用户
            await supabase.auth.admin.deleteUser(userData.auth_id)
        }

        // 删除用户档案（级联删除相关数据）
        const { error } = await supabase
            .from(TABLES.USERS)
            .delete()
            .eq('id', userId)

        if (error) {
            throw new Error(`删除用户失败: ${error.message}`)
        }

        return createSuccessResponse(null, '用户已删除')
    }

    // 更新个人资料
    async updateProfile(updateData) {
        if (!this.currentUser) {
            throw new Error('请先登录')
        }

        // 检查用户名是否已被占用
        if (updateData.username && updateData.username !== this.currentUser.username) {
            const { data: existingUser } = await supabase
                .from(TABLES.USERS)
                .select('id')
                .eq('username', updateData.username)
                .neq('id', this.currentUser.id)
                .single()

            if (existingUser) {
                throw new Error('用户名已被占用')
            }
        }

        // 检查邮箱是否已被占用
        if (updateData.email && updateData.email !== this.currentUser.email) {
            const { data: existingUser } = await supabase
                .from(TABLES.USERS)
                .select('id')
                .eq('email', updateData.email)
                .neq('id', this.currentUser.id)
                .single()

            if (existingUser) {
                throw new Error('邮箱已被占用')
            }
        }

        const { data, error } = await supabase
            .from(TABLES.USERS)
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.currentUser.id)
            .select()
            .single()

        if (error) {
            throw new Error(`更新个人资料失败: ${error.message}`)
        }

        this.currentUser = data
        this.updateUI()

        return createSuccessResponse(data, '个人资料已更新')
    }

    // 修改密码
    async changePassword(newPassword) {
        if (!this.currentUser) {
            throw new Error('请先登录')
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            throw new Error(`密码修改失败: ${error.message}`)
        }

        return createSuccessResponse(null, '密码修改成功')
    }

    // 更新UI（保持与原系统的兼容性）
    updateUI() {
        // 触发全局事件通知UI更新
        if (this.currentUser) {
            window.dispatchEvent(new CustomEvent('userLogin', {
                detail: { user: this.currentUser }
            }))
        } else {
            window.dispatchEvent(new CustomEvent('userLogout'))
        }

        // 直接调用UI更新函数（如果存在）
        if (typeof updateNewAuthUI === 'function') {
            updateNewAuthUI()
        }
        if (typeof updateAuthenticationState === 'function') {
            updateAuthenticationState()
        }
    }
}

// 创建全局实例（替代原有的 window.authSystem）
window.authSystem = new SupabaseAuthSystem()

console.log('🔐 Supabase认证系统已加载！')

export default SupabaseAuthSystem