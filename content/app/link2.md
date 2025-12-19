---
title: '橱窗-工具'
layout: 'aapp'
draft: false
searchHidden: true
appHidden: true
weight: 250003
summary: '生成橱窗页面所需的加密链接'
---

<style>
  body { 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC","Hiragino Sans GB","Microsoft YaHei", sans-serif;  
    line-height: 1.6; 
    color: var(--content); /* 复用B.M.解密器文本主色 */
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
  }
  h1 { 
    text-align: center; 
    margin-bottom: 2rem; 
    color: var(--primary); /* 复用标题主色 */
  }
  .container {
    background: var(--entry); /* 复用卡片背景色 */
    padding: 2rem;
    border-radius: var(--radius); /* 复用全局圆角 */
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
    border: 1px solid var(--border); /* 复用统一边框色 */
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--content); /* 复用文本色 */
  }
  #targetUrl {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid var(--border); /* 复用边框色 */
    border-radius: var(--radius); /* 复用圆角 */
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s;
    background: var(--theme); /* 复用主题色背景 */
    color: var(--content); /* 复用文本色 */
  }
  #targetUrl:focus {
    outline: none;
    border-color: var(--secondary); /* 聚焦时用次要色 */
    box-shadow: 0 0 0 3px rgba(0,0,0,0.05);
  }
  .btn { 
    border-radius: 10px; 
    padding: 10px; 
    margin: 10px auto; 
    cursor: pointer; 
    display: block; 
    width: 220px; 
    background-color: var(--secondary); /* 复用按钮次要色 */
    color: var(--theme); /* 复用按钮文字主题色 */
    border: 0; 
    font-size: 16px; 
    transition: .2s; /* 复用过渡效果 */
  }
  .btn:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 2px 8px var(--secondary); /* 复用按钮阴影 */
    opacity: 0.9; /* 复用hover透明度 */
  }
  .result {
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--theme); /* 复用主题色背景 */
    border-radius: var(--radius); /* 复用圆角 */
    border: 1px solid var(--border); /* 复用边框色 */
    display: none;
  }
  .result-title {
    font-size: 0.9rem;
    color: var(--secondary); /* 复用次要文本色 */
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  #resultUrl {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid var(--border); /* 复用边框色 */
    border-radius: var(--radius); /* 复用圆角 */
    font-size: 0.95rem;
    word-break: break-all;
    background: var(--entry); /* 复用卡片背景色 */
    color: var(--content); /* 复用文本色 */
    box-sizing: border-box;
    min-height: 80px;
    resize: none;
  }
  .copy-btn { 
    border-radius: 10px; 
    padding: 8px; 
    margin: 10px auto; 
    cursor: pointer; 
    background-color: var(--secondary); /* 复用按钮次要色 */
    color: var(--theme); /* 复用按钮文字主题色 */
    border: 0; 
    font-size: 14px; 
    transition: .2s; /* 复用过渡效果 */
  }
  .copy-btn:hover { 
    transform: translateY(-1px); 
    box-shadow: 0 2px 8px var(--secondary); /* 复用按钮阴影 */
    opacity: 0.9; /* 复用hover透明度 */
  }
  .hint {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: var(--secondary); /* 复用次要文本色 */
    text-align: center;
  }
  .error { 
    color: #d00; /* 复用错误红 */
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: none;
  }
  .pill { 
    display:inline-block; 
    padding:2px 8px; 
    border-radius:999px; 
    border:1px solid var(--border); 
    margin-left:8px; 
    font-size:12px; 
    color: var(--secondary); /* 复用标签次要色 */
  }
</style>

<h1>橱窗链接生成</h1>

<div class="container">
  <div class="form-group">
    <label for="targetUrl">网址（需包含 http/https）</label>
    <input type="url" id="targetUrl" placeholder="例如：https://example.com/page?param=123" required>
    <div class="error" id="urlError">请输入有效的网址（必须以 http:// 或 https:// 开头）</div>
  </div>

  <button class="btn" id="generateBtn">生成加密链接</button>

  <div class="result" id="resultContainer">
    <div class="result-title">生成的橱窗链接（可直接访问）：</div>
    <textarea id="resultUrl" readonly></textarea>
    <button class="btn copy-btn" id="copyBtn">复制链接</button>
  </div>

</div>

<script>
// 1. Base64 加密（适配 URL 安全编码，与橱窗页面解密逻辑一致）
function base64Encode(str) {
  return btoa(encodeURIComponent(str)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// 2. 生成目标链接
function generateLink(targetUrl) {
  const encodedData = base64Encode(targetUrl);
  return window.location.origin + '/link/?data=' + encodedData;
}

// 3. 页面交互逻辑
document.addEventListener('DOMContentLoaded', () => {
  const targetUrlInput = document.getElementById('targetUrl');
  const generateBtn = document.getElementById('generateBtn');
  const resultContainer = document.getElementById('resultContainer');
  const resultUrl = document.getElementById('resultUrl');
  const copyBtn = document.getElementById('copyBtn');
  const urlError = document.getElementById('urlError');

  // 生成按钮点击事件
  generateBtn.addEventListener('click', () => {
    const url = targetUrlInput.value.trim();
    
    // 验证网址有效性
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlError.style.display = 'block';
      resultContainer.style.display = 'none';
      return;
    }
    urlError.style.display = 'none';

    // 生成并显示链接
    const finalUrl = generateLink(url);
    resultUrl.value = finalUrl;
    resultContainer.style.display = 'block';
  });

  // 复制按钮点击事件
  copyBtn.addEventListener('click', () => {
    resultUrl.select();
    document.execCommand('copy');
    copyBtn.textContent = '复制成功！';
    setTimeout(() => {
      copyBtn.textContent = '复制链接';
    }, 2000);
  });

  // 输入框变化时隐藏错误提示
  targetUrlInput.addEventListener('input', () => {
    urlError.style.display = 'none';
  });
});
</script>
