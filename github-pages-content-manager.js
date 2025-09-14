// GitHub Pages兼容的Supabase内容管理系统
// 使用传统script标签加载，不使用ES6模块

(function() {
    'use strict';
    
    // 等待依赖加载完成
    function initializeContent() {
        if (!window.supabaseClient || !window.authSystem) {
            console.log('等待依赖加载...');
            setTimeout(initializeContent, 100);
            return;
        }

        class GitHubPagesContentManager {
            constructor() {
                this.supabase = window.supabaseClient;
                this.TABLES = window.TABLES;
                console.log('📚 GitHub Pages内容管理系统初始化...');
            }

            // 权限检查
            checkPermission(action) {
                if (!window.authSystem || !window.authSystem.currentUser) {
                    throw new Error('请先登录');
                }

                const writeActions = ['create', 'update', 'delete'];
                if (writeActions.includes(action) && !window.authSystem.hasPermission('write')) {
                    throw new Error('您没有权限执行此操作，只有管理员可以添加、修改或删除内容');
                }

                return true;
            }

            // ================== 词汇管理 ==================

            // 获取所有词汇
            async getVocabulary(filters = {}) {
                try {
                    let query = this.supabase
                        .from(this.TABLES.VOCABULARY)
                        .select('*')
                        .order('created_at', { ascending: false });

                    // 应用筛选器
                    if (filters.type && filters.type !== 'all') {
                        query = query.eq('type', filters.type);
                    }

                    if (filters.search) {
                        const searchTerm = `%${filters.search}%`;
                        query = query.or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm},pronunciation.ilike.${searchTerm}`);
                    }

                    if (filters.alphabet) {
                        query = query.ilike('word', `${filters.alphabet}%`);
                    }

                    if (filters.limit) {
                        query = query.limit(filters.limit);
                    }

                    if (filters.offset) {
                        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
                    }

                    const { data, error } = await query;

                    if (error) {
                        throw error;
                    }

                    return data;

                } catch (error) {
                    console.error('获取词汇失败:', error);
                    throw new Error(`获取词汇失败: ${error.message}`);
                }
            }

            // 添加新词汇
            async addVocabulary(wordData) {
                this.checkPermission('create');

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
                    };

                    const { data, error } = await this.supabase
                        .from(this.TABLES.VOCABULARY)
                        .insert([newWord])
                        .select()
                        .single();

                    if (error) {
                        throw error;
                    }

                    return window.createSuccessResponse(data, '词汇添加成功');

                } catch (error) {
                    console.error('添加词汇失败:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 更新词汇
            async updateVocabulary(wordId, updateData) {
                this.checkPermission('update');

                try {
                    const { data, error } = await this.supabase
                        .from(this.TABLES.VOCABULARY)
                        .update({
                            ...updateData,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', wordId)
                        .select()
                        .single();

                    if (error) {
                        throw error;
                    }

                    return window.createSuccessResponse(data, '词汇更新成功');

                } catch (error) {
                    console.error('更新词汇失败:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 删除词汇
            async deleteVocabulary(wordId) {
                this.checkPermission('delete');

                try {
                    const { data, error } = await this.supabase
                        .from(this.TABLES.VOCABULARY)
                        .delete()
                        .eq('id', wordId)
                        .select()
                        .single();

                    if (error) {
                        throw error;
                    }

                    return window.createSuccessResponse(data, '词汇删除成功');

                } catch (error) {
                    console.error('删除词汇失败:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // ================== 语法管理 ==================

            // 获取所有语法规则
            async getGrammar(filters = {}) {
                try {
                    let query = this.supabase
                        .from(this.TABLES.GRAMMAR)
                        .select('*')
                        .order('order_num', { ascending: true })
                        .order('created_at', { ascending: false });

                    if (filters.category && filters.category !== 'all') {
                        query = query.eq('category', filters.category);
                    }

                    if (filters.search) {
                        const searchTerm = `%${filters.search}%`;
                        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
                    }

                    const { data, error } = await query;

                    if (error) {
                        throw error;
                    }

                    return data;

                } catch (error) {
                    console.error('获取语法规则失败:', error);
                    throw new Error(`获取语法规则失败: ${error.message}`);
                }
            }

            // 添加语法规则
            async addGrammar(grammarData) {
                this.checkPermission('create');

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
                    };

                    const { data, error } = await this.supabase
                        .from(this.TABLES.GRAMMAR)
                        .insert([newRule])
                        .select()
                        .single();

                    if (error) {
                        throw error;
                    }

                    return window.createSuccessResponse(data, '语法规则添加成功');

                } catch (error) {
                    console.error('添加语法规则失败:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // ================== 搜索功能 ==================

            async searchAll(query) {
                try {
                    const searchTerm = `%${query}%`;
                    
                    const [vocabularyResult, grammarResult] = await Promise.all([
                        this.supabase
                            .from(this.TABLES.VOCABULARY)
                            .select('*')
                            .or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm},pronunciation.ilike.${searchTerm}`)
                            .limit(10),
                        this.supabase
                            .from(this.TABLES.GRAMMAR)
                            .select('*')
                            .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
                            .limit(10)
                    ]);

                    return {
                        vocabulary: vocabularyResult.data || [],
                        grammar: grammarResult.data || [],
                        phrases: [],
                        numbers: []
                    };

                } catch (error) {
                    console.error('搜索失败:', error);
                    return {
                        vocabulary: [],
                        grammar: [],
                        phrases: [],
                        numbers: []
                    };
                }
            }

            // ================== 统计信息 ==================

            async getStatistics() {
                try {
                    const [vocabCount, grammarCount] = await Promise.all([
                        this.supabase.from(this.TABLES.VOCABULARY).select('*', { count: 'exact', head: true }),
                        this.supabase.from(this.TABLES.GRAMMAR).select('*', { count: 'exact', head: true })
                    ]);

                    const vocabulary = vocabCount.count || 0;
                    const grammar = grammarCount.count || 0;

                    return {
                        vocabulary,
                        grammar,
                        phrases: 0,
                        numbers: 0,
                        total: vocabulary + grammar
                    };

                } catch (error) {
                    console.error('获取统计信息失败:', error);
                    return {
                        vocabulary: 0,
                        grammar: 0,
                        phrases: 0,
                        numbers: 0,
                        total: 0
                    };
                }
            }
        }

        // 创建全局实例（替代原有的 window.contentManager）
        window.contentManager = new GitHubPagesContentManager();
        console.log('📚 GitHub Pages内容管理系统已加载！');
    }

    // 开始初始化
    initializeContent();
})();