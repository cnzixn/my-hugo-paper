// 简单哈希函数保持不变
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// 多优先级时间获取器
async function getPriorityTime() {
    // 苏宁API优先
    try {
        const suningRes = await fetch('https://quan.suning.com/getSysTime.do');
        if (!suningRes.ok) throw new Error('苏宁API响应失败');
        
        const data = await suningRes.json();
        const [year, month, day] = data.sysTime2.split(' ')[0].split('-');
        return { year: +year, month: +month, day: +day };
    } catch (e) {
        console.log('苏宁API失败:', e);
    }

    // 北京时间API次选
    try {
        const beijingRes = await fetch('https://www.beijing-time.org/t/time.asp');
        if (!beijingRes.ok) throw new Error('北京API响应失败');
        
        const text = await beijingRes.text();
        const regex = /nyear=(\d+).*?nmonth=(\d+).*?nday=(\d+)/;
        const matches = text.match(regex);
        
        if (matches) {
            return {
                year: +matches[1],
                month: +matches[2],
                day: +matches[3]
            };
        }
        throw new Error('解析失败');
    } catch (e) {
        console.log('北京API失败:', e);
    }

    // 本地时间保底
    // const now = new Date();
    // return {
        // year: now.getFullYear(),
        // month: now.getMonth() + 1,
        // day: now.getDate()
    // };
}

// 生成今日密码（带优先级网络时间）
async function generateTodayPassword() {
    try {
        const timeData = await getPriorityTime();
        const { year, month, day } = timeData;
        
        // 统一日期格式（两位数）
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const salt = "bm hello world";
        const key = `day:${dateStr}-${salt}`;
        
        const hash = simpleHash(key);
        return ("0000" + (hash % 10000)).slice(-4);
    } catch (error) {
        console.error('密码生成失败:', error);
        return "????"; // 终极降级方案
    }
}

// 更新密码（带重试机制）
async function updatePasswordWithRetry(retries = 3) {
    try {
        // 显示加载状态
        document.querySelectorAll('.today_password').forEach(el => {
            el.textContent = "今日密码：加载中...";
        });

        const password = await generateTodayPassword();
        document.querySelectorAll('.today_password').forEach(el => {
            el.textContent = `今日密码：${password}`;
        });
    } catch (error) {
        if (retries > 0) {
            console.log(`重试中（剩余${retries}次）...`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒重试
            await updatePasswordWithRetry(retries - 1);
        } else {
            document.querySelectorAll('.today_password').forEach(el => {
                el.textContent = "今日密码：获取失败，请检查网络";
            });
        }
    }
}

// 初始化
updatePasswordWithRetry();
