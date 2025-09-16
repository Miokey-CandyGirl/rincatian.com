# 琳凯蒂亚语网站部署检查清单

## 部署前检查

### 1. 代码文件检查
- [ ] `config/supabase.js` - Supabase 配置文件存在且配置正确
- [ ] `github-pages-auth-system.js` - 认证系统文件存在
- [ ] `github-pages-content-manager-optimized.js` - 优化的内容管理系统存在
- [ ] `script.js` - 主脚本文件已更新
- [ ] 所有 HTML 文件已更新脚本引用

### 2. 数据库脚本检查
- [ ] `supabase-database-setup.sql` - 数据库初始化脚本存在
- [ ] `database-performance-optimization.sql` - 性能优化脚本存在

### 3. 工具文件检查
- [ ] `auth-debug.html` - 认证诊断工具存在
- [ ] `performance-monitor.html` - 性能监控工具存在
- [ ] `github-pages-migration-tool.html` - 数据迁移工具存在

## Supabase 配置检查

### 1. 项目配置
- [ ] Supabase 项目已创建
- [ ] 项目 URL: `https://fnnbtlfqjfgbifhhnuij.supabase.co`
- [ ] API 密钥已配置: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubmJ0bGZxamZnYmlmaGhudWlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MzgzMzIsImV4cCI6MjA3MzQxNDMzMn0.3dayc8xJQsrr3MbWp4C30hcjpOMd0P7ro380F6iQX00`

### 2. 数据库表初始化
- [ ] 登录 Supabase 控制台
- [ ] 进入 SQL Editor
- [ ] 执行 `supabase-database-setup.sql`
- [ ] 验证以下表已创建:
  - [ ] users
  - [ ] vocabulary
  - [ ] grammar
  - [ ] posts
  - [ ] replies
  - [ ] phrases
  - [ ] numbers
  - [ ] user_sessions

### 3. 性能优化
- [ ] 执行 `database-performance-optimization.sql`
- [ ] 验证索引已创建
- [ ] 验证视图已创建
- [ ] 验证函数已创建

## GitHub Pages 部署步骤

### 1. 代码推送
- [ ] 所有文件已提交到 Git 仓库
- [ ] 代码已推送到 GitHub
- [ ] GitHub Pages 已在仓库设置中启用

### 2. 域名配置（如使用自定义域名）
- [ ] 在 GitHub 仓库设置中配置自定义域名
- [ ] 在域名提供商处添加 CNAME 记录

### 3. HTTPS 配置
- [ ] GitHub Pages 自动提供 HTTPS 支持
- [ ] 验证网站可通过 HTTPS 访问

## 功能测试

### 1. 认证系统测试
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] 用户登出功能正常
- [ ] 权限检查功能正常

### 2. 内容管理测试
- [ ] 词汇查询功能正常
- [ ] 语法查询功能正常
- [ ] 搜索功能正常
- [ ] 分页功能正常

### 3. 性能测试
- [ ] 访问 `performance-monitor.html` 页面
- [ ] 检查数据库响应时间 (< 500ms)
- [ ] 检查缓存命中率 (> 70%)
- [ ] 检查页面加载时间

## 故障排除

### 1. 认证问题
- [ ] 使用 `auth-debug.html` 诊断工具
- [ ] 检查控制台错误信息
- [ ] 验证网络连接
- [ ] 确认数据库表已初始化

### 2. 性能问题
- [ ] 检查数据库索引
- [ ] 验证缓存系统工作正常
- [ ] 检查网络连接速度
- [ ] 使用性能监控工具分析

### 3. 数据库问题
- [ ] 检查 Supabase 服务状态
- [ ] 验证 API 密钥正确性
- [ ] 确认表结构正确
- [ ] 检查 RLS 策略配置

## 维护计划

### 1. 定期检查
- [ ] 每周检查性能监控数据
- [ ] 每月检查数据库使用情况
- [ ] 每季度审查安全配置

### 2. 备份策略
- [ ] Supabase 自动备份
- [ ] 定期导出重要数据
- [ ] 测试数据恢复流程

### 3. 更新计划
- [ ] 监控 Supabase 版本更新
- [ ] 定期更新依赖库
- [ ] 测试新功能兼容性

## 联系信息

### 技术支持
- 邮箱: 1778181360@qq.com
- QQ群: 515385616

### 文档更新
- 最后更新时间: 2025-09-15
- 维护团队: 华田中央大学田语学院