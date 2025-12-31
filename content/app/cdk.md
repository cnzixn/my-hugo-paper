---
title: 'CDK系统'
layout: 'aapp'
searchHidden: true
appHidden: true
weight: 250011
summary: 'CDK统一管理系统，包含生成、查看、删除功能'
---

<h1>CDK管理系统</h1>

<!-- <div class="reminder">
 <small class="note">
  管理员功能：<br>
  1. 生成新的CDK兑换码<br>
  2. 查看CDK列表和状态<br>
  3. 删除CDK<br>
 </small>
</div> -->

<div class="cdk-admin-container">
<!-- 登录表单 -->
<div id="loginSection" class="section login-section">
<h2>管理员登录</h2>
<!-- 自动登录加载状态 -->
<div id="autoLoginLoading" class="loading-state" style="display: none; color: #2196F3; margin: 10px 0; text-align: center;">自动登录中...</div>
<div class="form-group">
<label for="username">用户</label>
<input type="text" id="username" class="form-input" value="">
</div>
<div class="form-group">
<label for="password">密码</label>
<input type="password" id="password" class="form-input" value="">
</div>
<div class="button-group">
<button type="button" class="search-btn" onclick="debouncedLogin()">登录</button>
</div>
<div id="loginResult" class="result hidden"></div>
<!-- 登录调试信息显示区域 -->
<div id="loginDebug" class="result error hidden" style="font-size: 12px; white-space: pre-wrap; background-color: #fff3f3; border-color: #ff6b6b; color: #c92a2a; margin-top: 10px;"></div>
</div>

