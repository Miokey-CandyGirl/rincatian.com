// 田历测试脚本
console.log("开始测试田历系统...");

// 田历起点：2015年3月21日（公历） - 华田元年1月１日
const TIAN_CALENDAR_EPOCH = new Date(2015, 2, 21); // 月份从0开始，2表示3月

// 田历每月天数：[30,31,31,32,31,31,30,30,30,29,30,30]
const TIAN_MONTH_DAYS = [30, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30];

// 计算是否为闰年（简化版，每4年一次）
function isTianLeapYear(year) {
    return year % 4 === 0;
}

// 获取田历某年的总天数
function getTianYearDays(year) {
    let totalDays = TIAN_MONTH_DAYS.reduce((sum, days) => sum + days, 0); // 365天
    if (isTianLeapYear(year)) {
        totalDays += 1; // 闰年时1月增加一天
    }
    return totalDays;
}

// 计算田历日期
function calculateTianDate() {
    const now = new Date();
    const diffTime = now - TIAN_CALENDAR_EPOCH;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        // 如果是田历纪元前，返回田元前的日期
        return {
            year: 0,
            month: 12,
            day: 30,
            dayOfYear: 0,
            era: '田元前'
        };
    }
    
    let remainingDays = diffDays;
    let year = 1;
    
    // 计算年份
    while (true) {
        const yearDays = getTianYearDays(year);
        if (remainingDays < yearDays) {
            break;
        }
        remainingDays -= yearDays;
        year++;
    }
    
    const dayOfYear = remainingDays + 1;
    
    // 计算月份和日期
    let month = 1;
    let day = remainingDays + 1;
    
    for (let m = 0; m < 12; m++) {
        let monthDays = TIAN_MONTH_DAYS[m];
        // 闰年的１月增加一天
        if (m === 0 && isTianLeapYear(year)) {
            monthDays += 1;
        }
        
        if (day <= monthDays) {
            month = m + 1;
            break;
        }
        day -= monthDays;
    }
    
    return {
        year: year,
        month: month,
        day: day,
        dayOfYear: dayOfYear,
        era: '华田',
        isLeapYear: isTianLeapYear(year)
    };
}

// 执行测试
const tianDate = calculateTianDate();
console.log("田历计算结果:", tianDate);

let dateString;
if (tianDate.era === '田元前') {
    dateString = `田元前${Math.abs(tianDate.year)}年`;
} else {
    dateString = `华田${tianDate.year}年${tianDate.month}月${tianDate.day}日`;
}

console.log("格式化的田历日期:", dateString);