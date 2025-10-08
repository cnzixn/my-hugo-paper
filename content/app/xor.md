---
title: 'B.M.解密器'
layout: 'aapp'
searchHidden: true
hideTitlt: true
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
</style>

<h1>B.M.解密器</h1>
<!-- <span class="pill">任意格式 | 后缀不区分大小写 | 本地安全</span> -->


<div class="section">
  <small class="note">
    温馨提示：<br>
    • <mark>不消耗流量</mark>，文件在本地处理。<br>
    • 推荐使用 Chrome / Edge 浏览器。<br>
    • 支持 Android / Win ，暂不支持 iOS 。<br>
  </small>
</div>


<div class="section">
  <h2>1. 选择文件<span class="pill">支持任意格式</span></h2>
  <!-- <p class="muted">拖入或选择任意格式文件</p> -->
  <!-- <p class="case-hint">提示：后缀不区分大小写（如.ZIP、.Zip、.zip.xor、.ZIP.XOR均能正确识别）</p> -->
  <div class="limit-hint">⚠️ 最多选择100个文件，当前已选：<span id="fileCount">0</span>/100</div>
  
  <div id="fileDropZone" class="drop-zone">
    <p>拖放文件到这里 或</p>
    <button id="fileBrowseBtn">选择文件</button>
    <input type="file" id="fileInput" multiple style="display:none;">
  </div>
  
  <div id="fileList" class="file-list" style="display:none;"></div>
  <div id="fileError" class="error"></div>
</div>

<div class="section">
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

