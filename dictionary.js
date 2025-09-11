// 词典页面功能脚本

document.addEventListener('DOMContentLoaded', function() {
    // 确保认证系统正确初始化
    if (typeof initializeAuthSystem === 'function') {
        initializeAuthSystem();
        setTimeout(() => {
            updateAuthenticationState();
        }, 100);
    }
    
    // 初始化词典功能
    initDictionary();
    
    console.log('琳凯蒂亚语词典加载完成！📚');
});

// 词典数据
const dictionaryData = {
    // 标准词根（20个）
    standardWords: [
        {
            linkaitian: 'ŝelo',
            chinese: '贝，钱，货币',
            type: '名',
            pronunciation: '[ʃelo]',
            usage: '商业交易中的基本货币单位，也指贝壳类装饰品',
            origin: '标准词根',
            examples: ['ŝelo da komerco - 商业的钱', 'ŝelon ez koferē - 钱在盒子里']
        },
        {
            linkaitian: 'pulu',
            chinese: '羽，扇，羽毛',
            type: '名',
            pronunciation: '[pulu]',
            usage: '鸟类的羽毛，也指扇子类工具',
            origin: '标准词根',
            examples: ['berdo da pulu - 鸟的羽毛', 'pulu da vento - 扇风的扇子']
        },
        {
            linkaitian: 'elixir',
            chinese: '丹，药剂，炼金术品',
            type: '名',
            pronunciation: '[eliksiɻ]',
            usage: '魔法药剂或炼金术制品，具有特殊功效',
            origin: '标准词根',
            examples: ['elixir da vivo - 生命药剂', 'elixir magikai - 魔法药水']
        },
        {
            linkaitian: 'ŝafo',
            chinese: '羊，绵羊',
            type: '名',
            pronunciation: '[ʃafo]',
            usage: '家畜羊类，提供羊毛和肉食',
            origin: '标准词根',
            examples: ['ŝafo da lano - 羊毛', 'ŝafon ez prato - 羊在草地上']
        },
        {
            linkaitian: 'berdo',
            chinese: '鸟，飞鸟',
            type: '名',
            pronunciation: '[berdo]',
            usage: '能够飞行的鸟类动物',
            origin: '标准词根',
            examples: ['berdo fluze - 鸟在飞', 'berdo da ĉuēguaŋ - 星光鸟']
        },
        {
            linkaitian: 'loŋ',
            chinese: '龙，巨龙',
            type: '名',
            pronunciation: '[loŋ]',
            usage: '传说中的巨龙，象征力量与智慧',
            origin: '标准词根',
            examples: ['loŋ da fajro - 火龙', 'loŋ flugze - 龙在飞翔']
        },
        {
            linkaitian: 'sango',
            chinese: '血，血液',
            type: '名',
            pronunciation: '[saŋgo]',
            usage: '生物体内的血液，象征生命力',
            origin: '标准词根',
            examples: ['sango ruĝa - 红色的血', 'sango da vivo - 生命之血']
        },
        {
            linkaitian: 'viando',
            chinese: '肉，肉类',
            type: '名',
            pronunciation: '[viando]',
            usage: '动物的肉类，用作食物',
            origin: '标准词根',
            examples: ['viando da ŝafo - 羊肉', 'viando kuire - 烹饪肉类']
        },
        {
            linkaitian: 'ligno',
            chinese: '木，树，木材',
            type: '名',
            pronunciation: '[ligno]',
            usage: '树木或木材，建筑和制作的基本材料',
            origin: '标准词根',
            examples: ['ligno alta - 高大的树', 'ligno da domo - 房屋的木材']
        },
        {
            linkaitian: 'ĉēno',
            chinese: '车，车辆',
            type: '名',
            pronunciation: '[tʂʰeːno]',
            usage: '交通工具，用于运输人或物',
            origin: '标准词根',
            examples: ['ĉēno rapida - 快速的车', 'ĉēno da fajro - 火车']
        },
        {
            linkaitian: 'pruē',
            chinese: '春，春天',
            type: '名',
            pronunciation: '[prueː]',
            usage: '四季中的春季，象征新生与希望',
            origin: '标准词根',
            examples: ['pruē venas - 春天来了', 'pruē da floroj - 春天的花朵']
        },
        {
            linkaitian: 'ĉilo',
            chinese: '刀，刃具',
            type: '名',
            pronunciation: '[tɕilo]',
            usage: '切割工具或武器',
            origin: '标准词根',
            examples: ['ĉilo akra - 锋利的刀', 'ĉilo da kuiri - 厨刀']
        },
        {
            linkaitian: 'qigen',
            chinese: '今，今天，现在',
            type: '名',
            pronunciation: '[tɕigen]',
            usage: '当前的时间，今日',
            origin: '标准词根',
            examples: ['qigen estas bela tago - 今天是美好的一天', 'qigen wi amas - 今天我爱']
        },
        {
            linkaitian: 'kolor',
            chinese: '色，颜色',
            type: '名',
            pronunciation: '[kolor]',
            usage: '物体表面反射光线产生的视觉效果',
            origin: '标准词根',
            examples: ['kolor ruĝa - 红色', 'kolor da ĉuēguaŋ - 星光的颜色']
        },
        {
            linkaitian: 'kiwa',
            chinese: '瓦，瓦片',
            type: '名',
            pronunciation: '[kiwa]',
            usage: '建筑屋顶的覆盖材料',
            origin: '标准词根',
            examples: ['kiwa da tegmento - 屋顶瓦片', 'kiwa argila - 陶瓷瓦']
        },
        {
            linkaitian: 'formo',
            chinese: '形，形状，形式',
            type: '名',
            pronunciation: '[formo]',
            usage: '物体的外观形状或抽象形式',
            origin: '标准词根',
            examples: ['formo ronda - 圆形', 'formo da magia - 魔法形式']
        },
        {
            linkaitian: 'pajo',
            chinese: '页，页面',
            type: '名',
            pronunciation: '[pajo]',
            usage: '书籍或文档的一页',
            origin: '标准词根',
            examples: ['pajo da libro - 书的页面', 'pajo blanka - 空白页']
        },
        {
            linkaitian: 'senco',
            chinese: '义，意义，含义',
            type: '名',
            pronunciation: '[sentso]',
            usage: '词语或事物的含义和意义',
            origin: '标准词根',
            examples: ['senco profunda - 深刻的意义', 'senco da vivo - 生命的意义']
        },
        {
            linkaitian: 'rodu',
            chinese: '产，生产，产生',
            type: '动',
            pronunciation: '[rodu]',
            usage: '制造、生产或产生某物',
            origin: '标准词根',
            examples: ['roduksi fruktojn - 生产水果', 'rodu nova ideojn - 产生新想法']
        },
        {
            linkaitian: 'depon',
            chinese: '存，存放，保存',
            type: '动',
            pronunciation: '[depon]',
            usage: '将物品存放或保存在某处',
            origin: '标准词根',
            examples: ['deponi librojn - 存放书籍', 'depon en banko - 存在银行']
        }
    ],

    // 语法词汇
    grammarWords: {
        particles: [
            { word: "'ô", meaning: "主语助词（可自发动作）", example: "Wi'ô pêlē. - 我玩。" },
            { word: "'j", meaning: "主语助词（不可自发动作）", example: "Libro'j falis. - 书掉了。" },
            { word: "'l", meaning: "主语助词（事物性质、状态）", example: "Beleco'l plaĉas. - 美丽令人愉悦。" },
            { word: "'ō", meaning: "直接宾语助词", example: "Wi vidas ŝin'ō. - 我看见她。" },
            { word: "'r", meaning: "补语助词", example: "Li fariĝis kuracisto'r. - 他成了医生。" },
            { word: "'a", meaning: "定语助词", example: "Libro'a ruĝa. - 红色的书。" },
            { word: "'u", meaning: "状语助词", example: "Rapide'u kuri. - 快速地跑。" },
            { word: "'xu", meaning: "时间状语助词", example: "Matene'xu venas. - 早上来。" },
            { word: "'ku", meaning: "地点状语助词", example: "Hejme'ku resti. - 在家待着。" },
            { word: "'poroŋ", meaning: "目的状语助词", example: "Lerni'poroŋ venas. - 为了学习而来。" }
        ],
        pronouns: [
            { word: "wi", meaning: "我", example: "Wi amas vin. - 我爱你。" },
            { word: "ni", meaning: "你", example: "Ni estas bela. - 你很美。" },
            { word: "hi", meaning: "他（男）", example: "Hi laboras. - 他工作。" },
            { word: "ŝi", meaning: "她（女）", example: "Ŝi kantas. - 她唱歌。" },
            { word: "ji", meaning: "它（物）", example: "Ji brilas. - 它发光。" },
            { word: "win", meaning: "我们", example: "Win iras. - 我们去。" },
            { word: "nin", meaning: "你们", example: "Nin venas. - 你们来。" },
            { word: "hin", meaning: "他们", example: "Hin ludas. - 他们玩。" },
            { word: "ko", meaning: "这，这个", example: "Ko estas bela. - 这很美。" },
            { word: "go", meaning: "那，那个", example: "Go estas granda. - 那很大。" },
            { word: "nei", meaning: "谁", example: "Nei venas? - 谁来？" },
            { word: "neko", meaning: "什么", example: "Neko estas? - 是什么？" }
        ],
        conjunctions: [
            { word: "hâ", meaning: "和、与、且", example: "Wi hâ ni. - 我和你。" },
            { word: "ole", meaning: "并且、而且", example: "Bela ole saĝa. - 美丽而且聪明。" },
            { word: "sedo", meaning: "但是", example: "Malgranda sedo forta. - 小但是强。" },
            { word: "kona", meaning: "或者、还是", example: "Teo kona kafo? - 茶还是咖啡？" },
            { word: "qavi", meaning: "因为", example: "Qavi pluvas. - 因为下雨。" },
            { word: "gosi", meaning: "所以", example: "Gosi wi venas. - 所以我来。" },
            { word: "rugo", meaning: "假设", example: "Rugo ni volas. - 假设你想要。" },
            { word: "poroŋ", meaning: "为了", example: "Poroŋ lerni. - 为了学习。" }
        ],
        modals: [
            { word: "sēē", meaning: "将要、即将", example: "Wi sēē iras. - 我将要去。" },
            { word: "devi", meaning: "应该、应当", example: "Ni devi lerni. - 你应该学习。" },
            { word: "deθi", meaning: "想要、希望", example: "Wi deθi vidi. - 我想看。" },
            { word: "ghi", meaning: "会（能力）", example: "Hi ghi flugi. - 他会飞。" },
            { word: "povi", meaning: "能够、可以", example: "Ni povi fari. - 你能做。" },
            { word: "mezi", meaning: "值得", example: "Mezi legi. - 值得读。" }
        ]
    }
};

