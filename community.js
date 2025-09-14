// 社区页面功能脚本 - 真实用户交互版本

// 创建兼容层解决 communityData 未定义问题
// 立即初始化防止任何引用错误
let communityData = {
    users: [],
    posts: [],
    studyGroups: [],
    currentUser: null
};

// 创建示例帖子数据
function createSamplePosts() {
    return [
        {
            id: 'post_sample_001',
            title: '🌟 欢迎来到琳凯蒂亚语社区！',
            content: '大家好！欢迎来到琳凯蒂亚语社区。这里是所有爱好者交流学习这门美丽语言的地方。希望大家能多多交流，共同进步！',
            author: {
                id: 'admin',
                username: '管理员',
                displayName: '光线传说管理员',
                avatar: '🎆'
            },
            category: 'announcement',
            timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3天前
            views: 156,
            likes: ['user1', 'user2', 'user3'],
            replyCount: 8,
            tags: ['欢迎', '社区', '公告'],
            isPinned: true,
            status: 'active'
        },
        {
            id: 'post_sample_002',
            title: '📚 琳凯蒂亚语初学者求助！',
            content: '我刚开始学习琳凯蒂亚语，对于发音部分有些困惑。有没有经验丰富的小伙伴能给些建议呢？特别是关于音调变化的部分。',
            author: {
                id: 'user1',
                username: '新手小白',
                displayName: '初学者小明',
                avatar: '🌱'
            },
            category: 'grammar',
            timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12小时前
            views: 89,
            likes: ['user2', 'user4'],
            replyCount: 5,
            tags: ['初学者', '发音', '求助'],
            status: 'active'
        },
        {
            id: 'post_sample_003',
            title: '🎵 分享一首琳凯蒂亚语原创歌曲',
            content: '最近尝试用琳凯蒂亚语创作了一首小歌，叫《星光之歌》。虽然还不太成熟，但希望能和大家分享。欢迎大家给出意见和建议！',
            author: {
                id: 'user2',
                username: '音乐爱好者',
                displayName: '月光诗人',
                avatar: '🎶'
            },
            category: 'culture',
            timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6小时前
            views: 67,
            likes: ['user1', 'user3', 'user5'],
            replyCount: 3,
            tags: ['原创', '歌曲', '分享'],
            status: 'active'
        }
    ];
}

// 确保兼容层立即可用
function ensureCompatibilityLayer() {
    try {
        // 从 localStorage 加载数据
        const storedUsers = JSON.parse(localStorage.getItem('communityUsers') || '[]');
        const storedPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const storedCurrentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        communityData.users = storedUsers;
        communityData.posts = storedPosts;
        communityData.currentUser = storedCurrentUser;
        communityData.studyGroups = [];
        
        // 如果没有帖子数据，创建一些示例数据
        if (storedPosts.length === 0) {
            const samplePosts = createSamplePosts();
            communityData.posts = samplePosts;
            localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
            console.log('🎆 已创建示例帖子数据');
        }
        
        console.log('🔧 兼容层已确保初始化:', {
            users: communityData.users.length,
            posts: communityData.posts.length,
            currentUser: !!communityData.currentUser
        });
        
        return true;
    } catch (error) {
        console.error('兼容层初始化失败:', error);
        // 如果失败，至少确保对象存在
        communityData = {
            users: [],
            posts: createSamplePosts(),
            studyGroups: [],
            currentUser: null
        };
        return false;
    }
}

// 立即执行一次确保
ensureCompatibilityLayer();

// 初始化兼容层（向后兼容）
function initCompatibilityLayer() {
    return ensureCompatibilityLayer();
}

// ==================== 故事研讨功能 ====================

// 故事研讨数据存储
const storyDiscussions = {
    discussions: [],
    currentCategory: 'all',
    
    // 初始化数据
    init() {
        this.loadFromStorage();
        this.initEventListeners();
        this.loadCategoryContent();
    },
    
    // 从存储加载数据
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('storyDiscussions');
            if (stored) {
                this.discussions = JSON.parse(stored);
            } else {
                this.discussions = this.createSampleDiscussions();
                this.saveToStorage();
            }
        } catch (error) {
            console.error('加载故事讨论数据失败:', error);
            this.discussions = this.createSampleDiscussions();
        }
    },
    
    // 保存到存储
    saveToStorage() {
        try {
            localStorage.setItem('storyDiscussions', JSON.stringify(this.discussions));
        } catch (error) {
            console.error('保存故事讨论数据失败:', error);
        }
    },
    
    // 创建示例讨论数据
    createSampleDiscussions() {
        return [
            {
                id: 'story_disc_001',
                title: '妙可的双重身份认知与成长轨迹',
                content: '从田野突然变身为妙可这一剧情来看，作者在探讨身份认同这一深刻主题。田野作为18岁少年的记忆与妙可6岁女童的身体形成强烈反差，这种冲突不仅是生理上的，更是心理认知层面的。\n\n**身体认知的撕裂：**\n- 130斤健壮少年 → 36斤纤弱女童\n- 粗糙有茧的手 → 白皙纤细的小手\n- 沙哑的嗓音 → 甜糯的童音\n- 篮球运动能力 → 铅笔都握不稳\n\n**心理适应的层次：**\n1. **拒绝期**：否认现实，强调"我是田野"\n2. **愤怒期**：对身体限制的暴躁和不甘\n3. **协商期**：尝试在新身体中保留田野特质\n4. **接受期**：开始融合双重身份，成为"田妙可"\n\n这种设定让我想到了荣格的人格面具理论，田野/妙可需要整合anima（内在女性）和外在表现，最终实现完整的自我...',
                author: { username: '心理分析师', avatar: '🧠', displayName: '星光心理师' },
                category: 'character',
                type: '角色分析',
                timestamp: Date.now() - 1000 * 60 * 60 * 2,
                likes: 25,
                replies: 12,
                tags: ['身份认同', '心理分析', '角色发展', '成长轨迹'],
                isSpoiler: false
            },
            {
                id: 'story_disc_002',
                title: '琳凯蒂亚星球生态系统的科幻设定与文化内涵',
                content: '**奇幻生态的科学基础：**\n\n1. **银蓝色铃铛树**：果实能唱歌，可能是通过共振原理，类似风铃效应\n2. **蜂蜜色星光河**：发光莲花利用生物荧光，透明鱼类可能具有隐形能力\n3. **双月系统**：银月和金月的交叠产生特殊引力场，形成彩虹光环\n4. **流光云**：随时间变色并掉落光球，暗示大气层的能量传导\n\n**文化象征意义：**\n- 银铃树的歌声 = 自然的和谐与生命力\n- 星光河的流淌 = 时间与记忆的延续\n- 双月的交叠 = 对立统一的哲学思想\n- 流光云的变化 = 情感与精神的流动\n\n**与地球对比：**\n地球环境相对单调，缺乏魔法元素，这也解释了为什么光线使者在地球会"沉睡"——环境缺乏能量支撑...',
                author: { username: '科幻爱好者', avatar: '🌌', displayName: '星系探索者' },
                category: 'world',
                type: '世界观讨论',
                timestamp: Date.now() - 1000 * 60 * 60 * 5,
                likes: 34,
                replies: 18,
                tags: ['世界观', '生态设定', '科幻元素', '文化象征'],
                isSpoiler: false
            },
            {
                id: 'story_disc_003',
                title: '云雨时空背叛的深层动机：权力、嫉妒与命运',
                content: '**⚠️ 本文包含前传篇重要剧透 ⚠️**\n\n重读前传部分，发现云雨和时空的背叛绝非偶然，而是多重因素交织的必然结果：\n\n**心理层面分析：**\n1. **权力欲望**：作为星帝弟弟的儿子，却无法继承王位\n2. **能力自卑**：10岁的他们vs5岁就展现强大能力的妙可\n3. **关注匮乏**：星母极度宠爱妙可，他们缺乏同等关爱\n\n**行为模式解读：**\n- 深夜练习破坏魔法 = 对现有秩序的不满\n- 攻击星法塔 = 对权力中心的挑战\n- 逃离时的回望 = 内心仍有复杂情感\n\n**"天命"的预言暗示：**\n时空能预知18年后的"天命"，说明：\n1. 他们的叛逃是宿命的一部分\n2. 星帝可能早已知晓但选择让其发生\n3. 这场劫难是光线使者成长的必要考验\n\n从某种角度看，云雨时空是"必要的恶"，推动着主角们的成长...',
                author: { username: '情节分析专家', avatar: '🕵️', displayName: '剧情侦探' },
                category: 'plot',
                type: '剧情分析',
                timestamp: Date.now() - 1000 * 60 * 60 * 24,
                likes: 42,
                replies: 27,
                tags: ['反派动机', '剧情伏笔', '角色心理', '预言解读'],
                isSpoiler: true
            },
            {
                id: 'story_disc_004',
                title: '丽丽觉醒场景的象征意义与视觉呈现',
                content: '第四集中丽丽的觉醒场景是整个故事的高光时刻之一，充满了丰富的象征意义：\n\n**觉醒的触发条件：**\n1. **生死危机**：只有在极致的危险中，潜藏的力量才会爆发\n2. **守护意志**：不是为了自己，而是为了保护妙可的决心\n3. **记忆共鸣**："会唱歌的银色树林"触发了深层记忆\n\n**视觉效果的深层含义：**\n- **冰蓝色星光**：代表理性、冷静与纯净\n- **急速旋转的星环**：象征时间的轮回与宿命\n- **星辰符文**：古老智慧与力量的传承\n- **星尘裁决**：正义对邪恶的审判\n\n**雨中觉醒的环境设定：**\n雨天→阴霾压抑，象征困境\n星光破雨→希望穿透绝望\n冰蓝光芒→理性战胜情感\n\n**与妙可对比：**\n- 妙可：金色/温暖/太阳→感性、温情\n- 丽丽：蓝色/冷静/星辰→理性、坚毅\n两人形成完美的阴阳互补...',
                author: { username: '视觉分析师', avatar: '🎨', displayName: '光影追寻者' },
                category: 'plot',
                type: '剧情解读',
                timestamp: Date.now() - 1000 * 60 * 60 * 8,
                likes: 29,
                replies: 15,
                tags: ['觉醒场景', '象征意义', '视觉效果', '角色对比'],
                isSpoiler: false
            },
            {
                id: 'story_disc_005',
                title: '梦云被控制的心理操控技巧分析',
                content: '第五、六集中时空对梦云的控制堪称教科书级的心理操控案例：\n\n**第一阶段：环境营造**\n- 异常大雨→创造压抑氛围\n- 抑郁孢子→放大负面情绪\n- 梦境入侵→模糊现实边界\n\n**第二阶段：需求识别**\n- 精准捕捉梦云的痛点（证明价值、逃离家庭）\n- "日结200元"击中经济需求\n- "轻松优雅"满足虚荣心理\n\n**第三阶段：信任建立**\n- 预付现金→物质诱惑\n- 温和关怀→情感依赖\n- "你很特别"→自我价值认同\n\n**第四阶段：能力展示**\n- 咖啡"魔术"→神秘感\n- 引导"觉醒"→掌控感\n- 超能力视频→虚荣心爆棚\n\n**第五阶段：深度控制**\n- 幻象公司→完整的虚假世界\n- 黑暗能量注入→生理层面的控制\n- 任务植入→行为指令\n\n这种渐进式的控制比强制洗脑更可怕，因为受害者会误以为是自己的选择...',
                author: { username: '犯罪心理学者', avatar: '🔬', displayName: '行为分析师' },
                category: 'theory',
                type: '理论探讨',
                timestamp: Date.now() - 1000 * 60 * 60 * 12,
                likes: 38,
                replies: 23,
                tags: ['心理操控', '行为分析', '梦云', '反派手段'],
                isSpoiler: true
            },
            {
                id: 'story_disc_006',
                title: '光线传奇中的成长主题：从逃避到承担',
                content: '纵观前六集的剧情发展，"成长"是贯穿始终的核心主题：\n\n**妙可/田野的成长轨迹：**\n第一集：震惊否认 →"我是田野！"\n第二集：被迫适应 → 体验女孩生活\n第三集：自我证明 → 墨指刻答案\n第四集：承担责任 → 主动寻找丽丽\n\n**丽丽的成长轨迹：**\n- 从困惑排斥到记忆复苏\n- 从普通学生到光线使者\n- 从被保护者到守护者\n\n**成长的代价：**\n1. **身份认同的痛苦**：田野失去原有身份\n2. **责任的重负**：从个人生活到拯救世界\n3. **友情的考验**：面对被控制的梦云\n\n**成长的催化剂：**\n- 危机事件推动觉醒\n- 他人需要激发保护欲\n- 命运使命赋予意义\n\n**现实意义：**\n每个人都会经历身份转换的困惑期，关键是如何在变化中找到真正的自我，并承担相应的责任。妙可的成长历程就是一个隐喻，告诉我们成长不是失去，而是获得更完整的自己...',
                author: { username: '文学评论家', avatar: '📖', displayName: '主题研究者' },
                category: 'theory',
                type: '主题探讨',
                timestamp: Date.now() - 1000 * 60 * 60 * 18,
                likes: 33,
                replies: 19,
                tags: ['成长主题', '身份认同', '责任承担', '现实意义'],
                isSpoiler: false
            }
        ];
    },
    
    // 添加新讨论
    addDiscussion(discussionData) {
        const newDiscussion = {
            id: 'story_disc_' + Date.now(),
            ...discussionData,
            timestamp: Date.now(),
            likes: 0,
            replies: 0,
            author: communityData.currentUser || { username: '匿名', avatar: '👤' }
        };
        
        this.discussions.unshift(newDiscussion);
        this.saveToStorage();
        return newDiscussion;
    },
    
    // 获取筛选后的讨论
    getFilteredDiscussions(category = 'all') {
        if (category === 'all') {
            return this.discussions;
        }
        return this.discussions.filter(d => d.category === category);
    }
};

// 初始化故事研讨功能
function initStoryDiscussions() {
    console.log('🎭 初始化故事研讨功能...');
    
    // 检查DOM元素是否存在
    const storiesSection = document.querySelector('#stories');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    console.log('🔍 检查DOM元素:', {
        storiesSection: !!storiesSection,
        categoryButtons: categoryBtns.length,
        buttonsData: Array.from(categoryBtns).map(btn => ({
            category: btn.dataset.category,
            hasEventBound: btn.hasAttribute('data-event-bound')
        }))
    });
    
    if (!storiesSection) {
        console.warn('⚠️ 未找到故事研讨区域');
        return;
    }
    
    // 初始化数据
    storyDiscussions.init();
    
    // 绑定事件监听器
    initStoryEventListeners();
    
    // 加载默认内容
    loadStoryDiscussions('all');
    
    console.log('✅ 故事研讨功能初始化完成');
}

// 初始化故事研讨事件监听器
function initStoryEventListeners() {
    // 分类筛选按钮
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        // 检查是否已经绑定过事件
        if (!btn.hasAttribute('data-event-bound')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                console.log('💆 点击分类按钮:', category);
                switchStoryCategory(category);
            });
            // 标记为已绑定
            btn.setAttribute('data-event-bound', 'true');
        }
    });
    
    // 创建讨论按钮
    const createBtn = document.getElementById('createStoryDiscussionBtn');
    if (createBtn && !createBtn.hasAttribute('data-event-bound')) {
        createBtn.addEventListener('click', function() {
            if (isUserLoggedIn()) {
                showStoryDiscussionModal();
            } else {
                showLoginPrompt();
            }
        });
        createBtn.setAttribute('data-event-bound', 'true');
    }
    
    // 创作灵感按钮
    bindInspirationButtons();
    
    console.log('✅ 故事研讨事件监听器已绑定', {
        categoryButtons: categoryBtns.length,
        createButton: !!createBtn
    });
}

// 绑定灵感按钮
function bindInspirationButtons() {
    const inspirationCards = document.querySelectorAll('.inspiration-card');
    inspirationCards.forEach(card => {
        const button = card.querySelector('button');
        if (button && button.onclick) {
            // 已经有点击事件，跳过
            return;
        }
        
        if (button) {
            const title = card.querySelector('h5')?.textContent || card.querySelector('h4')?.textContent || '';
            const category = card.className.includes('character') ? 'character' :
                           card.className.includes('world') ? 'world' :
                           card.className.includes('plot') ? 'plot' :
                           card.className.includes('creative') ? 'creative' :
                           card.className.includes('theory') ? 'theory' : 'general';
            
            button.addEventListener('click', function() {
                handleAdvancedInspiration(title, category);
            });
        }
    });
}

// 切换故事分类
function switchStoryCategory(category) {
    console.log('🔄 切换到分类:', category);
    
    // 更新按钮状态
    const categoryBtns = document.querySelectorAll('.category-btn');
    console.log('💆 找到的分类按钮数量:', categoryBtns.length);
    
    categoryBtns.forEach(btn => {
        const isActive = btn.dataset.category === category;
        btn.classList.toggle('active', isActive);
        if (isActive) {
            console.log('✅ 激活按钮:', btn.dataset.category);
        }
    });
    
    // 加载对应分类内容
    loadStoryDiscussions(category);
    storyDiscussions.currentCategory = category;
    
    console.log('🎆 分类切换完成:', category);
}

// 切换故事章节
function switchStoryChapter(chapter) {
    // 更新按钮状态
    const chapterTabs = document.querySelectorAll('.chapter-tab');
    chapterTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.chapter === chapter);
    });
    
    // 加载对应章节内容
    loadStoryDiscussions(chapter);
    storyDiscussions.currentChapter = chapter;
    
    console.log('🔄 切换到章节:', chapter);
}

// 在社区页面标签切换中添加故事研讨
function loadTabContent(tabName) {
    console.log('📦 加载标签内容:', tabName);
    
    switch (tabName) {
        case 'discussions':
            loadDiscussions('all');
            break;
        case 'learning':
            loadLearningContent();
            break;
        case 'translation':
            loadTranslationContent();
            break;
        case 'events':
            loadEventsContent();
            break;
        case 'resources':
            loadResourcesContent();
            break;
        case 'stories':
            // 初始化故事研讨功能
            console.log('🎆 初始化故事研讨标签...');
            setTimeout(() => {
                initStoryDiscussions();
            }, 100);
            break;
    }
}

// 工具函数
function isUserLoggedIn() {
    return !!(communityData.currentUser || 
             (window.authSystem && window.authSystem.currentUser) ||
             (window.communitySystem && window.communitySystem.currentUser));
}

function isUserAdmin() {
    const user = communityData.currentUser || 
                (window.authSystem && window.authSystem.currentUser) ||
                (window.communitySystem && window.communitySystem.currentUser);
    return user && (user.role === 'admin' || user.username === 'admin');
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return '未知时间';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return Math.floor(diff / minute) + '分钟前';
    } else if (diff < day) {
        return Math.floor(diff / hour) + '小时前';
    } else if (diff < 7 * day) {
        return Math.floor(diff / day) + '天前';
    } else {
        return new Date(timestamp).toLocaleDateString();
    }
}

// 在文档加载完成时也初始化故事研讨
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // 延迟一些时间确保其他系统初始化完成
        setTimeout(() => {
            // 检查故事研讨标签是否激活或者是否需要初始化
            const storiesSection = document.querySelector('#stories.community-section');
            if (storiesSection) {
                // 无论是否激活都初始化，确保事件监听器被绑定
                initStoryDiscussions();
            }
        }, 500);
    });
} else {
    // 如果文档已经加载完成
    setTimeout(() => {
        const storiesSection = document.querySelector('#stories.community-section');
        if (storiesSection) {
            // 无论是否激活都初始化，确保事件监听器被绑定
            initStoryDiscussions();
        }
    }, 500);
}

// 加载故事讨论列表
function loadStoryDiscussions(category = 'all') {
    const discussionsList = document.getElementById('storyDiscussionsList');
    if (!discussionsList) {
        console.warn('未找到故事讨论列表元素');
        return;
    }
    
    const discussions = storyDiscussions.getFilteredDiscussions(category);
    
    if (discussions.length === 0) {
        discussionsList.innerHTML = `
            <div class="no-discussions">
                <div class="no-content-icon">📚</div>
                <h4>暂无相关讨论</h4>
                <p>成为第一个发起${getCategoryDisplayName(category)}讨论的人吧！</p>
                <button class="btn btn-primary" onclick="showStoryDiscussionModal()">
                    发起讨论
                </button>
            </div>
        `;
        return;
    }
    
    discussionsList.innerHTML = discussions.map(discussion => 
        createStoryDiscussionElement(discussion)
    ).join('');
    
    console.log(`✅ 已加载${category}分类的${discussions.length}个讨论`);
}

