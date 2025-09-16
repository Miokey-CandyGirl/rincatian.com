// Supabase配置文件 - GitHub Pages版本
// 注意：由于GitHub Pages不支持ES6模块，使用CDN版本

// 等待Supabase CDN加载完成
if (typeof window !== 'undefined' && window.supabase) {
    // 使用CDN版本的Supabase
    const { createClient } = window.supabase

    // Supabase项目配置
    const supabaseUrl = 'https://fnnbtlfqjfgbifhhnuij.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubmJ0bGZxamZnYmlmaGhudWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MzgzMzIsImV4cCI6MjA3MzQxNDMzMn0.3dayc8xJQsrr3MbWp4C30hcjpOMd0P7ro380F6iQX00'

    // 创建Supabase客户端
    window.supabaseClient = createClient(supabaseUrl, supabaseKey)

    // 数据库表名常量
    window.TABLES = {
        USERS: 'user_profiles',
        VOCABULARY: 'vocabulary',
        GRAMMAR: 'grammar',
        PHRASES: 'phrases',
        NUMBERS: 'numbers',
        POSTS: 'posts',
        REPLIES: 'replies',
        USER_SESSIONS: 'user_sessions'
    }

    // 错误处理工具
    window.handleSupabaseError = (error) => {
        console.error('Supabase操作错误:', error)
        return {
            success: false,
            message: error.message || '数据库操作失败',
            error: error
        }
    }

    // 成功响应工具
    window.createSuccessResponse = (data, message = '操作成功') => {
        return {
            success: true,
            message: message,
            data: data
        }
    }

    console.log('🔧 Supabase配置已加载（GitHub Pages版本）')
} else {
    console.error('⚠️ Supabase CDN未加载，请检查HTML中的CDN引用')
}