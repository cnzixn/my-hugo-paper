---
title: 'B.M.安装器'
layout: 'aapp'
searchHidden: true
appHidden: true
weight: 250001
summary: '支持安装BM框架/BM模组/BM补丁/自制模组。'
---

<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC","Hiragino Sans GB","Microsoft YaHei", sans-serif;  
    line-height: 1.6; 
    color: var(--content);
  }
  h1 { 
    text-align: center; 
    margin-bottom: 16px; 
    color: var(--primary);
  }
  .note { color: var(--secondary); }
  .section { 
    margin: 20px 0 28px; 
    padding: 20px; 
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--entry);
  }
  .drop-zone { 
    border: 2px dashed var(--tertiary);
    padding: 20px; 
    text-align: center; 
    margin: 10px 0; 
    cursor: pointer; 
    border-radius: var(--radius); 
    transition: .2s; 
  }
  .drop-zone.drag-over { border-color: var(--secondary); }
  .section button { 
    border-radius: 10px; 
    padding: 10px; 
    margin: 10px auto; 
    cursor: pointer; 
    display: block; 
    width: 220px; 
    background-color: var(--secondary);
    color: var(--theme);
    border: 0; 
    font-size: 16px; 
    transition: .2s;
    /* 修复手机焦点不消失 */
    outline: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  .section button:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 2px 8px var(--secondary);
    opacity: 0.9;
  }
  /* 强制移除点击后的焦点框 */
  button:focus, button:active, button:hover {
    outline: none !important;
    box-shadow: none !important;
    border-color: transparent !important;
  }
  .file-info, .file-list { 
    margin: 10px 0; 
    padding: 10px; 
    border: 1px solid var(--border); 
    border-radius: var(--radius); 
    background: var(--theme);
  }
  .file-info, .file-list { white-space: nowrap; overflow-x: auto; }
  .file-item { 
    padding: 6px 4px; 
    border-bottom: 1px solid var(--border);
  }
  .file-item:last-child { border-bottom: none; }
  .progress-container { margin: 12px 0; display: none; }
  .progress-bar { 
    height: 6px; 
    border: 1px solid var(--secondary);
    border-radius: 6px; 
    overflow: hidden; 
  }
  .progress-fill { 
    height: 100%; 
    width: 0%; 
    transition: width 0.3s; 
    background-color: #4cd964;
  }
  .error { 
    color: #d00;
    margin: 10px 0; 
    display: none; 
  }
  small strong { color: var(--primary); }
  .pill { 
    display:inline-block; 
    padding:2px 8px; 
    border-radius:999px; 
    border:1px solid var(--border); 
    margin-left:8px; 
    font-size:12px; 
    color: var(--secondary);
  }
  .muted { color: var(--secondary); }

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
    display: none;
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
  .alert-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 9998;
    display: none;
  }
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

<h1>B.M.安装器</h1>

<div id="loadingTip" style="text-align: center; padding: 30px; font-size: 16px; color: #666;">
  正在初始化工具，请稍候...
</div>

<div class="modal-mask" id="tipModal" style="display: none;">
  <div class="modal-content">
  <small class="note">
    温馨提示：<br>
    - 本地处理文件<mark>不消耗流量</mark>。<br>
    - 建议用 <a href="https://www.microsoft.com/edge/download?form=MA13FJ" target="_blank" style="color: #007bff; text-decoration: none;">Edge</a>、<a href="https://www.quark.cn/" target="_blank" style="color: #007bff; text-decoration: none;">夸克</a> 浏览器。<br>
    - <span style="color: #e74c3c; font-weight: 600;">不支持 iPad 和 iPhone 设备</span>。<br>
    - 仅支持框架<mark>B.M.260201+</mark>版本。<br>
    - 此工具仅可安装少量模组测试。
  </small>

  <div class="modal-buttons">
      <button class="modal-btn no-prompt-btn" onclick="noMorePrompt()">我知道了</button>
  </div>
  </div>
</div>

