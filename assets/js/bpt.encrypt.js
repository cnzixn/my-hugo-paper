// 简单哈希函数（原逻辑不变）
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// 网络时间获取器（重点修复：新增跨域兼容+更多稳定源+容错）
async function getPriorityTime() {
    // 1. 阿里云时间（国内最稳定，优先）
    try {
        const aliRes = await fetch('https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!aliRes.ok) throw new Error('阿里云响应失败');
        const data = await aliRes.json();
        const timestamp = data.data.timestamp;
        const dateObj = new Date(timestamp * 1000);
        if (isNaN(dateObj.getTime())) throw new Error('日期解析失败');
        return {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate(),
            weekday: dateObj.getDay() || 7 // 0→7（周日）
        };
    } catch (e) {
        console.log('阿里云API失败:', e);
    }

    // 2. 京东时间（备用）
    try {
        const jdRes = await fetch('https://a.jd.com//ajax/queryServerData.html', { mode: 'cors' });
        if (!jdRes.ok) throw new Error('京东响应失败');
        const data = await jdRes.json();
        const dateObj = new Date(data.serverTime);
        if (isNaN(dateObj.getTime())) throw new Error('日期解析失败');
        return {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate(),
            weekday: dateObj.getDay() || 7
        };
    } catch (e) {
        console.log('京东API失败:', e);
    }

    // 3. 本地时间兜底（避免完全空白，最后方案）
    try {
        const dateObj = new Date();
        console.log('使用本地时间兜底（确保礼包码显示）');
        return {
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate(),
            weekday: dateObj.getDay() || 7
        };
    } catch (e) {
        console.log('本地时间获取失败:', e);
    }

    throw new Error('所有时间源均不可用');
}

// 生成密码（原逻辑不变，确保礼包码正常生成）
function generatePassword(timeData, salt) {
    const { year, month, day } = timeData;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const key = `day:${dateStr}-${salt}`;
    const hash = simpleHash(key);
    return ("0000" + (hash % 10000)).slice(-4); // 4位礼包码/测试码
}

// 核心更新函数（明确区分两者逻辑，避免互相影响）
async function updatePasswordWithRetry(retries = 2) {
    try {
        const timeData = await getPriorityTime();
        const { weekday } = timeData;

        // 普通礼包码：全天显示（逻辑完全不变，确保正常）
        const normalPwd = generatePassword(timeData, "bm hello world");
        // Test码：仅周五（5）、六（6）、日（7）显示，其余显示????
        const testPwd = [5, 6, 7].includes(weekday) 
            ? generatePassword(timeData, "bmtest hello world") 
            : "????";

        // 强制更新元素（兼容选择器可能的细微差异）
        const normalElements = document.querySelectorAll('.today_password');
        const testElements = document.querySelectorAll('.today_password_test');

        // 确保元素存在再赋值，避免报错中断
        if (normalElements.length > 0) {
            normalElements.forEach(el => {
                el.textContent = normalPwd;
                el.style.display = 'inline'; // 强制显示，避免被隐藏
            });
        } else {
            console.warn('未找到礼包码元素！请检查class是否为 .today_password');
        }

        if (testElements.length > 0) {
            testElements.forEach(el => {
                el.textContent = testPwd;
                el.style.display = 'inline';
            });
        } else {
            console.warn('未找到test码元素！请检查class是否为 .today_password_test');
        }

    } catch (error) {
        if (retries > 0) {
            console.log(`重试中（剩余${retries}次）...`);
            await new Promise(resolve => setTimeout(resolve, 800));
            await updatePasswordWithRetry(retries - 1);
        } else {
            console.error('最终失败:', error);
            // 失败时也显示提示，不空白
            document.querySelectorAll('.today_password').forEach(el => {
                el.textContent = "加载中";
            });
            document.querySelectorAll('.today_password_test').forEach(el => {
                el.textContent = "加载中";
            });
        }
    }
}

// 初始化（立即执行，确保快速显示）
updatePasswordWithRetry();
