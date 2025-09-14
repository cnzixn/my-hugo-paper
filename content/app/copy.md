---
title: '网页剪贴板'
layout: 'page'
searchHidden: true
hideTitlt: true
---

  <style>
      /* 您提供的CSS样式 */
      h1 {
          text-align: center;
          margin-bottom: 30px;
      }
      .reminder{
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
      .section button {
          border-radius: 8px;
          padding: 10px;
          margin: 10px auto;
          cursor: pointer;
          display: block;
          width: 200px;
          background-color: #4CAF50;
          color: white;
          border: none;
          font-weight: bold;
      }
      .section button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px #666;
      }
      /* 测试按钮样式区分 */
      .section button.test-btn {
          background-color: #2196F3;
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

      /* 新增样式 */
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


<div class="section reminder">
    <p><strong>使用方法：</strong> 访问本页面带有"data=xxxxx"，则会将"xxxxx"显示在下面的内容框，方便复制。</p>
</div>


<!-- 显示从URL获取的数据 -->
<div class="file-info" id="data-container">
    正在从URL加载数据...
</div>

<div class="section">
 
  <!-- 测试按钮 -->
  <button class="test-btn" id="test-btn">测试一下</button>

  <!-- 复制按钮 -->
  <button id="copy-btn">复制内容</button>
  
  <!-- 复制成功提示 -->
  <div class="copied-notice" id="copied-notice">
      已复制到剪贴板！
  </div>
  
  <!-- 错误提示区域 -->
  <div class="error" id="error-msg"></div>
</div>

<script defer src="/js/app-copy.js"></script>

<!-- 测试按钮脚本 -->
<script>
document.getElementById('test-btn').addEventListener('click', function() {
    // 替换为你的指定网址（例如带测试数据的链接）
    const testUrl = '/app/copy?data=这是测试数据，用于验证功能';
    // 跳转到指定网址
    window.location.href = testUrl;
});
</script>

