// 简单哈希函数保持不变
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// 注释：不再使用本地时间，以下本地时间相关函数已禁用
/*
// 新增：仅获取本地时间（同步，快速返回）
function getLocalTime() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
    };
}

// 新增：将本地时间转换为北京时间（东八区）
function getLocalTimeAsBeijing() {
    const localDate = new Date();
    // 获取本地时间与UTC时间的分钟差（本地时区偏移）
    const localOffset = localDate.getTimezoneOffset(); // 单位：分钟，东时区为负，西时区为正
    // 北京时间 = 本地时间 + 本地时区偏移（分钟） + 8小时（480分钟）
    const beijingTime = new Date(localDate.getTime() + (localOffset * 60000) + (8 * 3600000));
    
    return {
        year: beijingTime.getFullYear(),
        month: beijingTime.getMonth() + 1,
        day: beijingTime.getDate()
    };
}
*/

// 多优先级网络时间获取器（保持不变）
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

    throw new Error('所有时间源均不可用');
}

// 生成密码（复用逻辑，接收时间数据参数）
function generatePassword(timeData, salt) {
    const { year, month, day } = timeData;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const key = `day:${dateStr}-${salt}`;
    const hash = simpleHash(key);
    return ("0000" + (hash % 10000)).slice(-4);
}

// 更新密码（仅使用网络时间，带重试）
async function updatePasswordWithRetry(retries = 3) {
    // 注释：不再使用本地时间生成临时密码，直接等待网络时间
    try {
        const networkTime = await getPriorityTime();
        const finalTestPwd = generatePassword(networkTime, "bmtest hello world");
        const finalPwd = generatePassword(networkTime, "bm hello world");
        
        // 用网络时间计算的密码显示
        document.querySelectorAll('.today_password_test').forEach(el => {
            el.textContent = finalTestPwd;
        });
        document.querySelectorAll('.today_password').forEach(el => {
            el.textContent = finalPwd;
        });

    } catch (error) {
        if (retries > 0) {
            console.log(`重试中（剩余${retries}次）...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updatePasswordWithRetry(retries - 1);
        } else {
            console.log("所有网络时间源均失败，无法生成密码");
            // 可根据需求添加失败提示逻辑，如显示错误信息
            document.querySelectorAll('.today_password_test, .today_password').forEach(el => {
                el.textContent = "获取失败";
            });
        }
    }
}

// 初始化
updatePasswordWithRetry();
