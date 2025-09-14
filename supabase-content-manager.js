// Supabase内容管理系统 - 替代原有的content-manager.js
import { supabase, TABLES, handleSupabaseError, createSuccessResponse } from '../config/supabase.js'

class SupabaseContentManager {
    constructor() {
        console.log('📚 Supabase内容管理系统初始化...')
    }

    // 权限检查
    checkPermission(action) {
        if (!window.authSystem || !window.authSystem.currentUser) {
            throw new Error('请先登录')
        }

        const writeActions = ['create', 'update', 'delete']
        if (writeActions.includes(action) && !window.authSystem.hasPermission('write')) {
            throw new Error('您没有权限执行此操作，只有管理员可以添加、修改或删除内容')
        }

        return true
    }

    // ================== 词汇管理 ==================

    // 获取所有词汇
    async getVocabulary(filters = {}) {
        try {
            let query = supabase
                .from(TABLES.VOCABULARY)
                .select('*')
                .order('created_at', { ascending: false })

            // 应用筛选器
            if (filters.type && filters.type !== 'all') {
                query = query.eq('type', filters.type)
            }

            if (filters.search) {
                const searchTerm = `%${filters.search}%`
                query = query.or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm},pronunciation.ilike.${searchTerm}`)
            }

            if (filters.alphabet) {
                query = query.ilike('word', `${filters.alphabet}%`)
            }

            if (filters.limit) {
                query = query.limit(filters.limit)
            }

            if (filters.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            return data

        } catch (error) {
            console.error('获取词汇失败:', error)
            throw new Error(`获取词汇失败: ${error.message}`)
        }
    }

    // 获取词汇统计
    async getVocabularyCount(filters = {}) {
        try {
            let query = supabase
                .from(TABLES.VOCABULARY)
                .select('*', { count: 'exact', head: true })

            if (filters.type && filters.type !== 'all') {
                query = query.eq('type', filters.type)
            }

            if (filters.search) {
                const searchTerm = `%${filters.search}%`
                query = query.or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm},pronunciation.ilike.${searchTerm}`)
            }

            const { count, error } = await query

            if (error) {
                throw error
            }