<!-- 管理功能区域 -->
<div id="adminSection" class="hidden">
  <!-- 标签页导航 -->
  <div class="tab-navigation">
  <button type="button" class="tab-btn active" onclick="switchTab('generate')">生成CDK</button>
  <button type="button" class="tab-btn" onclick="switchTab('list')">查询CDK</button>
  <button type="button" class="tab-btn" onclick="switchTab('payload')">修改配置</button>
  <button type="button" class="tab-btn" onclick="switchTab('logs')">操作日志</button>
  </div>
  
  <!-- 标签页内容 -->
  <div class="tab-content active" id="generateTab">
  <div class="section">
  <h2>生成新CDK</h2>
  
  <div class="form-group">
  <label for="cdk-count">生成数量:</label>
  <input type="number" id="cdk-count" class="form-input" value="10" min="1" max="1000">
  </div>
  
  <div class="form-group">
  <label for="cdk-days">有效天数:</label>
  <input type="number" id="cdk-days" class="form-input" value="30" min="1" max="365">
  </div>
  
  <div class="button-group">
  <button type="button" class="generate-btn" id="generate-cdk-btn" onclick="debouncedGenerateCDK()">生成CDK</button>
  <button type="button" class="clear-btn" id="clear-generate-btn" onclick="clearGenerateResult()">清空结果</button>
  <button type="button" class="copy-all-btn" id="copy-all-generated-btn" onclick="exportGeneratedCDKs()" style="display:none;">导出全部</button>
  </div>
  
  <div class="generated-result" id="generated-result-container">
  <h3>生成结果：</h3>
  <textarea id="generateResult" class="cdk-textarea" rows="10" readonly placeholder="生成的CDK将显示在这里..."></textarea>
  <div class="textarea-controls">
  <button type="button" class="copy-btn" id="copy-generated-btn" onclick="copyGeneratedCDKs()">复制全部CDK</button>
  </div>
  </div>
  </div>
  </div>
  
  <div class="tab-content" id="listTab">
  <div class="section">
  <div class="list-header">
  <h2>CDK列表</h2>
  <div class="list-controls">
  <button type="button" class="delete-btn" id="delete-all-unused-btn" onclick="debouncedDeleteAllUnusedCDKs()">删除全部</button>
  <button type="button" class="refresh-btn" id="refresh-list-btn" onclick="currentPage=1;listCDK()">刷新列表</button>
  <button type="button" class="copy-all-btn" id="copy-all-list-btn" onclick="exportAllCDKs()">导出全部</button>
  </div>
  </div>
  
  <!-- 搜索区域 - 静态HTML -->
  <div class="search-container" style="margin-bottom: 15px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
  <input type="text" id="searchCdk" placeholder="搜索CDK或UID..." style="padding: 10px 16px; border: 1px solid #ddd; border-radius: 6px; width: 300px; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease; outline: none;">
  <button type="button" class="search-btn" onclick="debouncedSearchCDK()" style="padding: 10px 24px; background-color: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease; min-width: 100px;">搜索</button>
  <!-- <button type="button" class="reset-btn" onclick="clearSearch()" style="padding: 10px 24px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease; min-width: 100px;">重置</button> -->
  </div>
  
  <div class="list-container" id="cdk-list-container">
  <div class="loading-state">加载中...</div>
  </div>
  </div>
  </div>
  
  <div class="tab-content" id="payloadTab">
  <div class="section">
  <h2>修改 CDK Payload</h2>
  
  <!-- 搜索条件输入 -->
  <div class="form-group">
  <label for="searchValue">CDK 搜索</label>
  <input type="text" id="searchValue" class="form-input" placeholder="请输入 CDK 代码、UID 或 MID">
  </div>
  
  <!-- 操作按钮 -->
  <div class="button-group">
  <button type="button" class="clear-btn" onclick="clearPayloadForm()">清空数据</button>
  <button type="button" class="search-btn" onclick="loadCDKPayload()">加载数据</button>
  <button type="button" class="generate-btn" onclick="updatePayload()">保存数据</button>
  </div>
  
  <!-- 原始 JSON 编辑 -->
  <div class="form-group">
  <h3>原始 JSON 编辑</h3>
  <textarea id="payloadContent" class="cdk-textarea" rows="20" placeholder="请输入 JSON 格式的 Payload"></textarea>
  </div>
  
  <!-- 隐藏的CDK存储 -->
  <input type="hidden" id="currentCdk" value="">
  
  <!-- 结果显示 -->
  <div id="payloadResult" class="result hidden"></div>
  </div>
  </div>

  <!-- 操作日志标签页 -->
  <div class="tab-content" id="logsTab">
  <div class="section">
  <div class="logs-header">
  <h2>操作日志</h2>
  <div class="logs-controls">
  <button type="button" class="refresh-btn" id="refresh-logs-btn" onclick="logsCurrentPage=1;loadLogs()">刷新日志</button>
  </div>
  </div>
  
  <!-- 日志查询过滤条件 -->
  <div class="logs-filters" style="margin-bottom: 15px; display: grid; grid-template-columns: 1fr auto auto; gap: 15px; align-items: end;">
  <div class="filter-item" style="grid-column: 1 / -1;">
  <label for="logs-search-content">搜索内容:</label>
  <input type="text" id="logs-search-content" placeholder="搜索操作类型、操作者、操作内容等" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
  </div>
  <button type="button" class="search-btn" onclick="logsCurrentPage=1;loadLogs()">查询日志</button>
  <button type="button" class="reset-btn" onclick="resetLogFilters()">重置筛选</button>
  </div>
  
  <!-- 日志列表 -->
  <div class="logs-list-container" style="overflow-x: auto; margin-bottom: 20px; max-height: 500px; overflow-y: auto;">
  <table id="logsTable" class="logs-table" style="width: 100%; border-collapse: collapse; margin-top: 15px; table-layout: fixed;">
  <thead>
  <tr style="background-color: #f5f5f5;">
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 60px; min-width: 60px;">序号</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 120px; min-width: 120px;">操作类型</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 100px; min-width: 100px;">操作者</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 300px; min-width: 200px; word-wrap: break-word; vertical-align: top;">操作内容</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 80px; min-width: 80px;">结果</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 120px; min-width: 120px; font-family: monospace;">IP地址</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 150px; min-width: 150px;">操作时间</th>
  <th style="border: 1px solid #ddd; padding: 10px; text-align: left; width: 300px; min-width: 200px; word-wrap: break-word; vertical-align: top;">错误信息</th>
  </tr>
  </thead>
  <tbody id="logsTableBody">
  <!-- 日志数据将通过JavaScript动态生成 -->
  <tr>
  <td colspan="8" style="text-align: center; padding: 20px; color: #666;">请点击"查询日志"按钮加载日志数据</td>
  </tr>
  </tbody>
  </table>
  </div>
  
  <!-- 日志分页 -->
  <div id="logsPagination" class="pagination" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 15px;">
  <!-- 分页内容将通过JavaScript动态生成 -->
  </div>
  </div>
  </div>
</div>

