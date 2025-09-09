// 社区页面功能脚本 - 真实用户交互版本

// 创建兼容层解决 communityData 未定义问题
// 立即初始化防止任何引用错误
let communityData = {
    users: [],
    posts: [],
    studyGroups: [],
    currentUser: null
};

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
            posts: [],
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 琳凯蒂亚语社区页面加载...');
    
    // 初始化兼容层
    initCompatibilityLayer();
    
    // 等待社区系统初始化完成
    setTimeout(() => {
        if (window.communitySystem) {
            initCommunityInterface();
            console.log('✅ 社区界面初始化完成');
        } else {
            console.error('❌ 社区系统未加载');
        }
    }, 500);
});

// 初始化社区界面
function initCommunityInterface() {
    initEventListeners();
    loadInitialContent();
    updateCommunityStats();
    startRealTimeUpdates();
}

// 初始化事件监听器
function initEventListeners() {
    console.log('🔍 初始化事件监听器...');
    
    // 导航标签切换
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(tab.dataset.tab);
        });
    });
    
    // 发布新话题按钮
    const newPostBtn = document.getElementById('newPostBtn');
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            // 检查用户是否已登录，优先使用新认证系统
            const isLoggedIn = (window.authSystem && window.authSystem.currentUser) || 
                              (window.communitySystem && window.communitySystem.currentUser) ||
                              communityData.currentUser;
            
            if (isLoggedIn) {
                showNewPostModal();
            } else {
                showLoginPrompt();
            }
        });
        console.log('✅ 发帖按钮事件已绑定');
    }
    
    // 筛选按钮 - 使用事件委托避免动态元素问题
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        postsContainer.addEventListener('click', (e) => {
            // 检查是否点击了筛选按钮
            if (e.target.classList.contains('filter-btn')) {
                e.preventDefault();
                
                const filterType = e.target.dataset.filter;
                if (filterType) {
                    console.log('🔍 筛选按钮被点击:', filterType);
                    
                    // 更新按钮状态
                    const filterBtns = postsContainer.querySelectorAll('.filter-btn');
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // 执行筛选
                    loadDiscussions(filterType);
                }
            }
        });
        console.log('✅ 筛选按钮事件委托已绑定');
    }
    
    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMorePosts);
        console.log('✅ 加载更多按钮事件已绑定');
    }
    
    // 登录按钮
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (typeof showNewLoginModal === 'function') {
                showNewLoginModal();
            } else if (typeof showLoginModal === 'function') {
                showLoginModal();
            } else {
                showLoginPrompt();
            }
        });
    }
    
    // 注册按钮
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
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
        });
    }
    
    console.log('✅ 所有事件监听器初始化完成');
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

// 加载讨论内容
function loadDiscussions() {
    console.log('加载讨论列表...');
    
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    // 获取当前筛选条件
    const activeFilter = document.querySelector('.filter-btn.active');
    const filterType = activeFilter ? activeFilter.dataset.filter : 'all';
    
    // 从社区系统获取帖子
    const posts = window.communitySystem.getPosts({
        status: 'active',
        sortBy: filterType === 'latest' ? 'timestamp' : 
                filterType === 'hot' ? 'likes' : 'timestamp'
    });
    
    postsList.innerHTML = '';
    
    if (posts.length === 0) {
        postsList.innerHTML = `
            <div class="no-posts">
                <div class="no-posts-icon">📝</div>
                <p>还没有帖子，快来发布第一个话题吧！</p>
                <button class="btn btn-primary" onclick="showNewPostModal()">发布话题</button>
            </div>
        `;
        return;
    }
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsList.appendChild(postElement);
    });
}

// 创建帖子元素
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item';
    postDiv.dataset.postId = post.id;
    
    // 置顶标识
    const pinnedBadge = post.isPinned ? '<span class="post-badge pinned">📌 置顶</span>' : '';
    
    // 锁定标识
    const lockedBadge = post.isLocked ? '<span class="post-badge locked">🔒 锁定</span>' : '';
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.author.avatar}</div>
            <div class="post-info">
                <div class="post-title-row">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-badges">${pinnedBadge}${lockedBadge}</div>
                </div>
                <div class="post-meta">
                    <span class="post-author">${post.author.displayName}</span>
                    <span class="post-time">${post.timeDisplay}</span>
                    <span class="post-category">${getCategoryName(post.category)}</span>
                </div>
            </div>
            <div class="post-stats">
                <span class="stat-item">👁️ ${post.views}</span>
                <span class="stat-item">❤️ ${post.likes.length}</span>
                <span class="stat-item">💬 ${post.replyCount}</span>
            </div>
        </div>
        <div class="post-content">${truncateContent(post.content, 200)}</div>
        <div class="post-footer">
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
            <div class="post-actions">
                <button class="btn btn-small btn-outline" onclick="viewPost('${post.id}')">
                    <span class="icon">👁️</span> 查看详情
                </button>
                <button class="btn btn-small btn-outline like-btn" onclick="togglePostLike('${post.id}')" data-liked="${post.likes.includes(window.communitySystem.currentUser?.id)}">
                    <span class="icon">❤️</span> ${post.likes.length}
                </button>
                <button class="btn btn-small btn-primary" onclick="replyToPost('${post.id}')">
                    <span class="icon">💬</span> 回复
                </button>
            </div>
        </div>
    `;
    
    return postDiv;
}

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
    
    // 优先使用新的社区系统
    if (window.communitySystem) {
        if (totalUsers) totalUsers.textContent = window.communitySystem.users.length;
        if (totalPosts) totalPosts.textContent = window.communitySystem.posts.filter(p => p.status === 'active').length;
        if (onlineUsers) onlineUsers.textContent = window.communitySystem.onlineUsers.size || Math.floor(Math.random() * 20) + 5;
    } else {
        // 使用兼容层
        if (totalUsers) totalUsers.textContent = communityData.users.length;
        if (totalPosts) totalPosts.textContent = communityData.posts.length;
        if (onlineUsers) onlineUsers.textContent = Math.floor(Math.random() * 50) + 10; // 模拟在线用户数
    }
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