            return count

        } catch (error) {
            console.error('获取词汇统计失败:', error)
            return 0
        }
    }

    // 添加新词汇
    async addVocabulary(wordData) {
        this.checkPermission('create')

        try {
            const newWord = {
                word: wordData.word,
                pronunciation: wordData.pronunciation,
                meaning: wordData.meaning,
                type: wordData.type,
                definition: wordData.definition,
                examples: wordData.examples || [],
                etymology: wordData.etymology || '',
                usage: wordData.usage || '',
                level: wordData.level || 'basic',
                tags: wordData.tags || [],
                created_by: window.authSystem.currentUser.id
            }

            const { data, error } = await supabase
                .from(TABLES.VOCABULARY)
                .insert([newWord])
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '词汇添加成功')

        } catch (error) {
            console.error('添加词汇失败:', error)
            return handleSupabaseError(error)
        }
    }

    // 更新词汇
    async updateVocabulary(wordId, updateData) {
        this.checkPermission('update')

        try {
            const { data, error } = await supabase
                .from(TABLES.VOCABULARY)
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', wordId)
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '词汇更新成功')

        } catch (error) {
            console.error('更新词汇失败:', error)
            return handleSupabaseError(error)
        }
    }

    // 删除词汇
    async deleteVocabulary(wordId) {
        this.checkPermission('delete')

        try {
            const { data, error } = await supabase
                .from(TABLES.VOCABULARY)
                .delete()
                .eq('id', wordId)
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '词汇删除成功')

        } catch (error) {
            console.error('删除词汇失败:', error)
            return handleSupabaseError(error)
        }
    }

    // ================== 语法管理 ==================

    // 获取所有语法规则
    async getGrammar(filters = {}) {
        try {
            let query = supabase
                .from(TABLES.GRAMMAR)
                .select('*')
                .order('order_num', { ascending: true })
                .order('created_at', { ascending: false })

            if (filters.category && filters.category !== 'all') {
                query = query.eq('category', filters.category)
            }

            if (filters.search) {
                const searchTerm = `%${filters.search}%`
                query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            return data

        } catch (error) {
            console.error('获取语法规则失败:', error)
            throw new Error(`获取语法规则失败: ${error.message}`)
        }
    }

    // 添加语法规则
    async addGrammar(grammarData) {
        this.checkPermission('create')

        try {
            const newRule = {
                title: grammarData.title,
                category: grammarData.category,
                description: grammarData.description,
                rules: grammarData.rules || [],
                examples: grammarData.examples || [],
                exceptions: grammarData.exceptions || [],
                level: grammarData.level || 'beginner',
                order_num: grammarData.order || 0,
                created_by: window.authSystem.currentUser.id
            }

            const { data, error } = await supabase
                .from(TABLES.GRAMMAR)
                .insert([newRule])
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '语法规则添加成功')

        } catch (error) {
            console.error('添加语法规则失败:', error)
            return handleSupabaseError(error)
        }
    }

    // 更新语法规则
    async updateGrammar(ruleId, updateData) {
        this.checkPermission('update')

        try {
            const { data, error } = await supabase
                .from(TABLES.GRAMMAR)
                .update({
                    ...updateData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', ruleId)
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '语法规则更新成功')

        } catch (error) {
            console.error('更新语法规则失败:', error)
            return handleSupabaseError(error)
        }
    }

    // 删除语法规则
    async deleteGrammar(ruleId) {
        this.checkPermission('delete')

        try {
            const { data, error } = await supabase
                .from(TABLES.GRAMMAR)
                .delete()
                .eq('id', ruleId)
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '语法规则删除成功')

        } catch (error) {
            console.error('删除语法规则失败:', error)
            return handleSupabaseError(error)
        }
    }

    // ================== 短语管理 ==================

    // 获取短语
    async getPhrases(category = 'all') {
        try {
            let query = supabase
                .from(TABLES.PHRASES)
                .select('*')
                .order('created_at', { ascending: false })

            if (category !== 'all') {
                query = query.eq('category', category)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            return data

        } catch (error) {
            console.error('获取短语失败:', error)
            throw new Error(`获取短语失败: ${error.message}`)
        }
    }

    // 添加短语
    async addPhrase(phraseData) {
        this.checkPermission('create')

        try {
            const newPhrase = {
                linkaitiya: phraseData.linkaitiya,
                chinese: phraseData.chinese,
                pronunciation: phraseData.pronunciation,
                category: phraseData.category,
                usage: phraseData.usage || '',
                level: phraseData.level || 'basic',
                created_by: window.authSystem.currentUser.id
            }

            const { data, error } = await supabase
                .from(TABLES.PHRASES)
                .insert([newPhrase])
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '短语添加成功')

        } catch (error) {
            console.error('添加短语失败:', error)
            return handleSupabaseError(error)
        }
    }

    // ================== 数词管理 ==================

    // 获取数词
    async getNumbers(type = 'all') {
        try {
            let query = supabase
                .from(TABLES.NUMBERS)
                .select('*')
                .order('value', { ascending: true })

            if (type !== 'all') {
                query = query.eq('type', type)
            }

            const { data, error } = await query

            if (error) {
                throw error
            }

            return data

        } catch (error) {
            console.error('获取数词失败:', error)
            throw new Error(`获取数词失败: ${error.message}`)
        }
    }

    // 添加数词
    async addNumber(numberData) {
        this.checkPermission('create')

        try {
            const newNumber = {
                value: numberData.value,
                linkaitiya: numberData.linkaitiya,
                pronunciation: numberData.pronunciation,
                type: numberData.type,
                description: numberData.description || '',
                created_by: window.authSystem.currentUser.id
            }

            const { data, error } = await supabase
                .from(TABLES.NUMBERS)
                .insert([newNumber])
                .select()
                .single()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, '数词添加成功')

        } catch (error) {
            console.error('添加数词失败:', error)
            return handleSupabaseError(error)
        }
    }

    // ================== 搜索功能 ==================

    async searchAll(query) {
        try {
            const searchTerm = `%${query}%`
            
            const [vocabularyResult, grammarResult, phrasesResult, numbersResult] = await Promise.all([
                supabase
                    .from(TABLES.VOCABULARY)
                    .select('*')
                    .or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm},pronunciation.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from(TABLES.GRAMMAR)
                    .select('*')
                    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from(TABLES.PHRASES)
                    .select('*')
                    .or(`linkaitiya.ilike.${searchTerm},chinese.ilike.${searchTerm}`)
                    .limit(10),
                supabase
                    .from(TABLES.NUMBERS)
                    .select('*')
                    .or(`linkaitiya.ilike.${searchTerm},value::text.ilike.${searchTerm}`)
                    .limit(10)
            ])

            return {
                vocabulary: vocabularyResult.data || [],
                grammar: grammarResult.data || [],
                phrases: phrasesResult.data || [],
                numbers: numbersResult.data || []
            }

        } catch (error) {
            console.error('搜索失败:', error)
            return {
                vocabulary: [],
                grammar: [],
                phrases: [],
                numbers: []
            }
        }
    }

    // ================== 统计信息 ==================

    async getStatistics() {
        try {
            const [vocabCount, grammarCount, phrasesCount, numbersCount] = await Promise.all([
                supabase.from(TABLES.VOCABULARY).select('*', { count: 'exact', head: true }),
                supabase.from(TABLES.GRAMMAR).select('*', { count: 'exact', head: true }),
                supabase.from(TABLES.PHRASES).select('*', { count: 'exact', head: true }),
                supabase.from(TABLES.NUMBERS).select('*', { count: 'exact', head: true })
            ])

            const vocabulary = vocabCount.count || 0
            const grammar = grammarCount.count || 0
            const phrases = phrasesCount.count || 0
            const numbers = numbersCount.count || 0

            return {
                vocabulary,
                grammar,
                phrases,
                numbers,
                total: vocabulary + grammar + phrases + numbers
            }

        } catch (error) {
            console.error('获取统计信息失败:', error)
            return {
                vocabulary: 0,
                grammar: 0,
                phrases: 0,
                numbers: 0,
                total: 0
            }
        }
    }

    // ================== 批量操作 ==================

    async batchImportVocabulary(vocabularyList) {
        this.checkPermission('create')

        try {
            const transformedList = vocabularyList.map(word => ({
                ...word,
                created_by: window.authSystem.currentUser.id,
                examples: word.examples || [],
                tags: word.tags || []
            }))

            const { data, error } = await supabase
                .from(TABLES.VOCABULARY)
                .insert(transformedList)
                .select()

            if (error) {
                throw error
            }

            return createSuccessResponse(data, `成功导入 ${data.length} 个词汇`)

        } catch (error) {
            console.error('批量导入词汇失败:', error)
            return handleSupabaseError(error)
        }
    }
}

// 创建全局实例（替代原有的 window.contentManager）
window.contentManager = new SupabaseContentManager()

console.log('📚 Supabase内容管理系统已加载！')

export default SupabaseContentManager