<!-- 登录框默认隐藏：display: none -->
<div class="section" id="loginSection" style="display: none; max-width: 400px; margin: 0 auto;">
  <h3 style="text-align: center; color: var(--primary); margin-bottom: 30px;">B.M.验证</h3>
  <div class="form-group">
    <!-- <label for="loginUid" style="display: block; margin: 8px 0; color: var(--content); font-weight: bold;">QQ 号</label> -->
    <input type="text" id="loginUid" name="loginUid" placeholder="请输入 QQ 号（用于接收验证码邮件）" required style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 16px; height: 44px; box-sizing: border-box;">
  </div>
  <div class="form-group">
    <!-- <label for="loginCode" style="display: block; margin: 8px 0; color: var(--content); font-weight: bold;">验证码</label> -->
    <div style="display: flex; gap: 10px; align-items: center;">
      <input type="text" id="loginCode" name="loginCode" placeholder="请输入 6 位验证码" required style="flex: 6; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius); font-size: 16px; height: 44px; box-sizing: border-box; min-width: 0;">
      <button type="button" id="sendCodeBtn" style="flex: 4; padding: 0 20px; background-color: var(--secondary); color: var(--theme); border: none; border-radius: var(--radius); cursor: pointer; font-size: 14px; white-space: nowrap; height: 44px; display: flex; align-items: center; justify-content: center; outline: none !important;">发送验证码</button>
    </div>
  </div>
  <div style="margin-bottom: 20px; position: relative; height: 48px;">
    <button type="button" id="loginBtn" style="position: absolute; left:0; top:0; width:100%; height:48px; padding: 12px; background-color: var(--secondary); color: var(--theme); border: none; border-radius: var(--radius); cursor: pointer; font-size: 16px; font-weight: bold; box-sizing: border-box; z-index:1; outline: none !important; -webkit-tap-highlight-color: transparent !important;">登录</button>
    <div id="loginError" class="error" style="position: absolute; left:0; top:0; width:100%; height:48px; padding: 12px; border-radius: var(--radius); font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: center; box-sizing: border-box; background-color: #fff2f0; color: #ff4d4f; border: 1px solid #ffccc7; z-index:2; display: none;"></div>
  </div>
</div>

<div class="section" id="section1" style="display: none;">
  <h2>1. 选择安装包<span class="pill">自动识别 APK / IPA</span></h2>
  <div id="pkgDropZone" class="drop-zone">
    <p>拖放 apk/ipa 文件到这里 或</p>
    <button id="pkgBrowseBtn">选择安装包</button>
    <input type="file" id="pkgFileInput" style="display:none;">
  </div>
  <div id="pkgFileInfo" class="file-info" style="display:none;"></div>
  <div id="pkgError" class="error"></div>
</div>

<div class="section" id="section2" style="display: none;">
  <h2>2. 选择模组文件<span class="pill">支持 BM框架/BM模组/BM补丁/自制模组 </span></h2>
  <div id="modsDropZone" class="drop-zone">
    <p>拖放 zip/xz/xor 文件到这里 或</p>
    <button id="modsBrowseBtn">选择模组文件</button>
    <input type="file" id="modsFileInput" multiple style="display:none;">
  </div>
  <div id="modsFileList" class="file-list" style="display:none;"></div>
  <div id="modsError" class="error"></div>
</div>

<div class="section" id="section3" style="display: none;">
  <h2>3. 安装模组</h2>
  <div class="muted" id="platformHint">当前平台：未选择</div>
  <button id="installBtn" disabled>开始安装</button>
  <div id="installProgress" class="progress-container">
    <div class="progress-bar"><div id="installProgressFill" class="progress-fill"></div></div>
    <p id="installProgressText">准备就绪</p>
  </div>
  <div id="installError" class="error"></div>
  
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

<script>
const modal = document.getElementById('tipModal');
const loadingTip = document.getElementById('loadingTip');
const sections = [
  document.getElementById('section1'),
  document.getElementById('section2'),
  document.getElementById('section3')
];

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function checkPromptCookie() {
    const cookies = document.cookie.split(';');
    let hasHideCookie = false;
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'no_show_tip_app_imod_251224' && value === 'true') {
            hasHideCookie = true;
            break;
        }
    }
    if (hasHideCookie) {
        modal.style.display = 'none';
        showMainContent();
    } else {
        modal.style.display = 'flex';
        showMainContent();
    }
}

function closeModal() {
    modal.style.display = 'none';
}

function noMorePrompt() {
    const date = new Date();
    date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
    document.cookie = `no_show_tip_app_imod_251224=true; expires=${date.toUTCString()}; path=/`;
    closeModal();
}

window.onload = function() {
    setTimeout(() => {
        if (loadingTip) {
            loadingTip.style.display = 'none';
        }
        
        if (isIOSDevice()) {
            if (loadingTip) {
                loadingTip.innerHTML = '<span style="color: #ff4444; font-weight: bold; font-size: 16px;"> 暂不支持 iPad/iPhone 设备！<br> 请使用电脑或安卓设备访问。</span>';
                loadingTip.style.display = 'block';
            }
            return;
        }
        
        if (modal) {
            modal.style.display = 'none';
        }
    }, 0); 
}; 
</script>
