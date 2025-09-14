-- 琳凯蒂亚语社区数据库表结构
-- 请在Supabase的SQL编辑器中执行这些语句

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar TEXT DEFAULT '',
    role VARCHAR(20) DEFAULT 'user',
    rank VARCHAR(50) DEFAULT '见习光线使者',
    permissions TEXT[] DEFAULT ARRAY['read'],
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMPTZ,
    profile JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建词汇表
CREATE TABLE IF NOT EXISTS vocabulary (
    id BIGSERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    pronunciation VARCHAR(200),
    meaning TEXT NOT NULL,
    type VARCHAR(50),
    definition TEXT,
    examples TEXT[] DEFAULT ARRAY[]::TEXT[],
    etymology TEXT DEFAULT '',
    usage TEXT DEFAULT '',
    level VARCHAR(20) DEFAULT 'basic',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 创建语法表
CREATE TABLE IF NOT EXISTS grammar (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    description TEXT NOT NULL,
    rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    examples TEXT[] DEFAULT ARRAY[]::TEXT[],
    exceptions TEXT[] DEFAULT ARRAY[]::TEXT[],
    level VARCHAR(20) DEFAULT 'beginner',
    order_num INTEGER DEFAULT 0,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 创建短语表
CREATE TABLE IF NOT EXISTS phrases (
    id BIGSERIAL PRIMARY KEY,
    linkaitiya VARCHAR(200) NOT NULL,
    chinese VARCHAR(200) NOT NULL,
    pronunciation VARCHAR(300),
    category VARCHAR(100),
    usage TEXT DEFAULT '',
    level VARCHAR(20) DEFAULT 'basic',
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建数词表
CREATE TABLE IF NOT EXISTS numbers (
    id BIGSERIAL PRIMARY KEY,
    value INTEGER NOT NULL,
    linkaitiya VARCHAR(100) NOT NULL,
    pronunciation VARCHAR(200),
    type VARCHAR(50),
    description TEXT DEFAULT '',
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 创建社区帖子表
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'published',
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 创建回复表
CREATE TABLE IF NOT EXISTS replies (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    parent_reply_id BIGINT REFERENCES replies(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 创建索引以提高性能
CREATE INDEX IF NOT EXISTS idx_vocabulary_word ON vocabulary(word);
CREATE INDEX IF NOT EXISTS idx_vocabulary_type ON vocabulary(type);
CREATE INDEX IF NOT EXISTS idx_grammar_category ON grammar(category);
CREATE INDEX IF NOT EXISTS idx_grammar_level ON grammar(level);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_post ON replies(post_id);

-- 9. 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar ENABLE ROW LEVEL SECURITY;
ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- 10. 创建安全策略

-- 用户表策略
CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Authenticated users can insert profile" ON users FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- 词汇表策略
CREATE POLICY "Anyone can read vocabulary" ON vocabulary FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert vocabulary" ON vocabulary FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update vocabulary" ON vocabulary FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete vocabulary" ON vocabulary FOR DELETE USING (auth.role() = 'authenticated');

-- 语法表策略
CREATE POLICY "Anyone can read grammar" ON grammar FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert grammar" ON grammar FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update grammar" ON grammar FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete grammar" ON grammar FOR DELETE USING (auth.role() = 'authenticated');

-- 短语表策略
CREATE POLICY "Anyone can read phrases" ON phrases FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert phrases" ON phrases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update phrases" ON phrases FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete phrases" ON phrases FOR DELETE USING (auth.role() = 'authenticated');

-- 数词表策略
CREATE POLICY "Anyone can read numbers" ON numbers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert numbers" ON numbers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update numbers" ON numbers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete numbers" ON numbers FOR DELETE USING (auth.role() = 'authenticated');

-- 帖子表策略
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own posts" ON posts FOR UPDATE USING (EXISTS (
    SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.id = posts.author_id
));
CREATE POLICY "Authors can delete own posts" ON posts FOR DELETE USING (EXISTS (
    SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.id = posts.author_id
));

-- 回复表策略
CREATE POLICY "Anyone can read replies" ON replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own replies" ON replies FOR UPDATE USING (EXISTS (
    SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.id = replies.author_id
));
CREATE POLICY "Authors can delete own replies" ON replies FOR DELETE USING (EXISTS (
    SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.id = replies.author_id
));

-- 11. 插入一些初始数据

-- 插入默认词汇
INSERT INTO vocabulary (word, pronunciation, meaning, type, definition, examples, level, created_by) VALUES
('link', 'liŋk', '光，光线', '名词', '指光线、光芒，是琳凯蒂亚语中最基础的词汇之一', ARRAY['link beautiful（美丽的光线）', 'link strong（强烈的光）'], 'basic', NULL),
('kaitiya', 'kaɪˈtiːja', '星球，世界', '名词', '指星球、世界，特指琳凯蒂亚星球', ARRAY['beautiful kaitiya（美丽的星球）'], 'basic', NULL),
('bela', 'ˈbela', '美丽的', '形容词', '表示美丽、漂亮的含义', ARRAY['bela link（美丽的光）', 'bela kaitiya（美丽的星球）'], 'basic', NULL);

-- 插入默认语法规则
INSERT INTO grammar (title, category, description, rules, examples, level, order_num, created_by) VALUES
('基本语序', '基础语法', '琳凯蒂亚语的基本语序为主-谓-宾（SVO）', 
 ARRAY['主语 + 谓语 + 宾语', '修饰语通常位于被修饰词之前', '疑问词位于句首'], 
 ARRAY['mi love link（我爱光线）', 'beautiful kaitiya shine（美丽的星球闪耀）'], 
 'beginner', 1, NULL);

-- 完成信息
SELECT 'Database setup completed successfully! 数据库设置成功完成！' as status;