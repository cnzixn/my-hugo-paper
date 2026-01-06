---
title: 'B.M.解密器'
layout: 'aapp'
draft: false
searchHidden: true
weight: 250002
summary: '使用XOR处理文件，防止网盘分享文件被和谐。'
---

<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC","Hiragino Sans GB","Microsoft YaHei", sans-serif;  
    line-height: 1.6; 
    color: var(--content); /* 适配文本主色 */
  }
  h1 { 
    text-align: center; 
    margin-bottom: 16px; 
    color: var(--primary); /* 标题用主色 */
  }
  .note { color: var(--secondary); } /* 次要文本色 */
  .section { 
    margin: 20px 0 28px; 
    padding: 20px; 
    border: 1px solid var(--border); /* 统一边框色 */
    border-radius: var(--radius); /* 复用全局圆角 */
    background: var(--entry); /* 卡片背景色 */
  }
  .drop-zone { 
    border: 2px dashed var(--tertiary); /* tertiary色做虚线边框 */
    padding: 20px; 
    text-align: center; 
    margin: 10px 0; 
    cursor: pointer; 
    border-radius: var(--radius); 
    transition: .2s; 
  }
  .drop-zone.drag-over { border-color: var(--secondary); } /* 拖拽时用次要色 */
  .section button { 
    border-radius: 10px; 
    padding: 10px; 
    margin: 10px auto; 
    cursor: pointer; 
    display: block; 
    width: 220px; 
    background-color: var(--secondary); /* 按钮用次要色 */
    color: var(--theme); /* 按钮文字用主题色（亮模式白/暗模式深灰） */
    border: 0; 
    font-size: 16px; 
    transition: .2s; /* 优化过渡效果 */
  }
  .section button:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 2px 8px var(--secondary); /* 阴影色与按钮色一致 */
    opacity: 0.9; /* 增加hover透明度变化 */
  }
  .section button:disabled { 
    background-color: var(--tertiary); 
    cursor: not-allowed; 
    transform: none; 
    box-shadow: none; 
    opacity: 0.7; 
  }
  .file-info, .file-list { 
    margin: 10px 0; 
    padding: 10px; 
    border: 1px solid var(--border); 
    border-radius: var(--radius); 
    background: var(--theme); /* 用主题色做背景 */
  }
  .file-info { white-space: nowrap; overflow-x: auto; }
  .file-list { max-height: 160px; overflow-y: auto; }
  .file-item { 
    padding: 6px 4px; 
    border-bottom: 1px solid var(--border); /* 统一分割线 */
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
  }
  .file-item:last-child { border-bottom: none; }
  .file-remove { 
    color: var(--secondary); 
    cursor: pointer; 
    font-size: 14px; 
    padding: 2px 6px; 
    border-radius: 4px; 
    background: var(--border); 
  }
  .progress-container { margin: 12px 0; display: none; }
  .progress-bar { 
    height: 6px; 
    border: 1px solid var(--secondary); /* 进度条边框用次要色 */
    border-radius: 6px; 
    overflow: hidden; 
  }
  .progress-fill { 
    height: 100%; 
    width: 0%; 
    transition: width 0.3s; 
    background-color: #4cd964; /* 保留原有成功绿（通用且醒目） */
  }
  .error { 
    color: #d00; /* 保留错误红（警示色无需适配） */
    margin: 10px 0; 
    display: none; 
  }
  small strong { color: var(--primary); } /* 强调文本用主色 */
  .pill { 
    display:inline-block; 
    padding:2px 8px; 
    border-radius:999px; 
    border:1px solid var(--border); 
    margin-left:8px; 
    font-size:12px; 
    color: var(--secondary); /* 标签用次要色 */
  }
  .muted { color: var(--secondary); } /* 弱化文本用次要色 */
  .limit-hint { 
    margin: 8px 0; 
    padding: 6px; 
    background: var(--border); 
    border-radius: var(--radius); 
    font-size: 14px; 
    color: var(--secondary); 
  }
  .case-hint {
    margin: 5px 0;
    font-size: 13px;
    color: var(--secondary);
    font-style: italic;
  }
  /* 自定义 Safari 提示弹窗样式 */
  .safari-alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--theme);
    border: 2px solid #d00;
    border-radius: var(--radius);
    padding: 30px 25px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 9999;
    text-align: center;
    display: none; /* 默认隐藏 */
  }
  .safari-alert h3 {
    color: #d00;
    margin: 0 0 15px 0;
    font-size: 18px;
  }
  .safari-alert p {
    margin: 0 0 20px 0;
    line-height: 1.8;
    color: var(--content);
  }
  .safari-alert .btn {
    background: var(--secondary);
    color: var(--theme);
    border: none;
    padding: 10px 25px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: .2s;
  }
  .safari-alert .btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  /* 遮罩层 */
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 9998;
    display: none; /* 默认隐藏 */
  }
  /* 遮罩层样式 */
  .modal-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
  }
  /* 弹窗内容样式 */
  .modal-content {
      background: #fff;
      padding: 25px;
      border-radius: 8px;
      width: 320px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  .note mark {
      background-color: #fff3cd;
      color: #856404;
      padding: 0 3px;
  }
  .modal-buttons {
      margin-top: 20px;
      text-align: center;
  }
  .modal-btn {
      padding: 6px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      // margin-left: 10px;
  }
  .close-btn {
      background: #e9ecef;
      color: #495057;
  }
  .no-prompt-btn {
      background: #007bff;
      color: #fff;
  }
</style>


<h1>B.M.解密器</h1>
<!-- <span class="pill">任意格式 | 后缀不区分大小写 | 本地安全</span> -->

<!-- 加载提示：初始化时显示 -->
<div id="loadingTip" style="text-align: center; padding: 30px; font-size: 16px; color: #666;">
  正在初始化工具，请稍候...
</div>

<!-- 弹窗容器 -->
<div class="modal-mask" id="tipModal" style="display: none;">
  <div class="modal-content">
  <small class="note">
      温馨提示：<br>
      • 本地处理文件<mark>不消耗流量</mark>。<br>
      • 强烈建议使用 Edge 浏览器。<br>
      • 暂不支持 iPad/iPhone 设备。<br>
  </small>
  <div class="modal-buttons">
      <button class="modal-btn no-prompt-btn" onclick="noMorePrompt()">不再提示</button>
  </div>
  </div>
</div>

<!-- 所有 section 初始隐藏 -->
<div class="section" id="section1" style="display: none;">
  <h2>1. 选择文件<span class="pill">支持任意格式</span></h2>
  <div class="limit-hint">⚠️ 最多选择100个文件，当前已选：<span id="fileCount">0</span>/100</div>
  
  <div id="fileDropZone" class="drop-zone">
    <p>拖放文件到这里 或</p>
    <button id="fileBrowseBtn">选择文件</button>
    <input type="file" id="fileInput" multiple style="display:none;">
  </div>
  
  <div id="fileList" class="file-list" style="display:none;"></div>
  <div id="fileError" class="error"></div>
</div>

<div class="section" id="section2" style="display: none;">
  <h2>2. 处理文件</h2>
  <p class="muted">处理后单文件将直接下载，多文件将自动打包为ZIP压缩包下载。</p>
  
  <button id="processBtn" disabled>开始处理</button>
  
  <div id="processProgress" class="progress-container">
    <div class="progress-bar"><div id="processProgressFill" class="progress-fill"></div></div>
    <p id="processProgressText" class="muted">准备就绪</p>
  </div>
  
  <div id="processError" class="error"></div>
  
  <div id="processResult" style="display: none;">
    <button id="downloadBtn" class="btn-view-counter">保存处理结果</button>
    <span class="muted" id="resultHint" style="margin-left: 10px;">处理完成，共生成1个文件</span>
  </div>
</div>

<!-- 必需库 -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script> -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script> -->

<script>
// 获取核心元素
const modal = document.getElementById('tipModal');
const loadingTip = document.getElementById('loadingTip');
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');

// 检查Cookie，判断是否显示弹窗
function checkPromptCookie() {
    const cookies = document.cookie.split(';');
    let hasHideCookie = false;
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'no_show_tip_app_xor_251224' && value === 'true') {
            hasHideCookie = true;
            break;
        }
    }
    // 根据Cookie状态控制弹窗显示
    modal.style.display = hasHideCookie ? 'none' : 'flex';
    // 弹窗加载完成后显示主内容
    showMainContent();
}

// 关闭弹窗
function closeModal() {
    modal.style.display = 'none';
}

// 不再提示，设置Cookie（有效期1天）
function noMorePrompt() {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    document.cookie = `no_show_tip_app_xor_251224=true; expires=${date.toUTCString()}; path=/`;
    closeModal();
}

// 显示主内容：隐藏加载提示，展示两个section
function showMainContent() {
    loadingTip.style.display = 'none';
    section1.style.display = 'block';
    section2.style.display = 'block';
}

// 页面加载完成后执行初始化，确保DOM完全加载
window.onload = function() {
    setTimeout(checkPromptCookie, 0);
};
</script>
