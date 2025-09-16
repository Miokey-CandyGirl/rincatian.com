-- 琳凯蒂亚语社区用户表结构
-- 请在Supabase的SQL编辑器中执行这些语句

-- 1. 创建用户配置文件表
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar TEXT DEFAULT '👤',
    role VARCHAR(20) DEFAULT 'user',
    rank VARCHAR(50) DEFAULT '见习光线使者',
    permissions TEXT[] DEFAULT ARRAY['read'],
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMPTZ,
    profile JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- 3. 启用行级安全策略 (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 4. 创建安全策略
-- 用户可以查看所有用户配置文件（公开信息）
CREATE POLICY "Users can read all profiles" ON user_profiles FOR SELECT USING (true);

-- 用户可以更新自己的配置文件
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- 认证用户可以创建自己的配置文件
CREATE POLICY "Authenticated users can insert profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. 创建触发器函数来自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. 创建触发器
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. 完成信息
SELECT 'User profiles table created successfully! 用户配置文件表创建成功！' as status;