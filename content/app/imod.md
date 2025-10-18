---
title: 'B.M.安装器'
layout: 'aapp'
searchHidden: true
hideTitlt: true
weight: 250001
summary: '支持安装BM框架/BM模组/BM补丁/自制模组。'
---

<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->
<!-- <head> -->
<!-- <meta charset="UTF-8" /> -->
<!-- <meta name="viewport" content="width=device-width,initial-scale=1" /> -->
<!-- <title>模组安装器（安卓/苹果自动识别）</title> -->
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
    border: 2px dashed var(--tertiary); /*  tertiary色做虚线边框 */
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
  .file-info, .file-list { 
    margin: 10px 0; 
    padding: 10px; 
    border: 1px solid var(--border); 
    border-radius: var(--radius); 
    background: var(--theme); /* 用主题色做背景 */
  }
  .file-info, .file-list { white-space: nowrap; overflow-x: auto; }
  .file-item { 
    padding: 6px 4px; 
    border-bottom: 1px solid var(--border); /* 统一分割线 */
  }
  .file-item:last-child { border-bottom: none; }
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
</style>

<!-- </head> -->
<!-- <body> -->

<h1>B.M.安装器</h1>
<!-- <span class="pill">自动识别 APK / IPA</span> -->

<div class="section">
  <small class="note">
    温馨提示：<br>
    • <mark>不消耗流量</mark>，文件在本地处理。<br>
    • 支持 Android / Win / Mac 系统。<br>
    • 推荐使用 Chrome / Edge 浏览器。<br>
  </small>
</div>

<div class="section">
  <h2>1. 选择安装包<span class="pill">自动识别 APK / IPA</span></h2>
  <!-- <p class="muted">拖入或选择 <strong>.apk</strong>（安卓）或 <strong>.ipa</strong>（苹果）。</p> -->
  <div id="pkgDropZone" class="drop-zone">
    <p>拖放 .apk / .ipa 到这里 或</p>
    <button id="pkgBrowseBtn">选择安装包</button>
    <input type="file" id="pkgFileInput" accept=".apk,.ipa" style="display:none;">
  </div>
  <div id="pkgFileInfo" class="file-info" style="display:none;"></div>
  <div id="pkgError" class="error"></div>
</div>

<div class="section">
  <h2>2. 选择模组文件<span class="pill">支持 BM框架/BM模组/BM补丁/自制模组 </span></h2>
  <!-- <p class="muted">支持 BM 框架 / BM 模组 / BM 补丁 / 三方模组（<code>.zip</code> / <code>.xz</code>）。</p> -->
  <div id="modsDropZone" class="drop-zone">
    <p>拖放 .zip / .xz 到这里 或</p>
    <button id="modsBrowseBtn">选择模组文件</button>
    <input type="file" id="modsFileInput" accept=".zip,.xz" multiple style="display:none;">
  </div>
  <div id="modsFileList" class="file-list" style="display:none;"></div>
  <div id="modsError" class="error"></div>
</div>

<div class="section">
  <h2>3. 安装模组</h2>
  <div class="muted" id="platformHint">当前平台：未选择</div>
  <button id="installBtn" disabled>开始安装</button>
  <div id="installProgress" class="progress-container">
    <div class="progress-bar"><div id="installProgressFill" class="progress-fill"></div></div>
    <p id="installProgressText">准备就绪</p>
  </div>
  <div id="installError" class="error"></div>
  <!-- <div id="installResult" style="display:none;"> -->
   <!-- <button id="downloadBtn" class="btn-view-counter">保存生成文件</button> -->
   <!-- <span class="muted" id="resultHint"></span> -->
  <!-- </div> -->
  
<div id="installResult" style="display: none;">
  <div class="platform-result" id="androidResult" style="display:none;">
    <button id="downloadBtnAndroid" class="btn-view-counter" data-id="amod-download-apk">保存APK文件</button>
    <span class="muted">已使用：<span class="amod-download-apk-count">0</span> 次</span>
  </div>

  <div class="platform-result" id="iosResult" style="display:none; margin-top:10px;">
    <button id="downloadBtnIOS" class="btn-view-counter" data-id="imod-download-ipa">保存IPA文件</button>
    <span class="muted">已使用：<span class="imod-download-ipa-count">0</span> 次</span>
  </div>

  <div class="muted" id="resultHint" style="margin-top:12px;"></div>
</div>


</div>

<!-- 必需库 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>



<!-- <script defer src="/js/bv.js"></script> -->
<!-- <script src="/js/klfa.js"></script> -->
<!-- <script src="/js/imod.js"></script> -->
{{< js-app-imod >}}



<!-- </body> -->
<!-- </html> -->