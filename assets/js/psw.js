// 简单哈希函数：输入字符串，返回一个整数哈希值
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // 简单累加 + 移位，确保哈希值分散
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // 转为32位整数（去符号）
    }
    return Math.abs(hash); // 取绝对值
}

// 生成今日密码
function generateTodayPassword() {
    const now = new Date();
    // 固定盐值（与Lua保持一致）
    const salt = "bm hello world";
    // 生成key：年月日 + 盐值（格式与Lua统一）
    const key = `day:${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${salt}`;
    
    // 计算哈希并取4位
    const hash = simpleHash(key);
    const code = ("0000" + (hash % 10000)).slice(-4);
    return code;
}

// 更新密码
function updatePassword() {
    const password = generateTodayPassword();
    document.querySelectorAll('.today_password').forEach(el => {
        el.textContent = "验证码：" + password + "，你可能会需要它！";
    });
}

updatePassword();
