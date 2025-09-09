// 修复admin.html文件的脚本
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复admin.html文件...');

// 读取原文件
const filePath = path.join(__dirname, 'admin.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. 修复forceLoadUsers函数，添加防重复生成逻辑
const oldForceLoadUsers = // 强制用户数据加载函数
        function forceLoadUsers() {
            console.log('👥 强制加载用户数据...');
            
            // 1. 创建或获取基础用户数据
            let users = [];
            
            // 尝试从 localStorage 获取
            const userSources = ['linkaitiya_users', 'users', 'currentUser'];
            
            for (const source of userSources) {
                const storedUsers = localStorage.getItem(source);
                if (storedUsers) {
                    try {
                        const parsed = JSON.parse(storedUsers);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            users = parsed;
                            console.log(\从 \ 获取到 \ 个用户\);
                            break;
                        } else if (source === 'currentUser' && parsed && parsed.id) {
                            users = [parsed];
                            console.log('从当前用户创建用户数据');
                            break;
                        }
                    } catch (error) {
                        console.warn(\解析 \ 失败:\, error);
                    }
                }
            }
            
            // 如果没有用户数据，创建示例数据
            if (users.length === 0) {;

const newForceLoadUsers = // 强制用户数据加载函数（修复版）
        function forceLoadUsers() {
            console.log('👥 强制加载用户数据（修复版）...');
            
            // 检查是否已经生成过示例数据
            const sampleDataGenerated = localStorage.getItem('sample_data_generated');
            const existingUsers = localStorage.getItem('linkaitiya_users');
            
            if (!sampleDataGenerated && (!existingUsers || JSON.parse(existingUsers).length === 0)) {
                console.log('📝 首次生成示例数据...');
                generateCleanUserData();
            } else {
                console.log('✅ 示例数据已存在，跳过生成');
            }
            
            // 加载用户数据
            const users = JSON.parse(localStorage.getItem('linkaitiya_users') || '[]');
            console.log(\👥 加载了 \ 个用户\);;

// 2. 添加generateCleanUserData函数
const generateCleanUserDataFunction = 
        // 生成干净的示例数据（只生成一次）
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
            
            // 设置标记，表示已经生成过示例数据
            localStorage.setItem('sample_data_generated', 'true');
            
            console.log(\✅ 已生成 \ 个干净的示例用户\);
            return cleanUsers;
        };

// 3. 移除定期检查机制
const oldSetInterval = // 定期检查和刷新用户数据
        setInterval(() => {
            const tbody = document.getElementById('usersTableBody');
            if (tbody && (!tbody.innerHTML || tbody.innerHTML.includes('暂无用户数据'))) {
                console.log('检测到用户表格为空，重新加载...');
                forceLoadUsers();
            }
        }, 3000);;

const newSetInterval = // 定期检查机制已禁用，防止重复生成数据
        // setInterval(() => {
        //     const tbody = document.getElementById('usersTableBody');
        //     if (tbody && (!tbody.innerHTML || tbody.innerHTML.includes('暂无用户数据'))) {
        //         console.log('检测到用户表格为空，重新加载...');
        //         forceLoadUsers();
        //     }
        // }, 3000);;

// 执行替换
content = content.replace(oldForceLoadUsers, newForceLoadUsers);
content = content.replace(oldSetInterval, newSetInterval);

// 在forceLoadUsers函数后添加generateCleanUserData函数
const insertPoint = content.indexOf('// 立即执行用户数据加载');
if (insertPoint !== -1) {
    content = content.slice(0, insertPoint) + generateCleanUserDataFunction + '\n        ' + content.slice(insertPoint);
}

// 写入修复后的文件
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ admin.html文件修复完成！');
console.log('🔧 修复内容：');
console.log('  1. 修复了forceLoadUsers函数，防止重复生成数据');
console.log('  2. 添加了generateCleanUserData函数');
console.log('  3. 禁用了定期检查机制');
console.log('  4. 添加了sample_data_generated标记');
console.log('🎉 现在刷新页面不会再增加重复数据了！');
