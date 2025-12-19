---
title: "橱窗"
layout: 'aapp'
searchHidden: true
appHidden: true
url: "/link"
---


<div id="embed-container" style="
  width: 100%;
  max-width: 1200px;
  height: 80vh;
  margin: 2rem auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
">
  <!-- 加载中/错误提示 -->
  <div id="loading" style="text-align: center; color: #666;">
    <p>正在解析链接...</p>
  </div>
  <div id="error" style="text-align: center; color: #dc2626; display: none;">
    <p>链接解析失败，请检查参数是否正确</p>
  </div>
  <!-- iframe 内嵌容器（默认隐藏） -->
  <iframe id="web-embed" width="100%" height="100%" frameborder="0" sandbox="allow-same-origin allow-scripts allow-popups" style="display: none;"></iframe>
</div>

<!-- Base64 解密+参数解析脚本 -->
<script>
// 1. 获取 URL 中的 data 参数
function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  return r ? decodeURIComponent(r[2]) : null;
}

// 2. Base64 解密（处理 URL 安全编码）
function base64Decode(str) {
  try {
    // 替换 URL 安全字符（+→-, /→_, =→空）
    str = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\s+/g, '');
    // 补全 Base64 编码长度
    while (str.length % 4) str += '=';
    return decodeURIComponent(atob(str));
  } catch (e) {
    return null;
  }
}

// 3. 执行解析并嵌入网页
document.addEventListener('DOMContentLoaded', () => {
  const dataParam = getUrlParam('data');
  const embedIframe = document.getElementById('web-embed');
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');

  if (!dataParam) {
    loading.style.display = 'none';
    error.innerHTML = '<p>链接解析失败，缺少 data 参数</p>';
    error.style.display = 'block';
    return;
  }

  const targetUrl = base64Decode(dataParam);
  if (!targetUrl || !targetUrl.startsWith('http')) {
    loading.style.display = 'none';
    error.innerHTML = '<p>链接解析失败，请确保是有效的网址</p>';
    error.style.display = 'block';
    return;
  }

  // 嵌入网页并显示
  embedIframe.src = targetUrl;
  embedIframe.style.display = 'block';
  loading.style.display = 'none';

  // 监听 iframe 加载错误（如对方禁止内嵌）
  embedIframe.onerror = () => {
    embedIframe.style.display = 'none';
    error.innerHTML = `<p>该网站禁止内嵌，<a href="${targetUrl}" target="_blank" style="color: #0071e3;">点击直接访问</a></p>`;
    error.style.display = 'block';
  };
});
</script>
