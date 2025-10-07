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
    • 模组<span style="color:red !important;" class="">免费下载和使用</span>，谨防上当受骗!!!<br>
    • 本站不提供付费服务，被骗别找站长!!!
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

<script>
// 从URL参数中提取data（用户码）
function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('data') || null;
}

// 获取当前日期并格式化为“251007”样式（年取后两位+月+日）
function getFormattedDate() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + month + day;
}

// 生成bmuser.lua文件并打包成压缩包（文件名格式：BM251007(UID).ZIP）
async function generateZipPackage(userId) {
  try {
    const zip = new JSZip();
    zip.file("ADD_TO_OBB/mods/bmuser.lua", `-- 用户码文件 - 自动生成\n\n  return "${userId}"`);
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
    const formattedDate = getFormattedDate();
    const zipFileName = `BM${formattedDate}(UID).ZIP`;
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('生成压缩包失败：', error);
    return false;
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  const dataContainer = document.getElementById('data-container');
  const generateBtn = document.getElementById('generate-btn');
  const successNotice = document.getElementById('success-notice');
  const errorMsg = document.getElementById('error-msg');
  
  // 1. 提取并显示用户码
  const userId = getUserIdFromUrl();
  if (userId) {
    dataContainer.textContent = `已获取用户码：${userId}`;
  } else {
    dataContainer.textContent = '错误：未从URL中获取到用户码';
    // 用class切换禁用样式，移除行内样式
    generateBtn.disabled = true;
    generateBtn.classList.remove('btn-default');
    generateBtn.classList.add('btn-disabled');
  }

  // 2. 生成按钮点击事件
  generateBtn.addEventListener('click', async () => {
    if (!userId) return;
    
    // 切换为加载中样式
    generateBtn.disabled = true;
    generateBtn.classList.remove('btn-default');
    generateBtn.classList.add('btn-loading');
    generateBtn.textContent = '正在生成...';
    errorMsg.style.display = 'none';

    // 生成压缩包
    const isSuccess = await generateZipPackage(userId);
    if (isSuccess) {
      successNotice.style.display = 'block';
      setTimeout(() => successNotice.style.display = 'none', 3000);
    } else {
      errorMsg.textContent = '压缩包生成失败，请刷新页面重试';
      errorMsg.style.display = 'block';
    }

    // 恢复默认样式
    generateBtn.classList.remove('btn-loading');
    generateBtn.classList.add('btn-default');
    generateBtn.textContent = '生成压缩包';
    generateBtn.disabled = false;
  });
});
</script>

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
