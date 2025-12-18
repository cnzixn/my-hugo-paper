
let apiUrl = 'https://ck.bxq.me'; // 请替换为你的API地址
let authHeader = '';

// 分页相关全局变量
let currentPage = 1;
let pageSize = 20;
let totalPages = 1;
let totalCDKs = 0;

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
        </div>
        <div class="cdk-actions">
            <button class="action-btn delete-btn" onclick="deleteCDKByCode('${cdk.code}')">删除</button>
            ${isUsed ? `<button class="action-btn clear-btn" onclick="clearCDKUID('${cdk.code}')">解绑</button>` : ''}
            <button class="action-btn copy-btn" onclick="copyToClipboard('${cdk.code}')">复制</button>
        </div>
    </div>`;
}


// 哈希函数
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
    
    if (!username || !password) {
        resultDiv.textContent = '请输入用户名和密码';
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
        return;
    }
    
    try {
        // 前端计算哈希
        const hash = await hashCredentials(username, password, 'default_salt');
        
        authHeader = `Hash ${username}:${hash}`;
        
        // 测试登录
        const response = await fetch(`${apiUrl}/api/admin/list`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('adminSection').classList.remove('hidden');
            resultDiv.textContent = '';
            resultDiv.classList.add('hidden');
            
            // 自动查询CDK列表
    listCDK();
            // 登录成功弹窗
            showToast('✅ 登录成功');
        } else {
            const errorData = await response.json();
            resultDiv.textContent = `登录失败: ${errorData.error || '用户名或密码错误'}`;
            resultDiv.classList.remove('hidden', 'success');
            resultDiv.classList.add('error');
        }
    } catch (error) {
        resultDiv.textContent = '登录失败：' + error.message;
        resultDiv.classList.remove('hidden', 'success');
        resultDiv.classList.add('error');
    }
}

// 添加全局变量存储CDK数据
let generatedCDKs = [];
let allCDKs = [];

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
    
    fetch(`${apiUrl}/api/admin/generate`, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        },
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
    
    // 格式化CDK文本，每行一个CDK
    let textToCopy = '';
    generatedCDKs.forEach(cdk => {
        // 每4字符插入-，先过滤已有-避免重复
        const formattedCode = cdk.code.replace(/-/g, '').replace(/(.{4})(?=.)/g, '$1-');
        textToCopy += `${formattedCode}\n`;
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
        const response = await fetch(`${apiUrl}/api/cdk/${cdkCode}`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
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
                <strong>创建时间:</strong> ${new Date(cdkData.createdAt).toLocaleString()}
                ${cdkData.boundAt ? `<br><strong>绑定时间:</strong> ${new Date(cdkData.boundAt).toLocaleString()}` : ''}
                ${cdkData.expireAt ? `<br><strong>过期时间:</strong> ${new Date(cdkData.expireAt).toLocaleString()}` : ''}
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
    
    fetch(`${apiUrl}/api/admin/list?page=${requestPage}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
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
                used: cdk.used || false
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
                
                // 修复日期显示问题
                const formatDate = (dateStr) => {
                    if (!dateStr) return '未设置';
                    const date = new Date(dateStr);
                    return isNaN(date) ? '无效日期' : date.toLocaleString();
                };
                
                // 修复有效期显示问题
                const validDays = cdk.days || 0;
                
                // 使用统一函数生成CDK项
                const formattedCode = cdk.code.replace(/-/g, '').replace(/(.{4})(?=.)/g, '$1-');
                const cdkItem = {
                    ...cdk,
                    code: formattedCode
                };
                listHtml += generateCDKItemHTML(cdkItem, isUsed, cardStyle, formatDate);
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
    fetch(`${apiUrl}/api/admin/export`, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
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
  
  fetch(`${apiUrl}/api/admin/delete`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
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
  if (!confirm(`确定要清除CDK ${cdk} 绑定的设备吗？`)) return;
  
  fetch(`${apiUrl}/api/admin/clear-uid`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
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
    const deletePromise = fetch(`${apiUrl}/api/admin/delete`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
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
    
    
    const container = document.getElementById('cdk-list-container');
    
    // 显示加载状态
    container.innerHTML = '<div class="loading-state" style="padding: 20px;">正在搜索CDK...<br>从D1数据库中查找所有匹配的CDK</div>';
    
    // 调用后端API搜索所有匹配的CDK
    fetch(`${apiUrl}/api/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
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
                
                // 修复日期显示问题
                const formatDate = (dateStr) => {
                    if (!dateStr) return '未设置';
                    const date = new Date(dateStr);
                    return isNaN(date) ? '无效日期' : date.toLocaleString();
                };
                
                // 修复有效期显示问题
                const validDays = cdk.days || 0;
                
                // 使用统一函数生成CDK项
                resultHtml += generateCDKItemHTML(cdk, isUsed, cardStyle, formatDate);
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