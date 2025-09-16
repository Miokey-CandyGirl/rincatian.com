// 导入修改后的农历计算类
const fs = require('fs');
eval(fs.readFileSync('./lunar-calendar.js', 'utf8'));

// 测试2025年9月15日到17日的农历日期
console.log('2025年9月15日农历结果:', LunarCalendar.solarToLunar(2025, 9, 15));
console.log('2025年9月16日农历结果:', LunarCalendar.solarToLunar(2025, 9, 16));
console.log('2025年9月17日农历结果:', LunarCalendar.solarToLunar(2025, 9, 17));