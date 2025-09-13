@echo off
echo 启动琳凯蒂亚语网站本地服务器...
echo.
echo 🎌 国旗导航功能已集成到所有主要页面：
echo   ✅ index.html - 首页
echo   ✅ grammar.html - 语法页面  
echo   ✅ dictionary.html - 词典页面
echo   ✅ culture.html - 文化页面
echo   ✅ community.html - 社区页面
echo   ✅ user-profile.html - 用户中心
echo.
echo 🚀 服务器将在 http://localhost:8080 启动
echo 📱 测试页面: http://localhost:8080/test-flag-navigation.html
echo.
echo ⚡ 按 Ctrl+C 停止服务器
echo.
python -m http.server 8080
pause