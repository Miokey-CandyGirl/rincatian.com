// GitHub Pages兼容的Supabase内容管理系统 - 性能优化版
// 使用传统script标签加载，不使用ES6模块

(function() {
    'use strict';
    
    // 缓存系统
    const Cache = {
        data: new Map(),
        timestamps: new Map(),
        TTL: 5 * 60 * 1000, // 5分钟缓存
        
        set(key, value) {
            this.data.set(key, value);
            this.timestamps.set(key, Date.now());
        },
        
        get(key) {
            const timestamp = this.timestamps.get(key);
            if (!timestamp || Date.now() - timestamp > this.TTL) {
                this.data.delete(key);
                this.timestamps.delete(key);
                return null;
            }
            return this.data.get(key);
        },
        
        clear() {
            this.data.clear();
            this.timestamps.clear();
        }
    };
    
    // 等待依赖加载完成
    function initializeContent() {
        if (!window.supabaseClient || !window.authSystem) {
            console.log('等待依赖加载...');
            setTimeout(initializeContent, 100);
            return;
        }

        class OptimizedContentManager {
            constructor() {
                this.supabase = window.supabaseClient;
                this.TABLES = window.TABLES;
                this.requestQueue = new Map(); // 防止重复请求
                console.log('📚 GitHub Pages内容管理系统初始化（性能优化版）...');
            }

            // 防重复请求的包装器
            async requestWithDeduplication(key, requestFn) {
                if (this.requestQueue.has(key)) {
                    return this.requestQueue.get(key);
                }
                
                const promise = requestFn();
                this.requestQueue.set(key, promise);
                
                try {
                    const result = await promise;
                    return result;
                } finally {
                    this.requestQueue.delete(key);
                }
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

            // ================== 优化的词汇管理 ==================

            // 获取所有词汇（带缓存和优化查询）
            async getVocabulary(filters = {}) {
                const cacheKey = `vocabulary_${JSON.stringify(filters)}`;
                const cached = Cache.get(cacheKey);
                if (cached) {
                    console.log('📱 使用缓存数据:', cacheKey);
                    return cached;
                }

                return this.requestWithDeduplication(cacheKey, async () => {
                    try {
                        let query = this.supabase
                            .from(this.TABLES.VOCABULARY)
                            .select('id, word, pronunciation, meaning, type, level, created_at') // 只选择必要字段
                            .order('created_at', { ascending: false });

                        // 应用筛选器
                        if (filters.type && filters.type !== 'all') {
                            query = query.eq('type', filters.type);
                        }

                        if (filters.search) {
                            const searchTerm = `%${filters.search}%`;
                            query = query.or(`word.ilike.${searchTerm},meaning.ilike.${searchTerm}`);
                        }

                        if (filters.alphabet) {
                            query = query.ilike('word', `${filters.alphabet}%`);
                        }

                        // 分页优化
                        const limit = filters.limit || 50;
                        const offset = filters.offset || 0;
                        query = query.range(offset, offset + limit - 1);

                        const { data, error } = await query;

                        if (error) {
                            throw error;
                        }

                        // 缓存结果
                        Cache.set(cacheKey, data);
                        console.log(`✅ 词汇数据加载完成: ${data.length} 条记录`);
                        return data;

                    } catch (error) {
                        console.error('获取词汇失败:', error);
                        throw new Error(`获取词汇失败: ${error.message}`);
                    }
                });
            }

            // 获取词汇详情（单独的API调用）
            async getVocabularyDetail(id) {
                const cacheKey = `vocabulary_detail_${id}`;
                const cached = Cache.get(cacheKey);
                if (cached) {
                    return cached;
                }

                try {
                    const { data, error } = await this.supabase
                        .from(this.TABLES.VOCABULARY)
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) {
                        throw error;
                    }

                    Cache.set(cacheKey, data);
                    return data;

                } catch (error) {
                    console.error('获取词汇详情失败:', error);
                    throw new Error(`获取词汇详情失败: ${error.message}`);
                }
            }

            // 添加新词汇（清除相关缓存）
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

                    // 清除相关缓存
                    this.clearVocabularyCache();

                    return window.createSuccessResponse(data, '词汇添加成功');

                } catch (error) {
                    console.error('添加词汇失败:', error);
                    return window.handleSupabaseError(error);
                }
            }

            // 批量获取数据（提高效率）
            async getBatchData(types = ['vocabulary', 'grammar']) {
                const cacheKey = `batch_${types.join('_')}`;
                const cached = Cache.get(cacheKey);
                if (cached) {
                    return cached;
                }

                try {
                    const promises = [];
                    const result = {};

                    if (types.includes('vocabulary')) {
                        promises.push(
                            this.supabase
                                .from(this.TABLES.VOCABULARY)
                                .select('id, word, pronunciation, meaning, type')
                                .limit(20)
                                .then(({ data }) => {
                                    result.vocabulary = data || [];
                                })
                        );
                    }

                    if (types.includes('grammar')) {
                        promises.push(
                            this.supabase
                                .from(this.TABLES.GRAMMAR)
                                .select('id, title, category, description')
                                .limit(20)
                                .then(({ data }) => {
                                    result.grammar = data || [];
                                })
                        );
                    }

                    await Promise.all(promises);
                    
                    Cache.set(cacheKey, result);
                    console.log('📦 批量数据加载完成');
                    return result;

                } catch (error) {
                    console.error('批量获取数据失败:', error);
                    throw new Error(`批量获取数据失败: ${error.message}`);
                }
            }

            // ================== 优化的语法管理 ==================

            // 获取所有语法规则（优化版）
            async getGrammar(filters = {}) {
                const cacheKey = `grammar_${JSON.stringify(filters)}`;
                const cached = Cache.get(cacheKey);
                if (cached) {
                    return cached;
                }

                return this.requestWithDeduplication(cacheKey, async () => {
                    try {
                        let query = this.supabase
                            .from(this.TABLES.GRAMMAR)
                            .select('id, title, category, description, level, order_num, created_at')
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

                        Cache.set(cacheKey, data);
                        return data;

                    } catch (error) {
                        console.error('获取语法规则失败:', error);
                        throw new Error(`获取语法规则失败: ${error.message}`);
                    }
                });
            }

            // ================== 缓存管理 ==================

            clearVocabularyCache() {
                const keysToDelete = Array.from(Cache.data.keys())
                    .filter(key => key.startsWith('vocabulary_'));
                keysToDelete.forEach(key => {
                    Cache.data.delete(key);
                    Cache.timestamps.delete(key);
                });
                console.log('🗑️ 词汇缓存已清除');
            }

            clearGrammarCache() {
                const keysToDelete = Array.from(Cache.data.keys())
                    .filter(key => key.startsWith('grammar_'));
                keysToDelete.forEach(key => {
                    Cache.data.delete(key);
                    Cache.timestamps.delete(key);
                });
                console.log('🗑️ 语法缓存已清除');
            }

            clearAllCache() {
                Cache.clear();
                console.log('🗑️ 所有缓存已清除');
            }

            // ================== 预加载和优化 ==================

            // 预加载常用数据
            async preloadData() {
                console.log('🔄 开始预加载数据...');
                try {
                    // 并行预加载
                    await Promise.all([
                        this.getVocabulary({ limit: 20 }),
                        this.getGrammar({ limit: 10 }),
                        this.getBatchData(['vocabulary', 'grammar'])
                    ]);
                    console.log('✅ 数据预加载完成');
                } catch (error) {
                    console.warn('预加载失败:', error);
                }
            }

            // ================== 统计信息（优化版） ==================

            async getStatistics() {
                const cacheKey = 'statistics';
                const cached = Cache.get(cacheKey);
                if (cached) {
                    return cached;
                }

                try {
                    // 并行查询统计信息
                    const [vocabResult, grammarResult] = await Promise.all([
                        this.supabase.from(this.TABLES.VOCABULARY).select('*', { count: 'exact', head: true }),
                        this.supabase.from(this.TABLES.GRAMMAR).select('*', { count: 'exact', head: true })
                    ]);

                    const vocabulary = vocabResult.count || 0;
                    const grammar = grammarResult.count || 0;

                    const stats = {
                        vocabulary,
                        grammar,
                        phrases: 0,
                        numbers: 0,
                        total: vocabulary + grammar
                    };

                    Cache.set(cacheKey, stats);
                    return stats;

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

            // ================== 性能监控 ==================

            async measurePerformance(operation, fn) {
                const start = performance.now();
                try {
                    const result = await fn();
                    const end = performance.now();
                    console.log(`⏱️ ${operation} 耗时: ${(end - start).toFixed(2)}ms`);
                    return result;
                } catch (error) {
                    const end = performance.now();
                    console.error(`❌ ${operation} 失败 (耗时: ${(end - start).toFixed(2)}ms):`, error);
                    throw error;
                }
            }
        }

        // 创建全局实例
        const optimizedManager = new OptimizedContentManager();
        
        // 保持向后兼容
        window.contentManager = optimizedManager;
        window.optimizedContentManager = optimizedManager;
        
        // 启动预加载
        optimizedManager.preloadData();
        
        console.log('📚 GitHub Pages内容管理系统已加载（性能优化版）！');
    }

    // 开始初始化
    initializeContent();
})();