// 创建故事讨论元素
function createStoryDiscussionElement(discussion) {
    const timeDisplay = formatTimeAgo(discussion.timestamp);
    const spoilerClass = discussion.isSpoiler ? 'spoiler-warning' : '';
    
    return `
        <div class="story-discussion-item ${spoilerClass}">
            ${discussion.isSpoiler ? '<div class="spoiler-badge">⚠️ 剧透</div>' : ''}
            
            <div class="discussion-header">
                <div class="discussion-author">
                    <div class="author-avatar">${discussion.author.avatar}</div>
                    <div class="author-info">
                        <div class="author-name">${discussion.author.displayName || discussion.author.username}</div>
                        <div class="discussion-meta">
                            <span class="discussion-time">${timeDisplay}</span>
                            <span class="discussion-type">${discussion.type}</span>
                            <span class="discussion-category">${getCategoryDisplayName(discussion.category)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="discussion-content">
                <h4 class="discussion-title">
                    <a href="#" onclick="viewStoryDiscussion('${discussion.id}')">
                        ${discussion.title}
                    </a>
                </h4>
                <p class="discussion-excerpt">
                    ${discussion.isSpoiler ? '点击查看内容（包含剧透）' : truncateText(discussion.content, 120)}
                </p>
            </div>
            
            <div class="discussion-footer">
                <div class="discussion-stats">
                    <span class="stat-item">
                        <span class="icon">❤️</span>
                        <span class="count">${discussion.likes}</span>
                    </span>
                    <span class="stat-item">
                        <span class="icon">💬</span>
                        <span class="count">${discussion.replies}</span>
                    </span>
                </div>
                
                <div class="discussion-tags">
                    ${discussion.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// 显示故事讨论模态框
function showStoryDiscussionModal() {
    const modal = createModal('storyDiscussionModal', '发起故事讨论', `
        <form id="storyDiscussionForm" class="story-discussion-form">
            <div class="form-group">
                <label for="discussionTitle">讨论标题 *</label>
                <input type="text" id="discussionTitle" name="title" required 
                       placeholder="请输入讨论标题，如：妙可的性格发展分析">
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="discussionCategory">讨论分类 *</label>
                    <select id="discussionCategory" name="category" required>
                        <option value="character">角色分析</option>
                        <option value="plot">剧情解读</option>
                        <option value="world">世界观讨论</option>
                        <option value="theory">理论探讨</option>
                        <option value="creative">创作分享</option>
                        <option value="general">综合讨论</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="discussionType">讨论类型 *</label>
                    <select id="discussionType" name="type" required>
                        <option value="角色分析">角色分析</option>
                        <option value="剧情分析">剧情分析</option>
                        <option value="剧情解读">剧情解读</option>
                        <option value="世界观讨论">世界观讨论</option>
                        <option value="情节预测">情节预测</option>
                        <option value="细节考察">细节考察</option>
                        <option value="主题探讨">主题探讨</option>
                        <option value="理论研究">理论研究</option>
                        <option value="创作分享">创作分享</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label for="discussionContent">讨论内容 *</label>
                <textarea id="discussionContent" name="content" required rows="8" 
                          placeholder="详细描述你的观点、分析或疑问...\n\n例如：\n- 分析角色的心理变化\n- 探讨情节的深层含义\n- 预测后续剧情发展\n- 讨论世界观设定"></textarea>
            </div>
            
            <div class="form-group">
                <label for="discussionTags">标签</label>
                <input type="text" id="discussionTags" name="tags" 
                       placeholder="用逗号分隔，如：角色发展,心理分析,妙可">
            </div>
            
            <div class="form-group">
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="isSpoiler" name="isSpoiler">
                        <span class="checkmark"></span>
                        包含剧透内容
                    </label>
                    <small class="form-hint">如果讨论涉及重要剧情透露，请勾选此项</small>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-outline" onclick="closeModal('storyDiscussionModal')">
                    取消
                </button>
                <button type="submit" class="btn btn-primary">
                    <span class="icon">📚</span>
                    发起讨论
                </button>
            </div>
        </form>
    `, 'medium');
    
    document.body.appendChild(modal);
    showModal('storyDiscussionModal');
    
    // 绑定表单提交事件
    const form = document.getElementById('storyDiscussionForm');
    if (form) {
        form.addEventListener('submit', handleStoryDiscussionSubmit);
    }
}

// 处理故事讨论表单提交
function handleStoryDiscussionSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const discussionData = {
        title: formData.get('title')?.trim(),
        content: formData.get('content')?.trim(),
        category: formData.get('category'),
        type: formData.get('type'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        isSpoiler: formData.get('isSpoiler') === 'on'
    };
    
    // 验证数据
    if (!discussionData.title || !discussionData.content) {
        showNotification('请填写完整的讨论信息', 'error');
        return;
    }
    
    try {
        // 添加讨论
        const newDiscussion = storyDiscussions.addDiscussion(discussionData);
        
        // 关闭模态框
        closeModal('storyDiscussionModal');
        
        // 刷新讨论列表
        loadStoryDiscussions(storyDiscussions.currentCategory);
        
        // 显示成功消息
        showNotification('讨论发起成功！', 'success');
        
        console.log('新故事讨论已创建:', newDiscussion);
        
    } catch (error) {
        console.error('创建故事讨论失败:', error);
        showNotification('发起讨论失败，请重试', 'error');
    }
}

// 获取分类显示名称
function getCategoryDisplayName(category) {
    const categoryNames = {
        'all': '全部',
        'character': '角色分析',
        'plot': '剧情解读',
        'world': '世界观讨论',
        'theory': '理论探讨',
        'creative': '创作分享',
        'general': '综合讨论'
    };
    return categoryNames[category] || category;
}

// 获取章节显示名称（保留兼容）
function getChapterDisplayName(chapter) {
    const chapterNames = {
        'all': '全部',
        'prequel': '前传篇',
        'chapter1': '第一集',
        'chapter2': '第二集', 
        'chapter3': '第三集',
        'chapter4': '第四集',
        'chapter5': '第五集',
        'chapter6': '第六集',
        'characters': '角色分析',
        'worldbuilding': '世界观'
    };
    return chapterNames[chapter] || chapter;
}

// 查看故事讨论详情
function viewStoryDiscussion(discussionId) {
    const discussion = storyDiscussions.discussions.find(d => d.id === discussionId);
    if (!discussion) {
        showNotification('讨论不存在', 'error');
        return;
    }
    
    // 显示详情模态框
    showStoryDiscussionDetail(discussion);
}

// 显示故事讨论详情
function showStoryDiscussionDetail(discussion) {
    const modal = createModal('storyDiscussionDetailModal', discussion.title, `
        <div class="story-discussion-detail">
            ${discussion.isSpoiler ? '<div class="spoiler-warning-banner">⚠️ 本讨论包含剧透内容 ⚠️</div>' : ''}
            
            <div class="discussion-detail-header">
                <div class="author-info">
                    <div class="author-avatar">${discussion.author.avatar}</div>
                    <div class="author-details">
                        <div class="author-name">${discussion.author.displayName || discussion.author.username}</div>
                        <div class="discussion-meta">
                            <span class="discussion-time">${formatTimeAgo(discussion.timestamp)}</span>
                            <span class="discussion-type">${discussion.type}</span>
                            <span class="discussion-category">${getCategoryDisplayName(discussion.category)}</span>
                        </div>
                    </div>
                </div>
                <div class="discussion-stats">
                    <span class="stat-item">❤️ ${discussion.likes}</span>
                    <span class="stat-item">💬 ${discussion.replies}</span>
                </div>
            </div>
            
            <div class="discussion-detail-content">
                ${discussion.content.replace(/\n/g, '<br>')}
            </div>
            
            <div class="discussion-detail-tags">
                ${discussion.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="discussion-detail-actions">
                <button class="btn btn-outline" onclick="toggleStoryDiscussionLike('${discussion.id}')">
                    <span class="icon">❤️</span> ${discussion.likes} 点赞
                </button>
                <button class="btn btn-primary" onclick="showStoryReplyForm('${discussion.id}')">
                    <span class="icon">💬</span> 回复
                </button>
                ${isUserAdmin() ? `
                    <button class="btn btn-danger" onclick="deleteStoryDiscussion('${discussion.id}')">
                        删除
                    </button>
                ` : ''}
            </div>
        </div>
    `, 'large');
    
    document.body.appendChild(modal);
    showModal('storyDiscussionDetailModal');
}

// 处理高级创作灵感
function handleAdvancedInspiration(title, category) {
    if (!isUserLoggedIn()) {
        showLoginPrompt();
        return;
    }
    
    // 根据不同类型处理
    switch (category) {
        case 'character':
            handleCharacterAnalysis(title);
            break;
        case 'world':
            handleWorldBuilding(title);
            break;
        case 'plot':
            handlePlotCreation(title);
            break;
        case 'creative':
            handleArtCreation(title);
            break;
        case 'theory':
            handleTheoryDiscussion(title);
            break;
        default:
            showStoryDiscussionModal();
    }
}

// 角色分析处理
function handleCharacterAnalysis(character) {
    const presetData = {
        category: 'character',
        type: '角色分析',
        title: `${character}的深度角色分析`,
        content: `让我们从多个维度来分析${character}这个角色：\n\n1. 心理层面：\n2. 成长轨迹：\n3. 人物关系：\n4. 象征意义：\n\n欢迎大家分享你们的见解！`
    };
    showPresetDiscussionModal(presetData);
}

// 世界构建处理
function handleWorldBuilding(type) {
    const presetData = {
        category: 'world',
        type: '世界观讨论',
        title: `琳凯蒂亚星球${type}创造计划`,
        content: `让我们一起丰富琳凯蒂亚星球的${type}设定：\n\n请考虑以下方面：\n- 外观特征\n- 功能作用\n- 文化意义\n- 与现有世界的关系\n\n发挥你的想象力，创造属于你的奇幻世界！`
    };
    showPresetDiscussionModal(presetData);
}

// 情节创作处理
function handlePlotCreation(type) {
    const presetData = {
        category: 'plot',
        type: '剧情创作',
        title: `${type}情节创作分享`,
        content: `分享你对${type}情节的想法和创作：\n\n可以包含：\n- 故事设定\n- 角色发展\n- 冲突设计\n- 情节转折\n\n让我们一起构建更精彩的光线传奇世界！`
    };
    showPresetDiscussionModal(presetData);
}

// 艺术创作处理
function handleArtCreation(artType) {
    const presetData = {
        category: 'creative',
        type: '艺术创作',
        title: `${artType}作品分享与交流`,
        content: `欢迎分享你的${artType}作品！\n\n分享时请包含：\n- 作品描述\n- 创作灵感\n- 技法说明\n- 希望得到的反馈\n\n让我们一起欣赏和讨论你的创作！`
    };
    showPresetDiscussionModal(presetData);
}

// 理论讨论处理
function handleTheoryDiscussion(theory) {
    const presetData = {
        category: 'theory',
        type: '理论研究',
        title: `从${theory}角度分析光线传奇`,
        content: `让我们从${theory}的角度深入分析光线传奇：\n\n可以探讨的主题：\n- 理论框架应用\n- 深层含义挖掘\n- 跨学科对比\n- 现实意义探讨\n\n欢迎学术性的深度交流！`
    };
    showPresetDiscussionModal(presetData);
}

// 显示预设讨论模态框
function showPresetDiscussionModal(presetData) {
    showStoryDiscussionModal();
    
    setTimeout(() => {
        if (presetData.title) {
            const titleInput = document.getElementById('discussionTitle');
            if (titleInput) titleInput.value = presetData.title;
        }
        if (presetData.content) {
            const contentInput = document.getElementById('discussionContent');
            if (contentInput) contentInput.value = presetData.content;
        }
        if (presetData.type) {
            const typeSelect = document.getElementById('discussionType');
            if (typeSelect) typeSelect.value = presetData.type;
        }
        if (presetData.category) {
            const categorySelect = document.getElementById('discussionCategory');
            if (categorySelect) categorySelect.value = presetData.category;
        }
    }, 100);
}

// 填充缺失的工具函数
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 简单的通知函数（如果不存在）
if (typeof showNotification !== 'function') {
    function showNotification(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#5352ed'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-weight: 500;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// 缺失的工具函数
function updateCommunityStats() {
    const totalUsersEl = document.getElementById('totalUsers');
    const totalPostsEl = document.getElementById('totalPosts');
    const onlineUsersEl = document.getElementById('onlineUsers');
    
    if (totalUsersEl) {
        const totalUsers = (window.communitySystem ? window.communitySystem.users.length : 0) + 
                          (communityData ? communityData.users.length : 0);
        totalUsersEl.textContent = totalUsers;
    }
    
    if (totalPostsEl) {
        const totalPosts = (window.communitySystem ? window.communitySystem.posts.length : 0) + 
                          (communityData ? communityData.posts.length : 0);
        totalPostsEl.textContent = totalPosts;
    }
    
    if (onlineUsersEl) {
        const onlineUsers = Math.floor(Math.random() * 10) + 5; // 模拟在线用户
        onlineUsersEl.textContent = onlineUsers;
    }
}

// 缺失的加载函数
function loadLearningContent() {
    console.log('📚 加载学习交流内容...');
}

function loadTranslationContent() {
    console.log('🔄 加载翻译练习内容...');
}

function loadEventsContent() {
    console.log('🎆 加载星球活动内容...');
}

function loadResourcesContent() {
    console.log('📋 加载资源分享内容...');
}

function loadOnlineUsers() {
    console.log('👥 加载在线用户...');
}

function loadRecentActivity() {
    console.log('🔥 加载最新动态...');
}

function loadMorePosts() {
    console.log('📜 加载更多帖子...');
    showNotification('暂无更多内容', 'info');
}

// 模拟的帖子查看和操作函数
function viewPostDetail(postId) {
    console.log('👁️ 查看帖子详情:', postId);
    
    // 在localStorage中查找帖子
    let post = null;
    
    // 从 communityData 中查找
    if (communityData && communityData.posts) {
        post = communityData.posts.find(p => p.id === postId);
    }
    
    // 从 communitySystem 中查找
    if (!post && window.communitySystem && window.communitySystem.posts) {
        post = window.communitySystem.posts.find(p => p.id === postId);
    }
    
    if (!post) {
        showNotification('帖子不存在', 'error');
        return;
    }
    
    // 增加浏览量
    if (post.views !== undefined) {
        post.views++;
    }
    
    // 显示帖子详情
    const modal = createModal('postDetailModal', post.title, `
        <div class="post-detail">
            <div class="post-meta" style="margin-bottom: 1rem; color: #a0a0a0;">
                <span>👤 ${post.author ? (typeof post.author === 'string' ? post.author : post.author.username || post.author.displayName) : '匿名用户'}</span>
                <span style="margin-left: 1rem;">🕰️ ${post.timeDisplay || getTimeAgo(post.timestamp)}</span>
                <span style="margin-left: 1rem;">👁️ ${post.views || 0} 次查看</span>
            </div>
            <div class="post-content" style="color: #e0e0e0; line-height: 1.6; margin-bottom: 2rem; white-space: pre-wrap;">
                ${post.content}
            </div>
            ${post.tags && post.tags.length > 0 ? `
                <div class="post-tags" style="margin-bottom: 1rem;">
                    ${post.tags.map(tag => `<span class="tag" style="background: rgba(78, 205, 196, 0.2); color: #4ecdc4; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem;">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="post-actions" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; display: flex; gap: 1rem;">
                <button class="btn btn-outline" onclick="likePost('${postId}')">
                    ❤️ ${Array.isArray(post.likes) ? post.likes.length : (post.likes || 0)} 点赞
                </button>
                <button class="btn btn-primary" onclick="replyToPost('${postId}')">
                    💬 回复
                </button>
            </div>
        </div>
    `, 'large');
    
    document.body.appendChild(modal);
    showModal('postDetailModal');
}

function replyToPost(postId) {
    console.log('💬 回复帖子:', postId);
    if (!isUserLoggedIn()) {
        showLoginPrompt();
        return;
    }
    showNotification('回复功能正在开发中...', 'info');
}

function deleteMyPost(postId) {
    console.log('🗑️ 删除帖子:', postId);
    if (!isUserLoggedIn()) {
        showLoginPrompt();
        return;
    }
    
    if (confirm('确定要删除这个帖子吗？')) {
        // 从 communityData 中删除
        if (communityData && communityData.posts) {
            const index = communityData.posts.findIndex(p => p.id === postId);
            if (index !== -1) {
                communityData.posts.splice(index, 1);
                localStorage.setItem('communityPosts', JSON.stringify(communityData.posts));
            }
        }
        
        // 从 communitySystem 中删除
        if (window.communitySystem && window.communitySystem.posts) {
            const post = window.communitySystem.posts.find(p => p.id === postId);
            if (post) {
                post.status = 'deleted';
                window.communitySystem.savePosts();
            }
        }
        
        showNotification('帖子已删除', 'success');
        loadDiscussions('all'); // 刷新列表
    }
}

function likePost(postId) {
    console.log('❤️ 点赞帖子:', postId);
    if (!isUserLoggedIn()) {
        showLoginPrompt();
        return;
    }
    showNotification('点赞成功！', 'success');
}

// 更新认证状态函数
function updateAuthenticationState() {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.getElementById('userInfo');
    
    // 检查各种认证系统
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            const userNameEl = document.getElementById('userName');
            const userAvatarEl = document.getElementById('userAvatar');
            if (userNameEl) userNameEl.textContent = currentUser.username || currentUser.displayName;
            if (userAvatarEl) userAvatarEl.textContent = currentUser.avatar || currentUser.username.charAt(0).toUpperCase();
        }
        
        // 更新 communityData
        communityData.currentUser = currentUser;
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        communityData.currentUser = null;
    }
}

// 立即执行一次确保
ensureCompatibilityLayer();

// 初始化兼容层（向后兼容）
function initCompatibilityLayer() {
    return ensureCompatibilityLayer();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 琳凯蒂亚语社区页面加载...');
    
    // 确保认证系统正确初始化
    if (typeof initializeAuthSystem === 'function') {
        initializeAuthSystem();
        setTimeout(() => {
            updateAuthenticationState();
        }, 100);
    }
    
    // 立即初始化兼容层
    ensureCompatibilityLayer();
    
    // 立即初始化事件监听器
    initEventListeners();
    
    // 等待社区系统初始化完成
    setTimeout(() => {
        try {
            // 初始化社区界面
            initCommunityInterface();
            
            // 加载初始内容
            loadInitialContent();
            
            // 更新统计数据
            updateCommunityStats();
            
            console.log('✅ 社区界面初始化完成');
        } catch (error) {
            console.error('❌ 社区系统初始化错误:', error);
            
            // 即使出错也要加载基本内容
            loadInitialContent();
        }
    }, 200); // 减少等待时间
});

// 初始化社区界面
function initCommunityInterface() {
    console.log('🔧 初始化社区界面...');
    
    try {
        // 确保按钮状态正常
        resetButtonStates();
        
        // 加载默认内容
        loadDiscussions('all');
        
        console.log('✅ 社区界面初始化完成');
    } catch (error) {
        console.error('❌ 社区界面初始化失败:', error);
    }
}

// 重置按钮状态
function resetButtonStates() {
    // 重置所有按钮的样式和事件
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        // 确保按钮可点击
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
        button.disabled = false;
        
        // 清除可能的加载状态
        button.classList.remove('loading', 'disabled');
    });
    
    // 特别检查筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        
        // 重置默认激活状态
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    console.log('✅ 按钮状态已重置');
}

// 初始化事件监听器
function initEventListeners() {
    console.log('🔍 初始化事件监听器...');
    
    // 导航标签切换
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        // 移除旧的事件监听器
        tab.removeEventListener('click', handleTabClick);
        // 添加新的事件监听器
        tab.addEventListener('click', handleTabClick);
    });
    
    // 发布新话题按钮
    const newPostBtn = document.getElementById('newPostBtn');
    if (newPostBtn) {
        newPostBtn.removeEventListener('click', handleNewPost);
        newPostBtn.addEventListener('click', handleNewPost);
        console.log('✅ 发帖按钮事件已绑定');
    }
    
    // 筛选按钮 - 使用事件委托避免动态元素问题
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        // 移除旧的事件监听器
        postsContainer.removeEventListener('click', handleFilterClick);
        // 添加新的事件监听器
        postsContainer.addEventListener('click', handleFilterClick);
        console.log('✅ 筛选按钮事件委托已绑定');
    }
    
    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.removeEventListener('click', loadMorePosts);
        loadMoreBtn.addEventListener('click', loadMorePosts);
        console.log('✅ 加载更多按钮事件已绑定');
    }
    
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.removeEventListener('click', handleLogin);
        loginBtn.addEventListener('click', handleLoginBtn);
        console.log('✅ 登录按钮事件已绑定');
    }
    
    // 注册按钮
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.removeEventListener('click', handleRegister);
        registerBtn.addEventListener('click', handleRegisterBtn);
        console.log('✅ 注册按钮事件已绑定');
    }
    
    console.log('✅ 所有事件监听器初始化完成');
}

// 事件处理函数
function handleTabClick(e) {
    e.preventDefault();
    const tabName = e.target.dataset.tab;
    if (tabName) {
        switchTab(tabName);
    }
}

function handleNewPost() {
    // 检查用户是否已登录，优先使用新认证系统
    const isLoggedIn = (window.authSystem && window.authSystem.currentUser) || 
                      (window.communitySystem && window.communitySystem.currentUser) ||
                      communityData.currentUser;
    
    if (isLoggedIn) {
        showNewPostModal();
    } else {
        showLoginPrompt();
    }
}

function handleFilterClick(e) {
    // 检查是否点击了筛选按钮
    if (e.target.classList.contains('filter-btn')) {
        e.preventDefault();
        
        const filterType = e.target.dataset.filter;
        if (filterType) {
            console.log('🔍 筛选按钮被点击:', filterType);
            
            // 更新按钮状态
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // 执行筛选
            loadDiscussions(filterType);
        }
    }
}

function handleLoginBtn() {
    if (typeof showNewLoginModal === 'function') {
        showNewLoginModal();
    } else if (typeof showLoginModal === 'function') {
        showLoginModal();
    } else {
        showLoginPrompt();
    }
}

function handleRegisterBtn() {
    if (typeof showNewRegisterModal === 'function') {
        showNewRegisterModal();
    } else if (typeof showRegisterModal === 'function') {
        showRegisterModal();
    } else {
        // 创建简单的注册提示
        const modal = createModal('registerPromptModal', '注册账号', `
            <div class="register-prompt-content">
                <div class="prompt-icon">🎆</div>
                <p>欢迎加入琳凯蒂亚星球！</p>
                <p>注册功能正在开发中，请稍后再试。</p>
                <div class="prompt-actions">
                    <button class="btn btn-primary" onclick="closeModal('registerPromptModal')">
                        知道了
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
        showModal('registerPromptModal');
    }
}

// 初始加载内容
function loadInitialContent() {
    console.log('📦 加载初始内容...');
    
    try {
        // 加载讨论列表（默认全部）
        loadDiscussions('all');
        
        // 加载在线用户
        loadOnlineUsers();
        
        // 加载最新动态
        loadRecentActivity();
        
        // 确保首个标签页是激活的
        const firstTab = document.querySelector('.nav-tab[data-tab="discussions"]');
        if (firstTab) {
            firstTab.classList.add('active');
        }
        
        const firstSection = document.getElementById('discussions');
        if (firstSection) {
            firstSection.classList.add('active');
        }
        
        console.log('✅ 初始内容加载完成');
    } catch (error) {
        console.error('❌ 初始内容加载失败:', error);
        
        // 即使出错也要显示基本界面
        showFallbackContent();
    }
}

// 显示备用内容
function showFallbackContent() {
    const postsList = document.getElementById('postsList');
    if (postsList) {
        postsList.innerHTML = `
            <div class="no-posts" style="text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.05); border-radius: 15px; margin: 2rem 0;">
                <div class="no-posts-icon" style="font-size: 3rem; margin-bottom: 1rem;">🎆</div>
                <h3 style="color: #ffd700; margin-bottom: 1rem;">欢迎来到琳凯蒂亚语社区！</h3>
                <p style="color: #e0e0e0; margin-bottom: 2rem;">加入我们一起探索这门神秘的语言吧！</p>
                <button class="btn btn-primary" onclick="showNewPostModal()" style="background: linear-gradient(45deg, #ffd700, #4ecdc4); color: #1a1a2e; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600;">🚀 发布话题</button>
            </div>
        `;
    }
}

// 标签页切换
function switchTab(tabName) {
    console.log('切换到标签页:', tabName);
    
    // 更新导航标签
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // 更新内容区域
    const sections = document.querySelectorAll('.community-section');
    sections.forEach(section => {
        section.classList.toggle('active', section.id === tabName);
    });
    
    // 加载对应内容
    loadTabContent(tabName);
}

// 加载标签页内容
function loadTabContent(tabName) {
    switch (tabName) {
        case 'discussions':
            loadDiscussions('all'); // 传入默认筛选类型
            break;
        case 'learning':
            loadLearningContent();
            break;
        case 'translation':
            loadTranslationContent();
            break;
        case 'events':
            loadEventsContent();
            break;
        case 'resources':
            loadResourcesContent();
            break;
    }
}

// 删除重复的 loadDiscussions 函数定义（保留更完整的版本）

// 删除重复的 createPostElement 函数定义（保留更完整的版本）

// 查看帖子详情
function viewPost(postId) {
    console.log('查看帖子详情:', postId);
    
    const post = window.communitySystem.posts.find(p => p.id === postId);
    if (!post) {
        showNotification('帖子不存在', 'error');
        return;
    }
    
    // 增加浏览量
    post.views++;
    window.communitySystem.savePosts();
    
    // 获取回复
    const replies = window.communitySystem.getReplies(postId);
    
    // 创建详情模态框
    showPostDetailModal(post, replies);
}

// 显示帖子详情模态框
function showPostDetailModal(post, replies) {
    const modal = createModal('postDetailModal', post.title, `
        <div class="post-detail">
            <div class="post-detail-header">
                <div class="author-info">
                    <div class="author-avatar">${post.author.avatar}</div>
                    <div class="author-details">
                        <div class="author-name">${post.author.displayName}</div>
                        <div class="post-time">${post.timeDisplay}</div>
                    </div>
                </div>
                <div class="post-stats">
                    <span>👁️ ${post.views}</span>
                    <span>❤️ ${post.likes.length}</span>
                    <span>💬 ${post.replyCount}</span>
                </div>
            </div>
            
            <div class="post-detail-content">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
            
            <div class="post-detail-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
            
            <div class="post-detail-actions">
                <button class="btn btn-outline like-btn" onclick="togglePostLike('${post.id}')" data-liked="${post.likes.includes(window.communitySystem.currentUser?.id)}">
                    <span class="icon">❤️</span> ${post.likes.length > 0 ? post.likes.length : ''} 点赞
                </button>
                <button class="btn btn-primary" onclick="showReplyForm('${post.id}')">
                    <span class="icon">💬</span> 回复
                </button>
                ${window.communitySystem.isAdmin() ? `
                    <button class="btn btn-warning" onclick="adminTogglePin('${post.id}')">
                        ${post.isPinned ? '取消置顶' : '置顶'}
                    </button>
                    <button class="btn btn-danger" onclick="adminDeletePost('${post.id}')">
                        删除
                    </button>
                ` : ''}
            </div>
            
            <div class="replies-section">
                <h4>回复 (${replies.length})</h4>
                <div id="repliesList" class="replies-list">
                    ${replies.length > 0 ? renderReplies(replies) : '<p class="no-replies">暂无回复，快来抢沙发吧！</p>'}
                </div>
                
                ${window.communitySystem.currentUser ? `
                    <div class="reply-form" id="replyForm_${post.id}" style="display: none;">
                        <h5>发表回复</h5>
                        <textarea id="replyContent_${post.id}" placeholder="写下你的回复..." rows="3"></textarea>
                        <div class="reply-form-actions">
                            <button class="btn btn-primary" onclick="submitReply('${post.id}')">
                                发表回复
                            </button>
                            <button class="btn btn-outline" onclick="hideReplyForm('${post.id}')">
                                取消
                            </button>
                        </div>
                    </div>
                ` : '<p class="login-prompt">请<a href="#" onclick="showLoginPrompt()">登录</a>后回复</p>'}
            </div>
        </div>
    `, 'large');
    
    document.body.appendChild(modal);
    showModal('postDetailModal');
}

// 渲染回复列表
function renderReplies(replies, level = 0) {
    return replies.map(reply => `
        <div class="reply-item" style="margin-left: ${level * 20}px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 1rem; margin-bottom: 1rem; border-left: 3px solid rgba(255, 215, 0, 0.3);">
            <div class="reply-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem;">
                <div style="display: flex; align-items: center; gap: 0.8rem;">
                    <div class="reply-avatar" style="width: 32px; height: 32px; background: linear-gradient(45deg, #ffd700, #4ecdc4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">${reply.author.avatar}</div>
                    <div class="reply-info">
                        <span class="reply-author" style="color: #ffd700; font-weight: 500; margin-right: 0.8rem;">${reply.author.displayName || reply.author.username}</span>
                        <span class="reply-time" style="color: #a0a0a0; font-size: 0.9rem;">${reply.timeDisplay}</span>
                    </div>
                </div>
                <div class="reply-actions" style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-small btn-outline" onclick="toggleReplyLike('${reply.id}')" style="background: rgba(255, 107, 129, 0.1); color: #ff6b81; border: 1px solid rgba(255, 107, 129, 0.3); padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                        ❤️ ${reply.likes.length}
                    </button>
                    <button class="btn btn-small btn-outline" onclick="replyToReply('${reply.id}')" style="background: rgba(78, 205, 196, 0.1); color: #4ecdc4; border: 1px solid rgba(78, 205, 196, 0.3); padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                        回复
                    </button>
                </div>
            </div>
            <div class="reply-content" style="color: #e0e0e0; line-height: 1.6; white-space: pre-wrap;">${reply.content.replace(/\n/g, '<br>')}</div>
            ${reply.children && reply.children.length > 0 ? renderReplies(reply.children, level + 1) : ''}
        </div>
    `).join('');
}

// 点赞帖子
function togglePostLike(postId) {
    if (!window.communitySystem.currentUser) {
        showLoginPrompt();
        return;
    }
    
    try {
        const likeCount = window.communitySystem.togglePostLike(postId);
        
        // 更新UI中的点赞数
        const likeBtns = document.querySelectorAll(`[onclick="togglePostLike('${postId}')"]`);
        likeBtns.forEach(btn => {
            const icon = btn.querySelector('.icon');
            if (icon) {
                btn.innerHTML = `<span class="icon">❤️</span> ${likeCount}`;
            }
        });
        
        showNotification('操作成功', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// 显示回复表单
function showReplyForm(postId) {
    const replyForm = document.getElementById(`replyForm_${postId}`);
    if (replyForm) {
        replyForm.style.display = 'block';
        document.getElementById(`replyContent_${postId}`).focus();
    }
}

// 隐藏回复表单
function hideReplyForm(postId) {
    const replyForm = document.getElementById(`replyForm_${postId}`);
    if (replyForm) {
        replyForm.style.display = 'none';
        document.getElementById(`replyContent_${postId}`).value = '';
    }
}

// 提交回复
function submitReply(postId, parentReplyId = null) {
    if (!window.communitySystem.currentUser) {
        showLoginPrompt();
        return;
    }
    
    const contentId = parentReplyId ? `replyContent_${parentReplyId}` : `replyContent_${postId}`;
    const content = document.getElementById(contentId)?.value.trim();
    
    if (!content) {
        showNotification('请输入回复内容', 'error');
        return;
    }
    
    try {
        const reply = window.communitySystem.createReply({
            postId: postId,
            content: content,
            parentReplyId: parentReplyId
        });
        
        // 刷新回复列表
        const repliesList = document.getElementById('repliesList');
        if (repliesList) {
            const replies = window.communitySystem.getReplies(postId);
            repliesList.innerHTML = replies.length > 0 ? renderReplies(replies) : '<p class="no-replies">暂无回复</p>';
        }
        
        // 清空并隐藏表单
        document.getElementById(contentId).value = '';
        hideReplyForm(postId);
        
        showNotification('回复发表成功！', 'success');
        
        // 刷新帖子列表中的回复数
        loadDiscussions('all');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// 初始化示例数据
function initSampleData() {
    if (communityData.posts.length === 0) {
        const samplePosts = [
            {
                id: 1,
                title: '琳凯蒂亚语的语法结构真的很有趣！',
                content: '刚开始学习琳凯蒂亚语，发现它的语法结构和我们熟悉的语言很不一样，特别是体态词尾系统，感觉像是在学习魔法咒语一样神奇...',
                author: '星光初学者',
                authorId: 'sample1',
                category: 'grammar',
                tags: ['语法', '初学者', '分享'],
                timestamp: Date.now() - 1000 * 60 * 30, // 30分钟前
                replies: 12,
                likes: 25,
                views: 156
            },
            {
                id: 2,
                title: '求助：关于数词系统的疑问',
                content: '在学习数词的时候遇到了困难，特别是概数词的用法，有经验的光线使者能帮忙解答一下吗？',
                author: '月亮学徒',
                authorId: 'sample2',
                category: 'grammar',
                tags: ['数词', '求助', '疑问'],
                timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2小时前
                replies: 8,
                likes: 15,
                views: 89
            },
            {
                id: 3,
                title: '分享一个很棒的琳凯蒂亚语学习资源',
                content: '发现了一个很好的练习网站，里面有很多互动练习，特别适合初学者...',
                author: '彩虹导师',
                authorId: 'sample3',
                category: 'resources',
                tags: ['资源', '分享', '网站'],
                timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5小时前
                replies: 23,
                likes: 47,
                views: 234
            }
        ];
        
        communityData.posts = samplePosts;
        localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
    }
    
    // 示例学习小组
    if (communityData.studyGroups.length === 0) {
        communityData.studyGroups = [
            {
                id: 1,
                name: '初学者互助组',
                description: '专为琳凯蒂亚语初学者设立的互助学习小组',
                members: 24,
                level: '入门',
                activity: '活跃'
            },
            {
                id: 2,
                name: '语法深度研究',
                description: '深入研究琳凯蒂亚语语法结构和规则',
                members: 18,
                level: '进阶',
                activity: '很活跃'
            },
            {
                id: 3,
                name: '文化交流社',
                description: '探讨《光线传奇》世界观和文化背景',
                members: 31,
                level: '中级',
                activity: '活跃'
            }
        ];
    }
}

// 标签页切换
function switchTab(tabName) {
    // 更新导航标签
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // 更新内容区域
    const sections = document.querySelectorAll('.community-section');
    sections.forEach(section => {
        section.classList.toggle('active', section.id === tabName);
    });
    
    // 加载对应内容
    loadTabContent(tabName);
}

// 加载标签页内容
function loadTabContent(tabName) {
    switch (tabName) {
        case 'discussions':
            loadDiscussions('all'); // 传入默认筛选类型
            break;
        case 'learning':
            loadLearningContent();
            break;
        case 'translation':
            loadTranslationContent();
            break;
        case 'events':
            loadEventsContent();
            break;
        case 'resources':
            loadResourcesContent();
            break;
    }
}

// 加载讨论内容（支持筛选）
function loadDiscussions(filterType = 'all') {
    console.log('📜 加载讨论列表，筛选类型:', filterType);
    
    const postsList = document.getElementById('postsList');
    if (!postsList) {
        console.warn('⚠️ 未找到 postsList 元素');
        return;
    }
    
    // 确保兼容层存在
    if (typeof communityData === 'undefined' || !communityData) {
        console.warn('⚠️ communityData 未定义，正在初始化...');
        ensureCompatibilityLayer();
    }
    
    // 优先从 localStorage 获取最新数据
    let posts = [];
    
    try {
        // 1. 首先从 localStorage 加载最新数据
        const localPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        console.log('💾 从 localStorage 加载帖子:', localPosts.length);
        
        // 2. 同步到兼容层（确保数据一致性）
        if (communityData && Array.isArray(communityData.posts)) {
            communityData.posts = localPosts;
            console.log('✅ 兼容层数据已同步');
        }
        
        // 3. 如果有新的社区系统，也考虑其数据
        if (window.communitySystem && window.communitySystem.posts && Array.isArray(window.communitySystem.posts)) {
            const systemPosts = window.communitySystem.posts.filter(p => p.status === 'active');
            
            // 合并数据，优先使用 localStorage 的数据
            const localPostIds = new Set(localPosts.map(p => p.id));
            const uniqueSystemPosts = systemPosts.filter(p => !localPostIds.has(p.id));
            
            posts = [...localPosts, ...uniqueSystemPosts];
            console.log('🔄 已合并系统数据，总计:', posts.length);
        } else {
            posts = localPosts;
            console.log('💾 使用 localStorage 数据');
        }
        
        // 4. 根据筛选类型进行筛选和排序
        posts = filterAndSortPosts(posts, filterType);
        
    } catch (error) {
        console.error('❌ 加载帖子数据失败:', error);
        posts = [];
    }
    
    postsList.innerHTML = '';
    
    if (posts.length === 0) {
        const noPostsMessage = filterType === 'all' ? '还没有帖子' : '暂无符合条件的帖子';
        postsList.innerHTML = `
            <div class="no-posts" style="text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.05); border-radius: 15px; margin: 2rem 0;">
                <div class="no-posts-icon" style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                <h3 style="color: #ffd700; margin-bottom: 1rem;">${noPostsMessage}</h3>
                <p style="color: #e0e0e0; margin-bottom: 2rem;">快来发布第一个话题吧！</p>
                <button class="btn btn-primary" onclick="showNewPostModal()" style="background: linear-gradient(45deg, #ffd700, #4ecdc4); color: #1a1a2e; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: 600;">🚀 发布话题</button>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsList.appendChild(postElement);
    });
    
    console.log('✅ 讨论列表加载完成，共 ' + posts.length + ' 个帖子（筛选: ' + filterType + '）');
}

// 筛选和排序帖子
function filterAndSortPosts(posts, filterType) {
    let filteredPosts = [...posts];
    
    switch (filterType) {
        case 'all':
            // 按时间排序（最新的在前）
            filteredPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            break;
        case 'hot':
            // 按热度排序（点赞数 + 回复数 * 2）
            filteredPosts.sort((a, b) => {
                const aHeat = (Array.isArray(a.likes) ? a.likes.length : (a.likes || 0)) + 
                             ((a.replyCount || a.replies || 0) * 2);
                const bHeat = (Array.isArray(b.likes) ? b.likes.length : (b.likes || 0)) + 
                             ((b.replyCount || b.replies || 0) * 2);
                return bHeat - aHeat;
            });
            break;
        case 'latest':
            // 按时间排序（最新的在前）
            filteredPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            break;
        case 'unanswered':
            // 只显示没有回复的帖子
            filteredPosts = filteredPosts.filter(post => (post.replyCount || post.replies || 0) === 0);
            filteredPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            break;
        default:
            filteredPosts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
    
    return filteredPosts;
}

// 创建帖子元素
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item';
    postDiv.dataset.postId = post.id;
    
    // 处理作者信息（兼容旧格式和新格式）
    const authorName = post.author ? 
        (typeof post.author === 'string' ? post.author : post.author.username || post.author.displayName) : 
        '匿名用户';
    
    const authorId = post.author && typeof post.author === 'object' ? 
        post.author.id : (post.authorId || 'unknown');
    
    const authorAvatar = post.author && typeof post.author === 'object' ? 
        (post.author.avatar || post.author.username.charAt(0).toUpperCase()) : 
        authorName.charAt(0).toUpperCase();
    
    // 处理时间显示
    const timeDisplay = post.timeDisplay || (post.timestamp ? getTimeAgo(post.timestamp) : '刚刚');
    
    // 处理数据统计（确保不为 undefined）
    const views = post.views || 0;
    const likes = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
    const replies = post.replyCount || post.replies || 0;
    
    // 处理标签（确保是数组）
    const tags = Array.isArray(post.tags) ? post.tags : [];
    
    // 处理分类显示
    const categoryName = getCategoryName(post.category || 'general');
    
    // 检查当前用户是否为帖子作者
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    const isAuthor = currentUser && (currentUser.id === authorId || currentUser.username === authorName);
    
    // 创建操作按钮
    const actionButtons = `
        <div class="post-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
            <button class="btn-small btn-view" onclick="viewPostDetail('${post.id}')" style="background: rgba(78, 205, 196, 0.2); color: #4ecdc4; border: 1px solid rgba(78, 205, 196, 0.3); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s ease;">
                👁️ 查看详情
            </button>
            <button class="btn-small btn-reply" onclick="replyToPost('${post.id}')" style="background: rgba(255, 215, 0, 0.2); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.3); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s ease;">
                💬 回复
            </button>
            ${isAuthor ? `
                <button class="btn-small btn-delete" onclick="deleteMyPost('${post.id}')" style="background: rgba(244, 67, 54, 0.2); color: #f44336; border: 1px solid rgba(244, 67, 54, 0.3); padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.3s ease;">
                    🗑️ 删除
                </button>
            ` : ''}
        </div>
    `;
    
    postDiv.innerHTML = `
        <div class="post-item-container" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 1.5rem; margin-bottom: 1rem; transition: all 0.3s ease;">
            <div class="post-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div class="post-main" style="flex: 1;">
                    <div class="post-title" style="color: #ffd700; font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.4; cursor: pointer;" onclick="viewPostDetail('${post.id}')">${post.title}</div>
                    <div class="post-meta" style="display: flex; gap: 1rem; color: #a0a0a0; font-size: 0.9rem; margin-bottom: 0.75rem;">
                        <span class="post-author" style="color: #4ecdc4;">
                            <span class="author-avatar" style="display: inline-block; width: 20px; height: 20px; background: linear-gradient(45deg, #ffd700, #4ecdc4); border-radius: 50%; text-align: center; line-height: 20px; font-size: 0.8rem; color: #1a1a2e; margin-right: 0.5rem;">${authorAvatar}</span>
                            ${authorName}
                        </span>
                        <span class="post-time">🕰️ ${timeDisplay}</span>
                        <span class="post-category" style="color: #f39c12;">🏷️ ${categoryName}</span>
                    </div>
                </div>
                <div class="post-stats" style="display: flex; gap: 1rem; color: #a0a0a0; font-size: 0.9rem;">
                    <span style="display: flex; align-items: center; gap: 0.25rem;">👁️ ${views}</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;">❤️ ${likes}</span>
                    <span style="display: flex; align-items: center; gap: 0.25rem;">💬 ${replies}</span>
                </div>
            </div>
            <div class="post-content" style="color: #e0e0e0; line-height: 1.6; margin-bottom: 1rem; max-height: 100px; overflow: hidden; position: relative; cursor: pointer;" onclick="viewPostDetail('${post.id}')">
                ${post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
            </div>
            ${tags.length > 0 ? `
                <div class="post-tags" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    ${tags.map(tag => `<span class="post-tag" style="background: rgba(78, 205, 196, 0.2); color: #4ecdc4; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.8rem; border: 1px solid rgba(78, 205, 196, 0.3);">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            ${actionButtons}
        </div>
    `;
    
    // 添加悬停效果
    postDiv.addEventListener('mouseenter', () => {
        const container = postDiv.querySelector('.post-item-container');
        if (container) {
            container.style.transform = 'translateY(-2px)';
            container.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.2)';
            container.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
    });
    
    postDiv.addEventListener('mouseleave', () => {
        const container = postDiv.querySelector('.post-item-container');
        if (container) {
            container.style.transform = 'translateY(0)';
            container.style.boxShadow = 'none';
            container.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
    
    return postDiv;
}

// 时间显示工具函数
function getTimeAgo(timestamp) {
    if (!timestamp) return '刚刚';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    // 超过一周显示具体日期
    return new Date(timestamp).toLocaleDateString();
}

// 分类名称映射
function getCategoryName(category) {
    const categoryMap = {
        'general': '💬 一般讨论',
        'grammar': '📝 语法问题',
        'vocabulary': '📚 词汇学习',
        'culture': '🌎 文化交流',
        'translation': '🔄 翻译讨论',
        'resources': '📎 资源分享',
        'help': '❓ 帮助求助',
        'announcement': '📢 公告通知'
    };
    
    return categoryMap[category] || '💬 一般讨论';
}

// 加载学习内容
function loadLearningContent() {
    loadStudyGroups();
    loadDailyChallenge();
    loadLeaderboard();
}

// 加载翻译练习内容
function loadTranslationContent() {
    console.log('🔤 加载翻译练习内容...');
    loadTranslationChallenges();
    loadTranslationShowcase();
}

// 加载星球活动内容
function loadEventsContent() {
    console.log('🎪 加载星球活动内容...');
    loadUpcomingEvents();
    loadOngoingEvents();
    loadPastEvents();
}

// 加载资源分享内容
function loadResourcesContent() {
    console.log('📚 加载资源分享内容...');
    loadResourcesList();
    setupResourceFilters();
}

// 加载翻译挑战
function loadTranslationChallenges() {
    const challengesContainer = document.getElementById('translationChallenges');
    if (!challengesContainer) return;
    
    challengesContainer.innerHTML = `
        <!-- AI翻译助手 -->
        <div class="ai-translation-panel">
            <div class="ai-panel-header">
                <h4>🤖 AI翻译助手</h4>
                <div class="ai-status">
                    <span class="status-indicator">●</span>
                    <span class="status-text">在线</span>
                </div>
            </div>
            
            <div class="ai-translation-form">
                <div class="form-group">
                    <label for="aiTranslationInput">输入文本 (限制100字符)</label>
                    <div class="input-container">
                        <textarea id="aiTranslationInput" 
                                 placeholder="请输入要翻译的中文或琳凯蒂亚语文本..." 
                                 maxlength="100" 
                                 rows="3"></textarea>
                        <div class="char-counter">
                            <span id="charCount">0</span>/100
                        </div>
                    </div>
                </div>
                
                <div class="translation-options">
                    <div class="option-row">
                        <label class="translation-direction">
                            <input type="radio" name="direction" value="zh-to-rincatian" checked>
                            <span>中文 → 琳凯蒂亚语</span>
                        </label>
                        <label class="translation-direction">
                            <input type="radio" name="direction" value="rincatian-to-zh">
                            <span>琳凯蒂亚语 → 中文</span>
                        </label>
                    </div>
                </div>
                
                <div class="ai-controls">
                    <button class="btn btn-primary" id="translateBtn" disabled>
                        ✨ 开始翻译 (0.1元/次)
                    </button>
                    <div class="balance-info">
                        <span class="balance-label">余额:</span>
                        <span class="balance-amount" id="userBalance">10.00</span>元
                    </div>
                </div>
                
                <div class="ai-result" id="aiTranslationResult" style="display: none;">
                    <div class="result-header">
                        <h5>📝 翻译结果</h5>
                        <div class="model-info">
                            <span class="model-badge" id="usedModel">deepseek-chat</span>
                        </div>
                    </div>
                    <div class="result-content" id="translationOutput"></div>
                    <div class="result-footer">
                        <div class="disclaimer">⚠️ AI翻译仅供参考</div>
                        <div class="result-actions">
                            <button class="btn btn-small btn-outline" onclick="copyTranslation()">📋 复制</button>
                            <button class="btn btn-small btn-outline" onclick="shareTranslation()">📤 分享</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 翻译挑战列表 -->
        <div class="challenges-grid">
            <div class="challenge-item">
                <div class="challenge-header">
                    <h4>🎯 每日翻译挑战</h4>
                    <span class="difficulty-badge basic">基础级</span>
                </div>
                <div class="challenge-content">
                    <p class="source-text">今天的天气很好。</p>
                    <p class="challenge-prompt">请将上述中文翻译成琳凯蒂亚语</p>
                </div>
                <div class="challenge-actions">
                    <button class="btn btn-primary btn-small">参与挑战</button>
                    <span class="participants">已有 23 人参与</span>
                </div>
            </div>
            
            <div class="challenge-item">
                <div class="challenge-header">
                    <h4>⭐ 语法翻译练习</h4>
                    <span class="difficulty-badge intermediate">中级</span>
                </div>
                <div class="challenge-content">
                    <p class="source-text">Wi'ô libo'ō midê yo.</p>
                    <p class="challenge-prompt">请翻译这个包含体态词尾的句子</p>
                </div>
                <div class="challenge-actions">
                    <button class="btn btn-primary btn-small">参与挑战</button>
                    <span class="participants">已有 15 人参与</span>
                </div>
            </div>
            
            <div class="challenge-item">
                <div class="challenge-header">
                    <h4>🔮 魔法用语翻译</h4>
                    <span class="difficulty-badge advanced">高级</span>
                </div>
                <div class="challenge-content">
                    <p class="source-text">愿光芒在水晶中显现</p>
                    <p class="challenge-prompt">翻译这句具有魔法色彩的祝福语</p>
                </div>
                <div class="challenge-actions">
                    <button class="btn btn-primary btn-small">参与挑战</button>
                    <span class="participants">已有 8 人参与</span>
                </div>
            </div>
        </div>
    `;
    
    // 初始化AI翻译功能
    initAITranslation();
}

// 加载优秀翻译展示
function loadTranslationShowcase() {
    const showcaseContainer = document.getElementById('translationShowcase');
    if (!showcaseContainer) return;
    
    const showcaseData = [
        {
            original: "我爱学习琳凯蒂亚语",
            translation: "Wi Rincatiana'ō liboke belaze yo.",
            author: "星光法师",
            rating: 4.8,
            votes: 24
        },
        {
            original: "今天的月亮很美丽",
            translation: "Zanava'xa luna'va beleli yo.",
            author: "月影诗人",
            rating: 4.9,
            votes: 31
        },
        {
            original: "Qavi'ô Rincatian zeluli libo'ya?",
            translation: "你们为什么要学习琳凯蒂亚语？",
            author: "彩虹导师",
            rating: 4.7,
            votes: 18
        }
    ];
    
    showcaseContainer.innerHTML = showcaseData.map(item => `
        <div class="showcase-item">
            <div class="translation-pair">
                <div class="original-text">
                    <label>原文:</label>
                    <p>${item.original}</p>
                </div>
                <div class="translation-text">
                    <label>译文:</label>
                    <p>${item.translation}</p>
                </div>
            </div>
            <div class="showcase-meta">
                <div class="author-info">
                    <span class="author">by ${item.author}</span>
                </div>
                <div class="rating-info">
                    <span class="rating">⭐ ${item.rating}</span>
                    <span class="votes">(${item.votes}票)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 加载学习小组
function loadStudyGroups() {
    const studyGroupsContainer = document.getElementById('studyGroups');
    if (!studyGroupsContainer) return;
    
    studyGroupsContainer.innerHTML = '';
    
    // 使用默认的学习小组数据
    const defaultGroups = [
        {
            id: 1,
            name: '✨ 初学者互助组',
            description: '专为琳凯蒂亚语初学者设立的互助学习小组',
            members: 24,
            level: '入门',
            activity: '活跃'
        },
        {
            id: 2,
            name: '📚 语法深度研究',
            description: '深入研究琳凯蒂亚语语法结构和规则',
            members: 18,
            level: '进阶',
            activity: '很活跃'
        },
        {
            id: 3,
            name: '🌌 文化交流社',
            description: '探讨《光线传奇》世界观和文化背景',
            members: 31,
            level: '中级',
            activity: '活跃'
        }
    ];
    
    const groups = communityData.studyGroups.length > 0 ? communityData.studyGroups : defaultGroups;
    
    groups.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.className = 'group-card';
        groupElement.style.cssText = `
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        groupElement.innerHTML = `
            <div class="group-name" style="color: #ffd700; font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">${group.name}</div>
            <div class="group-desc" style="color: #e0e0e0; margin-bottom: 1rem; line-height: 1.5;">${group.description}</div>
            <div class="group-members" style="color: #4ecdc4; font-size: 0.9rem;">
                👥 ${group.members} 名成员 · 📊 ${group.activity} · 🏆 ${group.level}
            </div>
        `;
        
        // 添加悬停效果
        groupElement.addEventListener('mouseenter', () => {
            groupElement.style.transform = 'translateY(-5px)';
            groupElement.style.boxShadow = '0 10px 25px rgba(255, 215, 0, 0.2)';
            groupElement.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        });
        
        groupElement.addEventListener('mouseleave', () => {
            groupElement.style.transform = 'translateY(0)';
            groupElement.style.boxShadow = 'none';
            groupElement.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        studyGroupsContainer.appendChild(groupElement);
    });
}

// 加载每日挑战
function loadDailyChallenge() {
    const challengeContainer = document.getElementById('dailyChallenge');
    if (!challengeContainer) return;
    
    const challenges = [
        {
            title: '翻译挑战',
            description: '将以下琳凯蒂亚语句子翻译成中文：\n"Wi belaze ĉuēguaŋ rivon."',
            reward: '经验值 +50'
        },
        {
            title: '语法练习',
            description: '使用正确的体态词尾完成句子：\nŜi pêlē____（她正在玩耍）',
            reward: '经验值 +30'
        },
        {
            title: '词汇学习',
            description: '学习今日新词汇：belai（美丽的）、ĉuēguaŋ（星光）、rivo（河流）',
            reward: '经验值 +40'
        }
    ];
    
    const todayChallenge = challenges[new Date().getDate() % challenges.length];
    
    challengeContainer.innerHTML = `
        <div class="challenge-title">${todayChallenge.title}</div>
        <div class="challenge-desc">${todayChallenge.description}</div>
        <div class="challenge-reward">奖励：${todayChallenge.reward}</div>
        <button class="btn btn-primary" style="margin-top: 15px;">开始挑战</button>
    `;
}

// 加载排行榜
function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboard');
    if (!leaderboardContainer) return;
    
    const topUsers = [
        { name: '星辰大师', points: 2450, avatar: '🌟' },
        { name: '月光法师', points: 2180, avatar: '🌙' },
        { name: '彩虹学者', points: 1950, avatar: '🌈' },
        { name: '光线探索者', points: 1720, avatar: '✨' },
        { name: '魔法新星', points: 1580, avatar: '💫' }
    ];
    
    leaderboardContainer.innerHTML = '';
    
    topUsers.forEach((user, index) => {
        const userElement = document.createElement('div');
        userElement.className = 'leaderboard-item';
        userElement.innerHTML = `
            <div class="rank-number">${index + 1}</div>
            <div class="rank-avatar">${user.avatar}</div>
            <div class="rank-info">
                <div class="rank-name">${user.name}</div>
                <div class="rank-points">${user.points} 经验值</div>
            </div>
        `;
        leaderboardContainer.appendChild(userElement);
    });
}

// ================== 星球活动相关函数 ==================

// 加载即将开始的活动
function loadUpcomingEvents() {
    const upcomingContainer = document.getElementById('upcomingEvents');
    if (!upcomingContainer) return;
    
    const upcomingEvents = [
        {
            id: 'event_001',
            title: '🎆 琳凯蒂亚语升级庆典',
            description: '庆祝琳凯蒂亚语网站全面升级，特别举办的社区庆典活动。有丰厚奖品和互动游戏等着你！',
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天后
            endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天后
            location: '琳凯蒂亚语社区广场',
            organizer: '华田中央大学田语学院',
            participants: 128,
            maxParticipants: 200,
            tags: ['庆典', '互动', '奖品'],
            difficulty: '初级',
            rewards: ['特别成就徽章', '限定头像框', '500经验值']
        },
        {
            id: 'event_002',
            title: '🌙 月光诗歌大赛',
            description: '用琳凯蒂亚语创作你的月光之歌，让美丽的诗句在星空中闪耀。优秀作品将获得专业点评和丰厚奖励！',
            startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后
            endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14天后
            location: '线上提交 + 社区展示',
            organizer: '月光诗社',
            participants: 45,
            maxParticipants: 100,
            tags: ['诗歌', '创作', '文学'],
            difficulty: '中级',
            rewards: ['月光诗人称号', '作品集录', '1000经验值']
        },
        {
            id: 'event_003',
            title: '✨ 初学者入门集训营',
            description: '专为琳凯蒂亚语新手设计的入门集训，从发音到语法，从词汇到交流，让你快速掌握这门魔法语言！',
            startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天后
            endTime: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(), // 17天后
            location: '在线直播 + 互动练习',
            organizer: '光线导师团',
            participants: 89,
            maxParticipants: 150,
            tags: ['入门', '集训', '直播'],
            difficulty: '初级',
            rewards: ['入门证书', '学习计划', '300经验值']
        },
        {
            id: 'event_004',
            title: '🌌 琳凯蒂亚语全球交流日',
            description: '每年一度的爳凯蒂亚语全球交流盛典，连接世界各地的光线使者，共同庆祝这门美丽语言。',
            startTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20天后
            endTime: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(), // 22天后
            location: '全球在线连线',
            organizer: '琳凯蒂亚语国际促进会',
            participants: 45,
            maxParticipants: 500,
            tags: ['全球', '交流', '庆典'],
            difficulty: '不限',
            rewards: ['全球使者徽章', '纪念品', '1000经验值'],
            highlights: '特邀《光线传说》作者参与，将有神秘嘉宾和惊喜环节。'
        }
    ];
    
    upcomingContainer.innerHTML = '';
    
    upcomingEvents.forEach(event => {
        const eventElement = createEventElement(event, 'upcoming');
        upcomingContainer.appendChild(eventElement);
    });
}

// 加载正在进行的活动
function loadOngoingEvents() {
    const ongoingContainer = document.getElementById('ongoingEvents');
    if (!ongoingContainer) return;
    
    const ongoingEvents = [
        {
            id: 'event_101',
            title: '🔥 光线传说粉丝艺术大赛',
            description: '展示你的艺术才华！绘画、设计、手工、摄影……只要与《光线传说》相关，都可以参赛！',
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前开始
            endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天后结束
            location: '社区展示厅',
            organizer: '光线艺术家联盟',
            participants: 76,
            maxParticipants: 120,
            tags: ['艺术', '展示', '创作'],
            difficulty: '不限',
            status: '进行中',
            progress: 65, // 进度百分比
            rewards: ['艺术家称号', '作品展示', '800经验值']
        },
        {
            id: 'event_102',
            title: '🎯 心灵感应互动挑战',
            description: '每日一个小挑战，通过琳凯蒂亚语与其他光线使者交流互动，提升语言水平和心灵連系。',
            startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前开始
            endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6天后结束
            location: '社区互动区',
            organizer: '心灵导师团',
            participants: 234,
            maxParticipants: 300,
            tags: ['互动', '挑战', '交流'],
            difficulty: '全阶段',
            status: '热烈进行中',
            progress: 40,
            rewards: ['心灵使者徽章', '特殊聊天框', '600经验值']
        },
        {
            id: 'event_103',
            title: '🌙 星空冥想与语言体验',
            description: '结合琳凯蒂亚语学习与冥想练习，在宁静的氛围中深度体验这门语言的神秘力量。',
            startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前开始
            endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天后结束
            location: '虚拟冥想室',
            organizer: '星空导师团',
            participants: 67,
            maxParticipants: 100,
            tags: ['冥想', '体验', '灵性'],
            difficulty: '中级',
            status: '深度进行中',
            progress: 70,
            rewards: ['星空导师认证', '冥想音频', '500经验值']
        },
        {
            id: 'event_104',
            title: '🎨 创意写作工坊',
            description: '用琳凯蒂亚语发挥你的创意，写下属于你的光线传奇故事，让想象力在星空中翱翔。',
            startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前开始
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天后结束
            location: '创意工作室',
            organizer: '文学创作社',
            participants: 156,
            maxParticipants: 200,
            tags: ['创意', '写作', '文学'],
            difficulty: '中高级',
            status: '激情创作中',
            progress: 85,
            rewards: ['文学创作家徽章', '作品发表', '800经验值']
        }
    ];
    
    ongoingContainer.innerHTML = '';
    
    ongoingEvents.forEach(event => {
        const eventElement = createEventElement(event, 'ongoing');
        ongoingContainer.appendChild(eventElement);
    });
}

// 加载往期活动
function loadPastEvents() {
    const pastContainer = document.getElementById('pastEvents');
    if (!pastContainer) return;
    
    const pastEvents = [
        {
            id: 'event_201',
            title: '🏆 第一届琳凯蒂亚语翻译大赛',
            description: '历史性的第一届翻译大赛已完美落下帷幕，感谢所有参赛者的热情参与！',
            startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
            location: '线上竞赛平台',
            organizer: '翻译家協会',
            participants: 156,
            maxParticipants: 200,
            tags: ['翻译', '竞赛', '历史'],
            difficulty: '中高级',
            status: '已结束',
            winners: ['月光翻译家', '星辰语言家', '彩虹学者'],
            highlights: '共收到182份优秀作品，创下参赛的历史新高！'
        },
        {
            id: 'event_202',
            title: '🌈 光线传说二周年庆典',
            description: '庆祝《光线传说》发布两周年，回顾一路走来的精彩历程。',
            startTime: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
            location: '社区广场 + 线上直播',
            organizer: '光线传说官方',
            participants: 445,
            maxParticipants: 500,
            tags: ['庆典', '周年', '回顾'],
            difficulty: '不限',
            status: '已结束',
            highlights: '历史上参与人数最多的社区活动，共同见证了琳凯蒂亚语的成长！'
        },
        {
            id: 'event_203',
            title: '🎭 第一届琳凯蒂亚语戏剧节',
            description: '首届琳凯蒂亚语戏剧节圆满落幕，精彩的表演和创意让每个人都印象深刻。',
            startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
            location: '虚拟戏剧院',
            organizer: '琳凯蒂亚戏剧社',
            participants: 234,
            maxParticipants: 300,
            tags: ['戏剧', '表演', '艺术'],
            difficulty: '不限',
            status: '已结束',
            winners: ['星光剧团', '月亮表演家', '彩虹诗人'],
            highlights: '共上演了15部原创作品，展现了琳凯蒂亚语的艺术魅力！'
        },
        {
            id: 'event_204',
            title: '🌍 第一届国际琳凯蒂亚语交流大会',
            description: '全球琳凯蒂亚语学习者和爱好者的盛大聚会，为这门语言的国际化奠定了基础。',
            startTime: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
            location: '全球多地连线',
            organizer: '国际语言交流协会',
            participants: 678,
            maxParticipants: 1000,
            tags: ['国际', '交流', '历史'],
            difficulty: '不限',
            status: '已结束',
            highlights: '来自23个国家和地区的参与者，标志着琳凯蒂亚语正式走向世界！'
        },
        {
            id: 'event_205',
            title: '🎄 星光冬日庆典',
            description: '在琳凯蒂亚星球的冬日节日，大家一起度过了温馨而难忘的时光。',
            startTime: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 147 * 24 * 60 * 60 * 1000).toISOString(),
            location: '线上庆典厅',
            organizer: '社区管理团',
            participants: 389,
            maxParticipants: 400,
            tags: ['冬日', '庆典', '温馨'],
            difficulty: '不限',
            status: '已结束',
            highlights: '特别设置了“感恩时刻”环节，大家用琳凯蒂亚语分享了一年来的收获和感动。'
        }
    ];
    
    pastContainer.innerHTML = '';
    
    pastEvents.forEach(event => {
        const eventElement = createEventElement(event, 'past');
        pastContainer.appendChild(eventElement);
    });
}

// 创建活动元素 - 增强版
function createEventElement(event, type) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item';
    
    // 获取状态显示
    const statusInfo = getEventStatusInfo(event, type);
    const timeInfo = getEventTimeInfo(event, type);
    
    eventDiv.innerHTML = `
        <div class="event-card">
            <div class="event-header">
                <div class="event-title">${event.title}</div>
                <div class="event-status ${statusInfo.class}">${statusInfo.text}</div>
            </div>
            
            <div class="event-description">${event.description}</div>
            
            <div class="event-details">
                <div class="event-meta">
                    <div class="meta-item">
                        <span class="meta-label">📅 时间</span>
                        <span class="meta-value">${timeInfo}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">📍 地点</span>
                        <span class="meta-value">${event.location}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">💼 主办</span>
                        <span class="meta-value">${event.organizer}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">👥 参与</span>
                        <span class="meta-value">${event.participants}/${event.maxParticipants}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">🏆 难度</span>
                        <span class="meta-value">${event.difficulty}</span>
                    </div>
                </div>
                
                ${event.progress !== undefined ? `
                    <div class="event-progress">
                        <div class="progress-label">活动进度: ${event.progress}%</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${event.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                <div class="event-tags">
                    ${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}
                </div>
                
                ${event.rewards ? `
                    <div class="event-rewards">
                        <div class="rewards-label">🎁 奖励：</div>
                        <div class="rewards-list">
                            ${event.rewards.map(reward => `<span class="reward-item">${reward}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${event.highlights ? `
                    <div class="event-highlights">
                        <div class="highlights-label">✨ 亮点：</div>
                        <div class="highlights-text">${event.highlights}</div>
                    </div>
                ` : ''}
                
                ${event.winners ? `
                    <div class="event-winners">
                        <div class="winners-label">🏆 获胜者：</div>
                        <div class="winners-list">
                            ${event.winners.map(winner => `<span class="winner-name">${winner}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div class="event-actions">
                ${getEventActions(event, type)}
            </div>
        </div>
    `;
    
    // 添加交互效果
    addEventInteractions(eventDiv, event);
    
    return eventDiv;
}

// 添加活动交互效果
function addEventInteractions(eventDiv, event) {
    const eventCard = eventDiv.querySelector('.event-card');
    
    // 鼠标悬停动画
    eventCard.addEventListener('mouseenter', () => {
        // 添加光效
        eventCard.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.2), 0 10px 25px rgba(0, 0, 0, 0.4)';
        
        // 进度条动画
        const progressFill = eventCard.querySelector('.progress-fill');
        if (progressFill) {
            const currentWidth = progressFill.style.width;
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = currentWidth;
            }, 100);
        }
    });
    
    eventCard.addEventListener('mouseleave', () => {
        eventCard.style.boxShadow = '';
    });
    
    // 按钮点击效果
    const buttons = eventCard.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 波纹动画 CSS
if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 获取活动状态信息
function getEventStatusInfo(event, type) {
    switch (type) {
        case 'upcoming':
            return { class: 'status-upcoming', text: '即将开始' };
        case 'ongoing':
            return { class: 'status-ongoing', text: event.status || '进行中' };
        case 'past':
            return { class: 'status-past', text: '已结束' };
        default:
            return { class: '', text: '' };
    }
}

// 获取活动时间信息
function getEventTimeInfo(event, type) {
    const startDate = new Date(event.startTime);
    const endDate = new Date(event.endTime);
    
    if (type === 'upcoming') {
        const daysUntil = Math.ceil((startDate - Date.now()) / (1000 * 60 * 60 * 24));
        return `${daysUntil}天后开始 (${startDate.toLocaleDateString()})`;
    } else if (type === 'ongoing') {
        const daysLeft = Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24));
        return `还剩 ${daysLeft} 天 (${endDate.toLocaleDateString()}结束)`;
    } else {
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
}

// 获取活动操作按钮
function getEventActions(event, type) {
    switch (type) {
        case 'upcoming':
            return `
                <button class="btn btn-primary" onclick="joinEvent('${event.id}')">🌟 报名参加</button>
                <button class="btn btn-outline" onclick="viewEventDetail('${event.id}')">👁️ 查看详情</button>
            `;
        case 'ongoing':
            return `
                <button class="btn btn-secondary" onclick="participateEvent('${event.id}')">🏃 立即参与</button>
                <button class="btn btn-outline" onclick="viewEventDetail('${event.id}')">👁️ 查看详情</button>
            `;
        case 'past':
            return `
                <button class="btn btn-outline" onclick="viewEventDetail('${event.id}')">📄 查看回顾</button>
                <button class="btn btn-outline" onclick="viewEventHighlights('${event.id}')">✨ 精彩回放</button>
            `;
        default:
            return '';
    }
}

// ================== 资源分享相关函数 ==================

// 加载资源列表
function loadResourcesList() {
    const resourcesContainer = document.getElementById('resourcesList');
    if (!resourcesContainer) return;
    
    const resources = [
        {
            id: 'res_001',
            title: '📚 琳凯蒂亚语初学者完整教程',
            description: '从零开始学习琳凯蒂亚语的完整教程，包含发音、语法、词汇和实用会话。',
            author: '华田中央大学田语学院',
            category: 'grammar',
            type: 'PDF文档',
            size: '12.5 MB',
            downloads: 1247,
            rating: 4.9,
            tags: ['基础教程', '系统学习', '初学者'],
            uploadTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初级',
            language: '中文',
            preview: '包含50个章节，200+练习题，音频发音指导。',
            features: ['图文并茂', '音频辅助', '练习题库', '進度跟踪']
        },
        {
            id: 'res_002',
            title: '🎧 琳凯蒂亚语标准发音指南',
            description: '专业的发音教学音频，由原著作者亲自录制，包含所有音素和语调变化。',
            author: '光线传说作者',
            category: 'media',
            type: 'MP3音频包',
            size: '156 MB',
            downloads: 892,
            rating: 5.0,
            tags: ['发音', '标准', '音频'],
            uploadTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '琳凯蒂亚语',
            preview: '包含48个字母发音，200+常用词汇，50个经典句子。',
            features: ['清晰音质', '慢速重复', '对比练习', '下载支持']
        },
        {
            id: 'res_003',
            title: '📋 日常会话1000句精选',
            description: '精心收集的日常最实用的琳凯蒂亚语会话，包含发音、中文翻译和使用场景。',
            author: '交流大师',
            category: 'vocabulary',
            type: 'Excel表格',
            size: '2.8 MB',
            downloads: 1534,
            rating: 4.8,
            tags: ['会话', '实用', '词汇表'],
            uploadTime: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初中级',
            language: '双语',
            preview: '按主题分类：问候、购物、用餐、旅行、工作等。',
            features: ['主题分类', '发音标注', '场景说明', '随时更新']
        },
        {
            id: 'res_004',
            title: '🛠️ 琳凯蒂亚语在线练习工具',
            description: '在线互动式练习工具，支持语法练习、词汇测试、口语练习和听力训练。',
            author: '智能学习实验室',
            category: 'tools',
            type: '在线工具',
            size: '在线使用',
            downloads: 3247, // 使用次数
            rating: 4.7,
            tags: ['在线工具', '互动练习', 'AI辅助'],
            uploadTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '多语言',
            preview: '支持自适应难度调整，实时反馈，学习进度跟踪。',
            features: ['自适应难度', 'AI评分', '进度跟踪', '社交学习']
        },
        {
            id: 'res_005',
            title: '📄 语法速查手册',
            description: '便携式语法参考手册，包含所有重要语法点和例句，适合随时查阅。',
            author: '语法专家组',
            category: 'grammar',
            type: 'PDF手册',
            size: '4.2 MB',
            downloads: 967,
            rating: 4.6,
            tags: ['语法', '手册', '快速查找'],
            uploadTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '中高级',
            language: '中文',
            preview: '按语法类别细分，带有索引和书签，便于快速定位。',
            features: ['细分类别', '快速索引', '例句丰富', '离线可用']
        },
        {
            id: 'res_006',
            title: '🎵 琳凯蒂亚语歌曲合集',
            description: '由社区成员创作的美丽琳凯蒂亚语歌曲，让你在音乐中感受语言的魅力。',
            author: '音乐创作社',
            category: 'media',
            type: 'MP3合集',
            size: '89 MB',
            downloads: 723,
            rating: 4.9,
            tags: ['音乐', '歌曲', '艺术'],
            uploadTime: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '不限',
            language: '琳凯蒂亚语',
            preview: '包含12首原创歌曲，涵盖民谣、流行、古典风格。',
            features: ['原创作品', '多风格', '专业制作', '歌词同步']
        },
        {
            id: 'res_007',
            title: '🎨 琳凯蒂亚语文字艺术创作集',
            description: '精美的琳凯蒂亚语书法作品和文字设计，展现语言的视觉美感和艺术魅力。',
            author: '文字艺术工作室',
            category: 'media',
            type: '图片集',
            size: '156 MB',
            downloads: 445,
            rating: 4.8,
            tags: ['艺术', '书法', '设计', '视觉'],
            uploadTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '不限',
            language: '琳凯蒂亚语',
            preview: '包含50+精美书法作品，多种字体风格，高清图片格式。',
            features: ['高清画质', '多种字体', '创意设计', '可打印']
        },
        {
            id: 'res_008',
            title: '📖 琳凯蒂亚语故事集「星光传说」',
            description: '原创琳凯蒂亚语短篇故事合集，帮助学习者在有趣的故事中提高阅读理解能力。',
            author: '故事创作团',
            category: 'vocabulary',
            type: 'PDF电子书',
            size: '8.7 MB',
            downloads: 867,
            rating: 4.7,
            tags: ['故事', '阅读', '文学', '练习'],
            uploadTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '中级',
            language: '双语对照',
            preview: '收录15个精彩故事，每个故事配有词汇注释和理解练习。',
            features: ['双语对照', '词汇注释', '理解练习', '声音朗读']
        },
        {
            id: 'res_009',
            title: '🧩 琳凯蒂亚语语法游戏合集',
            description: '寓教于乐的语法学习游戏，通过游戏化的方式让语法学习变得轻松有趣。',
            author: '教育游戏开发组',
            category: 'exercises',
            type: '在线游戏',
            size: '在线使用',
            downloads: 2156,
            rating: 4.6,
            tags: ['游戏', '语法', '互动', '趣味'],
            uploadTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初中级',
            language: '多语言',
            preview: '包含拼图、填空、匹配等多种游戏类型，覆盖所有主要语法点。',
            features: ['游戏化学习', '进度保存', '排行榜', '成就系统']
        },
        {
            id: 'res_010',
            title: '🔤 琳凯蒂亚语字母练习册',
            description: '专门设计的字母书写练习册，帮助初学者掌握正确的字母书写方法和笔顺。',
            author: '华田中央大学田语学院',
            category: 'exercises',
            type: 'PDF练习册',
            size: '15.3 MB',
            downloads: 1756,
            rating: 4.9,
            tags: ['字母', '书写', '练习', '基础'],
            uploadTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初级',
            language: '中文指导',
            preview: '48页精心设计的练习页面，包含字母描红、笔顺演示和书写练习。',
            features: ['笔顺演示', '描红练习', '标准字体', '打印友好']
        },
        {
            id: 'res_011',
            title: '🌟 琳凯蒂亚语魔法咒语大全',
            description: '收集《光线传奇》世界中的经典魔法咒语，学习神秘而优美的琳凯蒂亚语咒文。',
            author: '魔法研究协会',
            category: 'vocabulary',
            type: '电子手册',
            size: '6.8 MB',
            downloads: 2845,
            rating: 5.0,
            tags: ['魔法', '咒语', '文化', '经典'],
            uploadTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '中高级',
            language: '琳凯蒂亚语原文',
            preview: '收录100+经典咒语，包含发音指导、含义解释和使用背景。',
            features: ['原文收录', '发音指导', '文化背景', '使用场景']
        },
        {
            id: 'res_012',
            title: '🎯 琳凯蒂亚语水平测试题库',
            description: '标准化的琳凯蒂亚语水平测试题，帮助学习者准确评估自己的语言水平。',
            author: '语言测试中心',
            category: 'exercises',
            type: '题库系统',
            size: '在线使用',
            downloads: 1432,
            rating: 4.5,
            tags: ['测试', '评估', '标准', '题库'],
            uploadTime: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '多语言界面',
            preview: '包含听力、阅读、语法、词汇四大模块，自动评分和详细解析。',
            features: ['自动评分', '详细解析', '水平报告', '学习建议']
        }
    ];
    
    displayResources(resources);
}

// 显示资源列表
function displayResources(resources) {
    const resourcesContainer = document.getElementById('resourcesList');
    if (!resourcesContainer) return;
    
    resourcesContainer.innerHTML = '';
    
    resources.forEach(resource => {
        const resourceElement = createResourceElement(resource);
        resourcesContainer.appendChild(resourceElement);
    });
}

// 创建资源元素 - 增强版
function createResourceElement(resource) {
    const resourceDiv = document.createElement('div');
    resourceDiv.className = 'resource-item';
    
    const categoryIcon = getResourceCategoryIcon(resource.category);
    const ratingStars = generateStarRating(resource.rating);
    const difficultyColor = getDifficultyColor(resource.difficulty);
    
    resourceDiv.innerHTML = `
        <div class="resource-card">
            <div class="resource-header">
                <div class="resource-icon">${categoryIcon}</div>
                <div class="resource-type">${resource.type}</div>
            </div>
            
            <div class="resource-title">${resource.title}</div>
            <div class="resource-description">${resource.description}</div>
            
            <div class="resource-preview">
                <strong>🔍 内容预览：</strong>
                <p>${resource.preview}</p>
            </div>
            
            ${resource.features ? `
                <div class="resource-features">
                    <div class="features-label">✨ 特性：</div>
                    <div class="features-list">
                        ${resource.features.map(feature => `<span class="feature-item">${feature}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="resource-meta">
                <div class="resource-meta-item">
                    <span class="meta-value">${resource.author}</span>
                    <span class="meta-label">作者</span>
                </div>
                <div class="resource-meta-item">
                    <span class="meta-value" style="color: ${difficultyColor}">${resource.difficulty}</span>
                    <span class="meta-label">难度</span>
                </div>
                <div class="resource-meta-item">
                    <span class="meta-value">${resource.size}</span>
                    <span class="meta-label">大小</span>
                </div>
                <div class="resource-meta-item">
                    <span class="meta-value">${formatNumber(resource.downloads)}</span>
                    <span class="meta-label">下载</span>
                </div>
            </div>
            
            <div class="resource-rating">
                <div class="rating-stars">${ratingStars}</div>
                <span class="rating-value">${resource.rating.toFixed(1)}</span>
                <span class="rating-count">(基于 ${Math.floor(resource.downloads / 10)} 个评价)</span>
            </div>
            
            <div class="resource-actions">
                <button class="btn btn-primary" onclick="downloadResource('${resource.id}')">
                    💾 下载资源
                </button>
                <button class="btn btn-outline" onclick="previewResource('${resource.id}')">
                    👁️ 预览
                </button>
                <button class="btn btn-secondary" onclick="favoriteResource('${resource.id}')">
                    ❤️ 收藏
                </button>
            </div>
        </div>
    `;
    
    // 添加交互效果
    addResourceInteractions(resourceDiv, resource);
    
    return resourceDiv;
}

// 添加资源交互效果
function addResourceInteractions(resourceDiv, resource) {
    const resourceCard = resourceDiv.querySelector('.resource-card');
    
    // 鼠标悬停动画
    resourceCard.addEventListener('mouseenter', () => {
        resourceCard.style.boxShadow = '0 20px 50px rgba(76, 205, 196, 0.2), 0 10px 25px rgba(0, 0, 0, 0.4)';
        
        // 资源图标动画
        const icon = resourceCard.querySelector('.resource-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        // 特性标签动画
        const features = resourceCard.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            setTimeout(() => {
                feature.style.transform = 'translateY(-2px)';
            }, index * 50);
        });
    });
    
    resourceCard.addEventListener('mouseleave', () => {
        resourceCard.style.boxShadow = '';
        
        const icon = resourceCard.querySelector('.resource-icon');
        if (icon) {
            icon.style.transform = '';
        }
        
        const features = resourceCard.querySelectorAll('.feature-item');
        features.forEach(feature => {
            feature.style.transform = '';
        });
    });
    
    // 按钮点击效果
    const buttons = resourceCard.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 波纹效果
            createRippleEffect(this, e);
        });
    });
}

// 创建波纹效果
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 获取难度颜色
function getDifficultyColor(difficulty) {
    const colorMap = {
        '初级': '#00b894',
        '中级': '#fdcb6e',
        '中高级': '#e17055',
        '高级': '#d63031',
        '全阶段': '#4ecdc4',
        '不限': '#b0b0c8'
    };
    return colorMap[difficulty] || '#4ecdc4';
}

// 格式化数字
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 资源操作函数
function downloadResource(resourceId) {
    console.log('下载资源:', resourceId);
    showNotification('💾 开始下载资源...', 'info');
    
    // 模拟下载进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            showNotification('✅ 资源下载完成！', 'success');
        }
    }, 200);
}

function previewResource(resourceId) {
    console.log('预览资源:', resourceId);
    showNotification('👁️ 正在加载资源预览...', 'info');
    // 这里可以添加预览模态框逻辑
}

function favoriteResource(resourceId) {
    console.log('收藏资源:', resourceId);
    showNotification('❤️ 已添加到收藏夹！', 'success');
}

// 获取资源分类图标
function getResourceCategoryIcon(category) {
    const icons = {
        'grammar': '📝',
        'vocabulary': '📚',
        'exercises': '🎯',
        'tools': '🛠️',
        'media': '🎧'
    };
    return icons[category] || '📄';
}

// 生成星级评分
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    if (hasHalfStar) {
        stars += '🌟';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// 设置资源筛选器
function setupResourceFilters() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    if (!categoryTabs.length) return;
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 更新活跃状态
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 筛选资源
            const category = tab.dataset.category;
            filterResources(category);
        });
    });
}

// 筛选资源
function filterResources(category) {
    // 这里可以根据分类筛选资源
    console.log('🔍 筛选资源分类:', category);
    
    // 如果是“全部”，显示所有资源
    if (category === 'all') {
        loadResourcesList();
        return;
    }
    
    // 根据分类筛选显示
    // 获取所有资源数据
    const allResources = [
        // 语法相关资源
        {
            id: 'res_001',
            title: '📚 琳凯蒂亚语初学者完整教程',
            description: '从零开始学习琳凯蒂亚语的完整教程，包含发音、语法、词汇和实用会话。',
            author: '华田中央大学田语学院',
            category: 'grammar',
            type: 'PDF文档',
            size: '12.5 MB',
            downloads: 1247,
            rating: 4.9,
            tags: ['基础教程', '系统学习', '初学者'],
            uploadTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初级',
            language: '中文',
            preview: '包含50个章节，200+练习题，音频发音指导。',
            features: ['图文并茂', '音频辅助', '练习题库', '进度跟踪']
        },
        {
            id: 'res_005',
            title: '📄 语法速查手册',
            description: '便携式语法参考手册，包含所有重要语法点和例句，适合随时查阅。',
            author: '语法专家组',
            category: 'grammar',
            type: 'PDF手册',
            size: '4.2 MB',
            downloads: 967,
            rating: 4.6,
            tags: ['语法', '手册', '快速查找'],
            uploadTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '中高级',
            language: '中文',
            preview: '按语法类别细分，带有索引和书签，便于快速定位。',
            features: ['细分类别', '快速索引', '例句丰富', '离线可用']
        },
        // 音视频资源
        {
            id: 'res_002',
            title: '🎧 琳凯蒂亚语标准发音指南',
            description: '专业的发音教学音频，由原著作者亲自录制，包含所有音素和语调变化。',
            author: '光线传说作者',
            category: 'media',
            type: 'MP3音频包',
            size: '156 MB',
            downloads: 892,
            rating: 5.0,
            tags: ['发音', '标准', '音频'],
            uploadTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '琳凯蒂亚语',
            preview: '包含48个字母发音，200+常用词汇，50个经典句子。',
            features: ['清晰音质', '慢速重复', '对比练习', '下载支持']
        },
        // 词汇相关资源
        {
            id: 'res_003',
            title: '📋 日常会话1000句精选',
            description: '精心收集的日常最实用的琳凯蒂亚语会话，包含发音、中文翻译和使用场景。',
            author: '交流大师',
            category: 'vocabulary',
            type: 'Excel表格',
            size: '2.8 MB',
            downloads: 1534,
            rating: 4.8,
            tags: ['会话', '实用', '词汇表'],
            uploadTime: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初中级',
            language: '双语',
            preview: '按主题分类：问候、购物、用餐、旅行、工作等。',
            features: ['主题分类', '发音标注', '场景说明', '随时更新']
        },
        // 学习工具
        {
            id: 'res_004',
            title: '🛠️ 琳凯蒂亚语在线练习工具',
            description: '在线互动式练习工具，支持语法练习、词汇测试、口语练习和听力训练。',
            author: '智能学习实验室',
            category: 'tools',
            type: '在线工具',
            size: '在线使用',
            downloads: 3247,
            rating: 4.7,
            tags: ['在线工具', '互动练习', 'AI辅助'],
            uploadTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '多语言',
            preview: '支持自适应难度调整，实时反馈，学习进度跟踪。',
            features: ['自适应难度', 'AI评分', '进度跟踪', '社交学习']
        },
        // 练习题相关资源
        {
            id: 'res_009',
            title: '🧩 琳凯蒂亚语语法游戏合集',
            description: '寓教于乐的语法学习游戏，通过游戏化的方式让语法学习变得轻松有趣。',
            author: '教育游戏开发组',
            category: 'exercises',
            type: '在线游戏',
            size: '在线使用',
            downloads: 2156,
            rating: 4.6,
            tags: ['游戏', '语法', '互动', '趣味'],
            uploadTime: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初中级',
            language: '多语言',
            preview: '包含拼图、填空、匹配等多种游戏类型，覆盖所有主要语法点。',
            features: ['游戏化学习', '进度保存', '排行榜', '成就系统']
        },
        {
            id: 'res_010',
            title: '🔤 琳凯蒂亚语字母练习册',
            description: '专门设计的字母书写练习册，帮助初学者掌握正确的字母书写方法和笔顺。',
            author: '华田中央大学田语学院',
            category: 'exercises',
            type: 'PDF练习册',
            size: '15.3 MB',
            downloads: 1756,
            rating: 4.9,
            tags: ['字母', '书写', '练习', '基础'],
            uploadTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '初级',
            language: '中文指导',
            preview: '48页精心设计的练习页面，包含字母描红、笔顺演示和书写练习。',
            features: ['笔顺演示', '描红练习', '标准字体', '打印友好']
        },
        {
            id: 'res_012',
            title: '🎯 琳凯蒂亚语水平测试题库',
            description: '标准化的琳凯蒂亚语水平测试题，帮助学习者准确评估自己的语言水平。',
            author: '语言测试中心',
            category: 'exercises',
            type: '题库系统',
            size: '在线使用',
            downloads: 1432,
            rating: 4.5,
            tags: ['测试', '评估', '标准', '题库'],
            uploadTime: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
            difficulty: '全阶段',
            language: '多语言界面',
            preview: '包含听力、阅读、语法、词汇四大模块，自动评分和详细解析。',
            features: ['自动评分', '详细解析', '水平报告', '学习建议']
        }
    ];
    
    // 根据分类筛选资源
    const filteredResources = allResources.filter(resource => resource.category === category);
    
    // 显示筛选结果
    displayResources(filteredResources);
    
    showNotification(`已筛选出 ${filteredResources.length} 个${getCategoryDisplayName(category)}资源`, 'info');
}

// 获取分类显示名称
function getCategoryDisplayName(category) {
    const names = {
        'grammar': '语法资料',
        'vocabulary': '词汇表',
        'exercises': '练习题',
        'tools': '学习工具',
        'media': '音视频'
    };
    return names[category] || '未知分类';
}

// ================== 活动和资源交互函数 ==================

// 参加活动
function joinEvent(eventId) {
    console.log('🎆 加入活动:', eventId);
    
    // 检查用户是否登录
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser);
    
    if (!currentUser) {
        showNotification('请先登录后再报名参加活动！', 'warning');
        return;
    }
    
    // 模拟报名成功
    showNotification('🎉 报名成功！我们会在活动开始前通知您。', 'success');
    
    // 这里可以添加实际的报名逻辑
}

// 参与活动
function participateEvent(eventId) {
    console.log('🏃 参与活动:', eventId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser);
    
    if (!currentUser) {
        showNotification('请先登录后再参与活动！', 'warning');
        return;
    }
    
    showNotification('🌟 正在跳转到活动参与页面...', 'info');
    
    // 这里可以跳转到具体的活动参与页面
}

// 查看活动详情
function viewEventDetail(eventId) {
    console.log('👁️ 查看活动详情:', eventId);
    showNotification('正在加载活动详情...', 'info');
    
    // 这里可以显示活动详情模态框
}

// 查看活动亮点
function viewEventHighlights(eventId) {
    console.log('✨ 查看活动亮点:', eventId);
    showNotification('正在加载精彩回放...', 'info');
    
    // 这里可以显示活动精彩内容
}

// 下载资源
function downloadResource(resourceId) {
    console.log('📥 下载资源:', resourceId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser);
    
    if (!currentUser) {
        showNotification('请先登录后再下载资源！', 'warning');
        return;
    }
    
    showNotification('🚀 下载已开始，请稍候...', 'success');
    
    // 这里可以实现实际的下载逻辑
}

// 预览资源
function previewResource(resourceId) {
    console.log('👁️ 预览资源:', resourceId);
    showNotification('正在加载预览...', 'info');
    
    // 这里可以显示资源预览模态框
}

// 分享资源
function shareResource(resourceId) {
    console.log('🔗 分享资源:', resourceId);
    
    // 复制分享链接到剪贴板
    const shareUrl = `${window.location.origin}/community.html#resource-${resourceId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('📋 分享链接已复制到剪贴板！', 'success');
        }).catch(() => {
            showNotification('复制失败，请手动复制链接', 'error');
        });
    } else {
        showNotification(`分享链接：${shareUrl}`, 'info');
    }
}

// 评分资源
function rateResource(resourceId) {
    console.log('⭐ 评分资源:', resourceId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser);
    
    if (!currentUser) {
        showNotification('请先登录后再进行评分！', 'warning');
        return;
    }
    
    // 这里可以显示评分模态框
    showNotification('评分功能即将上线，敬请期待！', 'info');
}

// 处理登录
function handleLogin(e) {
    e.preventDefault();
    
    console.log('🔑 开始处理登录...');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('请填写完整的登录信息', 'error');
        return;
    }
    
    // 优先使用新的认证系统
    if (window.authSystem) {
        window.authSystem.login({ username: email, password: password })
            .then(result => {
                if (result.success) {
                    // 同步到兼容层
                    communityData.currentUser = {
                        id: window.authSystem.currentUser.id,
                        username: window.authSystem.currentUser.username,
                        email: window.authSystem.currentUser.email || email,
                        userType: 'learner',
                        joinDate: Date.now(),
                        points: 0,
                        rank: '初级光线使者',
                        avatar: window.authSystem.currentUser.username.charAt(0).toUpperCase()
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(communityData.currentUser));
                    hideModal('loginModal');
                    updateUI();
                    showNotification('🌟 欢迎回到星球！', 'success');
                    console.log('✅ 登录成功');
                } else {
                    showNotification('登录失败：' + result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('登录异常：' + error.message, 'error');
            });
        return;
    }
    
    // 备用方案：使用兼容层
    const user = communityData.users.find(u => 
        (u.email === email || u.username === email) && u.password === password
    );
    
    if (user) {
        communityData.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        hideModal('loginModal');
        updateUI();
        showNotification('🌟 欢迎回到星球！', 'success');
        console.log('✅ 登录成功（兼容模式）');
    } else {
        showNotification('邮箱/用户名或密码错误', 'error');
    }
}

// 处理注册
function handleRegister(e) {
    e.preventDefault();
    
    console.log('🎆 开始处理注册...');
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    
    // 验证
    if (!username || !email || !password) {
        showNotification('请填写完整的注册信息', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('密码确认不匹配', 'error');
        return;
    }
    
    // 检查是否已存在
    if (communityData.users.find(u => u.email === email)) {
        showNotification('邮箱已被注册', 'error');
        return;
    }
    
    if (communityData.users.find(u => u.username === username)) {
        showNotification('用户名已被使用', 'error');
        return;
    }
    
    // 优先使用新的认证系统
    if (window.authSystem) {
        window.authSystem.register({ username, email, password })
            .then(result => {
                if (result.success) {
                    // 创建对应的社区用户
                    const newUser = {
                        id: window.authSystem.currentUser.id,
                        username,
                        email,
                        password, // 注意：实际项目中不应存储明文密码
                        userType,
                        joinDate: Date.now(),
                        points: 0,
                        rank: '新手光线使者',
                        avatar: username.charAt(0).toUpperCase()
                    };
                    
                    communityData.users.push(newUser);
                    communityData.currentUser = newUser;
                    
                    localStorage.setItem('communityUsers', JSON.stringify(communityData.users));
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    
                    hideModal('registerModal');
                    updateUI();
                    showNotification('🎉 欢迎加入琳凯蒂亚星球！', 'success');
                    console.log('✅ 注册成功');
                } else {
                    showNotification('注册失败：' + result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('注册异常：' + error.message, 'error');
            });
        return;
    }
    
    // 备用方案：使用兼容层
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        userType,
        joinDate: Date.now(),
        points: 0,
        rank: '新手光线使者',
        avatar: username.charAt(0).toUpperCase()
    };
    
    communityData.users.push(newUser);
    communityData.currentUser = newUser;
    
    localStorage.setItem('communityUsers', JSON.stringify(communityData.users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    hideModal('registerModal');
    updateUI();
    showNotification('🎉 欢迎加入琳凯蒂亚星球！', 'success');
    console.log('✅ 注册成功（兼容模式）');
}

// 处理新帖子发布
function handleNewPost(e) {
    e.preventDefault();
    
    console.log('📢 开始处理新帖子发布...');
    
    // 检查用户登录状态
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !content) {
        showNotification('请填写完整的标题和内容', 'error');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        title,
        content,
        author: currentUser.username,
        authorId: currentUser.id,
        category,
        tags,
        timestamp: Date.now(),
        replies: 0,
        likes: 0,
        views: 0
    };
    
    // 优先使用新的社区系统
    if (window.communitySystem && typeof window.communitySystem.createPost === 'function') {
        try {
            const result = window.communitySystem.createPost({
                title: title,
                content: content,
                category: category,
                tags: tags
            });
            console.log('✅ 使用新系统创建帖子成功');
        } catch (error) {
            console.error('新系统创建帖子失败:', error);
            // 降级到兼容层
        }
    }
    
    // 同时保存到兼容层
    communityData.posts.unshift(newPost);
    localStorage.setItem('communityPosts', JSON.stringify(communityData.posts));
    
    hideModal('newPostModal');
    document.getElementById('newPostForm').reset();
    loadDiscussions('all');
    updateStats();
    showNotification('🎉 话题发布成功！', 'success');
    
    console.log('✅ 帖子发布完成');
}

// 处理登出
function handleLogout() {
    communityData.currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showNotification('已安全退出', 'info');
}

// 显示用户资料
function showUserProfile() {
    if (!communityData.currentUser) return;
    
    const user = communityData.currentUser;
    const modal = createModal('userProfileModal', '个人中心', `
        <div class="user-profile">
            <div class="profile-header">
                <div class="profile-avatar">${user.avatar}</div>
                <div class="profile-info">
                    <h3>${user.username}</h3>
                    <p class="user-rank">${user.rank}</p>
                    <p class="join-date">加入时间：${new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-number">${user.points || 0}</div>
                    <div class="stat-label">经验值</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${communityData.posts.filter(p => p.authorId === user.id).length}</div>
                    <div class="stat-label">发布贴子</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">15</div>
                    <div class="stat-label">活跃天数</div>
                </div>
            </div>
            <div class="profile-actions">
                <button class="btn btn-primary" onclick="editProfile()">编辑资料</button>
                <button class="btn btn-secondary" onclick="viewAchievements()">查看成就</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    showModal('userProfileModal');
}

// 显示用户设置
function showUserSettings() {
    if (!communityData.currentUser) return;
    
    const user = communityData.currentUser;
    const modal = createModal('userSettingsModal', '用户设置', `
        <form id="settingsForm">
            <div class="form-group">
                <label for="settingsUsername">用户名</label>
                <input type="text" id="settingsUsername" value="${user.username}">
            </div>
            <div class="form-group">
                <label for="settingsEmail">邮箱</label>
                <input type="email" id="settingsEmail" value="${user.email}">
            </div>
            <div class="form-group">
                <label for="settingsUserType">身份类型</label>
                <select id="settingsUserType">
                    <option value="learner" ${user.userType === 'learner' ? 'selected' : ''}>语言学习者</option>
                    <option value="teacher" ${user.userType === 'teacher' ? 'selected' : ''}>语言导师</option>
                    <option value="translator" ${user.userType === 'translator' ? 'selected' : ''}>翻译探索者</option>
                    <option value="researcher" ${user.userType === 'researcher' ? 'selected' : ''}>语言研究者</option>
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox">
                    <input type="checkbox" id="emailNotifications" checked>
                    <span>接收邮件通知</span>
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox">
                    <input type="checkbox" id="pushNotifications" checked>
                    <span>接收推送通知</span>
                </label>
            </div>
            <button type="submit" class="btn btn-primary">保存设置</button>
        </form>
    `);
    
    document.body.appendChild(modal);
    showModal('userSettingsModal');
    
    // 绑定表单提交事件
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsUpdate);
}

// 处理设置更新
function handleSettingsUpdate(e) {
    e.preventDefault();
    
    const username = document.getElementById('settingsUsername').value;
    const email = document.getElementById('settingsEmail').value;
    const userType = document.getElementById('settingsUserType').value;
    
    // 更新用户信息
    communityData.currentUser.username = username;
    communityData.currentUser.email = email;
    communityData.currentUser.userType = userType;
    
    // 更新存储
    const userIndex = communityData.users.findIndex(u => u.id === communityData.currentUser.id);
    if (userIndex !== -1) {
        communityData.users[userIndex] = communityData.currentUser;
        localStorage.setItem('communityUsers', JSON.stringify(communityData.users));
    }
    localStorage.setItem('currentUser', JSON.stringify(communityData.currentUser));
    
    hideModal('userSettingsModal');
    updateUI();
    showNotification('设置已更新', 'success');
}

// 创建模态框
function createModal(id, title, content, size = '') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = id;
    
    // 设置模态框大小样式
    const modalContentClass = size === 'large' ? 'modal-content large' : 'modal-content';
    
    modal.innerHTML = `
        <div class="${modalContentClass}">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" type="button" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #fff; padding: 0; width: 30px; height: 30px;">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // 绑定关闭事件
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('关闭按钮被点击');
            closeModal(id);
        });
    }
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log('背景被点击，关闭模态框');
            closeModal(id);
        }
    });
    
    return modal;
}

// 更新用户界面
function updateUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRank = document.getElementById('userRank');
    
    // 获取当前用户（优先使用新认证系统）
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (currentUser) {
        // 已登录状态 - 隐藏登录注册按钮容器，显示用户信息
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        
        // 同步到兼容层
        if (!communityData.currentUser || communityData.currentUser.id !== currentUser.id) {
            communityData.currentUser = {
                id: currentUser.id,
                username: currentUser.username,
                email: currentUser.email || currentUser.username + '@linkaitiya.star',
                userType: currentUser.userType || 'learner',
                joinDate: currentUser.joinDate || Date.now(),
                points: currentUser.points || 0,
                rank: currentUser.rank || '光线使者',
                avatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase()
            };
        }
        
        if (userAvatar) userAvatar.textContent = communityData.currentUser.avatar;
        if (userName) userName.textContent = communityData.currentUser.username;
        if (userRank) userRank.textContent = communityData.currentUser.rank;
        
        console.log('👤 用户界面已更新:', communityData.currentUser.username);
    } else {
        // 未登录状态 - 显示登录注册按钮容器，隐藏用户信息
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        
        // 清理兼容层
        communityData.currentUser = null;
        
        console.log('👤 用户界面已更新：未登录状态');
    }
    
    // 更新统计数据
    updateStats();
}

// 更新统计数据
function updateStats() {
    const totalUsers = document.getElementById('totalUsers');
    const totalPosts = document.getElementById('totalPosts');
    const onlineUsers = document.getElementById('onlineUsers');
    
    // 使用与管理页面和首页相同的用户数据获取逻辑，确保数据一致性
    let userCount = 0;
    
    // 1. 优先从 authSystem 获取所有用户（最可靠的数据源）
    if (window.authSystem && typeof window.authSystem.getAllUsers === 'function') {
        try {
            const users = window.authSystem.getAllUsers();
            // 使用管理页面的去重逻辑
            const uniqueUsers = [];
            const userIds = new Set();
            users.forEach(user => {
                if (user && user.id && !userIds.has(user.id)) {
                    userIds.add(user.id);
                    uniqueUsers.push(user);
                }
            });
            userCount = uniqueUsers.length;
            console.log('📊 从 authSystem 获取用户数:', userCount);
        } catch (error) {
            console.warn('⚠️ authSystem 获取失败:', error);
            
            // 2. 如果 authSystem 获取失败，从 localStorage 获取 linkaitiya_users
            try {
                const storedUsers = localStorage.getItem('linkaitiya_users');
                if (storedUsers) {
                    const parsed = JSON.parse(storedUsers);
                    if (Array.isArray(parsed)) {
                        // 去重处理，避免重复计数
                        const uniqueUsers = [];
                        const userIds = new Set();
                        parsed.forEach(user => {
                            if (user && user.id && !userIds.has(user.id)) {
                                userIds.add(user.id);
                                uniqueUsers.push(user);
                            }
                        });
                        userCount = uniqueUsers.length;
                        console.log('📊 从 localStorage[linkaitiya_users] 获取用户数:', userCount);
                    }
                }
            } catch (e) {
                console.warn('⚠️ 解析 linkaitiya_users 失败:', e);
            }
        }
    } else {
        // 3. 如果 authSystem 不可用，尝试从 localStorage 获取 linkaitiya_users
        try {
            const storedUsers = localStorage.getItem('linkaitiya_users');
            if (storedUsers) {
                const parsed = JSON.parse(storedUsers);
                if (Array.isArray(parsed)) {
                    // 去重处理，避免重复计数
                    const uniqueUsers = [];
                    const userIds = new Set();
                    parsed.forEach(user => {
                        if (user && user.id && !userIds.has(user.id)) {
                            userIds.add(user.id);
                            uniqueUsers.push(user);
                        }
                    });
                    userCount = uniqueUsers.length;
                    console.log('📊 从 localStorage[linkaitiya_users] 获取用户数:', userCount);
                }
            }
        } catch (error) {
            console.warn('⚠️ 解析 linkaitiya_users 失败:', error);
        }
    }
    
    // 更新用户数显示
    if (totalUsers) totalUsers.textContent = userCount;
    
    // 更新帖子数
    let postCount = 0;
    if (window.communitySystem) {
        postCount = window.communitySystem.posts.filter(p => p.status === 'active').length;
        if (totalPosts) totalPosts.textContent = postCount;
    } else if (totalPosts) {
        // 使用兼容层
        totalPosts.textContent = communityData.posts.length;
    }
    
    // 更新在线用户数
    if (window.communitySystem) {
        // 使用社区系统的在线用户数
        if (onlineUsers) onlineUsers.textContent = window.communitySystem.onlineUsers.size || Math.floor(Math.random() * 20) + 5;
    } else if (onlineUsers) {
        // 使用兼容层
        onlineUsers.textContent = Math.floor(Math.random() * 50) + 10; // 模拟在线用户数
    }
    
    console.log('📊 社区页面统计数据已更新:', { users: userCount, posts: postCount });
}

// 更新社区统计数据
function updateCommunityStats() {
    const totalUsers = document.getElementById('totalUsers');
    const totalPosts = document.getElementById('totalPosts');
    const onlineUsers = document.getElementById('onlineUsers');
    
    // 使用与管理页面和首页相同的用户数据获取逻辑，确保数据一致性
    let userCount = 0;
    
    // 1. 优先从 authSystem 获取所有用户（最可靠的数据源）
    if (window.authSystem && typeof window.authSystem.getAllUsers === 'function') {
        try {
            const users = window.authSystem.getAllUsers();
            // 使用管理页面的去重逻辑
            const uniqueUsers = [];
            const userIds = new Set();
            users.forEach(user => {
                if (user && user.id && !userIds.has(user.id)) {
                    userIds.add(user.id);
                    uniqueUsers.push(user);
                }
            });
            userCount = uniqueUsers.length;
            console.log('📊 从 authSystem 获取用户数:', userCount);
        } catch (error) {
            console.warn('⚠️ authSystem 获取失败:', error);
            
            // 2. 如果 authSystem 获取失败，从 localStorage 获取 linkaitiya_users
            try {
                const storedUsers = localStorage.getItem('linkaitiya_users');
                if (storedUsers) {
                    const parsed = JSON.parse(storedUsers);
                    if (Array.isArray(parsed)) {
                        // 去重处理，避免重复计数
                        const uniqueUsers = [];
                        const userIds = new Set();
                        parsed.forEach(user => {
                            if (user && user.id && !userIds.has(user.id)) {
                                userIds.add(user.id);
                                uniqueUsers.push(user);
                            }
                        });
                        userCount = uniqueUsers.length;
                        console.log('📊 从 localStorage[linkaitiya_users] 获取用户数:', userCount);
                    }
                }
            } catch (e) {
                console.warn('⚠️ 解析 linkaitiya_users 失败:', e);
            }
        }
    } else {
        // 3. 如果 authSystem 不可用，尝试从 localStorage 获取 linkaitiya_users
        try {
            const storedUsers = localStorage.getItem('linkaitiya_users');
            if (storedUsers) {
                const parsed = JSON.parse(storedUsers);
                if (Array.isArray(parsed)) {
                    // 去重处理，避免重复计数
                    const uniqueUsers = [];
                    const userIds = new Set();
                    parsed.forEach(user => {
                        if (user && user.id && !userIds.has(user.id)) {
                            userIds.add(user.id);
                            uniqueUsers.push(user);
                        }
                    });
                    userCount = uniqueUsers.length;
                    console.log('📊 从 localStorage[linkaitiya_users] 获取用户数:', userCount);
                }
            }
        } catch (error) {
            console.warn('⚠️ 解析 linkaitiya_users 失败:', error);
        }
    }
    
    // 更新用户数显示
    if (totalUsers) totalUsers.textContent = userCount;
    
    // 更新帖子数
    let postCount = 0;
    if (window.communitySystem) {
        postCount = window.communitySystem.posts.filter(p => p.status === 'active').length;
        if (totalPosts) totalPosts.textContent = postCount;
    } else if (totalPosts) {
        // 使用兼容层
        totalPosts.textContent = communityData.posts.length;
    }
    
    // 更新在线用户数
    if (window.communitySystem) {
        // 使用社区系统的在线用户数
        if (onlineUsers) onlineUsers.textContent = window.communitySystem.onlineUsers.size || Math.floor(Math.random() * 20) + 5;
    } else if (onlineUsers) {
        // 使用兼容层
        onlineUsers.textContent = Math.floor(Math.random() * 50) + 10; // 模拟在线用户数
    }
    
    console.log('📊 社区页面统计数据已更新:', { users: userCount, posts: postCount });
}

// 启动实时更新
function startRealTimeUpdates() {
    // 定期更新统计数据，但避免过于频繁的更新
    setInterval(() => {
        updateCommunityStats();
    }, 60000); // 每60秒更新一次，避免频繁更新导致的问题
    
    // 监听用户活动
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.communitySystem?.currentUser) {
            window.communitySystem.currentUser.lastActiveTime = Date.now();
            window.communitySystem.updateUserStats();
        }
    });
}

// 加载内容
function loadContent() {
    loadDiscussions('all'); // 传入默认筛选类型
    loadOnlineUsers();
    loadRecentActivity();
}

// 加载在线用户
function loadOnlineUsers() {
    const onlineList = document.getElementById('onlineUsersList');
    if (!onlineList) return;
    
    const onlineUsersList = [
        { name: '星光法师', avatar: '🌟' },
        { name: '月影忍者', avatar: '🌙' },
        { name: '彩虹学者', avatar: '🌈' },
        { name: '光线探索者', avatar: '✨' },
        { name: '魔法学徒', avatar: '🔮' }
    ];
    
    onlineList.innerHTML = '';
    
    onlineUsersList.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'online-user';
        userElement.innerHTML = `
            <div class="online-avatar">${user.avatar}</div>
            <div class="online-name">${user.name}</div>
            <div class="online-status"></div>
        `;
        onlineList.appendChild(userElement);
    });
}

// 加载最新动态
function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;
    
    const activities = [
        { text: '星光法师 发布了新话题', time: '2分钟前' },
        { text: '月影忍者 回复了讨论', time: '5分钟前' },
        { text: '彩虹学者 分享了资源', time: '10分钟前' },
        { text: '光线探索者 加入了学习小组', time: '15分钟前' },
        { text: '魔法学徒 完成了每日挑战', time: '20分钟前' }
    ];
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-text">${activity.text}</div>
            <div class="activity-time">${activity.time}</div>
        `;
        activityList.appendChild(activityElement);
    });
}

