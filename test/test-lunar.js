const LunarCalendar = require('../lunar-calendar.js');

// 测试2025年9月16日
const result = LunarCalendar.solarToLunar(2025, 9, 16);
console.log('2025年9月16日农历结果:', result);

// 测试其他日期
const result2 = LunarCalendar.solarToLunar(2025, 1, 1);
console.log('2025年1月1日农历结果:', result2);