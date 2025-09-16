// 数据迁移工具 - 从LocalStorage迁移到Supabase
import { supabase, TABLES, handleSupabaseError, createSuccessResponse } from './supabase.js'

class DataMigration {
    constructor() {
        this.migrationStatus = {
            users: false,
            vocabulary: false,
            grammar: false,
            phrases: false,
            numbers: false,
            posts: false,
            replies: false
        }
    }

    // 开始完整迁移
    async startFullMigration() {
        console.log('🚀 开始数据迁移...')
        
        try {
            // 按顺序迁移数据（考虑外键依赖）
            await this.migrateUsers()
            await this.migrateVocabulary()
            await this.migrateGrammar()
            await this.migratePhrases()
            await this.migrateNumbers()
            await this.migratePosts()
            await this.migrateReplies()
            
            console.log('✅ 数据迁移完成！')
            return { success: true, status: this.migrationStatus }
        } catch (error) {
            console.error('❌ 数据迁移失败:', error)
            return { success: false, error: error.message, status: this.migrationStatus }
        }
    }

    // 迁移用户数据
    async migrateUsers() {
        console.log('📋 迁移用户数据...')
        
        const localUsers = JSON.parse(localStorage.getItem('linkaitiya_users') || '[]')
        if (localUsers.length === 0) {
            console.log('没有找到本地用户数据')
            this.migrationStatus.users = true
            return
        }

        const transformedUsers = localUsers.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            rank: user.rank,
            permissions: user.permissions,
            status: user.status,
            join_date: user.joinDate,
            last_login: user.lastLogin,
            profile: user.profile || {}
        }))

        const { data, error } = await supabase
            .from(TABLES.USERS)
            .upsert(transformedUsers, { onConflict: 'id' })

        if (error) {
            throw new Error(`用户迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedUsers.length} 个用户`)
        this.migrationStatus.users = true
    }

    // 迁移词汇数据
    async migrateVocabulary() {
        console.log('📚 迁移词汇数据...')
        
        const localVocab = JSON.parse(localStorage.getItem('linkaitiya_vocabulary') || '[]')
        if (localVocab.length === 0) {
            console.log('没有找到本地词汇数据')
            this.migrationStatus.vocabulary = true
            return
        }

        const transformedVocab = localVocab.map(word => ({
            id: word.id,
            word: word.word,
            pronunciation: word.pronunciation,
            meaning: word.meaning,
            type: word.type,
            definition: word.definition,
            examples: word.examples || [],
            etymology: word.etymology,
            usage: word.usage,
            level: word.level,
            tags: word.tags || [],
            created_by: word.createdBy,
            created_at: word.createdAt,
            updated_at: word.updatedAt
        }))

        const { data, error } = await supabase
            .from(TABLES.VOCABULARY)
            .upsert(transformedVocab, { onConflict: 'id' })

        if (error) {
            throw new Error(`词汇迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedVocab.length} 个词汇`)
        this.migrationStatus.vocabulary = true
    }

    // 迁移语法数据
    async migrateGrammar() {
        console.log('📖 迁移语法数据...')
        
        const localGrammar = JSON.parse(localStorage.getItem('linkaitiya_grammar') || '[]')
        if (localGrammar.length === 0) {
            console.log('没有找到本地语法数据')
            this.migrationStatus.grammar = true
            return
        }

        const transformedGrammar = localGrammar.map(rule => ({
            id: rule.id,
            title: rule.title,
            category: rule.category,
            description: rule.description,
            rules: rule.rules || [],
            examples: rule.examples || [],
            exceptions: rule.exceptions || [],
            level: rule.level,
            order_num: rule.order || 0,
            created_by: rule.createdBy,
            created_at: rule.createdAt,
            updated_at: rule.updatedAt
        }))

        const { data, error } = await supabase
            .from(TABLES.GRAMMAR)
            .upsert(transformedGrammar, { onConflict: 'id' })

        if (error) {
            throw new Error(`语法迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedGrammar.length} 个语法规则`)
        this.migrationStatus.grammar = true
    }

    // 迁移短语数据
    async migratePhrases() {
        console.log('🗣️ 迁移短语数据...')
        
        const localPhrases = JSON.parse(localStorage.getItem('linkaitiya_phrases') || '[]')
        if (localPhrases.length === 0) {
            console.log('没有找到本地短语数据')
            this.migrationStatus.phrases = true
            return
        }

        const transformedPhrases = localPhrases.map(phrase => ({
            id: phrase.id,
            linkaitiya: phrase.linkaitiya,
            chinese: phrase.chinese,
            pronunciation: phrase.pronunciation,
            category: phrase.category,
            usage: phrase.usage,
            level: phrase.level,
            created_by: phrase.createdBy,
            created_at: phrase.createdAt
        }))

        const { data, error } = await supabase
            .from(TABLES.PHRASES)
            .upsert(transformedPhrases, { onConflict: 'id' })

        if (error) {
            throw new Error(`短语迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedPhrases.length} 个短语`)
        this.migrationStatus.phrases = true
    }

    // 迁移数词数据
    async migrateNumbers() {
        console.log('🔢 迁移数词数据...')
        
        const localNumbers = JSON.parse(localStorage.getItem('linkaitiya_numbers') || '[]')
        if (localNumbers.length === 0) {
            console.log('没有找到本地数词数据')
            this.migrationStatus.numbers = true
            return
        }

        const transformedNumbers = localNumbers.map(number => ({
            id: number.id,
            value: number.value,
            linkaitiya: number.linkaitiya,
            pronunciation: number.pronunciation,
            type: number.type,
            description: number.description,
            created_by: number.createdBy,
            created_at: number.createdAt
        }))

        const { data, error } = await supabase
            .from(TABLES.NUMBERS)
            .upsert(transformedNumbers, { onConflict: 'id' })

        if (error) {
            throw new Error(`数词迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedNumbers.length} 个数词`)
        this.migrationStatus.numbers = true
    }

    // 迁移帖子数据
    async migratePosts() {
        console.log('💬 迁移帖子数据...')
        
        const localPosts = JSON.parse(localStorage.getItem('linkaitiya_community_posts') || '[]')
        if (localPosts.length === 0) {
            console.log('没有找到本地帖子数据')
            this.migrationStatus.posts = true
            return
        }

        const transformedPosts = localPosts.map(post => ({
            id: post.id,
            author_id: post.authorId,
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags || [],
            views: post.views,
            likes: post.likes || [],
            reply_count: post.replyCount,
            status: post.status,
            is_pinned: post.isPinned,
            is_locked: post.isLocked,
            created_at: new Date(post.timestamp).toISOString(),
            updated_at: new Date(post.timestamp).toISOString()
        }))

        const { data, error } = await supabase
            .from(TABLES.POSTS)
            .upsert(transformedPosts, { onConflict: 'id' })

        if (error) {
            throw new Error(`帖子迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedPosts.length} 个帖子`)
        this.migrationStatus.posts = true
    }

    // 迁移回复数据
    async migrateReplies() {
        console.log('💭 迁移回复数据...')
        
        const localReplies = JSON.parse(localStorage.getItem('linkaitiya_community_replies') || '[]')
        if (localReplies.length === 0) {
            console.log('没有找到本地回复数据')
            this.migrationStatus.replies = true
            return
        }

        const transformedReplies = localReplies.map(reply => ({
            id: reply.id,
            post_id: reply.postId,
            author_id: reply.authorId,
            content: reply.content,
            parent_reply_id: reply.parentReplyId,
            likes: reply.likes || [],
            status: reply.status,
            created_at: new Date(reply.timestamp).toISOString()
        }))

        const { data, error } = await supabase
            .from(TABLES.REPLIES)
            .upsert(transformedReplies, { onConflict: 'id' })

        if (error) {
            throw new Error(`回复迁移失败: ${error.message}`)
        }

        console.log(`✅ 成功迁移 ${transformedReplies.length} 个回复`)
        this.migrationStatus.replies = true
    }

    // 数据验证
    async validateMigration() {
        console.log('🔍 验证迁移结果...')
        
        const results = {}
        
        for (const table of Object.values(TABLES)) {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true })
            
            if (error) {
                console.error(`验证表 ${table} 失败:`, error)
                results[table] = { error: error.message }
            } else {
                results[table] = { count: count }
                console.log(`✅ 表 ${table}: ${count} 条记录`)
            }
        }
        
        return results
    }

    // 备份LocalStorage数据
    backupLocalStorage() {
        console.log('💾 备份LocalStorage数据...')
        
        const backup = {}
        const keys = [
            'linkaitiya_users',
            'linkaitiya_vocabulary', 
            'linkaitiya_grammar',
            'linkaitiya_phrases',
            'linkaitiya_numbers',
            'linkaitiya_community_posts',
            'linkaitiya_community_replies',
            'linkaitiya_current_user',
            'linkaitiya_sessions'
        ]
        
        keys.forEach(key => {
            const data = localStorage.getItem(key)
            if (data) {
                backup[key] = data
            }
        })
        
        // 保存备份到文件
        const backupData = JSON.stringify(backup, null, 2)
        const blob = new Blob([backupData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `linkaitiya_backup_${new Date().toISOString().split('T')[0]}.json`
        a.click()
        
        URL.revokeObjectURL(url)
        
        console.log('✅ LocalStorage数据备份完成')
        return backup
    }
}

// 全局实例
window.dataMigration = new DataMigration()

// 导出
export default DataMigration