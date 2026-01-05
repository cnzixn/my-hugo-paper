
// <script>
let apiUrl = 'https://cdk.bxq.me'; // 请替换为你的API地址
let authHeader = '';

// 分页相关全局变量
let currentPage = 1;
let pageSize = 20;
let totalPages = 1;
let totalCDKs = 0;

// 标签页切换功能
/**
 * 切换标签页
 * @param {string} tabName - 标签页名称：generate, list, payload
 */

// 切换到日志标签时自动加载日志
function switchTab(tabName) {
    // 隐藏所有标签页内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示当前标签页内容
    const targetTab = document.getElementById(`${tabName}Tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活当前标签按钮
    event.target.classList.add('active');
    
    // 如果切换到日志标签，自动加载日志
    if (tabName === 'logs' && targetTab) {
        logsCurrentPage = 1;
        loadLogs();
    }
}

// 页面加载时检查并恢复 JWT token
window.addEventListener('DOMContentLoaded', () => {
    // 清除旧的认证信息
    localStorage.removeItem('cdkAdminAuth');
    
    // 检查 JWT token
    const token = localStorage.getItem('cdkAdminToken');
    const loginTime = localStorage.getItem('cdkAdminLoginTime');
    const expiresIn = localStorage.getItem('cdkAdminExpiresIn');
    
    if (token && loginTime && expiresIn) {
        // 检查 token 是否过期
        const now = Date.now();
        const isExpired = now - parseInt(loginTime) > parseInt(expiresIn) * 1000;
        
        if (!isExpired) {
            // 显示自动登录加载状态
            const autoLoginLoading = document.getElementById('autoLoginLoading');
            if (autoLoginLoading) {
                autoLoginLoading.style.display = 'block';
            }
            
            authHeader = `Bearer ${token}`;
            // 测试认证是否有效
            fetch(`${apiUrl}/api/admin/list`, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // 隐藏自动登录加载状态
                if (autoLoginLoading) {
                    autoLoginLoading.style.display = 'none';
                }
                
                if (response.ok) {
                    // 认证有效，直接显示管理界面
                    document.getElementById('loginSection').classList.add('hidden');
                    document.getElementById('adminSection').classList.remove('hidden');
                    listCDK();
                    showToast('✅ 已自动登录');
                } else {
                    // 认证无效，清除保存的信息
                    localStorage.removeItem('cdkAdminToken');
                    localStorage.removeItem('cdkAdminLoginTime');
                    localStorage.removeItem('cdkAdminExpiresIn');
                }
            })
            .catch(() => {
                // 隐藏自动登录加载状态
                if (autoLoginLoading) {
                    autoLoginLoading.style.display = 'none';
                }
                
                // 认证无效，清除保存的信息
                localStorage.removeItem('cdkAdminToken');
                localStorage.removeItem('cdkAdminLoginTime');
                localStorage.removeItem('cdkAdminExpiresIn');
            });
        } else {
            // token 已过期，清除保存的信息
            localStorage.removeItem('cdkAdminToken');
            localStorage.removeItem('cdkAdminLoginTime');
            localStorage.removeItem('cdkAdminExpiresIn');
        }
    }
});

// 统一生成CDK项HTML的函数
function generateCDKItemHTML(cdk, isUsed, cardStyle, formatDate) {
    // 修复有效期显示问题
    const validDays = cdk.days || 0;
    
    return `<div class="cdk-item" id="cdk-item-${cdk.code}" style="${cardStyle}">
        <div style="margin-bottom: 8px;">
            <span class="cdk-code">${cdk.code}</span>
        </div>
        <div class="cdk-meta" style="font-size: 12px; color: #666; line-height: 1.6;">
            <div style="margin-bottom: 3px;"><strong style="color: #666;">UID:</strong> <span style="color: #333; font-size: 13px;">${cdk.uid || '未设置'}</span></div>
            <div style="margin-bottom: 3px;"><strong style="color: #666;">MID:</strong> <span style="color: #333; font-size: 13px;">${isUsed ? cdk.mid : '未绑定'}</span></div>
            <div style="margin-bottom: 3px;"><strong>有效天数:</strong> ${validDays} 天</div>
            <div style="margin-bottom: 3px;"><strong>创建时间:</strong> ${formatDate(cdk.createdAt || cdk.created_at)}</div>
            ${isUsed ? `<div style="margin-bottom: 3px;"><strong>绑定时间:</strong> ${formatDate(cdk.boundAt || cdk.bound_at)}</div>` : ''}
            ${isUsed ? `<div style="margin-bottom: 3px;"><strong>过期时间:</strong> ${formatDate(cdk.expireAt || cdk.expire_at)}</div>` : ''}
            <div style="margin-bottom: 3px;"><strong>解绑次数:</strong> ${cdk.unbindCount || 0} 次</div>
            ${cdk.lastUnbindAt ? `<div style="margin-bottom: 3px;"><strong>最后解绑:</strong> ${formatDate(cdk.lastUnbindAt)}</div>` : ''}
        </div>
        <div class="cdk-actions">
            <button type="button" class="action-btn delete-btn" onclick="deleteCDKByCode('${cdk.code}')">删除</button>
            ${isUsed ? `<button type="button" class="action-btn clear-btn" onclick="clearCDKUID('${cdk.code}')">解绑</button>` : ''}
            <button type="button" class="action-btn copy-btn" onclick="copyToClipboard('${cdk.code}')">复制</button>
        </div>
    </div>`;
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// JWT 相关配置
const ADMIN_SALT = 'bm_default_salt';

// 哈希函数，用于登录时处理密码
async function hashCredentials(username, password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${username}..${password}..${salt}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 登录功能
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const resultDiv = document.getElementById('loginResult');
    const debugDiv = document.getElementById('loginDebug');
    
    // 清空之前的调试信息
    debugDiv.textContent = '';
    debugDiv.classList.add('hidden');
    
    if (!username || !password) {
        resultDiv.textContent = '请输入用户名和密码';
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
        return;
    }
    
    try {
        // 前端对密码进行哈希处理
        const hashedPassword = await hashCredentials(username, password, ADMIN_SALT);
        
        // 准备调试信息
        let debugInfo = `登录调试信息:\n`;
        debugInfo += `API地址: ${apiUrl}\n`;
        debugInfo += `用户名: ${username}\n`;
        debugInfo += `哈希后的密码: ${hashedPassword}\n`;
        debugInfo += `ADMIN_SALT: ${ADMIN_SALT}\n\n`;
        
        // 发送登录请求到后端，只发送用户名和哈希后的密码
        const response = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password: hashedPassword, isHashed: true })
        });
        
        debugInfo += `响应状态: ${response.status}\n`;
        
        const data = await response.json();
        
        debugInfo += `响应数据: ${JSON.stringify(data, null, 2)}\n`;
        
        if (response.ok && data.success) {
            // 保存 JWT token 到 localStorage
            const token = data.token;
            const expiresIn = data.expiresIn;
            const loginTime = Date.now();
            
            localStorage.setItem('cdkAdminToken', token);
            localStorage.setItem('cdkAdminLoginTime', loginTime);
            localStorage.setItem('cdkAdminExpiresIn', expiresIn);
            
            // 设置认证头
            authHeader = `Bearer ${token}`;
            
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminSection').classList.remove('hidden');
            resultDiv.textContent = '';
            resultDiv.classList.add('hidden');
            
            // 自动查询CDK列表
            listCDK();
            // 登录成功弹窗
            showToast('✅ 登录成功');
        } else {
            resultDiv.textContent = `登录失败: ${data.error || '用户名或密码错误'}`;
            resultDiv.classList.remove('hidden', 'success');
            resultDiv.classList.add('error');
            
            // 暂时关闭调试信息显示
            // debugDiv.textContent = debugInfo;
            // debugDiv.classList.remove('hidden');
        }
    } catch (error) {
        resultDiv.textContent = '登录失败：' + error.message;
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
        
        // 暂时关闭调试信息显示
        // let debugInfo = `登录调试信息:\n`;
        // debugInfo += `API地址: ${apiUrl}\n`;
        // debugInfo += `用户名: ${username}\n`;
        // debugInfo += `错误信息: ${error.message}\n`;
        // debugInfo += `错误详情: ${error.stack || '无更多详情'}\n`;
        // debugDiv.textContent = debugInfo;
        // debugDiv.classList.remove('hidden');
    }
}

// 防抖版本的登录函数，300ms内只能触发一次
const debouncedLogin = debounce(login, 300);

// 添加全局变量存储CDK数据
let generatedCDKs = [];
let allCDKs = [];

// 为其他高频操作按钮添加防抖版本
const debouncedGenerateCDK = debounce(generateCDK, 500);
const debouncedSearchCDK = debounce(searchCDK, 500);
const debouncedDeleteAllUnusedCDKs = debounce(deleteAllUnusedCDKs, 1000);

// 检查 JWT token 是否有效
function isTokenValid() {
    const token = localStorage.getItem('cdkAdminToken');
    const loginTime = localStorage.getItem('cdkAdminLoginTime');
    const expiresIn = localStorage.getItem('cdkAdminExpiresIn');
    
    if (!token || !loginTime || !expiresIn) {
        return false;
    }
    
    // 检查 token 是否过期
    const now = Date.now();
    const isExpired = now - parseInt(loginTime) > parseInt(expiresIn) * 1000;
    
    return !isExpired;
}

// 处理 token 过期
function handleTokenExpired() {
    localStorage.removeItem('cdkAdminToken');
    localStorage.removeItem('cdkAdminLoginTime');
    localStorage.removeItem('cdkAdminExpiresIn');
    authHeader = '';
    
    // 显示登录界面
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminSection').classList.add('hidden');
    showToast('❌ 登录已过期，请重新登录');
}

// 统一的 API 请求函数，添加 token 管理
async function apiRequest(url, options = {}) {
    // 检查 token 是否有效
    if (!isTokenValid()) {
        handleTokenExpired();
        return Promise.reject(new Error('Token expired'));
    }
    
    // 添加认证头
    const headers = {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // 检查响应状态
        if (response.status === 401) {
            // Token 无效或过期
            handleTokenExpired();
            return Promise.reject(new Error('Unauthorized'));
        }
        
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}

// 🌟 核心：底部居中弹窗函数（自动消失）
function showToast(message) {
    // 先移除已存在的弹窗，避免重复
    let toast = document.getElementById('customToast');
    if (toast) toast.remove();
    
    // 创建弹窗元素
    toast = document.createElement('div');
    toast.id = 'customToast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translate(-50%, 20px);
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示弹窗
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // 3秒后自动隐藏并移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 生成CDK
function generateCDK() {
    const count = document.getElementById('cdk-count').value;
    const days = document.getElementById('cdk-days').value;
    const resultContainer = document.getElementById('generated-result-container');
    const resultTextarea = document.getElementById('generateResult');
    
    // 显示加载状态
    resultTextarea.value = '正在生成CDK...';
    resultContainer.classList.add('show');
    
    apiRequest(`${apiUrl}/api/admin/generate`, {
        method: 'POST',
        body: JSON.stringify({ count: parseInt(count), days: parseInt(days) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 存储生成的CDK数据（用于复制全部功能）
            generatedCDKs = data.cdks.map(cdk => ({
                code: cdk.code,
                uid: cdk.uid || '',
                mid: cdk.mid || '',
                status: cdk.mid ? '已使用' : '未使用',
                days: cdk.days || 0
            }));
            
            // 将生成的CDK显示在多行文本框中
            const cdkList = data.cdks.map(cdk => cdk.code).join('\n');
            resultTextarea.value = cdkList;
            
            // 刷新CDK列表
            listCDK();
            // 生成成功弹窗
            showToast(`✅ 成功生成 ${data.count} 个CDK`);
        } else {
            resultTextarea.value = `生成失败：${data.error}`;
            // 生成失败弹窗
            showToast(`❌ 生成失败：${data.error}`);
        }
    })
    .catch(error => {
        resultTextarea.value = `生成失败：${error.message}`;
        // 生成失败弹窗
        showToast(`❌ 生成失败：${error.message}`);
    });
}

// 复制生成的CDK到剪贴板
function copyGeneratedCDKs() {
    const resultTextarea = document.getElementById('generateResult');
    const cdkList = resultTextarea.value;
    
    if (!cdkList || cdkList === '正在生成CDK...' || cdkList.startsWith('生成失败：')) {
        showToast('❌ 没有可复制的CDK');
        return;
    }
    
    navigator.clipboard.writeText(cdkList).then(() => {
        showToast('✅ CDK已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败：', err);
        showToast('❌ 复制失败，请手动复制');
    });
}

// 导出全部生成的CDK为TXT文件
function exportGeneratedCDKs() {
    if (generatedCDKs.length === 0) {
        showToast('❌ 没有可导出的CDK');
        return;
    }
    
    // 格式化CDK文本，每行一个CDK，包含天数信息（天数在前）
    let textToCopy = '';
    generatedCDKs.forEach(cdk => {
        // 每4字符插入-，先过滤已有-避免重复
        const formattedCode = cdk.code.replace(/-/g, '').replace(/(.{4})(?=.)/g, '$1-');
        textToCopy += `【${cdk.days}天】${formattedCode}\n`;
    });
    
    // 创建Blob对象并下载
    const blob = new Blob([textToCopy], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_cdks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast(`✅ 已导出全部 ${generatedCDKs.length} 个CDK`);
}


// 获取单个CDK详情
async function getCDKDetail(cdkCode) {
    try {
        const response = await apiRequest(`${apiUrl}/api/cdk/${cdkCode}`, {
            method: 'GET'
        });
        const data = await response.json();
        return data.success ? data.cdk : null;
    } catch (error) {
        console.error('获取CDK详情失败：', error);
        return null;
    }
}

// 切换CDK卡片详情显示
async function toggleCDKDetails(cdkCode) {
    const cdkItem = document.getElementById(`cdk-item-${cdkCode}`);
    const detailsDiv = document.getElementById(`cdk-details-${cdkCode}`);
    
    if (!detailsDiv) return;
    
    if (detailsDiv.classList.contains('hidden')) {
        // 显示详情
        detailsDiv.innerHTML = '<div class="loading-state" style="padding: 10px 0; font-size: 12px;">加载详情中...</div>';
        detailsDiv.classList.remove('hidden');
        
        // 获取详细数据
        const cdkData = await getCDKDetail(cdkCode);
        if (cdkData) {
            // 渲染详细信息
            const statusText = cdkData.uid ? '已使用' : '未使用';
            const statusClass = cdkData.uid ? 'status-used' : 'status-active';
            let detailsHtml = `<div class="cdk-info" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span class="cdk-status ${statusClass}" style="padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; border: 1px solid; min-width: 60px; text-align: center;">${statusText}</span>
                <strong>绑定UID:</strong> ${cdkData.uid || '未绑定'}
            </div>
            <div class="cdk-meta">
                <strong>创建时间:</strong> ${convertToLocalTime(cdkData.createdAt)}
                ${cdkData.boundAt ? `<br><strong>绑定时间:</strong> ${convertToLocalTime(cdkData.boundAt)}` : ''}
                ${cdkData.expireAt ? `<br><strong>过期时间:</strong> ${convertToLocalTime(cdkData.expireAt)}` : ''}
                <br><strong>有效期:</strong> ${cdkData.days || 0} 天
            </div>`;
            detailsDiv.innerHTML = detailsHtml;
        } else {
            detailsDiv.innerHTML = '<div style="padding: 10px 0; color: #f44336; font-size: 12px;">加载详情失败</div>';
        }
    } else {
        // 隐藏详情
        detailsDiv.classList.add('hidden');
    }
}

// 查询CDK列表
function listCDK() {
    const container = document.getElementById('cdk-list-container');
    
    // 显示加载状态
    container.innerHTML = '<div class="loading-state">加载CDK列表...</div>';
    
    // 直接请求第1页，确保重新分页后能看到数据
    const requestPage = currentPage;
    
    // 获取排序参数
    const sortByElement = document.getElementById('sortBy');
    const sortBy = sortByElement ? sortByElement.value : 'created_at';
    const sortOrderElement = document.getElementById('sortOrder');
    const sortOrder = sortOrderElement ? sortOrderElement.value : 'desc';

    
    apiRequest(`${apiUrl}/api/admin/list?page=${requestPage}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 更新分页信息
            currentPage = data.page;
            pageSize = data.pageSize;
            totalPages = data.totalPages;
            totalCDKs = data.total;
            
            // 存储当前页的完整CDK数据，用于直接显示详情
            allCDKs = data.cdks.map(cdk => ({
                code: cdk.code,
                uid: cdk.uid || '',
                mid: cdk.mid || '',
                createdAt: cdk.createdAt || '',
                boundAt: cdk.boundAt || '',
                expireAt: cdk.expireAt || '',
                days: cdk.days || 0,
                used: cdk.used || false,
                unbindCount: cdk.unbindCount || 0,
                lastUnbindAt: cdk.lastUnbindAt || ''
            }));
            
            // 处理当前页数据为空的情况
            if (allCDKs.length === 0) {
                // 如果是通过API获取的第一页数据为空，直接显示空状态
                if (currentPage === 1) {
                    container.innerHTML = '<div class="empty-state">暂无CDK数据</div>';
                    renderPagination();
                    return;
                }
            }
            
            // 统计信息
            const usedCount = allCDKs.filter(cdk => cdk.used === true || cdk.mid !== '').length;
            
            // 生成CDK列表 - 只包含统计信息和CDK列表，搜索框已改为静态HTML
            let listHtml = `<div class="stats-bar">
                <span>已使用：${usedCount}/${totalCDKs} | 第 ${currentPage}/${totalPages} 页</span>
            </div>`;
            
            listHtml += '<div class="cdk-list">';
            allCDKs.forEach(cdk => {
                // 根据是否已使用设置不同的样式
                const isUsed = cdk.mid !== '' && cdk.mid !== null;
                const cardStyle = isUsed 
                    ? 'border-left: 4px solid #f44336; background-color: #fff5f5;' 
                    : 'border-left: 4px solid #4CAF50; background-color: #f9fff9;';
                
                // 复用全局的convertToLocalTime函数进行时间转换
                
                // 修复有效期显示问题
                const validDays = cdk.days || 0;
                
                // 使用统一函数生成CDK项
                const formattedCode = cdk.code.replace(/-/g, '').replace(/(.{4})(?=.)/g, '$1-');
                const cdkItem = {
                    ...cdk,
                    code: formattedCode
                };
                listHtml += generateCDKItemHTML(cdkItem, isUsed, cardStyle, convertToLocalTime);
            });

            listHtml += '</div>';
            
            container.innerHTML = listHtml;
            
            // 渲染分页控件
            renderPagination();
        } else {
            container.innerHTML = `<div class="account-info error">查询失败：${data.error}</div>`;
            showToast(`❌ 查询失败：${data.error}`);
        }
    })
    .catch(error => {
        container.innerHTML = `<div class="account-info error">查询失败：${error.message}</div>`;
        showToast(`❌ 查询失败：${error.message}`);
    });
}