// 显示新帖子模态框
function showNewPostModal() {
    console.log('🌟 开始创建发帖模态框...');
    
    // 检查用户是否已登录，优先使用新认证系统
    const isLoggedIn = (window.authSystem && window.authSystem.currentUser) || 
                      (window.communitySystem && window.communitySystem.currentUser);
    
    if (!isLoggedIn) {
        console.log('用户未登录，显示登录提示');
        showLoginPrompt();
        return;
    }
    
    console.log('✅ 用户已登录，创建发帖模态框...');
    
    // 防止重复创建 - 先移除已存在的模态框
    const existingModal = document.getElementById('newPostModal');
    if (existingModal) {
        console.log('发现已存在的模态框，先移除...');
        existingModal.remove();
        // 等待DOM更新
        setTimeout(() => {
            createNewPostModal();
        }, 100);
        return;
    }
    
    // 直接创建新模态框
    createNewPostModal();
}

// 创建新帖子模态框的具体实现
function createNewPostModal() {
    console.log('🎯 开始创建模态框HTML...');
    
    // 防止事件传播导致的闪退
    document.body.style.overflow = 'hidden';
    
    // 创建模态框HTML（移除动画避免闪退）
    const modalHTML = `
        <div class="modal" id="newPostModal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); z-index: 10000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
            <div class="modal-content large" style="background: linear-gradient(145deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95)); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; max-width: 700px; width: 90%; max-height: 90vh; overflow-y: auto; transform: scale(0.9); transition: transform 0.3s ease;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <h3 style="color: #ffd700; margin: 0;">✨ 发布新话题</h3>
                    <button class="close-modal-btn" type="button" onclick="closeNewPostModal(); return false;" style="background: none; border: none; color: #e0e0e0; font-size: 1.5rem; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.1)'; this.style.color='#ffd700';" onmouseout="this.style.background='none'; this.style.color='#e0e0e0';">&times;</button>
                </div>
                <div class="modal-body" style="padding: 30px;">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="newPostTitle" style="display: block; color: #ffd700; margin-bottom: 8px; font-weight: 500;">标题</label>
                        <input type="text" id="newPostTitle" placeholder="请输入话题标题..." required style="width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 1rem;">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="newPostCategory" style="display: block; color: #ffd700; margin-bottom: 8px; font-weight: 500;">分类</label>
                        <select id="newPostCategory" style="width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 1rem;">
                            <option value="general" style="background: #1a1a2e; color: white;">一般讨论</option>
                            <option value="grammar" style="background: #1a1a2e; color: white;">语法问题</option>
                            <option value="vocabulary" style="background: #1a1a2e; color: white;">词汇学习</option>
                            <option value="culture" style="background: #1a1a2e; color: white;">文化交流</option>
                            <option value="translation" style="background: #1a1a2e; color: white;">翻译讨论</option>
                            <option value="resources" style="background: #1a1a2e; color: white;">资源分享</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="newPostContent" style="display: block; color: #ffd700; margin-bottom: 8px; font-weight: 500;">内容</label>
                        <textarea id="newPostContent" rows="8" placeholder="分享您的想法..." required style="width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 1rem; resize: vertical; min-height: 120px;"></textarea>
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="newPostTags" style="display: block; color: #ffd700; margin-bottom: 8px; font-weight: 500;">标签</label>
                        <input type="text" id="newPostTags" placeholder="请输入标签，用逗号分隔" style="width: 100%; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white; font-size: 1rem;">
                        <span class="form-hint" style="color: #b0b0c8; font-size: 0.8rem; margin-top: 5px; display: block;">例如：语法,初学者,疑问</span>
                    </div>
                    <div class="form-actions" style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px;">
                        <button type="button" class="btn-cancel" style="padding: 10px 20px; border: 2px solid rgba(255, 215, 0, 0.5); border-radius: 25px; background: transparent; color: #ffd700; cursor: pointer; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,215,0,0.1)'; this.style.borderColor='#ffd700';" onmouseout="this.style.background='transparent'; this.style.borderColor='rgba(255,215,0,0.5)';">取消</button>
                        <button type="button" class="btn-submit" style="padding: 10px 20px; border: none; border-radius: 25px; background: linear-gradient(45deg, #ffd700, #4ecdc4); color: #1a1a2e; cursor: pointer; font-weight: 500; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(255,215,0,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">🚀 发布话题</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    console.log('💫 添加模态框到页面...');
    
    // 使用 try-catch 防止插入失败
    try {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 模态框HTML已插入');
        
        // 立即获取模态框元素并检查
        const modal = document.getElementById('newPostModal');
        if (!modal) {
            throw new Error('模态框创建失败');
        }
        
        console.log('🎯 开始绑定事件...');
        setupModalEvents(modal);
        
        // 显示动画
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(1)';
            }
        }, 50);
        
        console.log('🎉 模态框创建和显示完成！');
        
    } catch (error) {
        console.error('❌ 模态框创建失败:', error);
        document.body.style.overflow = 'auto';
        showNotification('模态框创建失败，请刷新页面重试', 'error');
    }
}

// 设置模态框事件
function setupModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal-btn');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const submitBtn = modal.querySelector('.btn-submit');
    
    console.log('绑定按钮事件...', {
        closeBtn: !!closeBtn,
        cancelBtn: !!cancelBtn,
        submitBtn: !!submitBtn
    });
    
    // 防止事件冒泡的通用处理
    function preventBubble(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    
    // 关闭按钮事件 - 多重防护
    if (closeBtn) {
        // 第一重防护：直接onclick
        closeBtn.onclick = function(e) {
            console.log('🔴 关闭按钮 onclick 触发');
            preventBubble(e);
            closeNewPostModal();
            return false;
        };
        
        // 第二重防护：addEventListener
        closeBtn.addEventListener('click', function(e) {
            console.log('🔴 关闭按钮 addEventListener 触发');
            preventBubble(e);
            closeNewPostModal();
            return false;
        }, { capture: true, once: false });
        
        console.log('✅ 关闭按钮事件已绑定');
    } else {
        console.error('❌ 未找到关闭按钮');
    }
    
    // 取消按钮事件
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            console.log('🟡 取消按钮被点击');
            preventBubble(e);
            closeNewPostModal();
        });
        console.log('✅ 取消按钮事件已绑定');
    }
    
    // 提交按钮事件
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            console.log('🚀 提交按钮被点击');
            preventBubble(e);
            handleNewPostSubmit();
        });
        console.log('✅ 提交按钮事件已绑定');
    } else {
        console.error('❌ 未找到提交按钮');
    }
    
    // 点击背景关闭 - 但防止意外关闭
    modal.addEventListener('click', function(e) {
        // 只有点击背景（不是内容区域）才关闭
        if (e.target === modal) {
            console.log('🌆 背景被点击，关闭模态框');
            closeNewPostModal();
        }
    });
    
    // ESC键关闭
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            console.log('⌨️ ESC键被按下，关闭模态框');
            closeNewPostModal();
        }
    }
    
    document.addEventListener('keydown', handleEscKey);
    
    // 将事件监听器存储到模态框上，以便清理
    modal._escKeyHandler = handleEscKey;
    
    console.log('🎆 所有事件已绑定完成！');
}

// 关闭发帖模态框 - 增强版本
function closeNewPostModal() {
    console.log('💫 开始关闭发帖模态框...');
    
    const modal = document.getElementById('newPostModal');
    if (!modal) {
        console.log('⚠️ 模态框不存在，无需关闭');
        return;
    }
    
    // 清理事件监听器
    if (modal._escKeyHandler) {
        document.removeEventListener('keydown', modal._escKeyHandler);
        console.log('✅ ESC事件监听器已清理');
    }
    
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
    
    // 关闭动画
    modal.style.opacity = '0';
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.transform = 'scale(0.9)';
    }
    
    // 延迟移除DOM元素
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
            console.log('✅ 模态框已从 DOM 中移除');
        }
    }, 300);
    
    console.log('🎉 模态框关闭流程完成！');
}

// 处理新帖子提交
function handleNewPostSubmit() {
    console.log('开始处理新帖子提交...');
    
    // 确保兼容层存在和初始化
    if (typeof communityData === 'undefined' || !communityData) {
        console.warn('⚠️ communityData 未定义，正在重新初始化...');
        ensureCompatibilityLayer();
    }
    
    // 获取表单元素
    const titleElement = document.getElementById('newPostTitle');
    const contentElement = document.getElementById('newPostContent');
    const categoryElement = document.getElementById('newPostCategory');
    const tagsElement = document.getElementById('newPostTags');
    
    console.log('表单元素检查:', {
        title: !!titleElement,
        content: !!contentElement,
        category: !!categoryElement,
        tags: !!tagsElement
    });
    
    if (!titleElement || !contentElement) {
        console.error('未找到表单元素');
        showNotification('表单元素加载失败，请刷新页面重试', 'error');
        return;
    }
    
    const title = titleElement.value.trim();
    const content = contentElement.value.trim();
    const category = categoryElement ? categoryElement.value : 'general';
    const tagsInput = tagsElement ? tagsElement.value.trim() : '';
    
    console.log('表单数据:', { title, content, category, tagsInput });
    
    if (!title) {
        showNotification('请填写标题', 'error');
        titleElement.focus();
        return;
    }
    
    if (!content) {
        showNotification('请填写内容', 'error');
        contentElement.focus();
        return;
    }
    
    // 检查用户是否已登录
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser);
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        closeNewPostModal();
        showLoginPrompt();
        return;
    }
    
    console.log('当前用户:', currentUser.username);
    
    try {
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        // 创建帖子数据
        const newPost = {
            id: Date.now().toString(),
            title: title,
            content: content,
            category: category,
            tags: tags,
            author: {
                id: currentUser.id || 'user_' + Date.now(),
                username: currentUser.username,
                displayName: currentUser.displayName || currentUser.username,
                avatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase()
            },
            timestamp: Date.now(),
            likes: [],
            replyCount: 0,
            views: 0,
            status: 'active',
            timeDisplay: '刚刚'
        };
        
        console.log('创建的帖子数据:', newPost);
        
        // 保存到本地存储
        const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        existingPosts.unshift(newPost);
        localStorage.setItem('communityPosts', JSON.stringify(existingPosts));
        
        // 同时更新兼容层
        if (typeof communityData !== 'undefined' && communityData && Array.isArray(communityData.posts)) {
            communityData.posts.unshift(newPost);
            console.log('✅ 兼容层已同步更新');
        }
        
        console.log('帖子已保存到本地存储');
        
        // 显示成功消息 - 使用通知而不是alert
        showNotification('🎉 话题发布成功！', 'success');
        
        console.log('🎆 帖子发布成功，开始刷新界面...');
        
        // 关闭模态框
        closeNewPostModal();
        
        // 延迟刷新，确保模态框完全关闭
        setTimeout(() => {
            // 刷新讨论列表
            if (typeof loadDiscussions === 'function') {
                console.log('🔄 正在刷新讨论列表...');
                loadDiscussions('all');
            } else {
                console.warn('⚠️ loadDiscussions 函数不存在');
            }
            
            // 更新统计数据
            if (typeof updateCommunityStats === 'function') {
                updateCommunityStats();
            } else if (typeof updateStats === 'function') {
                updateStats();
            }
            
            console.log('✅ 界面刷新完成');
        }, 300);
        
        console.log('帖子发布流程完成');
        
    } catch (error) {
        console.error('发帖错误:', error);
        console.error('错误堆栈:', error.stack);
        
        // 详细的错误诊断
        console.log('🔍 错误诊断信息:');
        console.log('- communityData存在:', typeof communityData !== 'undefined');
        console.log('- window.authSystem存在:', typeof window.authSystem !== 'undefined');
        console.log('- window.communitySystem存在:', typeof window.communitySystem !== 'undefined');
        
        // 根据错误类型提供更具体的提示
        let errorMessage = '发布失败：';
        if (error.message.includes('communityData')) {
            errorMessage += 'communityData 初始化失败，请刷新页面重试';
        } else if (error.message.includes('undefined')) {
            errorMessage += '系统初始化不完整，请刷新页面重试';
        } else {
            errorMessage += (error.message || '未知错误');
        }
        
        showNotification(errorMessage, 'error');
    }
}

// 提交新帖子
function submitNewPost() {
    console.log('开始提交新帖子...');
    
    // 获取表单元素
    const titleElement = document.getElementById('newPostTitle');
    const contentElement = document.getElementById('newPostContent');
    const categoryElement = document.getElementById('newPostCategory');
    const tagsElement = document.getElementById('newPostTags');
    
    if (!titleElement || !contentElement) {
        console.error('未找到表单元素');
        showNotification('表单元素加载失败，请刷新页面重试', 'error');
        return;
    }
    
    const title = titleElement.value.trim();
    const content = contentElement.value.trim();
    const category = categoryElement ? categoryElement.value : 'general';
    const tagsInput = tagsElement ? tagsElement.value.trim() : '';
    
    console.log('表单数据:', { title, content, category, tagsInput });
    
    if (!title || !content) {
        showNotification('请填写标题和内容', 'error');
        return;
    }
    
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    try {
        // 检查用户是否已登录
        const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                           (window.communitySystem && window.communitySystem.currentUser);
        
        if (!currentUser) {
            showNotification('请先登录', 'error');
            return;
        }
        
        console.log('当前用户:', currentUser.username);
        
        // 使用社区系统创建帖子（如果可用）
        let newPost;
        if (window.communitySystem && typeof window.communitySystem.createPost === 'function') {
            console.log('使用社区系统创建帖子...');
            newPost = window.communitySystem.createPost({
                title: title,
                content: content,
                category: category,
                tags: tags
            });
        } else {
            console.log('使用备用方案创建帖子...');
            // 备用方案：手动创建帖子对象
            newPost = {
                id: Date.now().toString(),
                title: title,
                content: content,
                category: category,
                tags: tags,
                author: {
                    id: currentUser.id || 'user_' + Date.now(),
                    username: currentUser.username,
                    displayName: currentUser.displayName || currentUser.username,
                    avatar: currentUser.avatar || currentUser.username.charAt(0).toUpperCase()
                },
                timestamp: Date.now(),
                likes: [],
                replyCount: 0,
                views: 0,
                status: 'active'
            };
            
            // 尝试保存到本地存储
            const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
            existingPosts.unshift(newPost);
            localStorage.setItem('communityPosts', JSON.stringify(existingPosts));
        }
        
        console.log('帖子创建成功:', newPost.title);
        showNotification('话题发布成功！', 'success');
        closeNewPostModal();
        
        // 刷新讨论列表
        if (typeof loadDiscussions === 'function') {
            loadDiscussions('all');
        }
        if (typeof updateCommunityStats === 'function') {
            updateCommunityStats();
        }
        
    } catch (error) {
        console.error('发帖错误:', error);
        showNotification('发布失败：' + (error.message || '未知错误'), 'error');
    }
}

// 显示登录提示
function showLoginPrompt() {
    const modal = createModal('loginPromptModal', '需要登录', `
        <div class="login-prompt-content">
            <div class="prompt-icon">🔐</div>
            <p>您需要登录才能执行此操作</p>
            <p>加入我们的光线使者社区，开始您的琳凯蒂亚语学习之旅！</p>
            <div class="prompt-actions">
                <button class="btn btn-primary" onclick="if(typeof showNewLoginModal === 'function') { showNewLoginModal(); } else { showLoginModal(); } closeModal('loginPromptModal');">
                    立即登录
                </button>
                <button class="btn btn-outline" onclick="if(typeof showNewRegisterModal === 'function') { showNewRegisterModal(); } else { showRegisterModal(); } closeModal('loginPromptModal');">
                    注册账号
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    showModal('loginPromptModal');
}