// 当前显示的词汇列表
let currentWordList = [];
let currentPage = 1;
const wordsPerPage = 12;
let currentFilter = 'all';

// 初始化词典
function initDictionary() {
    initEventListeners();
    initAlphabetFilter();
    loadStandardWords();
    updateWordCount();
    updatePermissions();
    
    // 默认加载词汇收集
    switchTab('collect');
}

// 更新用户权限显示
function updatePermissions() {
    // 显示/隐藏管理员链接
    const adminNav = document.getElementById('adminNav');
    if (adminNav) {
        if (window.authSystem && window.authSystem.isAdmin()) {
            adminNav.style.display = 'block';
        } else {
            adminNav.style.display = 'none';
        }
    }
    
    // 更新添加单词按钮文字
    const addWordBtn = document.getElementById('addWordBtn');
    if (addWordBtn) {
        if (window.authSystem && window.authSystem.currentUser) {
            if (window.authSystem.hasPermission('write')) {
                addWordBtn.innerHTML = '<span class="icon">➕</span>添加单词';
                addWordBtn.title = '点击添加新单词';
            } else {
                addWordBtn.innerHTML = '<span class="icon">📝</span>申请添加';
                addWordBtn.title = '向管理员申请添加新单词';
            }
        } else {
            addWordBtn.innerHTML = '<span class="icon">➕</span>添加单词';
            addWordBtn.title = '请先登录';
        }
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 标签页切换
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // 有限词汇标签页切换
    const finiteTabs = document.querySelectorAll('.finite-tab');
    finiteTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            switchFiniteCategory(category);
        });
    });
    
    // 标准词汇标签页切换
    const openTabs = document.querySelectorAll('.open-tab');
    openTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            switchOpenCategory(category);
        });
    });
    
    // 原有词汇标签页切换
    const originalTabs = document.querySelectorAll('.original-tab');
    originalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            switchOriginalCategory(category);
        });
    });
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // 添加单词按钮
    const addWordBtn = document.getElementById('addWordBtn');
    if (addWordBtn) {
        addWordBtn.addEventListener('click', handleAddWord);
    }
    
    // 模态框关闭
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(btn.dataset.modal);
        });
    });
}

// 初始化字母筛选
function initAlphabetFilter() {
    const alphabetFilter = document.getElementById('alphabetFilter');
    if (!alphabetFilter) return;
    
    // 琳凯蒂亚语41个字母
    const letters = ['a', 'ā', 'â', 'b', 'c', 'ĉ', 'd', 'e', 'ē', 'ê', 'f', 'g', 'h', 'i', 'ï', 'î', 'j', 'k', 'l', 'm', 'n', 'o', 'ō', 'ô', 'p', 'q', 'r', 's', 'ŝ', 't', 'u', 'ü', 'û', 'v', 'w', 'x', 'y', 'z', 'ẑ', 'θ', 'ŋ'];
    
    // 添加"全部"按钮
    const allBtn = document.createElement('button');
    allBtn.className = 'alphabet-btn active';
    allBtn.textContent = '全';
    allBtn.addEventListener('click', () => {
        document.querySelectorAll('.alphabet-btn').forEach(btn => btn.classList.remove('active'));
        allBtn.classList.add('active');
        currentFilter = 'all';
        filterWordsByLetter('all');
    });
    alphabetFilter.appendChild(allBtn);
    
    // 添加字母按钮
    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'alphabet-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.alphabet-btn').forEach(btn => btn.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = letter;
            filterWordsByLetter(letter);
        });
        alphabetFilter.appendChild(btn);
    });
}

// 标签页切换
function switchTab(tabName) {
    // 更新导航标签
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // 更新内容区域
    const sections = document.querySelectorAll('.dictionary-section');
    sections.forEach(section => {
        section.classList.toggle('active', section.id === tabName);
    });
    
    // 加载对应内容
    loadTabContent(tabName);
}

// 加载标签页内容
function loadTabContent(tabName) {
    switch (tabName) {
        case 'collect':
            loadStandardWords();
            break;
        case 'alphabet':
            loadAlphabet();
            break;
        case 'closewords':
            // 初始化有限词汇系统，默认显示代词系统
            initFiniteWordSystem();
            switchFiniteCategory('pronouns');
            break;
        case 'openwords':
            // 初始化标准词汇系统，默认显示常用标准词根
            initOpenWordSystem();
            switchOpenCategory('roots');
            break;
        case 'original':
            // 初始化原有词汇系统，默认显示时间表达
            initOriginalWordSystem();
            switchOriginalCategory('time');
            break;
        case 'phrase':
            loadAllPhraseCategories();
            break;
    }
}

// 初始化有限词汇系统
function initFiniteWordSystem() {
    console.log('初始化有限词汇系统...');
    
    // 确保所有有限词汇分类都存在
    const categories = ['pronouns', 'numerals', 'conjunctions', 'particles', 'emotives'];
    categories.forEach(category => {
        const element = document.getElementById(category);
        if (element) {
            element.classList.remove('active');
        }
    });
}

// 切换有限词汇分类
function switchFiniteCategory(category) {
    console.log('切换到有限词汇分类:', category);
    
    // 更新标签按钮状态
    const finiteTabs = document.querySelectorAll('.finite-tab');
    finiteTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // 更新内容区域
    const categories = document.querySelectorAll('.finite-category');
    categories.forEach(categoryElement => {
        categoryElement.classList.toggle('active', categoryElement.id === category);
    });
    
    // 加载对应内容（如果需要动态加载）
    // 目前内容都是静态的，不需要额外加载
    switch (category) {
        case 'pronouns':
            console.log('显示代词系统');
            break;
        case 'numerals':
            console.log('显示数词系统');
            break;
        case 'conjunctions':
            console.log('显示连词系统');
            break;
        case 'particles':
            console.log('显示助词系统');
            break;
        case 'emotives':
            console.log('显示抒情词系统');
            break;
    }
}

// 初始化标准词汇系统
function initOpenWordSystem() {
    console.log('初始化标准词汇系统...');
    
    // 确保所有标准词汇分类都存在
    const categories = ['nouns', 'verbs', 'adjectives', 'adverbs', 'interjections'];
    categories.forEach(category => {
        const element = document.getElementById(category);
        if (element) {
            element.classList.remove('active');
        }
    });
}

// 切换标准词汇分类
function switchOpenCategory(category) {
    console.log('切换到标准词汇分类:', category);
    
    // 更新标签按钮状态
    const openTabs = document.querySelectorAll('.open-tab');
    openTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // 更新内容区域
    const categories = document.querySelectorAll('.open-category');
    categories.forEach(categoryElement => {
        categoryElement.classList.toggle('active', categoryElement.id === category);
    });
    
    // 加载对应内容（如果需要动态加载）
    // 目前内容都是静态的，不需要额外加载
    switch (category) {
        case 'roots':
            console.log('显示常用标准词根系统');
            break;
        case 'nouns':
            console.log('显示名词系统');
            break;
        case 'verbs':
            console.log('显示动词系统');
            break;
        case 'adjectives':
            console.log('显示形容词系统');
            break;
        case 'adverbs':
            console.log('显示副词系统');
            break;
        case 'interjections':
            console.log('显示声叹词系统');
            break;
    }
}

// 初始化原有词汇系统
function initOriginalWordSystem() {
    console.log('初始化原有词汇系统...');
    
    // 确保所有原有词汇分类都存在
    const categories = ['time', 'greetings', 'suffix', 'phrases'];
    categories.forEach(category => {
        const element = document.getElementById(category);
        if (element) {
            element.classList.remove('active');
        }
    });
}

// 切换原有词汇分类
function switchOriginalCategory(category) {
    console.log('切换到原有词汇分类:', category);
    
    // 更新标签按钮状态
    const originalTabs = document.querySelectorAll('.original-tab');
    originalTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // 更新内容区域
    const categories = document.querySelectorAll('.original-category');
    categories.forEach(categoryElement => {
        categoryElement.classList.toggle('active', categoryElement.id === category);
    });
    
    // 加载对应内容（如果需要动态加载）
    // 目前内容都是静态的，不需要额外加载
    switch (category) {
        case 'time':
            console.log('显示时间表达系统');
            break;
        case 'greetings':
            console.log('显示问候用语系统');
            break;
        case 'suffix':
            console.log('显示词缀系统');
            break;
        case 'phrases':
            console.log('显示魔法用语系统');
            break;
    }
}