// 导出全部列表中的CDK为TXT文件
function exportAllCDKs() {
    showToast('⏳ 正在导出CDK，请稍候...');
    
    // 调用服务器API导出所有CDK
    apiRequest(`${apiUrl}/api/admin/export`, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('导出失败');
        }
        return response.blob();
    })
    .then(blob => {
        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cdks_export.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('✅ CDK导出成功');
    })
    .catch(error => {
        console.error('导出CDK失败：', error);
        showToast('❌ CDK导出失败，请稍后重试');
    });
}

// ------------------------------
// 操作日志相关功能
// ------------------------------
let logsCurrentPage = 1;
const logsPageSize = 20;
let logsTotalPages = 1;
let logsTotalCount = 0;

// 重置日志筛选条件
function resetLogFilters() {
    document.getElementById('logs-search-content').value = '';
    logsCurrentPage = 1;
    loadLogs();
}

// 加载操作日志
async function loadLogs() {
    try {
        // 显示加载状态
        document.getElementById('logsTableBody').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #666;">正在加载日志...</td>
            </tr>
        `;
        
        // 获取筛选条件
        const searchContent = document.getElementById('logs-search-content').value;
        
        // 构建查询参数
        let queryParams = new URLSearchParams({
            page: logsCurrentPage,
            pageSize: logsPageSize
        });
        
        if (searchContent) queryParams.append('searchContent', searchContent);
        
        // 调用API加载日志
        const response = await apiRequest(`${apiUrl}/api/admin/logs?${queryParams}`, {
            method: 'GET'
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayLogs(data.data);
            updateLogsPagination(data.pagination);
        } else {
            document.getElementById('logsTableBody').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 20px; color: #c92a2a;">加载日志失败：${data.error || '未知错误'}</td>
                </tr>
            `;
            showToast(`❌ 加载日志失败：${data.error || '未知错误'}`);
        }
    } catch (error) {
        console.error('加载日志失败：', error);
        document.getElementById('logsTableBody').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #c92a2a;">加载日志失败：${error.message}</td>
            </tr>
        `;
        showToast(`❌ 加载日志失败：${error.message}`);
    }
}

// 将UTC时间转换为当地时间
function convertToLocalTime(utcTimeStr) {
    if (!utcTimeStr) return '-';
    try {
        // 确保时间字符串是标准的ISO 8601格式
        const normalizedTimeStr = utcTimeStr.replace(' ', 'T') + 'Z';
        const date = new Date(normalizedTimeStr);
        if (isNaN(date.getTime())) {
            // 如果标准化后仍无法解析，尝试直接解析原始字符串
            const fallbackDate = new Date(utcTimeStr);
            if (isNaN(fallbackDate.getTime())) {
                return '无效日期';
            }
            return fallbackDate.toLocaleString();
        }
        // 转换为当地时间的格式化字符串
        return date.toLocaleString();
    } catch (e) {
        console.error('时间转换错误:', e);
        return '无效日期';
    }
}

// 显示日志数据
function displayLogs(logs) {
    const logsTableBody = document.getElementById('logsTableBody');
    
    if (logs.length === 0) {
        logsTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #666;">没有找到符合条件的日志记录</td>
            </tr>
        `;
        return;
    }
    
    // 生成日志行
    const logRows = logs.map((log, index) => {
        const serialNumber = (logsCurrentPage - 1) * logsPageSize + index + 1;
        // 转换为当地时间
        const localTime = convertToLocalTime(log.operation_time);
        
        // 直接显示数据库返回的完整日志内容
        return `
            <tr style="border-bottom: 1px solid #eee; transition: background-color 0.2s; height: auto;">
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 60px; min-width: 60px;">${serialNumber}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-family: monospace; vertical-align: top; width: 180px; min-width: 180px; word-wrap: break-word; background-color: #fafafa;">${localTime}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500; vertical-align: top; width: 150px; min-width: 150px; word-wrap: break-word; background-color: #f0f8ff;">${log.operation_type}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; word-wrap: break-word; overflow-wrap: break-word; white-space: pre-wrap;">${log.operation_content}</td>
            </tr>
        `;
    }).join('');
    
    logsTableBody.innerHTML = logRows;
    
    // 添加行悬停效果
    const logRowsElements = logsTableBody.querySelectorAll('tr');
    logRowsElements.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f9f9f9';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
}

