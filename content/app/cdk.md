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
<div class="form-group">
<label for="username">用户</label>
<input type="text" id="username" class="form-input" value="cnzixn@qq.com">
</div>
<div class="form-group">
<label for="password">密码</label>
<input type="password" id="password" class="form-input" value="d55224488">
</div>
<div class="button-group">
<button class="search-btn" onclick="login()">登录</button>
</div>
<div id="loginResult" class="result hidden"></div>
</div>

<!-- 管理功能区域 -->
<div id="adminSection" class="hidden">
<div class="admin-container">
<!-- 左侧：生成CDK区域 -->
<div class="admin-left">
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
<button class="generate-btn" id="generate-cdk-btn" onclick="generateCDK()">生成CDK</button>
<button class="clear-btn" id="clear-generate-btn" onclick="clearGenerateResult()">清空结果</button>
<button class="copy-all-btn" id="copy-all-generated-btn" onclick="exportGeneratedCDKs()" style="display:none;">导出全部</button>
</div>

<div class="generated-result" id="generated-result-container">
<h3>生成结果：</h3>
<textarea id="generateResult" class="cdk-textarea" rows="10" readonly placeholder="生成的CDK将显示在这里..."></textarea>
<div class="textarea-controls">
<button class="copy-btn" id="copy-generated-btn" onclick="copyGeneratedCDKs()">复制全部CDK</button>
</div>
</div>
</div>
</div>

<!-- 右侧：CDK列表区域 -->
<div class="admin-right">
<div class="section">
<div class="list-header">
<h2>CDK列表</h2>
<div class="list-controls">
<button class="delete-btn" id="delete-all-unused-btn" onclick="deleteAllUnusedCDKs()">删除全部</button>
<button class="refresh-btn" id="refresh-list-btn" onclick="currentPage=1;listCDK()">刷新列表</button>
<button class="copy-all-btn" id="copy-all-list-btn" onclick="exportAllCDKs()">导出全部</button>
</div>
</div>

<!-- 搜索区域 - 静态HTML -->
<div class="search-container" style="margin-bottom: 15px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
<input type="text" id="searchCdk" placeholder="搜索CDK或UID..." style="padding: 10px 16px; border: 1px solid #ddd; border-radius: 6px; width: 300px; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease; outline: none;">
<button class="search-btn" onclick="searchCDK()" style="padding: 10px 24px; background-color: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease; min-width: 100px;">搜索</button>
<!-- <button class="reset-btn" onclick="clearSearch()" style="padding: 10px 24px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; box-shadow: 0 2px 5px rgba(0,0,0,0.15); transition: all 0.2s ease; min-width: 100px;">重置</button> -->
</div>

<div class="list-container" id="cdk-list-container">
<div class="loading-state">加载中...</div>
</div>
</div>
</div>
</div>
</div>
</div>

{{< js "app-cdk.js" >}}


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
        display: flex;
        border-bottom: 2px solid #ddd;
        margin-bottom: 20px;
    }
    
    .tab-btn {
        padding: 12px 24px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: #666;
        position: relative;
    }
    
    .tab-btn.active {
        color: #2196F3;
    }
    
    .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background-color: #2196F3;
    }
    
    .tab-btn:hover:not(.active) {
        background-color: #f5f5f5;
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


</style>

<script>

</script>