// 琳凯蒂亚语社区管理系统 - 核心功能
// 实现真正的用户留言、回复、管理等功能

class CommunitySystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('linkaitiya_community_users') || '[]');
        this.posts = JSON.parse(localStorage.getItem('linkaitiya_community_posts') || '[]');
        this.replies = JSON.parse(localStorage.getItem('linkaitiya_community_replies') || '[]');
        this.messages = JSON.parse(localStorage.getItem('linkaitiya_community_messages') || '[]');
        this.notifications = JSON.parse(localStorage.getItem('linkaitiya_community_notifications') || '[]');
        
        this.currentUser = null;
        this.onlineUsers = new Set();
        
        this.initializeSystem();
    }

    // 初始化系统
    initializeSystem() {
        console.log('🌟 琳凯蒂亚语社区系统初始化...');
        this.loadCurrentUser();
        if (this.users.length === 0) {
            this.initializeSampleData();
        }
        this.startRealTimeFeatures();
        console.log('✅ 社区系统初始化完成');
    }

    // 加载当前用户
    loadCurrentUser() {
        if (window.authSystem && window.authSystem.currentUser) {
            const authUser = window.authSystem.currentUser;
            let communityUser = this.users.find(u => u.authId === authUser.id);
            if (!communityUser) {
                communityUser = this.createCommunityProfile(authUser);
            }
            this.currentUser = communityUser;
            this.addToOnlineUsers(communityUser.id);
            console.log('从认证系统加载用户:', communityUser.username);
        }
    }

    // 为认证系统用户创建社区档案
    createCommunityProfile(authUser) {
        const communityUser = {
            id: 'community_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            authId: authUser.id,
            username: authUser.username,
            email: authUser.email,
            avatar: authUser.avatar,
            role: authUser.role,
            permissions: authUser.permissions || ['read'],
            displayName: authUser.username,
            bio: '',
            signature: '',
            joinDate: Date.now(),
            lastActiveTime: Date.now(),
            posts: 0,
            replies: 0,
            likes: 0,
            points: 0,
            level: 1,
            reputation: 100,
            settings: {
                emailNotifications: true,
                pushNotifications: true,
                showOnlineStatus: true,
                allowPrivateMessages: true
            },
            metadata: {
                registrationIP: this.getCurrentIP(),
                lastLoginIP: this.getCurrentIP(),
                loginCount: 1,
                deviceInfo: this.getDeviceInfo(),
                referrer: document.referrer || 'direct'
            }
        };

        this.users.push(communityUser);
        this.saveUsers();
        console.log('为认证用户创建社区档案:', communityUser.username);
        return communityUser;
    }

    // 创建新帖子
    createPost(postData) {
        if (!this.currentUser) throw new Error('用户未登录');
        if (!this.hasPermission('write')) throw new Error('没有发帖权限');

        const newPost = {
            id: 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            authorId: this.currentUser.id,
            title: postData.title.trim(),
            content: postData.content.trim(),
            category: postData.category || 'general',
            tags: Array.isArray(postData.tags) ? postData.tags : 
                  postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            timestamp: Date.now(),
            views: 0,
            likes: [],
            replyCount: 0,
            status: 'active',
            isPinned: false,
            isLocked: false
        };

        this.posts.unshift(newPost);
        this.savePosts();
        this.currentUser.posts++;
        this.currentUser.points += 10;
        this.updateUserStats();
        console.log('创建新帖子:', newPost.title);
        return newPost;
    }

    // 创建回复
    createReply(replyData) {
        if (!this.currentUser) throw new Error('用户未登录');
        if (!this.hasPermission('write')) throw new Error('没有回复权限');

        const newReply = {
            id: 'reply_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            postId: replyData.postId,
            authorId: this.currentUser.id,
            content: replyData.content.trim(),
            parentReplyId: replyData.parentReplyId || null,
            timestamp: Date.now(),
            likes: [],
            status: 'active'
        };

        this.replies.push(newReply);
        this.saveReplies();

        const post = this.posts.find(p => p.id === replyData.postId);
        if (post) {
            post.replyCount++;
            this.savePosts();
        }

        this.currentUser.replies++;
        this.currentUser.points += 5;
        this.updateUserStats();

        if (post && post.authorId !== this.currentUser.id) {
            this.sendNotification(post.authorId, {
                type: 'reply',
                title: '有新回复',
                message: `${this.currentUser.displayName} 回复了你的帖子 "${post.title}"`,
                relatedId: replyData.postId,
                relatedType: 'post'
            });
        }

        console.log('创建新回复:', newReply.id);
        return newReply;
    }

    // 获取帖子列表
    getPosts(filters = {}) {
        let filteredPosts = [...this.posts];

        if (filters.status) {
            filteredPosts = filteredPosts.filter(post => post.status === filters.status);
        }

        if (filters.category && filters.category !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === filters.category);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredPosts = filteredPosts.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );
        }

        filteredPosts.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.timestamp - a.timestamp;
        });

        return filteredPosts.map(post => ({
            ...post,
            author: this.getUserById(post.authorId),
            timeDisplay: this.formatTime(post.timestamp)
        }));
    }

    // 获取帖子回复
    getReplies(postId) {
        const postReplies = this.replies.filter(r => r.postId === postId && r.status === 'active');
        const topLevelReplies = postReplies.filter(r => !r.parentReplyId);
        
        return topLevelReplies.map(reply => ({
            ...reply,
            author: this.getUserById(reply.authorId),
            timeDisplay: this.formatTime(reply.timestamp),
            children: this.getChildReplies(reply.id, postReplies)
        })).sort((a, b) => a.timestamp - b.timestamp);
    }

    // 获取子回复
    getChildReplies(parentReplyId, allReplies) {
        const childReplies = allReplies.filter(r => r.parentReplyId === parentReplyId);
        return childReplies.map(reply => ({
            ...reply,
            author: this.getUserById(reply.authorId),
            timeDisplay: this.formatTime(reply.timestamp),
            children: this.getChildReplies(reply.id, allReplies)
        })).sort((a, b) => a.timestamp - b.timestamp);
    }

    // 点赞功能
    togglePostLike(postId) {
        if (!this.currentUser) throw new Error('用户未登录');
        const post = this.posts.find(p => p.id === postId);
        if (!post) throw new Error('帖子不存在');

        const userIndex = post.likes.indexOf(this.currentUser.id);
        if (userIndex === -1) {
            post.likes.push(this.currentUser.id);
        } else {
            post.likes.splice(userIndex, 1);
        }
        this.savePosts();
        return post.likes.length;
    }

    // 管理员功能
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission) || 
               this.currentUser.permissions.includes('admin');
    }

    deletePost(postId, reason = '') {
        if (!this.isAdmin()) throw new Error('没有管理权限');
        const post = this.posts.find(p => p.id === postId);
        if (!post) throw new Error('帖子不存在');
        
        post.status = 'deleted';
        post.deleteReason = reason;
        post.deletedBy = this.currentUser.id;
        post.deletedAt = Date.now();
        this.savePosts();
        console.log('管理员删除帖子:', post.title);
    }

    // 获取用户信息
    getUserById(userId) {
        return this.users.find(u => u.id === userId) || {
            id: userId,
            username: '未知用户',
            avatar: '?',
            displayName: '未知用户'
        };
    }

    // 工具函数
    getCurrentIP() {
        return '192.168.1.' + Math.floor(Math.random() * 254 + 1);
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    formatTime(timestamp) {
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

    addToOnlineUsers(userId) {
        this.onlineUsers.add(userId);
    }

    // 发送通知
    sendNotification(userId, notificationData) {
        const notification = {
            id: 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            userId: userId,
            type: notificationData.type,
            title: notificationData.title,
            message: notificationData.message,
            relatedId: notificationData.relatedId,
            relatedType: notificationData.relatedType,
            timestamp: Date.now(),
            isRead: false
        };

        this.notifications.push(notification);
        this.saveNotifications();
        console.log('发送通知给用户:', userId, notification.title);
    }

    // 存储函数
    saveUsers() { localStorage.setItem('linkaitiya_community_users', JSON.stringify(this.users)); }
    savePosts() { localStorage.setItem('linkaitiya_community_posts', JSON.stringify(this.posts)); }
    saveReplies() { localStorage.setItem('linkaitiya_community_replies', JSON.stringify(this.replies)); }
    saveNotifications() { localStorage.setItem('linkaitiya_community_notifications', JSON.stringify(this.notifications)); }
    
    updateUserStats() {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
        }
    }

    startRealTimeFeatures() {
        // 定期更新在线状态
        setInterval(() => {
            if (this.currentUser) {
                this.currentUser.lastActiveTime = Date.now();
                this.updateUserStats();
            }
        }, 60000);
    }

    // 初始化示例数据
    initializeSampleData() {
        console.log('初始化示例数据...');
        
        const sampleUsers = [
            {
                id: 'sample_admin_001',
                authId: 'admin',
                username: '星辰管理员',
                email: 'admin@linkaitiya.star',
                avatar: '🌟',
                role: 'admin',
                permissions: ['read', 'write', 'delete', 'admin'],
                displayName: '星辰管理员',
                bio: '琳凯蒂亚语社区的守护者',
                signature: '愿光线指引你的学习之路 ✨',
                joinDate: Date.now() - 1000 * 60 * 60 * 24 * 100,
                lastActiveTime: Date.now(),
                posts: 25,
                replies: 156,
                likes: 89,
                points: 2580,
                level: 15,
                reputation: 950,
                settings: {
                    emailNotifications: true,
                    pushNotifications: true,
                    showOnlineStatus: true,
                    allowPrivateMessages: true
                },
                metadata: {
                    registrationIP: '10.0.0.1',
                    lastLoginIP: '10.0.0.1',
                    loginCount: 234,
                    deviceInfo: this.getDeviceInfo(),
                    referrer: 'direct'
                }
            }
        ];

        this.users = sampleUsers;
        this.saveUsers();

        const samplePosts = [
            {
                id: 'post_sample_001',
                authorId: 'sample_admin_001',
                title: '欢迎来到琳凯蒂亚语社区！',
                content: '欢迎各位光线使者来到我们的魔法语言社区！在这里你可以：\n\n• 发布学习心得和疑问\n• 与其他学习者交流\n• 分享有用的学习资源\n• 参与有趣的语言活动\n\n让我们一起探索琳凯蒂亚语的奥秘吧！✨',
                category: 'announcement',
                tags: ['欢迎', '公告', '社区'],
                timestamp: Date.now() - 1000 * 60 * 60 * 24,
                views: 156,
                likes: [],
                replyCount: 0,
                status: 'active',
                isPinned: true,
                isLocked: false
            }
        ];

        this.posts = samplePosts;
        this.savePosts();
        console.log('示例数据初始化完成');
    }
}

// 创建全局社区系统实例
window.communitySystem = new CommunitySystem();

console.log('📚 琳凯蒂亚语社区系统已加载！');