// 更新日志分页
function updateLogsPagination(pagination) {
    logsTotalPages = pagination.totalPages;
    logsTotalCount = pagination.total;
    
    const paginationContainer = document.getElementById('logsPagination');
    
    let paginationHTML = `
        <span style="color: #666;">共 ${logsTotalCount} 条记录，第 ${logsCurrentPage}/${logsTotalPages} 页</span>
        <button type="button" class="pagination-btn" onclick="logsCurrentPage=1;loadLogs()" ${logsCurrentPage === 1 ? 'disabled' : ''}>
            首页
        </button>
        <button type="button" class="pagination-btn" onclick="logsCurrentPage--;loadLogs()" ${logsCurrentPage === 1 ? 'disabled' : ''}>
            上一页
        </button>
        <button type="button" class="pagination-btn" onclick="logsCurrentPage++;loadLogs()" ${logsCurrentPage === logsTotalPages ? 'disabled' : ''}>
            下一页
        </button>
        <button type="button" class="pagination-btn" onclick="logsCurrentPage=logsTotalPages;loadLogs()" ${logsCurrentPage === logsTotalPages ? 'disabled' : ''}>
            末页
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // 为分页按钮添加样式
    const paginationButtons = paginationContainer.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(btn => {
        btn.style.padding = '5px 10px';
        btn.style.border = '1px solid #ddd';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = btn.disabled ? '#f5f5f5' : '#fff';
        btn.style.color = btn.disabled ? '#999' : '#333';
        btn.style.transition = 'all 0.2s';
        
        if (!btn.disabled) {
            btn.addEventListener('mouseenter', () => {
                btn.style.backgroundColor = '#f0f0f0';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.backgroundColor = '#fff';
            });
        }
    });
}

// 清空生成结果
function clearGenerateResult() {
    document.getElementById('generated-result-container').classList.remove('show');
    document.getElementById('generateResult').value = '';
    generatedCDKs = [];
    showToast('✅ 已清空生成结果');
}

// 单个复制功能
function copyToClipboard(text) {
    // 每4字符插入一个-，自动过滤原有的-避免重复
    const formattedText = text.replace(/-/g, '').replace(/(.{4})(?=.)/g, '$1-');
    navigator.clipboard.writeText(formattedText).then(() => {
        showToast('✅ CDK已复制到剪贴板');
    }).catch(err => {
        console.error('复制失败：', err);
        showToast('❌ 复制失败，请手动复制');
    });
}


// 删除CDK功能
function deleteCDKByCode(cdk) {
  // 如需确认弹窗，可取消注释下方一行
  // if (!confirm(`确定要删除CDK ${cdk} 吗？此操作不可撤销！`)) return;
  
  apiRequest(`${apiUrl}/api/admin/delete`, {
    method: 'POST',
    body: JSON.stringify({ cdk: cdk })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 1. 直接隐藏当前删除的CDK项（核心简化步骤）
      const cdkItem = document.getElementById(`cdk-item-${cdk}`);
      if (cdkItem) cdkItem.style.display = 'none'; // 隐藏元素
      
      // 2. 同步本地数据（避免后续操作数据不一致）
      generatedCDKs = generatedCDKs.filter(item => item.code !== cdk);
      allCDKs = allCDKs.filter(item => item.code !== cdk);
      
      // 3. 控制批量复制按钮显示/隐藏
      if (generatedCDKs.length === 0) {
        document.getElementById('copy-all-generated-btn').style.display = 'none';
      }

      // 4. 刷新当前页面，保持数据一致性
      listCDK();
      
      showToast('✅ CDK删除成功');
    } else {
      showToast(`❌ 删除失败：${data.error}`);
    }
  })
  .catch(error => {
    showToast(`❌ 删除失败：${error.message}`);
  });
}

// 清除CDK绑定的UID功能
function clearCDKUID(cdk) {
  // 确认弹窗，防止误操作
  if (!confirm(`确定要清除CDK ${cdk} 绑定的设备吗？此操作将允许该CDK绑定到新设备！`)) return;
  
  apiRequest(`${apiUrl}/api/admin/clear-uid`, {
    method: 'POST',
    body: JSON.stringify({ cdk: cdk })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // 刷新CDK列表，显示更新后的状态
      listCDK();
      
      showToast('✅ 设备绑定清除成功，该CDK可绑定到新设备');
    } else {
      showToast(`❌ 清除设备绑定失败：${data.error}`);
    }
  })
  .catch(error => {
    showToast(`❌ 清除设备绑定失败：${error.message}`);
  });
}

// 删除当前页未使用的CDK
async function deleteAllUnusedCDKs() {
  // 筛选当前页未使用的CDK（通过mid是否存在判断）
  const unusedCDKs = allCDKs.filter(cdk => !cdk.mid);
  
  if (unusedCDKs.length === 0) {
    showToast('❌ 当前页没有未使用的CDK');
    return;
  }
  
  // 确认弹窗，避免误操作
  if (!confirm(`确定要删除当前页 ${unusedCDKs.length} 个未使用的CDK吗？此操作不可撤销！`)) return;
  
  // 逐个删除当前页未使用的CDK
  let deletedCount = 0;
  let failedCount = 0;
  
  // 使用Promise.all并发删除，不限制并发数
  const deletePromises = [];
  
  for (const cdk of unusedCDKs) {
    const deletePromise = apiRequest(`${apiUrl}/api/admin/delete`, {
      method: 'POST',
      body: JSON.stringify({ cdk: cdk.code })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        deletedCount++;
      } else {
        failedCount++;
      }
    })
    .catch(error => {
      failedCount++;
    });
    
    deletePromises.push(deletePromise);
  }
  
  // 等待所有请求完成
  await Promise.all(deletePromises);
  
  // 删除完成后，重置到第1页，避免出现空页
  currentPage = 1;
  
  // 刷新CDK列表
  listCDK();
  // 清空生成结果
  clearGenerateResult();
  // 显示成功提示
  showToast(`✅ 成功删除 ${deletedCount} 个未使用的CDK，失败 ${failedCount} 个`);
}



// 渲染分页控件
function renderPagination() {
    const container = document.getElementById('cdk-list-container');
    
    // 创建分页控件HTML
    let paginationHtml = '<div class="pagination">';
    
    // 上一页按钮
    // paginationHtml += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">上一页</button>`;
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    
    if (startPage > 1) {
        paginationHtml += `<button onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHtml += '<span>...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += '<span>...</span>';
        }
        paginationHtml += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // 下一页按钮
    // paginationHtml += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">下一页</button>`;
    
    paginationHtml += '</div>';
    
    // 添加分页控件到容器末尾
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination-container';
    paginationDiv.innerHTML = paginationHtml;
    
    // 移除旧的分页控件（如果存在）
    const oldPagination = container.querySelector('.pagination-container');
    if (oldPagination) {
        container.removeChild(oldPagination);
    }
    
    container.appendChild(paginationDiv);
}

// 跳转到指定页码
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    listCDK();
}