// 加载标准词汇
function loadStandardWords() {
    // 从内容管理系统获取词汇
    if (window.contentManager) {
        const vocabularyData = window.contentManager.getVocabulary();
        currentWordList = vocabularyData.length > 0 ? vocabularyData : dictionaryData.standardWords;
    } else {
        currentWordList = dictionaryData.standardWords;
    }
    
    currentPage = 1;
    displayWordList();
    updatePagination();
}

// 显示词汇列表
function displayWordList() {
    const wordList = document.getElementById('wordList');
    if (!wordList) return;
    
    const startIndex = (currentPage - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    const wordsToShow = currentWordList.slice(startIndex, endIndex);
    
    wordList.innerHTML = '';
    
    wordsToShow.forEach(word => {
        const wordElement = createWordElement(word);
        wordList.appendChild(wordElement);
    });
}

// 创建词汇元素
function createWordElement(word) {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word-item';
    
    // 兼容旧数据格式和新数据格式
    const linkaitian = word.word || word.linkaitian;
    const chinese = word.meaning || word.chinese;
    const type = word.type;
    const pronunciation = word.pronunciation;
    const usage = word.definition || word.usage;
    
    wordDiv.innerHTML = `
        <div class="word-header">
            <div>
                <div class="word-linkaitian">${linkaitian}</div>
                <div class="word-chinese">${chinese}</div>
            </div>
            <div class="word-type">${type}</div>
        </div>
        <div class="word-pronunciation">${pronunciation}</div>
        <div class="word-usage">${usage}</div>
    `;
    
    wordDiv.addEventListener('click', () => {
        showWordDetail(word);
    });
    
    return wordDiv;
}

// 显示词汇详情
function showWordDetail(word) {
    const modal = document.getElementById('wordDetailModal');
    const title = document.getElementById('modalWordTitle');
    const content = document.getElementById('modalWordContent');
    
    if (!modal || !title || !content) return;
    
    // 兼容旧数据格式和新数据格式
    const linkaitian = word.word || word.linkaitian;
    const chinese = word.meaning || word.chinese;
    const type = word.type;
    const pronunciation = word.pronunciation;
    const definition = word.definition || word.usage;
    const examples = word.examples || [];
    const etymology = word.etymology || word.origin;
    const level = word.level || '基础';
    
    title.textContent = `${linkaitian} - ${chinese}`;
    
    content.innerHTML = `
        <div class="word-detail">
            <div class="detail-section">
                <h4>基本信息</h4>
                <p><strong>词性：</strong>${type}</p>
                <p><strong>发音：</strong>${pronunciation}</p>
                <p><strong>来源：</strong>${etymology || '标准词根'}</p>
                <p><strong>难度：</strong>${level}</p>
            </div>
            <div class="detail-section">
                <h4>释义</h4>
                <p>${definition}</p>
            </div>
            ${examples && examples.length > 0 ? `
                <div class="detail-section">
                    <h4>例句</h4>
                    ${examples.map(example => `<p>• ${example}</p>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    showModal('wordDetailModal');
}

// 处理搜索
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const languageFilter = document.getElementById('languageFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    if (!searchInput) return;
    
    const query = searchInput.value.trim().toLowerCase();
    const language = languageFilter ? languageFilter.value : 'all';
    const type = typeFilter ? typeFilter.value : 'all';
    
    // 获取当前数据源
    let sourceWords = [];
    if (window.contentManager) {
        const vocabularyData = window.contentManager.getVocabulary();
        sourceWords = vocabularyData.length > 0 ? vocabularyData : dictionaryData.standardWords;
    } else {
        sourceWords = dictionaryData.standardWords;
    }
    
    let filteredWords = sourceWords;
    
    // 按搜索词过滤
    if (query) {
        filteredWords = filteredWords.filter(word => {
            // 兼容旧数据格式和新数据格式
            const linkaitian = (word.word || word.linkaitian || '').toLowerCase();
            const chinese = (word.meaning || word.chinese || '').toLowerCase();
            
            const linkaitianMatch = linkaitian.includes(query);
            const chineseMatch = chinese.includes(query);
            
            if (language === 'linkaitian') {
                return linkaitianMatch;
            } else if (language === 'chinese') {
                return chineseMatch;
            } else {
                return linkaitianMatch || chineseMatch;
            }
        });
    }
    
    // 按词性过滤
    if (type !== 'all') {
        filteredWords = filteredWords.filter(word => word.type === type);
    }
    
    // 显示搜索结果
    const searchResults = document.getElementById('searchResults');
    const wordList = document.getElementById('wordList');
    
    if (query || type !== 'all') {
        currentWordList = filteredWords;
        currentPage = 1;
        
        if (searchResults) {
            searchResults.classList.add('show');
            searchResults.innerHTML = `
                <div class="search-header">
                    搜索结果：找到 ${filteredWords.length} 个词汇
                </div>
            `;
        }
        
        if (filteredWords.length === 0) {
            if (wordList) {
                wordList.innerHTML = `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <div>没有找到匹配的词汇</div>
                    </div>
                `;
            }
        } else {
            displayWordList();
        }
    } else {
        if (searchResults) {
            searchResults.classList.remove('show');
        }
        loadStandardWords();
    }
    
    updatePagination();
}

// 更新词汇数量
function updateWordCount() {
    const wordCount = document.getElementById('wordCount');
    if (wordCount) {
        let totalWords = 0;
        
        // 从内容管理系统获取真实数量
        if (window.contentManager) {
            const vocabularyData = window.contentManager.getVocabulary();
            totalWords = vocabularyData.length;
        }
        
        // 如果没有真实数据，显示默认数据
        if (totalWords === 0) {
            totalWords = dictionaryData.standardWords.length;
        }
        
        wordCount.textContent = totalWords;
    }
}

// 更新分页
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(currentWordList.length / wordsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 上一页按钮
    paginationHTML += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">上一页</button>`;
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="page-btn active">${i}</button>`;
        } else {
            paginationHTML += `<button class="page-btn" onclick="changePage(${i})">${i}</button>`;
        }
    }
    
    // 下一页按钮
    paginationHTML += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">下一页</button>`;
    
    pagination.innerHTML = paginationHTML;
}

// 切换页面
function changePage(page) {
    const totalPages = Math.ceil(currentWordList.length / wordsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayWordList();
    updatePagination();
    
    // 滚动到顶部
    document.querySelector('.dictionary-main').scrollIntoView({ behavior: 'smooth' });
}

// 按字母筛选
function filterWordsByLetter(letter) {
    if (letter === 'all') {
        loadStandardWords();
        return;
    }
    
    // 获取当前数据源
    let sourceWords = [];
    if (window.contentManager) {
        const vocabularyData = window.contentManager.getVocabulary();
        sourceWords = vocabularyData.length > 0 ? vocabularyData : dictionaryData.standardWords;
    } else {
        sourceWords = dictionaryData.standardWords;
    }
    
    currentWordList = sourceWords.filter(word => {
        // 兼容旧数据格式和新数据格式
        const linkaitian = word.word || word.linkaitian;
        return linkaitian.toLowerCase().startsWith(letter.toLowerCase());
    });
    
    currentPage = 1;
    displayWordList();
    updatePagination();
}

// 工具函数
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// 更多词典功能

// 加载语法词汇
function loadGrammarWords() {
    loadParticles();
    loadPronouns();
    loadConjunctions();
    loadModals();
}

// 加载助词
function loadParticles() {
    const particleList = document.getElementById('particleList');
    if (!particleList) return;
    
    particleList.innerHTML = '';
    
    dictionaryData.grammarWords.particles.forEach(particle => {
        const particleElement = document.createElement('div');
        particleElement.className = 'grammar-item';
        particleElement.innerHTML = `
            <div class="grammar-word">${particle.word}</div>
            <div class="grammar-meaning">${particle.meaning}</div>
            <div class="grammar-example">${particle.example}</div>
        `;
        particleList.appendChild(particleElement);
    });
}

// 加载代词
function loadPronouns() {
    const pronounList = document.getElementById('pronounList');
    if (!pronounList) return;
    
    pronounList.innerHTML = '';
    
    dictionaryData.grammarWords.pronouns.forEach(pronoun => {
        const pronounElement = document.createElement('div');
        pronounElement.className = 'grammar-item';
        pronounElement.innerHTML = `
            <div class="grammar-word">${pronoun.word}</div>
            <div class="grammar-meaning">${pronoun.meaning}</div>
            <div class="grammar-example">${pronoun.example}</div>
        `;
        pronounList.appendChild(pronounElement);
    });
}

// 加载连词
function loadConjunctions() {
    const conjunctionList = document.getElementById('conjunctionList');
    if (!conjunctionList) return;
    
    conjunctionList.innerHTML = '';
    
    dictionaryData.grammarWords.conjunctions.forEach(conjunction => {
        const conjunctionElement = document.createElement('div');
        conjunctionElement.className = 'grammar-item';
        conjunctionElement.innerHTML = `
            <div class="grammar-word">${conjunction.word}</div>
            <div class="grammar-meaning">${conjunction.meaning}</div>
            <div class="grammar-example">${conjunction.example}</div>
        `;
        conjunctionList.appendChild(conjunctionElement);
    });
}

// 加载能愿前止词
function loadModals() {
    const modalList = document.getElementById('modalList');
    if (!modalList) return;
    
    modalList.innerHTML = '';
    
    dictionaryData.grammarWords.modals.forEach(modal => {
        const modalElement = document.createElement('div');
        modalElement.className = 'grammar-item';
        modalElement.innerHTML = `
            <div class="grammar-word">${modal.word}</div>
            <div class="grammar-meaning">${modal.meaning}</div>
            <div class="grammar-example">${modal.example}</div>
        `;
        modalList.appendChild(modalElement);
    });
}

// 加载字母发音
function loadAlphabet() {
    loadVowels();
    loadConsonants();
}

// 加载元音字母
function loadVowels() {
    const vowelsList = document.getElementById('vowelsList');
    if (!vowelsList) return;
    
    vowelsList.innerHTML = '';
    
    const vowels = [
        { char: 'a', pronunciation: 'ä', ipa: '[ä]' },
        { char: 'e', pronunciation: 'e', ipa: '[e̞]' },
        { char: 'i', pronunciation: 'i', ipa: '[i]' },
        { char: 'o', pronunciation: 'o', ipa: '[ɑʊ̯]' },
        { char: 'u', pronunciation: 'u', ipa: '[u]' },
        { char: 'ā', pronunciation: 'ai', ipa: '[aɪ̯]' },
        { char: 'ē', pronunciation: 'ei', ipa: '[eɪ̯]' },
        { char: 'ï', pronunciation: 'iz', ipa: '[z̩]' },
        { char: 'ō', pronunciation: 'ou', ipa: '[oʊ̯]' },
        { char: 'ü', pronunciation: 'yu', ipa: '[y]' },
        { char: 'â', pronunciation: 'ae', ipa: '[æ]' },
        { char: 'ê', pronunciation: 'eh', ipa: '[ɤ]' },
        { char: 'î', pronunciation: 'iv', ipa: '[ɸ]' },
        { char: 'ô', pronunciation: 'oe', ipa: '[œ]' },
        { char: 'û', pronunciation: 'uo', ipa: '[o]' }
    ];
    
    vowels.forEach(vowel => {
        const vowelElement = document.createElement('div');
        vowelElement.className = 'letter-item';
        vowelElement.innerHTML = `
            <div class="letter-char">${vowel.char}</div>
            <div class="letter-pronunciation">${vowel.pronunciation}</div>
            <div class="letter-ipa">${vowel.ipa}</div>
        `;
        vowelsList.appendChild(vowelElement);
    });
}

// 加载辅音字母
function loadConsonants() {
    const consonantsList = document.getElementById('consonantsList');
    if (!consonantsList) return;
    
    consonantsList.innerHTML = '';
    
    const consonants = [
        { char: 'b', pronunciation: 'b', ipa: '[pɑʊ̯]' },
        { char: 'c', pronunciation: 'ts', ipa: '[tsʰɑʊ̯]' },
        { char: 'ĉ', pronunciation: 'ch', ipa: '[tʂʰɑʊ̯]/[tɕʰɑʊ̯]' },
        { char: 'd', pronunciation: 'd', ipa: '[tɑʊ̯]' },
        { char: 'f', pronunciation: 'f', ipa: '[fɑʊ̯]' },
        { char: 'g', pronunciation: 'g', ipa: '[kɑʊ̯]/[k]' },
        { char: 'h', pronunciation: 'h', ipa: '[xɑʊ̯]' },
        { char: 'j', pronunciation: 'j', ipa: '[tɕɑʊ̯]' },
        { char: 'k', pronunciation: 'k', ipa: '[kʰɑʊ̯]' },
        { char: 'l', pronunciation: 'l', ipa: '[lɑʊ̯]/[ɭ]' },
        { char: 'm', pronunciation: 'm', ipa: '[mɑʊ̯]/[m̚]' },
        { char: 'n', pronunciation: 'n', ipa: '[nɑʊ̯]/[n̚]' },
        { char: 'p', pronunciation: 'p', ipa: '[pʰɑʊ̯]' },
        { char: 'q', pronunciation: 'q', ipa: '[tɕʰɑʊ̯]' },
        { char: 'r', pronunciation: 'r', ipa: '[ɻɑʊ̯]/[l]/[ɚ]' },
        { char: 's', pronunciation: 's', ipa: '[sɑʊ̯]' },
        { char: 'ŝ', pronunciation: 'sh', ipa: '[ʂɑʊ̯]/[ɕɑʊ̯]' },
        { char: 't', pronunciation: 't', ipa: '[tʰɑʊ̯]' },
        { char: 'v', pronunciation: 'v', ipa: '[vɑʊ̯]' },
        { char: 'w', pronunciation: 'w', ipa: '[wɑʊ̯]' },
        { char: 'x', pronunciation: 'x', ipa: '[ɕɑʊ̯]' },
        { char: 'y', pronunciation: 'y', ipa: '[jɑʊ̯]' },
        { char: 'z', pronunciation: 'z', ipa: '[tsɑʊ̯]/[θɑʊ̯]' },
        { char: 'ẑ', pronunciation: 'zh', ipa: '[tʂɑʊ̯]/[tɕɑʊ̯]' },
        { char: 'θ', pronunciation: 'th', ipa: '[θɑʊ̯]' },
        { char: 'ŋ', pronunciation: 'ng', ipa: '[ŋɑʊ̯]' }
    ];
    
    consonants.forEach(consonant => {
        const consonantElement = document.createElement('div');
        consonantElement.className = 'letter-item';
        consonantElement.innerHTML = `
            <div class="letter-char">${consonant.char}</div>
            <div class="letter-pronunciation">${consonant.pronunciation}</div>
            <div class="letter-ipa">${consonant.ipa}</div>
        `;
        consonantsList.appendChild(consonantElement);
    });
}

// 加载常用短语
function loadPhrases() {
    loadGreetingPhrases();
    loadBasicPhrases();
    loadTimePhrases();
    loadMagicPhrases();
}

// 加载问候短语
function loadGreetingPhrases() {
    const greetingPhrases = document.getElementById('greetingPhrases');
    if (!greetingPhrases) return;
    
    greetingPhrases.innerHTML = '';
    
    const greetingCategories = [
        {
            category: "日常问候",
            icon: "👋",
            phrases: [
                { linkaitian: "Kun", chinese: "你好", usage: "最基础的问候语（基于语法文件）", level: "基础", audio: true },
                { linkaitian: "Kun ni", chinese: "你好（对你）", usage: "向特定人问候", level: "基础", audio: true },
                { linkaitian: "Kun win", chinese: "大家好", usage: "向多人问候", level: "基础", audio: false },
                { linkaitian: "Salutojon", chinese: "向你问好", usage: "正式问候", level: "中级", audio: false }
            ]
        },
        {
            category: "时间问候",
            icon: "🕐",
            phrases: [
                { linkaitian: "Bonan matenen", chinese: "早上好", usage: "早晨问候", level: "基础", audio: true },
                { linkaitian: "Bonan posttagmezon", chinese: "下午好", usage: "下午问候", level: "基础", audio: false },
                { linkaitian: "Bonan vesperen", chinese: "晚上好", usage: "傍晚问候", level: "基础", audio: true },
                { linkaitian: "Bonan nokten", chinese: "晚安", usage: "睡前问候", level: "基础", audio: true }
            ]
        },
        {
            category: "告别用语",
            icon: "👋",
            phrases: [
                { linkaitian: "Ĝis revido", chinese: "再见", usage: "通用告别", level: "基础", audio: true },
                { linkaitian: "Ĝis la revido", chinese: "期待再见", usage: "期待下次见面", level: "中级", audio: false },
                { linkaitian: "Adiaux", chinese: "永别了", usage: "正式或长期告别", level: "中级", audio: false },
                { linkaitian: "Ĝis morgaux", chinese: "明天见", usage: "约定明天见面", level: "基础", audio: false }
            ]
        },
        {
            category: "礼貌用语",
            icon: "🙏",
            phrases: [
                { linkaitian: "Dankon", chinese: "谢谢", usage: "表达感谢", level: "基础", audio: true },
                { linkaitian: "Tre dankon", chinese: "非常感谢", usage: "强烈感谢", level: "基础", audio: false },
                { linkaitian: "Pardonen", chinese: "对不起", usage: "道歉用语", level: "基础", audio: true },
                { linkaitian: "Mi bedauxras", chinese: "我很抱歉", usage: "正式道歉", level: "中级", audio: false },
                { linkaitian: "Bonvenon", chinese: "欢迎", usage: "欢迎他人", level: "基础", audio: false },
                { linkaitian: "Ne dankinde", chinese: "不客气", usage: "回应感谢", level: "中级", audio: false }
            ]
        }
    ];
    
    greetingCategories.forEach(categoryData => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'phrase-category-group';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'phrase-category-title';
        categoryTitle.innerHTML = `${categoryData.icon} ${categoryData.category}`;
        categoryDiv.appendChild(categoryTitle);
        
        const phrasesGrid = document.createElement('div');
        phrasesGrid.className = 'phrases-grid';
        
        categoryData.phrases.forEach(phrase => {
            const phraseElement = document.createElement('div');
            phraseElement.className = `phrase-item level-${phrase.level}`;
            phraseElement.innerHTML = `
                <div class="phrase-header">
                    <div class="phrase-linkaitian">${phrase.linkaitian}</div>
                    <div class="phrase-badges">
                        <span class="phrase-level level-${phrase.level}">${phrase.level}</span>
                        ${phrase.audio ? '<span class="audio-badge">🔊</span>' : ''}
                    </div>
                </div>
                <div class="phrase-chinese">${phrase.chinese}</div>
                <div class="phrase-usage">${phrase.usage}</div>
            `;
            
            // 添加点击播放音频功能（模拟）
            if (phrase.audio) {
                phraseElement.addEventListener('click', () => {
                    console.log(`播放音频: ${phrase.linkaitian}`);
                    // 这里可以添加真实的音频播放功能
                });
                phraseElement.style.cursor = 'pointer';
            }
            
            phrasesGrid.appendChild(phraseElement);
        });
        
        categoryDiv.appendChild(phrasesGrid);
        greetingPhrases.appendChild(categoryDiv);
    });
}

// 加载基础短语
function loadBasicPhrases() {
    const basicPhrases = document.getElementById('basicPhrases');
    if (!basicPhrases) return;
    
    basicPhrases.innerHTML = '';
    
    const basicCategories = [
        {
            category: "基本交流",
            icon: "💬",
            phrases: [
                { linkaitian: "Wi amas nin", chinese: "我爱你", usage: "表达爱意", level: "基础", grammar: "wi(我) + amas(爱) + nin(你们)" },
                { linkaitian: "Ni estas bela", chinese: "你很美", usage: "赞美他人", level: "基础", grammar: "ni(你) + estas(是) + bela(美丽)" },
                { linkaitian: "Wi ne komprenas", chinese: "我不明白", usage: "表示不理解", level: "基础", grammar: "wi(我) + ne(不) + komprenas(理解)" },
                { linkaitian: "Kiel fartas?", chinese: "你好吗？", usage: "询问近况", level: "基础", grammar: "kiel(如何) + fartas(身体状况)" }
            ]
        },
        {
            category: "请求帮助",
            icon: "🆘",
            phrases: [
                { linkaitian: "Helpu min", chinese: "帮助我", usage: "请求帮助", level: "基础", grammar: "helpu(帮助) + min(我)" },
                { linkaitian: "Ĉu vi povas helpi?", chinese: "你能帮忙吗？", usage: "礼貌请求", level: "中级", grammar: "ĉu(是否) + vi(你) + povas(能够) + helpi(帮助)" },
                { linkaitian: "Mi bezonas helpon", chinese: "我需要帮助", usage: "表达需求", level: "中级", grammar: "mi(我) + bezonas(需要) + helpon(帮助)" },
                { linkaitian: "Bonvolu helpi min", chinese: "请帮助我", usage: "正式请求", level: "高级", grammar: "bonvolu(请) + helpi(帮助) + min(我)" }
            ]
        },
        {
            category: "询问信息",
            icon: "❓",
            phrases: [
                { linkaitian: "Kie estas?", chinese: "在哪里？", usage: "询问位置", level: "基础", grammar: "kie(哪里) + estas(是/在)" },
                { linkaitian: "Kio estas tio?", chinese: "那是什么？", usage: "询问事物", level: "基础", grammar: "kio(什么) + estas(是) + tio(那)" },
                { linkaitian: "Kiam ni iros?", chinese: "我们什么时候去？", usage: "询问时间", level: "中级", grammar: "kiam(何时) + ni(我们) + iros(将去)" },
                { linkaitian: "Kiom kostas?", chinese: "多少钱？", usage: "询问价格", level: "中级", grammar: "kiom(多少) + kostas(花费)" }
            ]
        },
        {
            category: "回应表达",
            icon: "✅",
            phrases: [
                { linkaitian: "Mi estas bone", chinese: "我很好", usage: "回答近况", level: "基础", grammar: "mi(我) + estas(是) + bone(好)" },
                { linkaitian: "Mi ne scias", chinese: "我不知道", usage: "表示不知情", level: "基础", grammar: "mi(我) + ne(不) + scias(知道)" },
                { linkaitian: "Jes, mi komprenas", chinese: "是的，我明白", usage: "确认理解", level: "基础", grammar: "jes(是) + mi(我) + komprenas(理解)" },
                { linkaitian: "Ne, mi ne volas", chinese: "不，我不想要", usage: "拒绝", level: "基础", grammar: "ne(不) + mi(我) + ne(不) + volas(想要)" }
            ]
        }
    ];
    
    basicCategories.forEach(categoryData => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'phrase-category-group';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'phrase-category-title';
        categoryTitle.innerHTML = `${categoryData.icon} ${categoryData.category}`;
        categoryDiv.appendChild(categoryTitle);
        
        const phrasesGrid = document.createElement('div');
        phrasesGrid.className = 'phrases-grid';
        
        categoryData.phrases.forEach(phrase => {
            const phraseElement = document.createElement('div');
            phraseElement.className = `phrase-item level-${phrase.level}`;
            phraseElement.innerHTML = `
                <div class="phrase-header">
                    <div class="phrase-linkaitian">${phrase.linkaitian}</div>
                    <div class="phrase-badges">
                        <span class="phrase-level level-${phrase.level}">${phrase.level}</span>
                    </div>
                </div>
                <div class="phrase-chinese">${phrase.chinese}</div>
                <div class="phrase-usage">${phrase.usage}</div>
                <div class="phrase-grammar">语法：${phrase.grammar}</div>
            `;
            phrasesGrid.appendChild(phraseElement);
        });
        
        categoryDiv.appendChild(phrasesGrid);
        basicPhrases.appendChild(categoryDiv);
    });
}

// 加载时间短语
function loadTimePhrases() {
    const timePhrases = document.getElementById('timePhrases');
    if (!timePhrases) return;
    
    timePhrases.innerHTML = '';
    
    const timeCategories = [
        {
            category: "时间状态",
            icon: "⏰",
            phrases: [
                { linkaitian: "θuu wi mide ŝin", chinese: "过去我看见她", usage: "过去时间（基于语法文件）", level: "中级", grammar: "θuu(过去助词) + wi(我) + mide(看见) + ŝin(她们)" },
                { linkaitian: "Zïli wi labore", chinese: "现在我在工作", usage: "现在时间（基于语法文件）", level: "中级", grammar: "zïli(现在助词) + wi(我) + labore(工作)" },
                { linkaitian: "Joli wi ire", chinese: "将来我会去", usage: "将来时间（基于语法文件）", level: "中级", grammar: "joli(将来助词) + wi(我) + ire(去)" }
            ]
        },
        {
            category: "星期表达",
            icon: "📅",
            phrases: [
                { linkaitian: "Gezïyōbi'xu wi labore", chinese: "星期一我工作", usage: "星期时间（基于语法文件）", level: "中级", grammar: "gezïyōbi(星期一) + 'xu(时间状语助词) + wi(我) + labore(工作)" },
                { linkaitian: "Kayōbi'xu ni studas", chinese: "星期二你学习", usage: "学习安排", level: "中级", grammar: "kayōbi(星期二) + 'xu + ni(你) + studas(学习)" },
                { linkaitian: "Niĉiyōbi'xu win ripozas", chinese: "星期日我们休息", usage: "休息时间", level: "中级", grammar: "niĉiyōbi(星期日) + 'xu + win(我们) + ripozas(休息)" }
            ]
        },
        {
            category: "月份季节",
            icon: "🌸",
            phrases: [
                { linkaitian: "Êmi'xu pruē venas", chinese: "一月春天来了", usage: "季节变化（基于语法文件）", level: "中级", grammar: "êmi(一月) + 'xu + pruē(春天) + venas(来)" },
                { linkaitian: "Vêmi'xu estas varma", chinese: "六月很温暖", usage: "季节描述", level: "中级", grammar: "vêmi(六月) + 'xu + estas(是) + varma(温暖)" },
                { linkaitian: "Pimi'xu neĝas", chinese: "十二月下雪", usage: "冬季天气", level: "中级", grammar: "pimi(十二月) + 'xu + neĝas(下雪)" }
            ]
        },
        {
            category: "时间副词",
            icon: "⌛",
            phrases: [
                { linkaitian: "Kogomade wi amas", chinese: "自始至终我爱着", usage: "时间副词（基于语法文件）", level: "高级", grammar: "kogomade(自始至终) + wi(我) + amas(爱)" },
                { linkaitian: "Yixiōli ŝi estas bela", chinese: "她总是很美", usage: "持续时间（基于语法文件）", level: "高级", grammar: "yixiōli(总是) + ŝi(她) + estas(是) + bela(美丽)" },
                { linkaitian: "Bioli wi venos", chinese: "我马上就来", usage: "即将发生", level: "中级", grammar: "bioli(即将) + wi(我) + venos(将来)" }
            ]
        }
    ];
    
    timeCategories.forEach(categoryData => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'phrase-category-group';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'phrase-category-title';
        categoryTitle.innerHTML = `${categoryData.icon} ${categoryData.category}`;
        categoryDiv.appendChild(categoryTitle);
        
        const phrasesGrid = document.createElement('div');
        phrasesGrid.className = 'phrases-grid';
        
        categoryData.phrases.forEach(phrase => {
            const phraseElement = document.createElement('div');
            phraseElement.className = `phrase-item level-${phrase.level}`;
            phraseElement.innerHTML = `
                <div class="phrase-header">
                    <div class="phrase-linkaitian">${phrase.linkaitian}</div>
                    <div class="phrase-badges">
                        <span class="phrase-level level-${phrase.level}">${phrase.level}</span>
                    </div>
                </div>
                <div class="phrase-chinese">${phrase.chinese}</div>
                <div class="phrase-usage">${phrase.usage}</div>
                <div class="phrase-grammar">语法：${phrase.grammar}</div>
            `;
            phrasesGrid.appendChild(phraseElement);
        });
        
        categoryDiv.appendChild(phrasesGrid);
        timePhrases.appendChild(categoryDiv);
    });
}

// 加载魔法短语
function loadMagicPhrases() {
    const magicPhrases = document.getElementById('magicPhrases');
    if (!magicPhrases) return;
    
    magicPhrases.innerHTML = '';
    
    const magicCategories = [
        {
            category: "原有词汇",
            icon: "🎆",
            phrases: [
                { linkaitian: "gaŋ-d-yodene", chinese: "说的也是", usage: "原有词汇-语言压缩包（基于语法文件）", level: "高级", grammar: "gaŋ(说) + d(的) + yodene(也是) - 压缩表达", special: true },
                { linkaitian: "seeli-o-komprenas", chinese: "理解的方式", usage: "理解方法的压缩表达", level: "高级", grammar: "seeli(如何) + o(的) + komprenas(理解)", special: true }
            ]
        },
        {
            category: "标准词根运用",
            icon: "✨",
            phrases: [
                { linkaitian: "Šelo'ô brilas", chinese: "钱币闪闪发光", usage: "使用标准词根（基于语法文件）", level: "中级", grammar: "šelo(贝/钱) + 'ô(主语助词) + brilas(闪耀)" },
                { linkaitian: "Pulu'a bela", chinese: "美丽的羽毛", usage: "标准词根形容（基于语法文件）", level: "中级", grammar: "pulu(羽毛) + 'a(定语助词) + bela(美丽)" },
                { linkaitian: "Loŋ'ô flugi", chinese: "龙在飞", usage: "魔法生物（基于语法文件）", level: "中级", grammar: "loŋ(龙) + 'ô(主语助词) + flugi(飞行)" },
                { linkaitian: "Elixir da vivo", chinese: "生命药剂", usage: "魔法物品（基于语法文件）", level: "中级", grammar: "elixir(药剂) + da(的) + vivo(生命)" }
            ]
        },
        {
            category: "集体与存在",
            icon: "🌟",
            phrases: [
                { linkaitian: "Berdo'on flugi", chinese: "鸟群在飞", usage: "集体名词（基于语法文件）", level: "中级", grammar: "berdo(鸟) + 'on(集体复数) + flugi(飞行)" },
                { linkaitian: "Sango'lio ez ruĝa", chinese: "血液是红色的", usage: "存在性状语（基于语法文件）", level: "中级", grammar: "sango(血) + 'lio(事物主语助词) + ez(存在) + ruĝa(红色)" },
                { linkaitian: "Ligno'a alta", chinese: "高大的树木", usage: "自然物描述", level: "基础", grammar: "ligno(木/树) + 'a(定语助词) + alta(高大)" }
            ]
        },
        {
            category: "魔法咒语",
            icon: "🔮",
            phrases: [
                { linkaitian: "Lumo'ô brilas!", chinese: "光芒闪耀！", usage: "召唤光明咒语", level: "高级", grammar: "lumo(光) + 'ô(主语助词) + brilas(闪耀)", special: true },
                { linkaitian: "Ĉuēguaŋ da magia", chinese: "星光魔法", usage: "星光系法术", level: "高级", grammar: "ĉuēguaŋ(星光) + da(的) + magia(魔法)", special: true },
                { linkaitian: "Kolor'on ŝanĝi!", chinese: "变换颜色！", usage: "变色咒语", level: "高级", grammar: "kolor(颜色) + 'on(复数宾语) + ŝanĝi(改变)", special: true },
                { linkaitian: "Formo'ō novi!", chinese: "重塑形态！", usage: "变形法术", level: "高级", grammar: "formo(形状) + 'ō(直接宾语助词) + novi(更新)", special: true }
            ]
        }
    ];
    
    magicCategories.forEach(categoryData => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'phrase-category-group';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'phrase-category-title';
        categoryTitle.innerHTML = `${categoryData.icon} ${categoryData.category}`;
        categoryDiv.appendChild(categoryTitle);
        
        const phrasesGrid = document.createElement('div');
        phrasesGrid.className = 'phrases-grid';
        
        categoryData.phrases.forEach(phrase => {
            const phraseElement = document.createElement('div');
            phraseElement.className = `phrase-item level-${phrase.level} ${phrase.special ? 'special-phrase' : ''}`;
            phraseElement.innerHTML = `
                <div class="phrase-header">
                    <div class="phrase-linkaitian">${phrase.linkaitian}</div>
                    <div class="phrase-badges">
                        <span class="phrase-level level-${phrase.level}">${phrase.level}</span>
                        ${phrase.special ? '<span class="special-badge">✨</span>' : ''}
                    </div>
                </div>
                <div class="phrase-chinese">${phrase.chinese}</div>
                <div class="phrase-usage">${phrase.usage}</div>
                <div class="phrase-grammar">语法：${phrase.grammar}</div>
            `;
            
            // 给特殊短语添加魔法特效
            if (phrase.special) {
                phraseElement.addEventListener('click', () => {
                    addMagicEffect(phraseElement);
                });
                phraseElement.style.cursor = 'pointer';
            }
            
            phrasesGrid.appendChild(phraseElement);
        });
        
        categoryDiv.appendChild(phrasesGrid);
        magicPhrases.appendChild(categoryDiv);
    });
}