// 用户删除自己的帖子
function deleteMyPost(postId) {
    console.log('🗑️ 尝试删除帖子:', postId);
    
    // 检查用户是否已登录
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    // 确认删除
    if (!confirm('确定要删除这个帖子吗？此操作不可撤销。')) {
        return;
    }
    
    try {
        // 从 localStorage 获取帖子列表
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const postIndex = posts.findIndex(p => p.id == postId);
        
        if (postIndex === -1) {
            showNotification('帖子不存在', 'error');
            return;
        }
        
        const post = posts[postIndex];
        
        // 检查是否为帖子作者
        const isAuthor = (post.author && typeof post.author === 'object' && post.author.id === currentUser.id) ||
                        (post.authorId === currentUser.id) ||
                        (typeof post.author === 'string' && post.author === currentUser.username);
        
        if (!isAuthor) {
            showNotification('您只能删除自己发布的帖子', 'error');
            return;
        }
        
        // 删除帖子
        posts.splice(postIndex, 1);
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        // 同时更新兼容层
        if (communityData && Array.isArray(communityData.posts)) {
            const compatIndex = communityData.posts.findIndex(p => p.id == postId);
            if (compatIndex !== -1) {
                communityData.posts.splice(compatIndex, 1);
            }
        }
        
        // 显示成功消息
        showNotification('帖子已删除', 'success');
        
        // 刷新讨论列表
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterType = activeFilter ? activeFilter.dataset.filter : 'all';
        loadDiscussions(filterType);
        
        // 更新统计数据
        if (typeof updateCommunityStats === 'function') {
            updateCommunityStats();
        } else if (typeof updateStats === 'function') {
            updateStats();
        }
        
        console.log('✅ 帖子删除成功');
        
    } catch (error) {
        console.error('❌ 删除帖子失败:', error);
        showNotification('删除失败：' + (error.message || '未知错误'), 'error');
    }
}

