---
title: 'B.M.安装器'
layout: 'aapp'
searchHidden: true
hideTitlt: true
summary: '支持安装BM框架/BM模组/BM补丁/自制模组。'
---

<!-- <!DOCTYPE html> -->
<!-- <html lang="zh-CN"> -->
<!-- <head> -->
<!-- <meta charset="UTF-8" /> -->
<!-- <meta name="viewport" content="width=device-width,initial-scale=1" /> -->
<!-- <title>模组安装器（安卓/苹果自动识别）</title> -->
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC","Hiragino Sans GB","Microsoft YaHei", sans-serif;  line-height: 1.6; }
  h1 { text-align: center; margin-bottom: 16px; }
  .note { color:#666; }
  .section { margin: 20px 0 28px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
  .drop-zone { border: 2px dashed #aaa; padding: 20px; text-align: center; margin: 10px 0; cursor: pointer; border-radius: 8px; transition: .2s; }
  .drop-zone.drag-over { border-color: #666; }
  .section button { border-radius: 10px; padding: 10px; margin: 10px auto; cursor: pointer; display: block; width: 220px; background-color: #1AB8F9; color:#fff; border: 0; font-size: 16px; }
  .section button:hover { transform: translateY(-1px); box-shadow: 0 2px 8px #6663; }
  .file-info, .file-list { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
  .file-info { white-space: nowrap; overflow-x: auto; }
  .file-item { padding: 6px 4px; border-bottom: 1px solid #eee; }
  .file-item:last-child { border-bottom: none; }
  .progress-container { margin: 12px 0; display: none; }
  .progress-bar { height: 6px; border: 1px solid #666; border-radius: 6px; overflow: hidden; }
  .progress-fill { height: 100%; width: 0%; transition: width 0.3s; background-color: #4cd964; }
  .error { color: #d00; margin: 10px 0; display: none; }
  small strong { color:#000; }
  .pill { display:inline-block; padding:2px 8px; border-radius:999px; border:1px solid #ddd; margin-left:8px; font-size:12px; color:#555; }
  .muted { color:#777; }
</style>
<!-- </head> -->
<!-- <body> -->

<h1>B.M.安装器</h1>
<!-- <span class="pill">自动识别 APK / IPA</span> -->

<div class="section">
  <small class="note">
    <h4>温馨提示：</h4>
    • <mark>不消耗流量</mark>，文件在本地处理。<br>
    • 推荐使用 Chrome / Edge 浏览器。<br>
    • 支持 Android / Win ，暂不支持 iOS 。<br>
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
  <h2>2. 选择模组文件<span class="pill">支持 BM框架 / BM模组 / 三方模组</span></h2>
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




<!-- </body> -->
<!-- </html> -->