// 魔法特效函数
function addMagicEffect(element) {
    element.style.animation = 'magicGlow 1s ease-in-out';
    element.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
    
    setTimeout(() => {
        element.style.animation = '';
        element.style.boxShadow = '';
    }, 1000);
}

// 短语系统扩展功能
class PhraseSystemExtension {
    constructor() {
        this.customCategories = JSON.parse(localStorage.getItem('linkaitiya_custom_phrases') || '[]');
    }
    
    // 添加自定义分类
    addCustomCategory(categoryData) {
        const categoryId = 'custom_' + Date.now();
        const newCategory = {
            id: categoryId,
            category: categoryData.category,
            icon: categoryData.icon || '💬',
            phrases: categoryData.phrases || [],
            createdAt: new Date().toISOString(),
            createdBy: window.authSystem?.currentUser?.username || 'Anonymous'
        };
        
        this.customCategories.push(newCategory);
        this.saveCustomCategories();
        return categoryId;
    }
    
    // 添加短语到分类
    addPhraseToCategory(categoryId, phraseData) {
        const category = this.customCategories.find(cat => cat.id === categoryId);
        if (category) {
            const newPhrase = {
                id: 'phrase_' + Date.now(),
                linkaitian: phraseData.linkaitian,
                chinese: phraseData.chinese,
                usage: phraseData.usage,
                level: phraseData.level || '基础',
                grammar: phraseData.grammar || '',
                audio: phraseData.audio || false,
                special: phraseData.special || false,
                createdAt: new Date().toISOString()
            };
            
            category.phrases.push(newPhrase);
            this.saveCustomCategories();
            return newPhrase.id;
        }
        return null;
    }
    
