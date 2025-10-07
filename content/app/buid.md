---
title: 'B.M.用户码'
layout: 'aapp'
searchHidden: true
hideTitlt: true
summary: '通过链接获取用户码，生成“BM补丁”文件。'
---


<h1>B.M.用户码</h1>

<div class="reminder">
  <small class="note">
    <h4>温馨提示：</h4>
    • 模组<span style="color:red !important;" class="">免费</span>下载和使用，谨防上当受骗!!!<br>
    • 如果自愿付费，一切纠纷与本站无关!!!
  </small>
</div>

<!-- 显示从URL获取的用户码 -->
<div class="file-info" id="data-container">
    正在从URL加载用户码...
</div>

<div class="section">
  <!-- 生成压缩包按钮：默认状态用btn-default，禁用状态添加btn-disabled -->
  <button id="generate-btn" class="btn-default">生成压缩包</button>
  
  <!-- 生成成功提示 -->
  <div class="copied-notice" id="success-notice">
      压缩包生成成功，已开始下载！
  </div>
  
  <!-- 错误提示区域 -->
  <div class="error" id="error-msg"></div>
</div>

<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>


<style>
/* 基础样式 */
h1 {
    text-align: center;
    margin-bottom: 30px;
}

.reminder {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 3px;
}

.drop-zone {
    border: 2px dashed #aaa;
    padding: 20px;
    text-align: center;
    margin: 10px 0;
    cursor: pointer;
    border-radius: 3px;
}

.drop-zone.drag-over {
    border-color: #666;
}

/* 按钮样式：拆分3种状态class，替代js行内样式 */
/* 1. 默认按钮样式 */
.btn-default {
    border-radius: 8px;
    padding: 10px;
    margin: 10px auto;
    cursor: pointer;
    display: block;
    width: 200px;
    background-color: var(--secondary);
    color: white;
    border: none;
    font-weight: bold;
    transition: all 0.2s ease;
}

.btn-default:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px #666;
}

/* 2. 禁用按钮样式 */
.btn-disabled {
    border-radius: 8px;
    padding: 10px;
    margin: 10px auto;
    cursor: not-allowed;
    display: block;
    width: 200px;
    background-color: #ccc; /* 禁用时的灰色 */
    color: white;
    border: none;
    font-weight: bold;
}

/* 3. 加载中按钮样式 */
.btn-loading {
    border-radius: 8px;
    padding: 10px;
    margin: 10px auto;
    cursor: not-allowed;
    display: block;
    width: 200px;
    background-color: var(--secondary); /* 加载时保持主色，仅改光标 */
    color: white;
    border: none;
    font-weight: bold;
}

.file-info {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    white-space: nowrap;
    overflow-x: auto;
    font-family: monospace;
}

.progress-container {
    margin: 10px 0;
    display: none;
}

.progress-bar {
    height: 5px;
    border: 1px solid #666;
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    width: 0%;
    transition: width 0.3s;
    background-color: #4cd964;
}

.error {
    color: red;
    margin: 10px 0;
    display: none;
}

.file-list {
    margin: 10px 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 10px;
}

.file-item {
    padding: 5px;
    border-bottom: 1px solid #eee;
}

.file-item:last-child {
    border-bottom: none;
}

/* 成功提示样式 */
.copied-notice {
    display: none;
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: fadeOut 2s forwards;
}

@keyframes fadeOut {
    0% { opacity: 1; }
    70% { opacity: 1; }
    100% { opacity: 0; }
}
</style>
