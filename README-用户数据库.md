# 琳凯蒂亚语社区用户数据库说明

## 概述

用户数据库模块 (`user-database.js`) 是为琳凯蒂亚语社区专门设计的数据管理模块，用于统一管理用户相关的各种数据，包括基本信息、学习数据、社区数据和用户设置等。

## 功能特性

1. **数据分类存储**：将用户数据按类型分别存储，提高数据管理效率
2. **统一接口**：提供统一的API接口访问各类用户数据
3. **自动初始化**：在用户注册时自动初始化相关数据结构
4. **权限控制**：集成现有认证系统的权限控制机制
5. **数据持久化**：基于localStorage实现数据持久化存储

## 数据结构

用户数据库将数据分为以下几个类别：

### 1. 用户基本信息 (profiles)
- 生物信息 (bio)
- 位置信息 (location)
- 个人网站 (website)
- 创建时间 (createdAt)
- 更新时间 (updatedAt)

### 2. 学习数据 (learning_data)
- 学习进度 (progress)
- 连续学习天数 (streak)
- 最后学习日期 (lastStudyDate)
- 收藏列表 (favorites)
- 学习历史 (history)

### 3. 社区数据 (community_data)
- 发布的帖子 (posts)
- 发表的回复 (replies)

### 4. 用户设置 (settings)
- 每日学习目标 (dailyGoal)
- 通知设置 (notifications)
- 邮件通知设置 (emailNotifications)
- 主题设置 (theme)

## API 接口

### 用户基本信息管理
```javascript
// 保存用户基本信息
window.userDatabase.saveUserProfile(profileData)

// 获取用户基本信息
window.userDatabase.getUserProfile()
```

### 学习数据管理
```javascript
// 保存学习数据
window.userDatabase.saveLearningData(learningData)

// 获取学习数据
window.userDatabase.getLearningData()
```

### 收藏管理
```javascript
// 保存用户收藏
window.userDatabase.saveUserFavorites(favorites)

// 获取用户收藏
window.userDatabase.getUserFavorites()

// 添加收藏
window.userDatabase.addFavorite(item)

// 移除收藏
window.userDatabase.removeFavorite(itemId)
```

### 学习历史管理
```javascript
// 保存学习历史
window.userDatabase.saveLearningHistory(history)

// 获取学习历史
window.userDatabase.getLearningHistory()
```

### 用户设置管理
```javascript
// 保存用户设置
window.userDatabase.saveUserSettings(settings)

// 获取用户设置
window.userDatabase.getUserSettings()
```

### 数据清除
```javascript
// 清除当前用户数据（注销时使用）
window.userDatabase.clearUserData()

// 获取所有用户数据（仅限管理员）
window.userDatabase.getAllUsersData()
```

## 使用示例

### 1. 保存用户资料
```javascript
if (window.userDatabase) {
    window.userDatabase.saveUserProfile({
        bio: '琳凯蒂亚语爱好者',
        location: '北京',
        website: 'https://mywebsite.com'
    });
}
```

### 2. 添加收藏
```javascript
if (window.userDatabase) {
    window.userDatabase.addFavorite({
        id: 'word_001',
        word: 'linkaitiya',
        meaning: '琳凯蒂亚语',
        type: 'word'
    });
}
```

### 3. 保存学习设置
```javascript
if (window.userDatabase) {
    window.userDatabase.saveUserSettings({
        dailyGoal: 15,
        notifications: true,
        emailNotifications: false
    });
}
```

## 集成说明

### 与认证系统的集成
用户数据库模块会自动与认证系统集成，在用户注册时初始化相关数据结构。

### 与社区系统的集成
社区系统会在用户发布帖子或回复时，同时将相关信息保存到用户数据库中。

## 测试

项目包含专门的测试页面 `test-user-database.html`，可用于验证用户数据库功能是否正常工作。

## 注意事项

1. 用户数据库依赖于认证系统，必须在用户登录后才能正常使用
2. 所有数据存储在浏览器的localStorage中，清除浏览器数据会导致数据丢失
3. 管理员可以访问所有用户数据，但需要相应的权限验证
4. 在用户注销时应调用 `clearUserData()` 方法清除相关数据