    // 获取所有分类
    getAllCategories() {
        return this.customCategories;
    }
    
    // 保存到本地存储
    saveCustomCategories() {
        localStorage.setItem('linkaitiya_custom_phrases', JSON.stringify(this.customCategories));
    }
    
    // 删除分类
    deleteCategory(categoryId) {
        this.customCategories = this.customCategories.filter(cat => cat.id !== categoryId);
        this.saveCustomCategories();
    }
    
    // 删除短语
    deletePhrase(categoryId, phraseId) {
        const category = this.customCategories.find(cat => cat.id === categoryId);
        if (category) {
            category.phrases = category.phrases.filter(phrase => phrase.id !== phraseId);
            this.saveCustomCategories();
        }
    }
}

// 初始化短语系统扩展
const phraseExtension = new PhraseSystemExtension();

// 扩展的加载函数 - 加载所有短语分类
function loadAllPhraseCategories() {
    // 加载默认分类
    loadGreetingPhrases();
    loadBasicPhrases();
    loadTimePhrases();
    loadMagicPhrases();
    
    // 加载自定义分类
    loadCustomPhraseCategories();
}

// 加载自定义短语分类
function loadCustomPhraseCategories() {
    const customCategories = phraseExtension.getAllCategories();
    
    customCategories.forEach(categoryData => {
        // 创建自定义分类容器
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'phrase-category';
        categoryContainer.innerHTML = `
            <h3>${categoryData.icon} ${categoryData.category} <span class="custom-badge">自定义</span></h3>
            <div class="phrase-list" id="${categoryData.id}"></div>
        `;
        
        // 添加到对应的容器
        const phraseCategories = document.querySelector('.phrases-categories');
        if (phraseCategories) {
            phraseCategories.appendChild(categoryContainer);
        }
        
        // 加载短语
        loadCustomCategoryPhrases(categoryData);
    });
}