// 查看帖子详情
function viewPostDetail(postId) {
    console.log('👁️ 查看帖子详情:', postId);
    
    try {
        // 从 localStorage 获取帖子
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const post = posts.find(p => p.id == postId);
        
        if (!post) {
            showNotification('帖子不存在', 'error');
            return;
        }
        
        // 增加浏览量
        post.views = (post.views || 0) + 1;
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        // 同时更新兼容层
        if (communityData && Array.isArray(communityData.posts)) {
            const compatPost = communityData.posts.find(p => p.id == postId);
            if (compatPost) {
                compatPost.views = post.views;
            }
        }
        
        // 处理作者信息
        const authorName = post.author ? 
            (typeof post.author === 'string' ? post.author : post.author.username || post.author.displayName) : 
            '匿名用户';
        
        const authorId = post.author && typeof post.author === 'object' ? 
            post.author.id : (post.authorId || 'unknown');
        
        const authorAvatar = post.author && typeof post.author === 'object' ? 
            (post.author.avatar || post.author.username.charAt(0).toUpperCase()) : 
            authorName.charAt(0).toUpperCase();
        
        // 处理时间显示
        const timeDisplay = post.timeDisplay || (post.timestamp ? getTimeAgo(post.timestamp) : '刚刚');
        
        // 处理数据统计
        const views = post.views || 0;
        const likes = Array.isArray(post.likes) ? post.likes.length : (post.likes || 0);
        const replies = post.replyCount || post.replies || 0;
        
        // 处理标签
        const tags = Array.isArray(post.tags) ? post.tags : [];
        
        // 检查当前用户是否为帖子作者
        const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                           (window.communitySystem && window.communitySystem.currentUser) ||
                           communityData.currentUser;
        
        const isAuthor = currentUser && (currentUser.id === authorId || currentUser.username === authorName);
        const isLoggedIn = !!currentUser;
        
        // 创建详情模态框
        const modalContent = `
            <div class="post-detail" style="max-height: 70vh; overflow-y: auto;">
                <div class="post-detail-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="author-info" style="display: flex; align-items: center; gap: 1rem;">
                        <div class="author-avatar" style="width: 50px; height: 50px; background: linear-gradient(45deg, #ffd700, #4ecdc4); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #1a1a2e; font-weight: bold;">${authorAvatar}</div>
                        <div class="author-details">
                            <div class="author-name" style="color: #ffd700; font-weight: 600; font-size: 1.1rem;">${authorName}</div>
                            <div class="post-time" style="color: #a0a0a0; font-size: 0.9rem;">🕰️ ${timeDisplay}</div>
                        </div>
                    </div>
                    <div class="post-stats" style="display: flex; gap: 1rem; color: #a0a0a0;">
                        <span style="display: flex; align-items: center; gap: 0.25rem;">👁️ ${views}</span>
                        <span style="display: flex; align-items: center; gap: 0.25rem;">❤️ ${likes}</span>
                        <span style="display: flex; align-items: center; gap: 0.25rem;">💬 ${replies}</span>
                    </div>
                </div>
                
                <div class="post-detail-content" style="color: #e0e0e0; line-height: 1.8; margin-bottom: 1.5rem; white-space: pre-wrap;">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
                
                ${tags.length > 0 ? `
                    <div class="post-detail-tags" style="margin-bottom: 1.5rem;">
                        ${tags.map(tag => `<span class="post-tag" style="background: rgba(78, 205, 196, 0.2); color: #4ecdc4; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; border: 1px solid rgba(78, 205, 196, 0.3); margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block;">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="post-detail-actions" style="display: flex; gap: 1rem; flex-wrap: wrap; padding: 1rem 0; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    ${isLoggedIn ? `
                        <button class="btn btn-outline" onclick="likePost('${post.id}')" style="background: rgba(255, 215, 0, 0.1); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                            ❤️ ${likes > 0 ? likes : ''} 点赞
                        </button>
                        <button class="btn btn-primary" onclick="showPostReplyForm('${post.id}')" style="background: linear-gradient(45deg, #ffd700, #4ecdc4); color: #1a1a2e; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                            💬 回复
                        </button>
                    ` : `
                        <p style="color: #a0a0a0; font-style: italic;">请<a href="#" onclick="showLoginPrompt(); closeModal('postDetailModal');" style="color: #4ecdc4; text-decoration: none;">登录</a>后参与互动</p>
                    `}
                    ${isAuthor ? `
                        <button class="btn btn-danger" onclick="deleteMyPost('${post.id}'); closeModal('postDetailModal');" style="background: rgba(244, 67, 54, 0.2); color: #f44336; border: 1px solid rgba(244, 67, 54, 0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                            🗑️ 删除
                        </button>
                    ` : ''}
                </div>
                
                <div class="replies-section" style="margin-top: 2rem;">
                    <h4 style="color: #ffd700; margin-bottom: 1rem;">回复 (${replies})</h4>
                    <div id="repliesList" class="replies-list">
                        <!-- 回复列表将通过 loadPostReplies 函数动态加载 -->
                    </div>
                    
                    ${isLoggedIn ? `
                        <div class="reply-form" id="replyForm_${post.id}" style="margin-top: 1.5rem; padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; display: none;">
                            <h5 style="color: #ffd700; margin-bottom: 1rem;">发表回复</h5>
                            <textarea id="replyContent_${post.id}" placeholder="写下您的回复..." rows="3" style="width: 100%; padding: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white; resize: vertical;"></textarea>
                            <div class="reply-form-actions" style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button class="btn btn-primary" onclick="submitPostReply('${post.id}')" style="background: linear-gradient(45deg, #ffd700, #4ecdc4); color: #1a1a2e; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: 500;">
                                    发表回复
                                </button>
                                <button class="btn btn-outline" onclick="hidePostReplyForm('${post.id}')" style="background: transparent; color: #e0e0e0; border: 1px solid rgba(255, 255, 255, 0.3); padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer;">
                                    取消
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // 创建并显示模态框
        const modal = createModal('postDetailModal', post.title, modalContent, 'large');
        document.body.appendChild(modal);
        showModal('postDetailModal');
        
        // 加载回复列表
        loadPostReplies(postId);
        
        console.log('✅ 帖子详情显示完成');
        
    } catch (error) {
        console.error('❌ 查看帖子详情失败:', error);
        showNotification('加载详情失败：' + (error.message || '未知错误'), 'error');
    }
}

// 加载帖子回复列表
function loadPostReplies(postId) {
    console.log('📋 加载帖子回复:', postId);
    
    try {
        const repliesContainer = document.getElementById('repliesList');
        if (!repliesContainer) {
            console.warn('回复容器不存在');
            return;
        }
        
        // 从 localStorage 获取回复数据
        const allReplies = JSON.parse(localStorage.getItem('communityReplies') || '[]');
        const postReplies = allReplies.filter(reply => reply.postId === postId && reply.status === 'active');
        
        if (postReplies.length === 0) {
            repliesContainer.innerHTML = '<p style="color: #a0a0a0; font-style: italic; text-align: center; padding: 2rem;">暂无回复，快来抢沙发吧！</p>';
            return;
        }
        
        // 筛选顶级回复（没有 parentReplyId 的回复）
        const topLevelReplies = postReplies.filter(reply => !reply.parentReplyId);
        
        // 构建回复数据结构（包含子回复）
        const repliesWithChildren = topLevelReplies.map(reply => {
            return {
                ...reply,
                author: getUserById(reply.authorId) || { id: reply.authorId, username: '已删除用户', avatar: '👤' },
                timeDisplay: formatTime(reply.timestamp),
                children: getChildReplies(reply.id, postReplies)
            };
        }).sort((a, b) => a.timestamp - b.timestamp);
        
        // 渲染回复列表
        repliesContainer.innerHTML = renderReplies(repliesWithChildren);
        
        console.log(`✅ 加载了 ${repliesWithChildren.length} 个顶级回复`);
        
    } catch (error) {
        console.error('❌ 加载回复失败:', error);
        const repliesContainer = document.getElementById('repliesList');
        if (repliesContainer) {
            repliesContainer.innerHTML = '<p style="color: #f44336; font-style: italic; text-align: center; padding: 2rem;">加载回复失败</p>';
        }
    }
}

// 获取子回复
function getChildReplies(parentReplyId, allReplies) {
    const childReplies = allReplies.filter(reply => reply.parentReplyId === parentReplyId);
    return childReplies.map(reply => {
        return {
            ...reply,
            author: getUserById(reply.authorId) || { id: reply.authorId, username: '已删除用户', avatar: '👤' },
            timeDisplay: formatTime(reply.timestamp),
            children: getChildReplies(reply.id, allReplies)
        };
    }).sort((a, b) => a.timestamp - b.timestamp);
}

// 获取用户信息
function getUserById(userId) {
    // 先从 localStorage 获取所有用户
    const allUsers = JSON.parse(localStorage.getItem('communityUsers') || '[]');
    let user = allUsers.find(u => u.id === userId);
    
    if (!user && window.communitySystem && typeof window.communitySystem.getUserById === 'function') {
        user = window.communitySystem.getUserById(userId);
    }
    
    // 如果还是找不到，返回默认用户
    if (!user) {
        return {
            id: userId,
            username: '匿名用户',
            displayName: '匿名用户',
            avatar: '👤'
        };
    }
    
    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName || user.username,
        avatar: user.avatar || '👤'
    };
}

// 格式化时间显示
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) { // 1分钟内
        return '刚刚';
    } else if (diff < 3600000) { // 1小时内
        return Math.floor(diff / 60000) + '分钟前';
    } else if (diff < 86400000) { // 1天内
        return Math.floor(diff / 3600000) + '小时前';
    } else { // 超过1天
        const date = new Date(timestamp);
        return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}