<!-- 自定义确认弹窗 -->
<div id="customConfirmModal" class="modal hidden">
  <div class="modal-content">
  <div class="modal-header">
  <h3>确认操作</h3>
  <button type="button" class="modal-close" onclick="closeConfirmModal()">&times;</button>
  </div>
  <div class="modal-body">
  <p id="confirmMessage">确定要执行此操作吗？</p>
  </div>
  <div class="modal-footer">
  <button type="button" class="modal-cancel" onclick="closeConfirmModal()">取消</button>
  <button type="button" class="modal-confirm" onclick="confirmAction()">确定</button>
  </div>
  </div>
</div>

<!-- 遮罩层 -->
<div id="modalOverlay" class="modal-overlay hidden"></div>
</div>


<style>
    /* 保持原剪贴板风格 */
    h1, h2 {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .reminder {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
    
    .cdk-admin-container {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    /* 桌面端 - 左右两栏布局 */
    .admin-container {
        display: flex;
        gap: 20px;
    }
    
    .admin-left {
        flex: 1;
        min-width: 300px;
    }
    
    .admin-right {
        flex: 2;
        min-width: 400px;
    }
    
    @media (max-width: 768px) {
        .admin-container {
            flex-direction: column;
        }
        
        .admin-left,
        .admin-right {
            width: 100%;
            min-width: auto;
        }
    }
    
    /* 标签导航 */
    .tab-navigation {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        border-bottom: 2px solid #ddd;
        margin-bottom: 15px;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        align-items: center !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    .tab-navigation::-webkit-scrollbar {
        display: none !important;
    }
    
    .tab-btn {
        flex: 0 0 auto !important;
        white-space: nowrap !important;
        padding: 8px 16px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        color: #666;
        position: relative;
        min-width: auto;
        text-align: center;
        outline: none;
        user-select: none;
        transition: all 0.2s ease;
        margin: 0 !important;
    }
    
    .tab-btn.active {
        color: #2196F3;
    }
    
    .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 10%;
        right: 10%;
        height: 2px;
        background-color: #2196F3;
        transition: all 0.2s ease;
    }
    
    .tab-btn:hover:not(.active) {
        background-color: #f5f5f5;
        color: #444;
    }
    
    /* 移除焦点样式 */
    .tab-btn:focus {
        outline: none;
        box-shadow: none;
    }
    
    /* 标签内容 */
    .tab-content {
        display: none;
    }
    
    .tab-content.active {
        display: block;
    }
    
    /* 通用样式 */
    .section {
        background: white;
        border: 1px solid #ddd;
        border-radius: 3px;
        padding: 20px;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group.inline {
        display: inline-block;
        margin-right: 15px;
        margin-bottom: 0;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    
    .form-input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 3px;
        font-size: 14px;
        box-sizing: border-box;
    }
    
    .form-input.small {
        width: 80px;
    }
    
    .form-select {
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 3px;
        font-size: 14px;
        background: white;
    }
    
    .button-group {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }
    
    button {
        border-radius: 8px;
        padding: 10px 20px;
        cursor: pointer;
        border: none;
        font-weight: bold;
        font-size: 14px;
    }
    
    button:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px #666;
    }
    
    .generate-btn {
        background-color: #4CAF50;
        color: white;
    }
    
    .clear-btn {
        background-color: #f44336;
        color: white;
    }
    
    .refresh-btn {
        background-color: #2196F3;
        color: white;
    }
    
    .search-btn {
        background-color: #2196F3;
        color: white;
        width: 100%; /* 占满父容器宽度 */
        padding: 8px 0; /* 可选，加些上下内边距更饱满 */
    }

    
    .ban-btn {
        background-color: #f44336;
        color: white;
    }
    
    .unban-btn {
        background-color: #4CAF50;
        color: white;
    }
    
    .copy-btn {
        background-color: #2196F3;
        color: white;
    }
    
    .delete-btn {
        background-color: #f44336;
        color: white;
    }
    
    .generated-result {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 3px;
        background-color: #f8f9fa;
        display: none;
    }
    
    .generated-result.show {
        display: block;
    }
    
    .list-controls {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .list-container {
        min-height: 200px;
    }
    .cdk-list {
    max-height: 600px; /* 核心：限制最大高度，超出就滚 */
    overflow-y: auto; /* 垂直滚动（上下滚），内容不够时不显示滚动条 */
    overflow-x: hidden; /* 禁止水平滚动，避免多余滚动条 */
    padding-right: 8px; /* 预留滚动条空间，防止内容被挡 */
}


    

    
    .cdk-code {
        font-family: monospace;
        font-weight: bold;
        color: #333;
    }
    
    .cdk-days {
        color: #2196F3;
        font-size: 0.9em;
    }
    
    .cdk-status {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 0.8em;
        font-weight: bold;
    }
    
    .status-active {
        background-color: #e8f5e8;
        color: #2e7d32;
    }
    
    .status-used {
        background-color: #ffebee;
        color: #c62828;
    }
    
    .status-expired {
        background-color: #fff3e0;
        color: #ef6c00;
    }
    
    .cdk-actions {
        margin-top: 5px;
    }
    
    .action-btn {
        padding: 3px 8px;
        font-size: 12px;
        margin-right: 5px;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
    
    .pagination {
        display: flex;
        justify-content: center;
        gap: 5px;
        margin-top: 20px;
        align-items: center;
    }
    
    .pagination button {
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        color: #333;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
    }
    
    .pagination button:hover:not(:disabled) {
        background-color: #f5f5f5;
        border-color: #2196F3;
    }
    
    .pagination button.active {
        background-color: #2196F3;
        color: white;
        border-color: #2196F3;
    }
    
    .pagination button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .pagination span {
        padding: 0 10px;
        color: #666;
        font-size: 14px;
    }
    
    .pagination-container .pagination {
        margin-top: 0;
    }
    
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }
    
    .account-info {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 3px;
        background-color: #f8f9fa;
        min-height: 100px;
    }
    
    .account-info.error {
        border-color: #f44336;
        background-color: #ffebee;
        color: #c62828;
    }
    
    .account-info.success {
        border-color: #4CAF50;
        background-color: #e8f5e8;
        color: #2e7d32;
    }
    
    /* 登录表单样式 */
    .login-section {
        max-width: 400px;
        margin: 50px auto;
    }
    
    .result {
        margin-top: 15px;
        padding: 10px;
        border-radius: 3px;
    }
    
    .result.success {
        background-color: #e8f5e8;
        border: 1px solid #4CAF50;
        color: #2e7d32;
    }
    
    .result.error {
        background-color: #ffebee;
        border: 1px solid #f44336;
        color: #c62828;
    }
    
    .hidden {
        display: none;
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .tab-navigation {
            flex-wrap: wrap;
        }
        
        .tab-btn {
            flex: 1;
            min-width: 120px;
            text-align: center;
        }
        
        .form-group.inline {
            display: block;
            margin-right: 0;
            margin-bottom: 10px;
        }
        
        .list-controls {
            display: block;
        }
        
        /* 移动端优化 - 时间范围控件 */
        .time-range-controls {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .time-range-controls label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .time-range-controls input {
            width: 100% !important;
            margin-right: 0 !important;
        }
        
        .time-range-controls button {
            width: 100%;
            margin-right: 0 !important;
            margin-bottom: 5px;
        }
        
        /* 移动端优化 - 管理员容器布局 */
        .admin-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .admin-left,
        .admin-right {
            width: 100%;
        }
        
        /* 移动端优化 - CDK项 */

        
        /* 移动端优化 - 按钮组 */
        .button-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .button-group button {
            width: 100%;
        }
        
        /* 移动端优化 - 表单控件 */
        .form-input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            box-sizing: border-box;
        }
        
        /* 移动端优化 - 统计信息 */
        .stats-bar {
            font-size: 14px;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        
        .stats-bar span {
            display: block;
            line-height: 1.5;
        }
        
        /* 移动端优化 - 分页控件 */
        .pagination {
            flex-wrap: wrap;
            gap: 5px;
        }
        
        .pagination button {
            padding: 6px 10px;
            font-size: 14px;
        }
        
        /* 移动端优化 - 登录表单 */
        .login-section {
            max-width: 100%;
            padding: 20px;
        }
    }
    
    /* 复制全部按钮样式 */
.copy-all-btn {
    background: linear-gradient(135deg, #4caf50, #2e7d32);
    color: white;
}

/* 多行文本框样式 */
.cdk-textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    background-color: #f8f9fa;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 10px;
    min-height: 200px;
}

.cdk-textarea:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

/* 文本框控制区样式 */
.textarea-controls {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.textarea-controls button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.2s ease;
}

.textarea-controls button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* CDK状态标签 */
.cdk-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    margin-left: 10px;
}

.status-active {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #4caf50;
}

.status-used {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #f44336;
}

/* CDK项样式 */
.cdk-item {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 15px;
    padding: 12px;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.cdk-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
}

.cdk-code {
    font-family: 'Courier New', monospace;
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

.cdk-actions {
    margin-top: 8px;
    display: flex;
    gap: 6px;
    width: 100%;
}

.cdk-actions .action-btn {
    flex: 1;
}

.action-btn {
    padding: 4px 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s ease;
}

.copy-btn {
    background-color: #e3f2fd;
    color: #1976d2;
}

.delete-btn {
    background-color: #ffebee;
    color: #d32f2f;
}

.clear-btn {
    background-color: #fff3e0;
    color: #ff9800;
}

.copy-btn:hover {
    background-color: #bbdefb;
}

.delete-btn {
    background-color: #ffebee;
    color: #d32f2f;
}

.delete-btn:hover {
    background-color: #ffcdd2;
}

/* 自定义确认弹窗样式 */
.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
}

.modal.hidden,
.modal-overlay.hidden {
    display: none;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.modal-close:hover {
    background-color: #e0e0e0;
    color: #333;
}

.modal-body {
    padding: 20px;
}

.modal-body p {
    margin: 0;
    color: #555;
    line-height: 1.5;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #e0e0e0;
}

.modal-cancel,
.modal-confirm {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.modal-cancel {
    background-color: #e0e0e0;
    color: #333;
}

.modal-cancel:hover {
    background-color: #bdbdbd;
}

.modal-confirm {
    background-color: #f44336;
    color: white;
}

.modal-confirm:hover {
    background-color: #d32f2f;
}


</style>

<script>
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
function switchTab(tabName) {
    // 1. 移除所有标签页按钮的active类
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 2. 为当前点击的标签页按钮添加active类
    event.target.classList.add('active');
    
    // 3. 隐藏所有标签页内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 4. 显示当前点击的标签页内容
    const targetTab = document.getElementById(`${tabName}Tab`);
    if (targetTab) {
        targetTab.classList.add('active');
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
    
    apiRequest(`${apiUrl}/api/admin/list?page=${requestPage}&pageSize=${pageSize}`, {
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
                <td colspan="8" style="text-align: center; padding: 20px; color: #666;">正在加载日志...</td>
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
                    <td colspan="8" style="text-align: center; padding: 20px; color: #c92a2a;">加载日志失败：${data.error || '未知错误'}</td>
                </tr>
            `;
            showToast('❌ 加载日志失败');
        }
    } catch (error) {
        console.error('加载日志失败：', error);
        document.getElementById('logsTableBody').innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #c92a2a;">加载日志失败：${error.message}</td>
            </tr>
        `;
        showToast('❌ 加载日志失败');
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
                <td colspan="8" style="text-align: center; padding: 20px; color: #666;">没有找到符合条件的日志记录</td>
            </tr>
        `;
        return;
    }
    
    // 生成日志行
    const logRows = logs.map((log, index) => {
        const serialNumber = (logsCurrentPage - 1) * logsPageSize + index + 1;
        const successText = log.success === 1 ? '<span style="color: #2e7d32;">成功</span>' : '<span style="color: #c62828;">失败</span>';
        const errorMessage = log.error_message ? `<span style="color: #c62828; font-size: 12px;">${log.error_message}</span>` : '-';
        // 转换为当地时间
        const localTime = convertToLocalTime(log.operation_time);
        
        return `
            <tr style="border-bottom: 1px solid #eee; transition: background-color 0.2s; height: auto;">
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 60px; min-width: 60px;">${serialNumber}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500; vertical-align: top; width: 120px; min-width: 120px; word-wrap: break-word;">${log.operation_type}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 100px; min-width: 100px; word-wrap: break-word;">${log.operator}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 300px; min-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${log.operation_content}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 80px; min-width: 80px;">${successText}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-family: monospace; vertical-align: top; width: 120px; min-width: 120px; word-wrap: break-word;">${log.ip_address}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 150px; min-width: 150px; word-wrap: break-word;">${localTime}</td>
                <td style="border: 1px solid #ddd; padding: 10px; vertical-align: top; width: 300px; min-width: 200px; word-wrap: break-word; overflow-wrap: break-word;">${errorMessage}</td>
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
    
    
    const container = document.getElementById('cdk-list-container');
    
    // 显示加载状态
    container.innerHTML = '<div class="loading-state" style="padding: 20px;">正在搜索CDK...<br>从D1数据库中查找所有匹配的CDK</div>';
    
    // 调用后端API搜索所有匹配的CDK
    apiRequest(`${apiUrl}/api/search?q=${encodeURIComponent(searchTerm)}`, {
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

</script>