// 加载自定义分类的短语
function loadCustomCategoryPhrases(categoryData) {
    const container = document.getElementById(categoryData.id);
    if (!container) return;
    
    container.innerHTML = '';
    
    const phrasesGrid = document.createElement('div');
    phrasesGrid.className = 'phrases-grid';
    
    categoryData.phrases.forEach(phrase => {
        const phraseElement = document.createElement('div');
        phraseElement.className = `phrase-item level-${phrase.level} ${phrase.special ? 'special-phrase' : ''}`;
        phraseElement.innerHTML = `
            <div class="phrase-header">
                <div class="phrase-linkaitian">${phrase.linkaitian}</div>
                <div class="phrase-badges">
                    <span class="phrase-level level-${phrase.level}">${phrase.level}</span>
                    ${phrase.audio ? '<span class="audio-badge">🔊</span>' : ''}
                    ${phrase.special ? '<span class="special-badge">✨</span>' : ''}
                    <button class="delete-phrase-btn" onclick="deleteCustomPhrase('${categoryData.id}', '${phrase.id}')">×</button>
                </div>
            </div>
            <div class="phrase-chinese">${phrase.chinese}</div>
            <div class="phrase-usage">${phrase.usage}</div>
            ${phrase.grammar ? `<div class="phrase-grammar">语法：${phrase.grammar}</div>` : ''}
            <div class="phrase-meta">创建于: ${new Date(phrase.createdAt).toLocaleDateString()}</div>
        `;
        
        // 添加特殊效果
        if (phrase.special) {
            phraseElement.addEventListener('click', () => {
                addMagicEffect(phraseElement);
            });
            phraseElement.style.cursor = 'pointer';
        }
        
        phrasesGrid.appendChild(phraseElement);
    });
    
    // 添加“添加短语”按钮
    const addPhraseBtn = document.createElement('div');
    addPhraseBtn.className = 'add-phrase-btn';
    addPhraseBtn.innerHTML = `
        <div class="add-phrase-placeholder">
            <div class="add-icon">+</div>
            <div>添加新短语</div>
        </div>
    `;
    addPhraseBtn.addEventListener('click', () => showAddPhraseModal(categoryData.id));
    phrasesGrid.appendChild(addPhraseBtn);
    
    container.appendChild(phrasesGrid);
}