// 切换回复点赞
function toggleReplyLike(replyId) {
    console.log('❤️ 点赞回复:', replyId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    try {
        // 从 localStorage 获取回复列表
        const allReplies = JSON.parse(localStorage.getItem('communityReplies') || '[]');
        const reply = allReplies.find(r => r.id === replyId);
        
        if (!reply) {
            showNotification('回复不存在', 'error');
            return;
        }
        
        // 确保 likes 是数组
        if (!Array.isArray(reply.likes)) {
            reply.likes = [];
        }
        
        const userId = currentUser.id || currentUser.username;
        const userIndex = reply.likes.findIndex(id => id === userId);
        
        if (userIndex !== -1) {
            // 取消点赞
            reply.likes.splice(userIndex, 1);
            showNotification('已取消点赞', 'info');
        } else {
            // 添加点赞
            reply.likes.push(userId);
            showNotification('点赞成功', 'success');
        }
        
        // 保存到 localStorage
        localStorage.setItem('communityReplies', JSON.stringify(allReplies));
        
        // 重新加载回复列表
        loadPostReplies(reply.postId);
        
    } catch (error) {
        console.error('❌ 点赞回复失败:', error);
        showNotification('操作失败：' + (error.message || '未知错误'), 'error');
    }
}

// 回复回复（嵌套回复）
function replyToReply(parentReplyId) {
    console.log('📝 回复回复:', parentReplyId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    // 这里可以展开一个嵌套回复表单，暂时提示功能开发中
    showNotification('嵌套回复功能开发中...', 'info');
}

// 点赞帖子
function likePost(postId) {
    console.log('❤️ 点赞帖子:', postId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    try {
        // 从 localStorage 获取帖子列表
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const post = posts.find(p => p.id == postId);
        
        if (!post) {
            showNotification('帖子不存在', 'error');
            return;
        }
        
        // 确保 likes 是数组
        if (!Array.isArray(post.likes)) {
            post.likes = [];
        }
        
        // 检查是否已点赞
        const userIndex = post.likes.findIndex(userId => userId === currentUser.id || userId === currentUser.username);
        
        if (userIndex !== -1) {
            // 取消点赞
            post.likes.splice(userIndex, 1);
            showNotification('已取消点赞', 'info');
        } else {
            // 添加点赞
            post.likes.push(currentUser.id || currentUser.username);
            showNotification('点赞成功', 'success');
        }
        
        // 保存到 localStorage
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        // 同时更新兼容层
        if (communityData && Array.isArray(communityData.posts)) {
            const compatPost = communityData.posts.find(p => p.id == postId);
            if (compatPost) {
                compatPost.likes = post.likes;
            }
        }
        
        // 刷新显示
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterType = activeFilter ? activeFilter.dataset.filter : 'all';
        loadDiscussions(filterType);
        
        // 如果详情页面打开，也更新详情页面
        const detailModal = document.getElementById('postDetailModal');
        if (detailModal) {
            closeModal('postDetailModal');
            setTimeout(() => viewPostDetail(postId), 300);
        }
        
    } catch (error) {
        console.error('❌ 点赞操作失败:', error);
        showNotification('操作失败：' + (error.message || '未知错误'), 'error');
    }
}

// 显示回复表单
function showPostReplyForm(postId) {
    const replyForm = document.getElementById(`replyForm_${postId}`);
    if (replyForm) {
        replyForm.style.display = 'block';
        const textarea = document.getElementById(`replyContent_${postId}`);
        if (textarea) {
            textarea.focus();
        }
    }
}

// 隐藏回复表单
function hidePostReplyForm(postId) {
    const replyForm = document.getElementById(`replyForm_${postId}`);
    if (replyForm) {
        replyForm.style.display = 'none';
        const textarea = document.getElementById(`replyContent_${postId}`);
        if (textarea) {
            textarea.value = '';
        }
    }
}

// 提交回复
function submitPostReply(postId) {
    console.log('💬 提交回复:', postId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showNotification('请先登录', 'error');
        return;
    }
    
    const textarea = document.getElementById(`replyContent_${postId}`);
    if (!textarea) {
        showNotification('回复表单不存在', 'error');
        return;
    }
    
    const content = textarea.value.trim();
    if (!content) {
        showNotification('请输入回复内容', 'error');
        textarea.focus();
        return;
    }
    
    try {
        // 从 localStorage 获取帖子列表
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const post = posts.find(p => p.id == postId);
        
        if (!post) {
            showNotification('帖子不存在', 'error');
            return;
        }
        
        // 创建新回复
        const newReply = {
            id: 'reply_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            postId: postId,
            authorId: currentUser.id || currentUser.username,
            content: content,
            parentReplyId: null, // 顶级回复
            timestamp: Date.now(),
            likes: [],
            status: 'active'
        };
        
        // 从 localStorage 获取现有回复
        const allReplies = JSON.parse(localStorage.getItem('communityReplies') || '[]');
        allReplies.push(newReply);
        
        // 保存回复到 localStorage
        localStorage.setItem('communityReplies', JSON.stringify(allReplies));
        
        // 增加帖子的回复数
        post.replyCount = (post.replyCount || post.replies || 0) + 1;
        post.replies = post.replyCount; // 兼容旧字段
        
        // 保存帖子列表
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        // 同时更新兼容层
        if (communityData && Array.isArray(communityData.posts)) {
            const compatPost = communityData.posts.find(p => p.id == postId);
            if (compatPost) {
                compatPost.replyCount = post.replyCount;
                compatPost.replies = post.replyCount;
            }
        }
        
        showNotification('回复发表成功！', 'success');
        
        // 清空并隐藏表单
        textarea.value = '';
        hidePostReplyForm(postId);
        
        // 重新加载回复列表
        loadPostReplies(postId);
        
        // 更新回复数显示
        const repliesTitle = document.querySelector('.replies-section h4');
        if (repliesTitle) {
            repliesTitle.textContent = `回复 (${post.replyCount})`;
        }
        
        // 刷新列表显示
        const activeFilter = document.querySelector('.filter-btn.active');
        const filterType = activeFilter ? activeFilter.dataset.filter : 'all';
        loadDiscussions(filterType);
        
    } catch (error) {
        console.error('❌ 提交回复失败:', error);
        showNotification('回复失败：' + (error.message || '未知错误'), 'error');
    }
}

// 回复帖子（快捷方式）
function replyToPost(postId) {
    console.log('💬 回复帖子:', postId);
    
    const currentUser = (window.authSystem && window.authSystem.currentUser) || 
                       (window.communitySystem && window.communitySystem.currentUser) ||
                       communityData.currentUser;
    
    if (!currentUser) {
        showLoginPrompt();
        return;
    }
    
    // 打开详情页面并显示回复表单
    viewPostDetail(postId);
    
    // 延迟显示回复表单，确保模态框已完全加载
    setTimeout(() => {
        showPostReplyForm(postId);
    }, 500);
}

// 管理员功能：置顶/取消置顶帖子
function adminTogglePin(postId) {
    if (!window.communitySystem.isAdmin()) {
        showNotification('没有管理权限', 'error');
        return;
    }
    
    const post = window.communitySystem.posts.find(p => p.id === postId);
    if (!post) {
        showNotification('帖子不存在', 'error');
        return;
    }
    
    post.isPinned = !post.isPinned;
    window.communitySystem.savePosts();
    
    showNotification(post.isPinned ? '帖子已置顶' : '已取消置顶', 'success');
    
    // 刷新列表和详情页
    loadDiscussions('all');
    
    // 更新详情页按钮文本
    const pinBtn = document.querySelector(`[onclick="adminTogglePin('${postId}')"]`);
    if (pinBtn) {
        pinBtn.textContent = post.isPinned ? '取消置顶' : '置顶';
    }
}

// 管理员功能：删除帖子
function adminDeletePost(postId) {
    if (!window.communitySystem.isAdmin()) {
        showNotification('没有管理权限', 'error');
        return;
    }
    
    const confirmDelete = confirm('确定要删除这个帖子吗？此操作不可撤销。');
    if (!confirmDelete) return;
    
    try {
        window.communitySystem.deletePost(postId, '管理员删除');
        showNotification('帖子已删除', 'success');
        
        // 关闭详情模态框
        closeModal('postDetailModal');
        
        // 刷新列表
        loadDiscussions('all');
        updateCommunityStats();
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// 筛选帖子
function filterPosts(filterType) {
    console.log('🔍 筛选帖子:', filterType);
    
    // 直接调用 loadDiscussions 并传入筛选类型
    loadDiscussions(filterType);
    
    // 更新筛选按钮的活跃状态
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        }
    });
    
    console.log('✅ 筛选完成:', filterType);
}

// 加载更多帖子
function loadMorePosts() {
    console.log('加载更多帖子...');
    // 这里可以实现分页加载逻辑
    showNotification('已加载所有帖子', 'info');
}

// 初始加载内容
function loadInitialContent() {
    console.log('加载初始内容...');
    loadDiscussions('all'); // 传入默认筛选类型
    loadOnlineUsers();
    loadRecentActivity();
}

// 更新社区统计数据
function updateCommunityStats() {
    const totalUsers = document.getElementById('totalUsers');
    const totalPosts = document.getElementById('totalPosts');
    const onlineUsers = document.getElementById('onlineUsers');
    
    if (window.communitySystem) {
        if (totalUsers) {
            totalUsers.textContent = window.communitySystem.users.length;
        }
        if (totalPosts) {
            totalPosts.textContent = window.communitySystem.posts.filter(p => p.status === 'active').length;
        }
        if (onlineUsers) {
            onlineUsers.textContent = window.communitySystem.onlineUsers.size || Math.floor(Math.random() * 20) + 5;
        }
    }
}

// 启动实时更新
function startRealTimeUpdates() {
    // 定期更新统计数据
    setInterval(() => {
        updateCommunityStats();
    }, 30000); // 每30秒更新一次
    
    // 监听用户活动
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && window.communitySystem?.currentUser) {
            window.communitySystem.currentUser.lastActiveTime = Date.now();
            window.communitySystem.updateUserStats();
        }
    });
}

