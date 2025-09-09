// 琳凯蒂亚语内容管理系统
// 用于管理语法、词汇等内容的增删改查

class ContentManager {
    constructor() {
        this.vocabulary = JSON.parse(localStorage.getItem('linkaitiya_vocabulary') || '[]');
        this.grammar = JSON.parse(localStorage.getItem('linkaitiya_grammar') || '[]');
        this.phrases = JSON.parse(localStorage.getItem('linkaitiya_phrases') || '[]');
        this.numbers = JSON.parse(localStorage.getItem('linkaitiya_numbers') || '[]');
        
        this.initializeDefaultContent();
    }

    // 初始化默认内容
    initializeDefaultContent() {
        if (this.vocabulary.length === 0) {
            this.initializeDefaultVocabulary();
        }
        if (this.grammar.length === 0) {
            this.initializeDefaultGrammar();
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

    // ================== 词汇管理 ==================

    // 获取所有词汇
    getVocabulary(filters = {}) {
        let result = [...this.vocabulary];

        // 应用筛选器
        if (filters.type && filters.type !== 'all') {
            result = result.filter(word => word.type === filters.type);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(word => 
                word.word.toLowerCase().includes(searchTerm) ||
                word.meaning.toLowerCase().includes(searchTerm) ||
                word.pronunciation.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.alphabet) {
            result = result.filter(word => 
                word.word.toLowerCase().startsWith(filters.alphabet.toLowerCase())
            );
        }

        return result;
    }

    // 添加新词汇
    addVocabulary(wordData) {
        this.checkPermission('create');

        const newWord = {
            id: 'vocab_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
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
            createdBy: window.authSystem.currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.vocabulary.push(newWord);
        this.saveVocabulary();

        return { success: true, message: '词汇添加成功', data: newWord };
    }

    // 更新词汇
    updateVocabulary(wordId, updateData) {
        this.checkPermission('update');

        const wordIndex = this.vocabulary.findIndex(w => w.id === wordId);
        if (wordIndex === -1) {
            throw new Error('词汇不存在');
        }

        const updatedWord = {
            ...this.vocabulary[wordIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
            updatedBy: window.authSystem.currentUser.id
        };

        this.vocabulary[wordIndex] = updatedWord;
        this.saveVocabulary();

        return { success: true, message: '词汇更新成功', data: updatedWord };
    }

    // 删除词汇
    deleteVocabulary(wordId) {
        this.checkPermission('delete');

        const wordIndex = this.vocabulary.findIndex(w => w.id === wordId);
        if (wordIndex === -1) {
            throw new Error('词汇不存在');
        }

        const deletedWord = this.vocabulary.splice(wordIndex, 1)[0];
        this.saveVocabulary();

        return { success: true, message: '词汇删除成功', data: deletedWord };
    }

    // ================== 语法管理 ==================

    // 获取所有语法规则
    getGrammar(filters = {}) {
        let result = [...this.grammar];

        if (filters.category && filters.category !== 'all') {
            result = result.filter(rule => rule.category === filters.category);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(rule => 
                rule.title.toLowerCase().includes(searchTerm) ||
                rule.description.toLowerCase().includes(searchTerm)
            );
        }

        return result;
    }

    // 添加语法规则
    addGrammar(grammarData) {
        this.checkPermission('create');

        const newRule = {
            id: 'grammar_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            title: grammarData.title,
            category: grammarData.category,
            description: grammarData.description,
            rules: grammarData.rules || [],
            examples: grammarData.examples || [],
            exceptions: grammarData.exceptions || [],
            level: grammarData.level || 'beginner',
            order: grammarData.order || 0,
            createdBy: window.authSystem.currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.grammar.push(newRule);
        this.saveGrammar();

        return { success: true, message: '语法规则添加成功', data: newRule };
    }

    // 更新语法规则
    updateGrammar(ruleId, updateData) {
        this.checkPermission('update');

        const ruleIndex = this.grammar.findIndex(r => r.id === ruleId);
        if (ruleIndex === -1) {
            throw new Error('语法规则不存在');
        }

        const updatedRule = {
            ...this.grammar[ruleIndex],
            ...updateData,
            updatedAt: new Date().toISOString(),
            updatedBy: window.authSystem.currentUser.id
        };

        this.grammar[ruleIndex] = updatedRule;
        this.saveGrammar();

        return { success: true, message: '语法规则更新成功', data: updatedRule };
    }

    // 删除语法规则
    deleteGrammar(ruleId) {
        this.checkPermission('delete');

        const ruleIndex = this.grammar.findIndex(r => r.id === ruleId);
        if (ruleIndex === -1) {
            throw new Error('语法规则不存在');
        }

        const deletedRule = this.grammar.splice(ruleIndex, 1)[0];
        this.saveGrammar();

        return { success: true, message: '语法规则删除成功', data: deletedRule };
    }

    // ================== 短语管理 ==================

    // 获取短语
    getPhrases(category = 'all') {
        if (category === 'all') {
            return [...this.phrases];
        }
        return this.phrases.filter(phrase => phrase.category === category);
    }

    // 添加短语
    addPhrase(phraseData) {
        this.checkPermission('create');

        const newPhrase = {
            id: 'phrase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            linkaitiya: phraseData.linkaitiya,
            chinese: phraseData.chinese,
            pronunciation: phraseData.pronunciation,
            category: phraseData.category,
            usage: phraseData.usage || '',
            level: phraseData.level || 'basic',
            createdBy: window.authSystem.currentUser.id,
            createdAt: new Date().toISOString()
        };

        this.phrases.push(newPhrase);
        this.savePhrases();

        return { success: true, message: '短语添加成功', data: newPhrase };
    }

    // ================== 数词管理 ==================

    // 获取数词
    getNumbers(type = 'all') {
        if (type === 'all') {
            return [...this.numbers];
        }
        return this.numbers.filter(num => num.type === type);
    }

    // 添加数词
    addNumber(numberData) {
        this.checkPermission('create');

        const newNumber = {
            id: 'number_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            value: numberData.value,
            linkaitiya: numberData.linkaitiya,
            pronunciation: numberData.pronunciation,
            type: numberData.type, // cardinal, ordinal, measure
            description: numberData.description || '',
            createdBy: window.authSystem.currentUser.id,
            createdAt: new Date().toISOString()
        };

        this.numbers.push(newNumber);
        this.saveNumbers();

        return { success: true, message: '数词添加成功', data: newNumber };
    }

    // ================== 数据持久化 ==================

    saveVocabulary() {
        localStorage.setItem('linkaitiya_vocabulary', JSON.stringify(this.vocabulary));
    }

    saveGrammar() {
        localStorage.setItem('linkaitiya_grammar', JSON.stringify(this.grammar));
    }

    savePhrases() {
        localStorage.setItem('linkaitiya_phrases', JSON.stringify(this.phrases));
    }

    saveNumbers() {
        localStorage.setItem('linkaitiya_numbers', JSON.stringify(this.numbers));
    }

    // ================== 初始化默认数据 ==================

    initializeDefaultVocabulary() {
        const defaultVocab = [
            {
                id: 'vocab_default_1',
                word: 'link',
                pronunciation: 'liŋk',
                meaning: '光，光线',
                type: '名',
                definition: '指光线、光芒，是琳凯蒂亚语中最基础的词汇之一',
                examples: ['link beautiful（美丽的光线）', 'link strong（强烈的光）'],
                etymology: '来自古琳凯蒂亚语，表示光的概念',
                usage: '常用于描述各种光线和光芒',
                level: 'basic',
                tags: ['基础词汇', '光'],
                createdBy: 'system',
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            },
            {
                id: 'vocab_default_2',
                word: 'kaitiya',
                pronunciation: 'kaɪˈtiːja',
                meaning: '星球，世界',
                type: '名',
                definition: '指星球、世界，特指琳凯蒂亚星球',
                examples: ['beautiful kaitiya（美丽的星球）'],
                etymology: '琳凯蒂亚星球的本名',
                usage: '用于指代星球、世界等概念',
                level: 'basic',
                tags: ['基础词汇', '星球'],
                createdBy: 'system',
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            }
        ];

        this.vocabulary = defaultVocab;
        this.saveVocabulary();
    }

    initializeDefaultGrammar() {
        const defaultGrammar = [
            {
                id: 'grammar_default_1',
                title: '基本语序',
                category: '基础语法',
                description: '琳凯蒂亚语的基本语序为主-谓-宾（SVO）',
                rules: [
                    '主语 + 谓语 + 宾语',
                    '修饰语通常位于被修饰词之前',
                    '疑问词位于句首'
                ],
                examples: [
                    'mi love link（我爱光线）',
                    'beautiful kaitiya shine（美丽的星球闪耀）'
                ],
                exceptions: ['在诗歌和正式文体中可能出现倒装'],
                level: 'beginner',
                order: 1,
                createdBy: 'system',
                createdAt: '2025-01-01T00:00:00.000Z',
                updatedAt: '2025-01-01T00:00:00.000Z'
            }
        ];

        this.grammar = defaultGrammar;
        this.saveGrammar();
    }

    // ================== 搜索功能 ==================

    searchAll(query) {
        const results = {
            vocabulary: [],
            grammar: [],
            phrases: [],
            numbers: []
        };

        const searchTerm = query.toLowerCase();

        // 搜索词汇
        results.vocabulary = this.vocabulary.filter(word =>
            word.word.toLowerCase().includes(searchTerm) ||
            word.meaning.toLowerCase().includes(searchTerm) ||
            word.pronunciation.toLowerCase().includes(searchTerm)
        );

        // 搜索语法
        results.grammar = this.grammar.filter(rule =>
            rule.title.toLowerCase().includes(searchTerm) ||
            rule.description.toLowerCase().includes(searchTerm)
        );

        // 搜索短语
        results.phrases = this.phrases.filter(phrase =>
            phrase.linkaitiya.toLowerCase().includes(searchTerm) ||
            phrase.chinese.toLowerCase().includes(searchTerm)
        );

        // 搜索数词
        results.numbers = this.numbers.filter(num =>
            num.linkaitiya.toLowerCase().includes(searchTerm) ||
            num.value.toString().includes(searchTerm)
        );

        return results;
    }

    // ================== 统计信息 ==================

    getStatistics() {
        return {
            vocabulary: this.vocabulary.length,
            grammar: this.grammar.length,
            phrases: this.phrases.length,
            numbers: this.numbers.length,
            total: this.vocabulary.length + this.grammar.length + this.phrases.length + this.numbers.length
        };
    }
}

// 创建全局内容管理系统实例
window.contentManager = new ContentManager();

console.log('📚 琳凯蒂亚语内容管理系统已加载！');