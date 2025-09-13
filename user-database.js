// 用户数据库管理模块
// 用于统一管理用户相关数据的存储和检索

class UserDatabase {
    constructor() {
        this.dbPrefix = 'linkaitiya_user_';
        this.initializeDatabase();
    }

    // 初始化数据库
    initializeDatabase() {
        console.log('🔧 用户数据库初始化...');
        // 确保必要的存储结构存在
        this.ensureStorageStructure();
        console.log('✅ 用户数据库初始化完成');
    }

    // 确保存储结构
    ensureStorageStructure() {
        // 用户基本信息存储
        if (!localStorage.getItem(`${this.dbPrefix}profiles`)) {
            localStorage.setItem(`${this.dbPrefix}profiles`, JSON.stringify({}));
        }
        
        // 用户学习数据存储
        if (!localStorage.getItem(`${this.dbPrefix}learning_data`)) {
            localStorage.setItem(`${this.dbPrefix}learning_data`, JSON.stringify({}));
        }
        
        // 用户社区数据存储
        if (!localStorage.getItem(`${this.dbPrefix}community_data`)) {
            localStorage.setItem(`${this.dbPrefix}community_data`, JSON.stringify({}));
        }
        
        // 用户设置数据存储
        if (!localStorage.getItem(`${this.dbPrefix}settings`)) {
            localStorage.setItem(`${this.dbPrefix}settings`, JSON.stringify({}));
        }
    }

    // 获取用户ID（基于认证系统）
    getCurrentUserId() {
        if (window.authSystem && window.authSystem.currentUser) {
            return window.authSystem.currentUser.id;
        }
        return null;
    }

