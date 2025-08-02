-- 简单哈希函数（与JS逻辑完全相同）
local function simpleHash(str)
    local hash = 0
    for i = 1, #str do
        local charCode = string.byte(str, i)
        -- 与JS的 (hash << 5) - hash + charCode 等价
        hash = (hash * 32) - hash + charCode
        -- 转为32位整数（模拟JS的 hash & hash）
        hash = hash % 0x100000000 -- 取32位无符号范围
    end
    return math.abs(hash) -- 取绝对值
end

-- 生成今日密码
local function generateTodayPassword()
    local now = os.date("*t")
    local salt = "bm hello world" -- 与JS盐值一致
    -- 生成与JS相同格式的key
    local key = string.format("day:%d-%d-%d-%s", now.year, now.month, now.day, salt)
    
    -- 计算哈希并取4位
    local hash = simpleHash(key)
    local code = string.format("%04d", hash % 10000)
    return code
end

-- 输出结果
print("今日密码：", generateTodayPassword())