// 搜索CDK
function searchCDK() {
    let searchTerm = document.getElementById('searchCdk').value.trim();
    
    if (!searchTerm) {
        showToast('❌ 请输入搜索关键词');
        return;
    }
    
    // 过滤掉连字符，确保搜索能匹配数据库中的CDK（数据库中存储的是没有连字符的原始CDK）
    searchTerm = searchTerm.replace(/-/g, '');
    
    // 获取排序参数
    const sortBy = document.getElementById('sortBy')?.value || 'created_at';
    const sortOrder = document.getElementById('sortOrder')?.value || 'desc';
    
    const container = document.getElementById('cdk-list-container');
    
    // 显示加载状态
    container.innerHTML = '<div class="loading-state" style="padding: 20px;">正在搜索CDK...<br>从D1数据库中查找所有匹配的CDK</div>';
    
    // 调用后端API搜索所有匹配的CDK
    apiRequest(`${apiUrl}/api/search?q=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}&sortOrder=${sortOrder}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const filteredCDKs = data.cdks;
            
            if (filteredCDKs.length === 0) {
                container.innerHTML = `
                    <div class="stats-bar">
                        <span>搜索结果：找到 ${filteredCDKs.length} 个匹配的CDK</span>
                    </div>
                    <div class="empty-state" style="padding: 20px;">未找到匹配的CDK</div>
                `;
                showToast('❌ 未找到匹配的CDK');
                return;
            }
            
            // 更新显示
            
            // 生成搜索结果HTML - 只包含统计信息和CDK列表，搜索框已改为静态HTML
            let resultHtml = `<div class="stats-bar">
                <span>搜索结果：找到 ${filteredCDKs.length} 个匹配的CDK</span>
            </div>`;
            
            resultHtml += '<div class="cdk-list">';
            filteredCDKs.forEach(cdk => {
                // 根据是否已使用设置不同的样式
                const isUsed = cdk.mid !== '' && cdk.mid !== null;
                const cardStyle = isUsed 
                    ? 'border-left: 4px solid #f44336; background-color: #fff5f5;' 
                    : 'border-left: 4px solid #4CAF50; background-color: #f9fff9;';
                
                // 修复有效期显示问题
                const validDays = cdk.days || 0;
                
                // 使用统一函数生成CDK项
                resultHtml += generateCDKItemHTML(cdk, isUsed, cardStyle, convertToLocalTime);
            });
            
            resultHtml += '</div>';
            
            container.innerHTML = resultHtml;
            
            showToast(`✅ 找到 ${filteredCDKs.length} 个匹配的CDK`);
        } else {
            container.innerHTML = `
                <div class="account-info error" style="margin: 15px; padding: 15px;">搜索失败：${data.error || '未知错误'}</div>
            `;
            showToast(`❌ 搜索失败：${data.error || '未知错误'}`);
        }
    })
    .catch(error => {
        console.error('搜索CDK失败：', error);
        container.innerHTML = `
            <div class="account-info error" style="margin: 15px; padding: 15px;">搜索失败：网络错误或服务器错误</div>
        `;
        showToast('❌ 搜索失败：网络错误或服务器错误');
    });
}

// 清空搜索
function clearSearch() {
    // 清空搜索输入
    document.getElementById('searchCdk').value = '';
    
    // 重新加载列表
    listCDK();
    
    showToast('✅ 搜索已清空');
}

// 加载 CDK Payload
async function loadCDKPayload() {
    const searchValue = document.getElementById('searchValue').value.trim();
    const resultDiv = document.getElementById('payloadResult');
    
    if (!searchValue) {
        resultDiv.textContent = '请输入搜索值';
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
        return;
    }
    
    try {
        // 1. 先拿搜索框里的内容去搜索
        const searchResponse = await apiRequest(`${apiUrl}/api/search?q=${encodeURIComponent(searchValue)}`, {
            method: 'GET'
        });
        
        const searchData = await searchResponse.json();
        
        if (searchData.success) {
            const cdks = searchData.cdks;
            
            // 2. 检查搜索结果
            if (cdks && cdks.length === 1) {
                // 2.1 如果刚好有一个结果，就拿它的CDK去加载payload
                const cdkCode = cdks[0].code;
                
                // 2.2 使用CDK代码调用专门的API获取完整的CDK详情，包括payload
                const cdkResponse = await apiRequest(`${apiUrl}/api/cdk/${cdkCode}`, {
                    method: 'GET'
                });
                
                const cdkData = await cdkResponse.json();
                
                if (cdkData.success) {
                    let payload = {
                        role: {
                            basic: true,
                            bm000: false
                        },
                        ext: {
                            version: 'v1.0',
                            remark: '支持嵌套JSON'
                        }
                    };
                    
                    // 如果 CDK 已有 payload，使用现有 payload
                    if (cdkData.cdk && cdkData.cdk.payload) {
                        try {
                            // 检查payload类型，如果是字符串则解析，否则直接使用
                            if (typeof cdkData.cdk.payload === 'string') {
                                payload = JSON.parse(cdkData.cdk.payload);
                            } else {
                                // 已经是对象，直接使用
                                payload = cdkData.cdk.payload;
                            }
                        } catch (e) {
                            console.error('解析 payload 失败:', e);
                        }
                    }
                    
                    // 显示原始 JSON
                    document.getElementById('payloadContent').value = JSON.stringify(payload, null, 2);
                    
                    // 保存当前CDK到隐藏输入框
                    document.getElementById('currentCdk').value = cdkCode;
                    
                    resultDiv.textContent = `✅ 成功加载 ${cdkCode} 的 Payload`;
                    resultDiv.classList.remove('hidden', 'success');
                    resultDiv.classList.add('success');
                    showToast(`✅ 成功加载 ${cdkCode} 的 Payload`);
                } else {
                    resultDiv.textContent = `❌ 加载CDK详情失败：${cdkData.error || '未知错误'}`;
                    resultDiv.classList.remove('hidden', 'success');
                    resultDiv.classList.add('error');
                }
            } else if (cdks && cdks.length > 1) {
                // 如果结果有多个，提示用户
                resultDiv.textContent = `找到 ${cdks.length} 个匹配的CDK，请先搜索后复制准确的CDK代码`;
                resultDiv.classList.remove('hidden', 'success');
                resultDiv.classList.add('error');
                showToast(`❌ 找到 ${cdks.length} 个匹配的CDK，请先搜索后复制准确的CDK代码`);
            } else {
                // 如果结果没有，提示用户
                resultDiv.textContent = '未找到匹配的CDK，请先搜索后复制准确的CDK代码';
                resultDiv.classList.remove('hidden', 'success');
                resultDiv.classList.add('error');
                showToast('❌ 未找到匹配的CDK，请先搜索后复制准确的CDK代码');
            }
        } else {
            resultDiv.textContent = `❌ 搜索失败：${searchData.error || '未知错误'}`;
            resultDiv.classList.remove('hidden', 'success');
            resultDiv.classList.add('error');
        }
    } catch (error) {
        resultDiv.textContent = `❌ 加载失败：${error.message}`;
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
    }
}

// 更新 Payload
async function updatePayload() {
    const cdk = document.getElementById('currentCdk').value.trim();
    const payloadContent = document.getElementById('payloadContent').value.trim();
    const resultDiv = document.getElementById('payloadResult');
    
    if (!cdk || !payloadContent) {
        resultDiv.textContent = '请先加载一个CDK的Payload';
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
        return;
    }
    
    try {
        // 解析 JSON，确保格式正确
        const payload = JSON.parse(payloadContent);
        
        // 发送更新请求
        const response = await apiRequest(`${apiUrl}/api/admin/update-payload`, {
            method: 'POST',
            body: JSON.stringify({ cdk, payload })
        });
        
        const data = await response.json();
        
        if (data.success) {
            resultDiv.textContent = `✅ 成功更新 ${data.cdk} 的 Payload`;
            resultDiv.classList.remove('hidden', 'error');
            resultDiv.classList.add('success');
            showToast(`✅ 成功更新 ${data.cdk} 的 Payload`);
        } else {
            resultDiv.textContent = `❌ 更新失败：${data.error}`;
            resultDiv.classList.remove('hidden', 'success');
            resultDiv.classList.add('error');
        }
    } catch (error) {
        resultDiv.textContent = `❌ 更新失败：${error.message}`;
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
    }
}

// 清空 Payload 表单
function clearPayloadForm() {
    document.getElementById('searchValue').value = '';
    document.getElementById('payloadContent').value = '';
    document.getElementById('currentCdk').value = '';
    document.getElementById('payloadResult').textContent = '';
    document.getElementById('payloadResult').classList.add('hidden');
    showToast('✅ 已清空数据');
}

// 自定义确认弹窗相关
let confirmCallback = null;

/**
 * 打开自定义确认弹窗
 * @param {string} message - 确认消息
 * @param {Function} callback - 确认后的回调函数
 */
function openConfirmModal(message, callback) {
    // 设置确认消息
    document.getElementById('confirmMessage').textContent = message;
    
    // 保存回调函数
    confirmCallback = callback;
    
    // 显示弹窗和遮罩层
    document.getElementById('customConfirmModal').classList.remove('hidden');
    document.getElementById('modalOverlay').classList.remove('hidden');
    
    // 阻止页面滚动
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭自定义确认弹窗
 */
function closeConfirmModal() {
    // 隐藏弹窗和遮罩层
    document.getElementById('customConfirmModal').classList.add('hidden');
    document.getElementById('modalOverlay').classList.add('hidden');
    
    // 恢复页面滚动
    document.body.style.overflow = '';
    
    // 清空回调函数
    confirmCallback = null;
}

/**
 * 执行确认操作
 */
function confirmAction() {
    // 如果有回调函数，则执行
    if (confirmCallback) {
        confirmCallback();
    }
    // 关闭弹窗
    closeConfirmModal();
}

// 修改删除CDK功能，使用自定义确认弹窗
function deleteCDKByCode(cdk) {
    openConfirmModal(`确定要删除CDK ${cdk} 吗？此操作不可撤销！`, () => {
        apiRequest(`${apiUrl}/api/admin/delete`, {
            method: 'POST',
            body: JSON.stringify({ cdk: cdk })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 1. 直接隐藏当前删除的CDK项（核心简化步骤）
                const cdkItem = document.getElementById(`cdk-item-${cdk}`);
                if (cdkItem) cdkItem.style.display = 'none'; // 隐藏元素
                
                // 2. 同步本地数据（避免后续操作数据不一致）
                generatedCDKs = generatedCDKs.filter(item => item.code !== cdk);
                allCDKs = allCDKs.filter(item => item.code !== cdk);
                
                // 3. 控制批量复制按钮显示/隐藏
                if (generatedCDKs.length === 0) {
                    document.getElementById('copy-all-generated-btn').style.display = 'none';
                }

                // 4. 刷新当前页面，保持数据一致性
                listCDK();
                
                showToast('✅ CDK删除成功');
            } else {
                showToast(`❌ 删除失败：${data.error}`);
            }
        })
        .catch(error => {
            showToast(`❌ 删除失败：${error.message}`);
        });
    });
}

// 修改清除CDK绑定功能，使用自定义确认弹窗
function clearCDKUID(cdk) {
    openConfirmModal(`确定要清除CDK ${cdk} 绑定的设备吗？此操作将允许该CDK绑定到新设备！`, () => {
        apiRequest(`${apiUrl}/api/admin/clear-uid`, {
            method: 'POST',
            body: JSON.stringify({ cdk: cdk })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 刷新CDK列表，显示更新后的状态
                listCDK();
                
                showToast('✅ 设备绑定清除成功，该CDK可绑定到新设备');
            } else {
                showToast(`❌ 清除设备绑定失败：${data.error}`);
            }
        })
        .catch(error => {
            showToast(`❌ 清除设备绑定失败：${error.message}`);
        });
    });
}

// 修改删除所有未使用CDK功能，使用自定义确认弹窗
async function deleteAllUnusedCDKs() {
    // 筛选当前页未使用的CDK（通过mid是否存在判断）
    const unusedCDKs = allCDKs.filter(cdk => !cdk.mid);
    
    if (unusedCDKs.length === 0) {
        showToast('❌ 当前页没有未使用的CDK');
        return;
    }
    
    openConfirmModal(`确定要删除当前页 ${unusedCDKs.length} 个未使用的CDK吗？此操作不可撤销！`, async () => {
        // 逐个删除当前页未使用的CDK
        let deletedCount = 0;
        let failedCount = 0;
        
        // 使用Promise.all并发删除，不限制并发数
        const deletePromises = [];
        
        for (const cdk of unusedCDKs) {
            const deletePromise = apiRequest(`${apiUrl}/api/admin/delete`, {
                method: 'POST',
                body: JSON.stringify({ cdk: cdk.code })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    deletedCount++;
                } else {
                    failedCount++;
                }
            })
            .catch(error => {
                failedCount++;
            });
            
            deletePromises.push(deletePromise);
        }
        
        // 等待所有请求完成
        await Promise.all(deletePromises);
        
        // 删除完成后，重置到第1页，避免出现空页
        currentPage = 1;
        
        // 刷新CDK列表
        listCDK();
        // 清空生成结果
        clearGenerateResult();
        // 显示成功提示
        showToast(`✅ 成功删除 ${deletedCount} 个未使用的CDK，失败 ${failedCount} 个`);
    });
}

// </script>