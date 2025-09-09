// 琳凯蒂亚语网站本地服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9999;

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// 获取文件的MIME类型
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// 创建HTTP服务器
const server = http.createServer((req, res) => {
    // 解析URL
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // 防止路径遍历攻击
    filePath = path.normalize(filePath);
    if (filePath.includes('..')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // 构建完整的文件路径
    const fullPath = path.join(__dirname, filePath);
    
    // 检查文件是否存在
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // 文件不存在，返回404
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>页面未找到 - 琳凯蒂亚语社区</title>
                    <style>
                        body {
                            font-family: 'Microsoft YaHei', sans-serif;
                            background: linear-gradient(135deg, #1a237e, #3f51b5);
                            color: white;
                            text-align: center;
                            padding: 2rem;
                            margin: 0;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-direction: column;
                        }
                        h1 { color: #ffd700; margin-bottom: 1rem; }
                        p { margin-bottom: 2rem; }
                        a { 
                            color: #00bcd4; 
                            text-decoration: none; 
                            padding: 1rem 2rem;
                            border: 2px solid #00bcd4;
                            border-radius: 25px;
                            transition: all 0.3s ease;
                        }
                        a:hover {
                            background: #00bcd4;
                            color: white;
                            transform: translateY(-2px);
                        }
                    </style>
                </head>
                <body>
                    <h1>🌟 页面未找到</h1>
                    <p>您访问的页面在琳凯蒂亚星球的某个角落迷失了...</p>
                    <a href="/">返回首页</a>
                </body>
                </html>
            `);
            return;
        }
        
        // 读取并返回文件
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
                return;
            }
            
            // 设置正确的Content-Type
            const mimeType = getMimeType(fullPath);
            res.writeHead(200, {
                'Content-Type': mimeType + (mimeType.startsWith('text/') ? '; charset=utf-8' : '')
            });
            res.end(data);
        });
    });
});

// 启动服务器
server.listen(PORT, () => {
    console.log('🌟 琳凯蒂亚语社区网站已启动！');
    console.log(`🚀 请访问: http://localhost:${PORT}`);
    console.log('📚 语法页面: http://localhost:' + PORT + '/grammar.html');
    console.log('⭐ 按 Ctrl+C 停止服务器');
    
    // 在Windows上自动打开浏览器
    const { exec } = require('child_process');
    exec(`start http://localhost:${PORT}`, (err) => {
        if (err) {
            console.log('💡 请手动在浏览器中打开: http://localhost:' + PORT);
        }
    });
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n✨ 琳凯蒂亚语社区网站已关闭');
    process.exit(0);
});

// 错误处理
process.on('uncaughtException', (err) => {
    console.error('❌ 服务器错误:', err.message);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ 端口 ${PORT} 已被占用，请尝试其他端口`);
    } else {
        console.error('❌ 服务器启动失败:', err.message);
    }
});