// 显示添加短语模态框
function showAddPhraseModal(categoryId) {
    if (!window.authSystem?.currentUser) {
        showMessage('请先登录后再添加短语！', 'warning');
        return;
    }
    
    const modal = createModal('添加短语', `
        <div class="add-phrase-form">
            <div class="form-group">
                <label for="newPhraseLinkaitian">琳凯蒂亚语 *</label>
                <input type="text" id="newPhraseLinkaitian" placeholder="输入琳凯蒂亚语短语" required>
            </div>
            <div class="form-group">
                <label for="newPhraseChinese">中文释义 *</label>
                <input type="text" id="newPhraseChinese" placeholder="输入中文释义" required>
            </div>
            <div class="form-group">
                <label for="newPhraseUsage">用法说明</label>
                <input type="text" id="newPhraseUsage" placeholder="描述使用场景">
            </div>
            <div class="form-group">
                <label for="newPhraseGrammar">语法结构</label>
                <input type="text" id="newPhraseGrammar" placeholder="详细语法解释">
            </div>
            <div class="form-group">
                <label for="newPhraseLevel">难度等级</label>
                <select id="newPhraseLevel">
                    <option value="基础">基础</option>
                    <option value="中级">中级</option>
                    <option value="高级">高级</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="newPhraseSpecial"> 特殊短语（具有魔法效果）
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal('addPhraseModal')">取消</button>
                <button type="button" class="btn btn-primary" onclick="submitNewPhrase('${categoryId}')"> 添加短语</button>
            </div>
        </div>
    `);
    
    modal.id = 'addPhraseModal';
    document.body.appendChild(modal);
}

// 提交新短语
function submitNewPhrase(categoryId) {
    const linkaitian = document.getElementById('newPhraseLinkaitian').value.trim();
    const chinese = document.getElementById('newPhraseChinese').value.trim();
    const usage = document.getElementById('newPhraseUsage').value.trim();
    const grammar = document.getElementById('newPhraseGrammar').value.trim();
    const level = document.getElementById('newPhraseLevel').value;
    const special = document.getElementById('newPhraseSpecial').checked;
    
    if (!linkaitian || !chinese) {
        showMessage('请填写琳凯蒂亚语和中文释义！', 'error');
        return;
    }
    
    const phraseData = {
        linkaitian,
        chinese,
        usage: usage || '用户自定义短语',
        grammar,
        level,
        special
    };
    
    const phraseId = phraseExtension.addPhraseToCategory(categoryId, phraseData);
    
    if (phraseId) {
        hideModal('addPhraseModal');
        showMessage('短语添加成功！', 'success');
        
        // 重新加载对应分类
        const category = phraseExtension.getAllCategories().find(cat => cat.id === categoryId);
        if (category) {
            loadCustomCategoryPhrases(category);
        }
    } else {
        showMessage('添加失败，请稍后重试。', 'error');
    }
}

// 删除自定义短语
function deleteCustomPhrase(categoryId, phraseId) {
    if (confirm('确定要删除这个短语吗？')) {
        phraseExtension.deletePhrase(categoryId, phraseId);
        
        // 重新加载对应分类
        const category = phraseExtension.getAllCategories().find(cat => cat.id === categoryId);
        if (category) {
            loadCustomCategoryPhrases(category);
        }
        
        showMessage('短语已删除！', 'success');
    }
}

// 显示创建分类模态框
function showCreateCategoryModal() {
    if (!window.authSystem?.currentUser) {
        showMessage('请先登录后再创建分类！', 'warning');
        return;
    }
    
    const modal = createModal('创建短语分类', `
        <div class="create-category-form">
            <div class="form-group">
                <label for="newCategoryName">分类名称 *</label>
                <input type="text" id="newCategoryName" placeholder="例如：旅行用语" required>
            </div>
            <div class="form-group">
                <label for="newCategoryIcon">分类图标</label>
                <input type="text" id="newCategoryIcon" placeholder="例如：✈️" maxlength="2">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal('createCategoryModal')">取消</button>
                <button type="button" class="btn btn-primary" onclick="submitNewCategory()">创建分类</button>
            </div>
        </div>
    `);
    
    modal.id = 'createCategoryModal';
    document.body.appendChild(modal);
}

// 提交新分类
function submitNewCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    const categoryIcon = document.getElementById('newCategoryIcon').value.trim() || '💬';
    
    if (!categoryName) {
        showMessage('请填写分类名称！', 'error');
        return;
    }
    
    const categoryData = {
        category: categoryName,
        icon: categoryIcon,
        phrases: []
    };
    
    const categoryId = phraseExtension.addCustomCategory(categoryData);
    
    if (categoryId) {
        hideModal('createCategoryModal');
        showMessage('分类创建成功！', 'success');
        
        // 重新加载所有分类
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        showMessage('创建失败，请稍后重试。', 'error');
    }
}

// 加载数词系统
function loadNumbers() {
    loadCardinalNumbers();
    loadNumberSuffixes();
    loadMeasureWords();
}

// 加载基数词
function loadCardinalNumbers() {
    const cardinalNumbers = document.getElementById('cardinalNumbers');
    if (!cardinalNumbers) return;
    
    cardinalNumbers.innerHTML = '';
    
    const cardinals = [
        { value: '0', word: 'nu', chinese: '零' },
        { value: '1', word: 'i', chinese: '一' },
        { value: '2', word: 'nim', chinese: '二' },
        { value: '3', word: 'sâm', chinese: '三' },
        { value: '4', word: 'fōl', chinese: '四' },
        { value: '5', word: 'ven', chinese: '五' },
        { value: '6', word: 'lêm', chinese: '六' },
        { value: '7', word: 'qim', chinese: '七' },
        { value: '8', word: 'fa', chinese: '八' },
        { value: '9', word: 'jôl', chinese: '九' },
        { value: '10', word: 'ŝim', chinese: '十' },
        { value: '100', word: 'cen', chinese: '百' },
        { value: '1000', word: 'kio', chinese: '千' },
        { value: '10000', word: 'wan', chinese: '万' },
        { value: '1000000', word: 'mion', chinese: '百万' },
        { value: '100000000', word: 'yom', chinese: '亿' },
        { value: '1000000000000', word: 'ĉuē', chinese: '兆' }
    ];
    
    cardinals.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.className = 'number-item';
        numberElement.innerHTML = `
            <div class="number-value">${number.value}</div>
            <div class="number-word">${number.word}</div>
            <div class="number-chinese">${number.chinese}</div>
        `;
        cardinalNumbers.appendChild(numberElement);
    });
}

// 加载数词词缀
function loadNumberSuffixes() {
    const numberSuffixes = document.getElementById('numberSuffixes');
    if (!numberSuffixes) return;
    
    numberSuffixes.innerHTML = '';
    
    const suffixes = [
        { name: 'fu-', meaning: '负数词：负几', example: 'fusâm = 负三' },
        { name: 'ẑeŋ-', meaning: '正数词：正几', example: 'ẑeŋven = 正五' },
        { name: 'di-', meaning: '序数词：第几', example: 'dilêm = 第六' },
        { name: '-bām', meaning: '倍数词：几倍', example: 'nimbām = 两倍' },
        { name: 'haŋ-', meaning: '概数词：约几', example: 'haŋkio = 约千' },
        { name: 'do', meaning: '小数词：几点几', example: 'i do nim = 1.2' },
        { name: 'ape', meaning: '分数词：几分之几', example: 'sâm ape fōl = 四分之三' },
        { name: 'cen ape', meaning: '百分数', example: 'cen ape i = 1%' }
    ];
    
    suffixes.forEach(suffix => {
        const suffixElement = document.createElement('div');
        suffixElement.className = 'suffix-item';
        suffixElement.innerHTML = `
            <div class="suffix-name">${suffix.name}</div>
            <div class="suffix-meaning">${suffix.meaning}</div>
            <div class="suffix-example">${suffix.example}</div>
        `;
        numberSuffixes.appendChild(suffixElement);
    });
}

// 加载量名词
function loadMeasureWords() {
    const measureWords = document.getElementById('measureWords');
    if (!measureWords) return;
    
    measureWords.innerHTML = '';
    
    const measures = [
        { name: 'tufo', meaning: '束、丛、簇、绺', example: 'tufo da floroj = 一束花' },
        { name: 'peco', meaning: '片、块、件', example: 'peco da pano = 一片面包' },
        { name: 'foyo', meaning: '次、回、趟', example: 'foyo da vizito = 一次拜访' },
        { name: 'rupo', meaning: '群、批、组', example: 'rupo da berdoj = 一群鸟' },
        { name: 'mit', meaning: '米（距离单位）', example: 'mit da distanco = 一米距离' },
        { name: 'ger', meaning: '克（重量单位）', example: 'ger da oro = 一克黄金' },
        { name: 'liẑo', meaning: '升（容量单位）', example: 'liẑo da akvo = 一升水' }
    ];
    
    measures.forEach(measure => {
        const measureElement = document.createElement('div');
        measureElement.className = 'measure-item';
        measureElement.innerHTML = `
            <div class="measure-name">${measure.name}</div>
            <div class="measure-meaning">${measure.meaning}</div>
            <div class="measure-example">${measure.example}</div>
        `;
        measureWords.appendChild(measureElement);
    });
}