// 工具函数
function getCategoryName(category) {
    const categoryMap = {
        'general': '一般讨论',
        'grammar': '语法问题', 
        'vocabulary': '词汇学习',
        'culture': '文化交流',
        'translation': '翻译讨论',
        'resources': '资源分享',
        'announcement': '公告'
    };
    return categoryMap[category] || '未知分类';
}

function truncateContent(content, maxLength = 150) {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString();
}

// 模态框相关函数
function showModal(modalId) {
    console.log('显示模态框:', modalId);
    
    const modal = document.getElementById(modalId);
    if (modal) {
        // 显示模态框
        modal.style.display = 'flex';
        
        // 延迟添加动画类，确保动画效果
        setTimeout(() => {
            modal.classList.add('show');
            console.log('模态框动画已激活');
        }, 10);
    } else {
        console.warn('未找到模态框:', modalId);
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function closeModal(modalId) {
    console.log('尝试关闭模态框:', modalId);
    
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log('找到模态框，开始关闭动画');
        
        // 添加关闭动画
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
                console.log('模态框已从 DOM 中移除');
            }
        }, 200);
    } else {
        console.warn('未找到模态框:', modalId);
    }
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // 添加到页面
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || 'ℹ️';
}

// 控制台日志输出初始化成功信息
console.log('🎆 所有社区功能加载完成！');
