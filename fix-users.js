// 修复重复用户数据的脚本
console.log('🔧 开始修复重复用户数据...');

// 1. 清理重复的用户数据
function cleanDuplicateUsers() {
    const userKeys = ['linkaitiya_users', 'users'];
    let cleanedCount = 0;
    
    userKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const users = JSON.parse(data);
                if (Array.isArray(users)) {
                    const originalCount = users.length;
                    
                    // 去重逻辑
                    const uniqueUsers = [];
                    const seenIds = new Set();
                    const seenUsernameEmails = new Set();
                    
                    users.forEach(user => {
                        const userKey = `${user.username}_${user.email}`;
                        
                        if (!seenIds.has(user.id) && !seenUsernameEmails.has(userKey)) {
                            seenIds.add(user.id);
                            seenUsernameEmails.add(userKey);
                            uniqueUsers.push(user);
                        } else {
                            console.log(`🗑️ 移除重复用户: ${user.username} (${user.id})`);
                            cleanedCount++;
                        }
                    });
                    
                    if (originalCount !== uniqueUsers.length) {
                        localStorage.setItem(key, JSON.stringify(uniqueUsers));
                        console.log(`✅ ${key}: ${originalCount} → ${uniqueUsers.length} 个用户`);
                    }
                }
            } catch (error) {
                console.error(`❌ 清理 ${key} 失败:`, error);
            }
        }
    });
    
    console.log(`🧹 清理完成，共移除 ${cleanedCount} 个重复用户`);
    return cleanedCount;
}

// 2. 生成干净的示例数据
function generateCleanUserData() {
    const cleanUsers = [
        {
            id: 'admin-001',
            username: '琳凯蒂亚',
            displayName: '管理员',
            email: '1778181360@qq.com',
            role: 'admin',
            status: 'active',
            joinDate: Date.now() - 86400000 * 30,
            lastLogin: Date.now() - 300000,
            avatar: '👑',
            level: 'expert',
            permissions: ['read', 'write', 'delete', 'manage_users', 'manage_content']
        },
        {
            id: 'user-001',
            username: '星光法师',
            displayName: '星光法师',
            email: 'starlight@rincatian.com',
            role: 'moderator',
            status: 'active',
            joinDate: Date.now() - 86400000 * 15,
            lastLogin: Date.now() - 600000,
            avatar: '✨',
            level: 'advanced',
            permissions: ['read', 'write']
        },
        {
            id: 'user-002',
            username: '月光学者',
            displayName: '月光学者',
            email: 'moonscholar@rincatian.com',
            role: 'user',
            status: 'active',
            joinDate: Date.now() - 86400000 * 7,
            lastLogin: Date.now() - 1800000,
            avatar: '🌙',
            level: 'intermediate',
            permissions: ['read']
        },
        {
            id: 'user-003',
            username: '水晶探索者',
            displayName: '水晶探索者',
            email: 'crystal@rincatian.com',
            role: 'user',
            status: 'active',
            joinDate: Date.now() - 86400000 * 3,
            lastLogin: Date.now() - 3600000,
            avatar: '🔮',
            level: 'basic',
            permissions: ['read']
        },
        {
            id: 'user-004',
            username: '彩虹诗人',
            displayName: '彩虹诗人',
            email: 'rainbow@rincatian.com',
            role: 'user',
            status: 'inactive',
            joinDate: Date.now() - 86400000 * 1,
            lastLogin: Date.now() - 86400000,
            avatar: '🌈',
            level: 'basic',
            permissions: ['read']
        }
    ];
    
    // 保存到localStorage
    localStorage.setItem('linkaitiya_users', JSON.stringify(cleanUsers));
    localStorage.setItem('users', JSON.stringify(cleanUsers));
    
    console.log(`✅ 已生成 ${cleanUsers.length} 个干净的示例用户`);
    return cleanUsers;
}

// 3. 执行修复
function fixDuplicateUsers() {
    console.log('🚀 开始修复重复用户问题...');
    
    // 先清理重复数据
    const cleanedCount = cleanDuplicateUsers();
    
    // 如果清理后没有用户数据，生成新的示例数据
    const existingUsers = localStorage.getItem('linkaitiya_users');
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
        console.log('📝 没有用户数据，生成示例数据...');
        generateCleanUserData();
    }
    
    console.log('🎉 修复完成！请刷新页面查看结果');
    
    // 刷新页面
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// 执行修复
fixDuplicateUsers();
