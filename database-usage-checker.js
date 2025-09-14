// 数据库使用情况检查工具
// 请在浏览器控制台中运行此代码来查看数据分布

async function checkDatabaseUsage() {
    if (!window.supabaseClient) {
        console.error('Supabase客户端未初始化');
        return;
    }

    console.log('🔍 开始检查数据库使用情况...');
    
    try {
        // 检查各表的数据量
        const tables = ['vocabulary', 'grammar', 'users', 'phrases', 'numbers', 'posts', 'replies'];
        const results = {};
        
        for (const table of tables) {
            try {
                const { count, error } = await window.supabaseClient
                    .from(table)
                    .select('*', { count: 'exact', head: true });
                
                if (error) {
                    console.warn(`表 ${table} 查询失败:`, error.message);
                    results[table] = '查询失败';
                } else {
                    results[table] = count || 0;
                }
            } catch (e) {
                results[table] = '表不存在';
            }
        }
        
        console.log('📊 数据库表数据统计:');
        console.table(results);
        
        // 计算总数据量
        const totalRecords = Object.values(results)
            .filter(v => typeof v === 'number')
            .reduce((sum, count) => sum + count, 0);
        
        console.log(`📈 总记录数: ${totalRecords}`);
        console.log(`💾 数据库大小: 0.026GB (26MB)`);
        console.log(`📊 平均每条记录: ${totalRecords > 0 ? (26 * 1024 / totalRecords).toFixed(2) : 0}KB`);
        
        return results;
    } catch (error) {
        console.error('检查失败:', error);
    }
}

// 运行检查
checkDatabaseUsage();