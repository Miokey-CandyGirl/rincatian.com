-- 琳凯蒂亚语数据库性能优化脚本
-- 在Supabase SQL编辑器中运行此脚本来优化数据库性能

-- 1. 创建更多索引以提高查询速度
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vocabulary_word_gin ON vocabulary USING GIN (to_tsvector('english', word));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vocabulary_meaning_gin ON vocabulary USING GIN (to_tsvector('chinese', meaning));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vocabulary_level ON vocabulary(level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vocabulary_created_at ON vocabulary(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_grammar_title_gin ON grammar USING GIN (to_tsvector('chinese', title));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_grammar_description_gin ON grammar USING GIN (to_tsvector('chinese', description));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_grammar_level ON grammar(level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_grammar_order_created ON grammar(order_num, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON users(status);

-- 2. 创建复合索引
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vocabulary_type_level ON vocabulary(type, level);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_grammar_category_level ON grammar(category, level);

-- 3. 创建视图以提高常用查询性能
CREATE OR REPLACE VIEW vocabulary_summary AS
SELECT 
    id,
    word,
    pronunciation,
    meaning,
    type,
    level,
    created_at,
    array_length(examples, 1) as examples_count
FROM vocabulary
ORDER BY created_at DESC;

CREATE OR REPLACE VIEW grammar_summary AS
SELECT 
    id,
    title,
    category,
    description,
    level,
    order_num,
    created_at,
    array_length(rules, 1) as rules_count,
    array_length(examples, 1) as examples_count
FROM grammar
ORDER BY order_num, created_at DESC;

-- 4. 创建统计视图
CREATE OR REPLACE VIEW content_statistics AS
SELECT 
    'vocabulary' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN level = 'basic' THEN 1 END) as basic_count,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count
FROM vocabulary
UNION ALL
SELECT 
    'grammar' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN level = 'beginner' THEN 1 END) as beginner_count,
    COUNT(CASE WHEN level = 'intermediate' THEN 1 END) as intermediate_count,
    COUNT(CASE WHEN level = 'advanced' THEN 1 END) as advanced_count
FROM grammar;

-- 5. 优化RLS策略（使用索引友好的方式）
DROP POLICY IF EXISTS "Anyone can read vocabulary" ON vocabulary;
CREATE POLICY "Anyone can read vocabulary" ON vocabulary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read grammar" ON grammar;
CREATE POLICY "Anyone can read grammar" ON grammar FOR SELECT USING (true);

-- 6. 创建搜索函数（提高搜索性能）
CREATE OR REPLACE FUNCTION search_vocabulary(search_term TEXT, search_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id BIGINT,
    word VARCHAR(100),
    pronunciation VARCHAR(200),
    meaning TEXT,
    type VARCHAR(50),
    level VARCHAR(20),
    rank REAL
) 
LANGUAGE SQL
STABLE
AS $$
    SELECT 
        v.id,
        v.word,
        v.pronunciation,
        v.meaning,
        v.type,
        v.level,
        ts_rank(
            to_tsvector('english', v.word) || to_tsvector('chinese', v.meaning),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM vocabulary v
    WHERE 
        to_tsvector('english', v.word) || to_tsvector('chinese', v.meaning) 
        @@ plainto_tsquery('english', search_term)
        OR v.word ILIKE '%' || search_term || '%'
        OR v.meaning ILIKE '%' || search_term || '%'
    ORDER BY rank DESC, v.created_at DESC
    LIMIT search_limit;
$$;

CREATE OR REPLACE FUNCTION search_grammar(search_term TEXT, search_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR(200),
    category VARCHAR(100),
    description TEXT,
    level VARCHAR(20),
    order_num INTEGER,
    rank REAL
) 
LANGUAGE SQL
STABLE
AS $$
    SELECT 
        g.id,
        g.title,
        g.category,
        g.description,
        g.level,
        g.order_num,
        ts_rank(
            to_tsvector('chinese', g.title) || to_tsvector('chinese', g.description),
            plainto_tsquery('chinese', search_term)
        ) as rank
    FROM grammar g
    WHERE 
        to_tsvector('chinese', g.title) || to_tsvector('chinese', g.description) 
        @@ plainto_tsquery('chinese', search_term)
        OR g.title ILIKE '%' || search_term || '%'
        OR g.description ILIKE '%' || search_term || '%'
    ORDER BY rank DESC, g.order_num, g.created_at DESC
    LIMIT search_limit;
$$;

-- 7. 创建缓存表（减少复杂查询的执行时间）
CREATE TABLE IF NOT EXISTS cache_content_stats (
    id SERIAL PRIMARY KEY,
    stat_type VARCHAR(50) NOT NULL,
    stat_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 创建更新统计信息的函数
CREATE OR REPLACE FUNCTION refresh_content_stats()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- 删除旧的统计信息
    DELETE FROM cache_content_stats;
    
    -- 插入新的统计信息
    INSERT INTO cache_content_stats (stat_type, stat_value) VALUES
    ('vocabulary_count', (SELECT COUNT(*)::text::jsonb FROM vocabulary)),
    ('grammar_count', (SELECT COUNT(*)::text::jsonb FROM grammar)),
    ('users_count', (SELECT COUNT(*)::text::jsonb FROM users)),
    ('total_content', (
        SELECT jsonb_build_object(
            'vocabulary', (SELECT COUNT(*) FROM vocabulary),
            'grammar', (SELECT COUNT(*) FROM grammar),
            'users', (SELECT COUNT(*) FROM users),
            'total', (SELECT COUNT(*) FROM vocabulary) + (SELECT COUNT(*) FROM grammar)
        )
    ));
END;
$$;

-- 9. 初始化统计信息
SELECT refresh_content_stats();

-- 10. 授予必要的权限
GRANT SELECT ON vocabulary_summary TO authenticated, anon;
GRANT SELECT ON grammar_summary TO authenticated, anon;
GRANT SELECT ON content_statistics TO authenticated, anon;
GRANT SELECT ON cache_content_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_vocabulary(TEXT, INTEGER) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_grammar(TEXT, INTEGER) TO authenticated, anon;

-- 11. 分析表以更新统计信息
ANALYZE vocabulary;
ANALYZE grammar;
ANALYZE users;

-- 完成信息
SELECT 'Database performance optimization completed! 数据库性能优化完成！' as status;

-- 显示优化结果
SELECT 
    'Performance Optimization Results' as title,
    (SELECT COUNT(*) FROM vocabulary) as vocabulary_count,
    (SELECT COUNT(*) FROM grammar) as grammar_count,
    (SELECT COUNT(*) FROM users) as users_count,
    'Indexes and views created successfully' as optimization_status;