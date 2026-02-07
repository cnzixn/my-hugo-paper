---
title: '口令读取测试'
layout: 'aapp'
searchHidden: true
appHidden: true
weight: 250010
summary: '读取剪贴板、自动清理特殊符号、提取领奖口令'
---

<h1>口令读取测试</h1>

<div class="section">
  <button id="paste-btn">从剪贴板粘贴读取</button>

  <div class="file-info" id="raw-text">
    原始内容：
  </div>

  <div class="file-info" id="clean-text">
    清理后（可被网站识别）：
  </div>

  <div class="file-info" id="code-result">
    识别到的口令：
  </div>

  <div class="error" id="error-msg" style="display:none; color:red;"></div>
</div>

<style>
  h1 {
    text-align: center;
    margin-bottom: 30px;
  }
  .section button {
    border-radius: 8px;
    padding: 10px;
    margin: 10px auto;
    cursor: pointer;
    display: block;
    width: 220px;
    background-color: #2196F3;
    color: white;
    border: none;
    font-weight: bold;
  }
  .section button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px #666;
  }
  .file-info {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: monospace;
  }
  #error-msg {
    text-align: center;
    margin-top: 10px;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function () {
  const pasteBtn = document.getElementById('paste-btn')
  const rawText = document.getElementById('raw-text')
  const cleanText = document.getElementById('clean-text')
  const codeResult = document.getElementById('code-result')
  const errorMsg = document.getElementById('error-msg')

  pasteBtn.addEventListener('click', async () => {
    try {
      hideError()

      // 1. 读取剪贴板
      const text = await navigator.clipboard.readText()
      rawText.textContent = '原始内容：\n' + text

      // 2. 清理变音符号（你用来躲关键词的那些）
      const cleaned = text.replace(/[\u0300-\u036F\u0483-\u0489]/g, '').trim()
      cleanText.textContent = '清理后（可被网站识别）：\n' + cleaned

      // 3. 自动提取口令（匹配 CZxxxx 或 wW:/xxxx 格式）
      const codeMatch = cleaned.match(/[A-Za-z0-9]+:[\/A-Za-z0-9]+|CZ\d+/i)
      if (codeMatch) {
        codeResult.textContent = '识别到的口令：\n' + codeMatch[0]
      } else {
        codeResult.textContent = '识别到的口令：\n未匹配到口令'
      }

    } catch (e) {
      showError('读取剪贴板失败：需要 HTTPS + 用户手动点击授权')
      console.error(e)
    }
  })

  function showError(msg) {
    errorMsg.textContent = msg
    errorMsg.style.display = 'block'
  }
  function hideError() {
    errorMsg.style.display = 'none'
  }
})
</script>