// ================= 添加单词功能 =================

// 处理添加单词按钮点击
function handleAddWord() {
    // 检查用户是否已登录
    if (!window.authSystem || !window.authSystem.currentUser) {
        showMessage('请先登录后再添加单词！', 'warning');
        return;
    }
    
    // 检查用户权限
    if (window.authSystem.hasPermission('write')) {
        // 管理员可以直接添加
        showAddWordModal();
    } else {
        // 普通用户只能提交申请
        showWordRequestModal();
    }
}

// 显示添加单词模态框（管理员）
function showAddWordModal() {
    const modal = createModal('添加新单词', `
        <div class="add-word-form">
            <div class="form-group">
                <label for="newWordLinkaitiya">琳凯蒂亚语单词 *</label>
                <input type="text" id="newWordLinkaitiya" placeholder="输入琳凯蒂亚语单词" required>
            </div>
            <div class="form-group">
                <label for="newWordPronunciation">音标 *</label>
                <input type="text" id="newWordPronunciation" placeholder="[fono'logi]" required>
            </div>
            <div class="form-group">
                <label for="newWordChinese">中文释义 *</label>
                <input type="text" id="newWordChinese" placeholder="输入中文释义" required>
            </div>
            <div class="form-group">
                <label for="newWordType">词性 *</label>
                <select id="newWordType" required>
                    <option value="">选择词性</option>
                    <option value="名">名词</option>
                    <option value="动">动词</option>
                    <option value="形">形容词</option>
                    <option value="副">副词</option>
                    <option value="代">代词</option>
                    <option value="数">数词</option>
                    <option value="连">连词</option>
                    <option value="助">助词</option>
                    <option value="抒">抒情词</option>
                    <option value="声">声叹词</option>
                </select>
            </div>
            <div class="form-group">
                <label for="newWordUsage">用法说明</label>
                <textarea id="newWordUsage" placeholder="描述单词的具体用法和含义" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label for="newWordExamples">例句（每行一个）</label>
                <textarea id="newWordExamples" placeholder="示例：\nword'ô phrase - 例句翻译\nword usage - 用法说明" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="newWordLevel">难度等级</label>
                <select id="newWordLevel">
                    <option value="basic">基础</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal('addWordModal')">取消</button>
                <button type="button" class="btn btn-primary" onclick="submitNewWord()">添加单词</button>
            </div>
        </div>
    `);
    
    modal.id = 'addWordModal';
    document.body.appendChild(modal);
}

// 显示单词申请模态框（普通用户）
function showWordRequestModal() {
    const modal = createModal('申请添加单词', `
        <div class="word-request-form">
            <div class="request-notice">
                <div class="notice-icon">📝</div>
                <div class="notice-text">
                    <h4>单词添加申请</h4>
                    <p>您可以向管理员申请添加新单词，我们会尽快审核您的建议。</p>
                </div>
            </div>
            
            <div class="form-group">
                <label for="requestWordLinkaitiya">琳凯蒂亚语单词 *</label>
                <input type="text" id="requestWordLinkaitiya" placeholder="输入建议添加的琳凯蒂亚语单词" required>
            </div>
            <div class="form-group">
                <label for="requestWordChinese">中文释义 *</label>
                <input type="text" id="requestWordChinese" placeholder="输入中文释义" required>
            </div>
            <div class="form-group">
                <label for="requestWordType">词性</label>
                <select id="requestWordType">
                    <option value="">选择词性（可选）</option>
                    <option value="名">名词</option>
                    <option value="动">动词</option>
                    <option value="形">形容词</option>
                    <option value="副">副词</option>
                    <option value="代">代词</option>
                    <option value="数">数词</option>
                    <option value="连">连词</option>
                    <option value="助">助词</option>
                    <option value="抒">抒情词</option>
                    <option value="声">声叹词</option>
                </select>
            </div>
            <div class="form-group">
                <label for="requestWordReason">申请理由</label>
                <textarea id="requestWordReason" placeholder="请简述为什么需要添加这个单词，以及它的用法场景" rows="3"></textarea>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="hideModal('wordRequestModal')">取消</button>
                <button type="button" class="btn btn-primary" onclick="submitWordRequest()">提交申请</button>
            </div>
        </div>
    `);
    
    modal.id = 'wordRequestModal';
    document.body.appendChild(modal);
}

// 创建模态框通用函数
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: linear-gradient(135deg, #1a237e, #3f51b5);
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        ">
            <div class="modal-header" style="
                background: linear-gradient(45deg, #ffd700, #00bcd4);
                padding: 15px 20px;
                border-radius: 15px 15px 0 0;
                color: #1a237e;
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0; font-size: 1.2rem;">${title}</h3>
                <button onclick="hideModal('${modal.id}')" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #1a237e;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px; color: white;">
                ${content}
            </div>
        </div>
    `;
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal.id);
        }
    });
    
    return modal;
}

// 提交新单词（管理员）
async function submitNewWord() {
    const linkaitiya = document.getElementById('newWordLinkaitiya').value.trim();
    const pronunciation = document.getElementById('newWordPronunciation').value.trim();
    const chinese = document.getElementById('newWordChinese').value.trim();
    const type = document.getElementById('newWordType').value;
    const usage = document.getElementById('newWordUsage').value.trim();
    const examples = document.getElementById('newWordExamples').value.trim();
    const level = document.getElementById('newWordLevel').value;
    
    // 验证必填字段
    if (!linkaitiya || !pronunciation || !chinese || !type) {
        showMessage('请填写所有必填字段！', 'error');
        return;
    }
    
    try {
        // 准备词汇数据
        const wordData = {
            word: linkaitiya,
            pronunciation: pronunciation,
            meaning: chinese,
            type: type,
            definition: usage || `${type}词，表示${chinese}`,
            examples: examples ? examples.split('\n').filter(ex => ex.trim()) : [],
            level: level,
            usage: usage || `常用${type}词`,
            tags: [type, level]
        };
        
        // 添加到内容管理系统
        const result = window.contentManager.addVocabulary(wordData);
        
        if (result.success) {
            hideModal('addWordModal');
            showMessage('单词添加成功！', 'success');
            
            // 刷新词汇列表和统计
            loadStandardWords();
            updateWordCount();
            
            // 如果当前有筛选或搜索，重新应用
            if (currentFilter !== 'all') {
                filterWordsByLetter(currentFilter);
            }
        } else {
            showMessage('添加失败：' + result.message, 'error');
        }
    } catch (error) {
        console.error('添加单词错误:', error);
        showMessage('添加失败：' + error.message, 'error');
    }
}

// 提交单词申请（普通用户）
function submitWordRequest() {
    const linkaitiya = document.getElementById('requestWordLinkaitiya').value.trim();
    const chinese = document.getElementById('requestWordChinese').value.trim();
    const type = document.getElementById('requestWordType').value;
    const reason = document.getElementById('requestWordReason').value.trim();
    
    // 验证必填字段
    if (!linkaitiya || !chinese) {
        showMessage('请填写单词和中文释义！', 'error');
        return;
    }
    
    try {
        // 获取现有申请列表
        let requests = JSON.parse(localStorage.getItem('linkaitiya_word_requests') || '[]');
        
        // 创建新申请
        const newRequest = {
            id: 'request_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            linkaitiya: linkaitiya,
            chinese: chinese,
            type: type,
            reason: reason,
            requestedBy: window.authSystem.currentUser.id,
            requestedByName: window.authSystem.currentUser.username,
            requestedAt: new Date().toISOString(),
            status: 'pending' // pending, approved, rejected
        };
        
        requests.push(newRequest);
        localStorage.setItem('linkaitiya_word_requests', JSON.stringify(requests));
        
        hideModal('wordRequestModal');
        showMessage('申请已提交！管理员会尽快审核您的建议。', 'success');
        
    } catch (error) {
        console.error('提交申请错误:', error);
        showMessage('提交失败，请稍后重试。', 'error');
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-toast';
    
    const colors = {
        success: { bg: '#4caf50', icon: '✅' },
        error: { bg: '#f44336', icon: '❌' },
        warning: { bg: '#ff9800', icon: '⚠️' },
        info: { bg: '#2196f3', icon: 'ℹ️' }
    };
    
    const color = colors[type] || colors.info;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${color.bg};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        font-weight: 500;
        max-width: 350px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease-out;
    `;
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 16px;">${color.icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // 3秒后自动消失
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// 隐藏模态框函数（通用）
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
    
    // 同时移除其他可能的模态框
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(m => m.remove());
}

// 添加CSS动画样式
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #ffd700;
        font-weight: 500;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 5px;
        color: white;
        font-size: 14px;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: #ffd700;
        box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
    }
    
    .form-group input::placeholder,
    .form-group textarea::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 215, 0, 0.3);
    }
    
    .request-notice {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .notice-icon {
        font-size: 24px;
        color: #ffd700;
    }
    
    .notice-text h4 {
        margin: 0 0 5px 0;
        color: #ffd700;
        font-size: 16px;
    }
    
    .notice-text p {
        margin: 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        line-height: 1.4;
    }
`;
document.head.appendChild(additionalStyles);