    // 保存用户基本信息
    saveUserProfile(profileData) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const profiles = JSON.parse(localStorage.getItem(`${this.dbPrefix}profiles`) || '{}');
            profiles[userId] = {
                ...profiles[userId],
                ...profileData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`${this.dbPrefix}profiles`, JSON.stringify(profiles));
            console.log('✅ 用户基本信息已保存', userId);
            return true;
        } catch (error) {
            console.error('❌ 保存用户基本信息失败:', error);
            return false;
        }
    }

    // 获取用户基本信息
    getUserProfile() {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return null;
        }

        try {
            const profiles = JSON.parse(localStorage.getItem(`${this.dbPrefix}profiles`) || '{}');
            return profiles[userId] || null;
        } catch (error) {
            console.error('❌ 获取用户基本信息失败:', error);
            return null;
        }
    }

    // 保存用户学习数据
    saveLearningData(learningData) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const learningDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}learning_data`) || '{}');
            learningDataStorage[userId] = {
                ...learningDataStorage[userId],
                ...learningData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`${this.dbPrefix}learning_data`, JSON.stringify(learningDataStorage));
            console.log('✅ 用户学习数据已保存', userId);
            return true;
        } catch (error) {
            console.error('❌ 保存用户学习数据失败:', error);
            return false;
        }
    }

    // 获取用户学习数据
    getLearningData() {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return null;
        }

        try {
            const learningDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}learning_data`) || '{}');
            return learningDataStorage[userId] || {};
        } catch (error) {
            console.error('❌ 获取用户学习数据失败:', error);
            return {};
        }
    }

    // 保存用户社区数据
    saveCommunityData(communityData) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const communityDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}community_data`) || '{}');
            communityDataStorage[userId] = {
                ...communityDataStorage[userId],
                ...communityData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`${this.dbPrefix}community_data`, JSON.stringify(communityDataStorage));
            console.log('✅ 用户社区数据已保存', userId);
            return true;
        } catch (error) {
            console.error('❌ 保存用户社区数据失败:', error);
            return false;
        }
    }

    // 获取用户社区数据
    getCommunityData() {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return null;
        }

        try {
            const communityDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}community_data`) || '{}');
            return communityDataStorage[userId] || {};
        } catch (error) {
            console.error('❌ 获取用户社区数据失败:', error);
            return {};
        }
    }

    // 保存用户设置
    saveUserSettings(settings) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const settingsStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}settings`) || '{}');
            settingsStorage[userId] = {
                ...settingsStorage[userId],
                ...settings,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`${this.dbPrefix}settings`, JSON.stringify(settingsStorage));
            console.log('✅ 用户设置已保存', userId);
            return true;
        } catch (error) {
            console.error('❌ 保存用户设置失败:', error);
            return false;
        }
    }

    // 获取用户设置
    getUserSettings() {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return null;
        }

        try {
            const settingsStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}settings`) || '{}');
            return settingsStorage[userId] || {};
        } catch (error) {
            console.error('❌ 获取用户设置失败:', error);
            return {};
        }
    }

    // 保存用户收藏
    saveUserFavorites(favorites) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const learningData = this.getLearningData();
            learningData.favorites = favorites;
            return this.saveLearningData(learningData);
        } catch (error) {
            console.error('❌ 保存用户收藏失败:', error);
            return false;
        }
    }

    // 获取用户收藏
    getUserFavorites() {
        try {
            const learningData = this.getLearningData();
            return learningData.favorites || [];
        } catch (error) {
            console.error('❌ 获取用户收藏失败:', error);
            return [];
        }
    }

    // 添加收藏
    addFavorite(item) {
        try {
            const favorites = this.getUserFavorites();
            // 检查是否已存在
            const exists = favorites.find(fav => fav.id === item.id);
            if (!exists) {
                favorites.push(item);
                return this.saveUserFavorites(favorites);
            }
            return true;
        } catch (error) {
            console.error('❌ 添加收藏失败:', error);
            return false;
        }
    }

    // 移除收藏
    removeFavorite(itemId) {
        try {
            const favorites = this.getUserFavorites();
            const newFavorites = favorites.filter(fav => fav.id !== itemId);
            return this.saveUserFavorites(newFavorites);
        } catch (error) {
            console.error('❌ 移除收藏失败:', error);
            return false;
        }
    }

    // 保存用户学习历史
    saveLearningHistory(history) {
        const userId = this.getCurrentUserId();
        if (!userId) {
            throw new Error('用户未登录');
        }

        try {
            const learningData = this.getLearningData();
            learningData.history = history;
            return this.saveLearningData(learningData);
        } catch (error) {
            console.error('❌ 保存学习历史失败:', error);
            return false;
        }
    }

    // 获取用户学习历史
    getLearningHistory() {
        try {
            const learningData = this.getLearningData();
            return learningData.history || [];
        } catch (error) {
            console.error('❌ 获取学习历史失败:', error);
            return [];
        }
    }

    // 清除用户数据（用于注销等场景）
    clearUserData() {
        const userId = this.getCurrentUserId();
        if (!userId) {
            return;
        }

        try {
            // 清除用户基本信息
            const profiles = JSON.parse(localStorage.getItem(`${this.dbPrefix}profiles`) || '{}');
            delete profiles[userId];
            localStorage.setItem(`${this.dbPrefix}profiles`, JSON.stringify(profiles));

            // 清除用户学习数据
            const learningDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}learning_data`) || '{}');
            delete learningDataStorage[userId];
            localStorage.setItem(`${this.dbPrefix}learning_data`, JSON.stringify(learningDataStorage));

            // 清除用户社区数据
            const communityDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}community_data`) || '{}');
            delete communityDataStorage[userId];
            localStorage.setItem(`${this.dbPrefix}community_data`, JSON.stringify(communityDataStorage));

            // 清除用户设置
            const settingsStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}settings`) || '{}');
            delete settingsStorage[userId];
            localStorage.setItem(`${this.dbPrefix}settings`, JSON.stringify(settingsStorage));

            console.log('✅ 用户数据已清除', userId);
        } catch (error) {
            console.error('❌ 清除用户数据失败:', error);
        }
    }

    // 获取所有用户数据（仅限管理员）
    getAllUsersData() {
        if (!window.authSystem || !window.authSystem.isAdmin()) {
            throw new Error('权限不足');
        }

        try {
            const profiles = JSON.parse(localStorage.getItem(`${this.dbPrefix}profiles`) || '{}');
            const learningDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}learning_data`) || '{}');
            const communityDataStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}community_data`) || '{}');
            const settingsStorage = JSON.parse(localStorage.getItem(`${this.dbPrefix}settings`) || '{}');

            const allUsersData = {};
            const allUserIds = new Set([
                ...Object.keys(profiles),
                ...Object.keys(learningDataStorage),
                ...Object.keys(communityDataStorage),
                ...Object.keys(settingsStorage)
            ]);

            allUserIds.forEach(userId => {
                allUsersData[userId] = {
                    profile: profiles[userId] || {},
                    learningData: learningDataStorage[userId] || {},
                    communityData: communityDataStorage[userId] || {},
                    settings: settingsStorage[userId] || {}
                };
            });

            return allUsersData;
        } catch (error) {
            console.error('❌ 获取所有用户数据失败:', error);
            return {};
        }
    }
}

// 创建全局用户数据库实例
window.userDatabase = new UserDatabase();

console.log('📚 琳凯蒂亚语用户数据库已加载！');

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserDatabase;
}