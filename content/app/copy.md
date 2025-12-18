---
title: 'B.M.剪贴板'
layout: 'aapp'
searchHidden: true
appHidden: true # 自定义实现，App列表隐藏
weight: 250009
summary: '通过访问链接将[数据]导出，方便复制使用。'
---


<h1>B.M.剪贴板</h1>

<!-- <div class="reminder"> -->
  <!-- <small class="note"> -->
  <!-- 温馨提示：<br> - 模组<span style="color:red !important;" class="">免费</span>下载和使用，谨防上当受骗!!! -->
  <!-- </small> -->
<!-- </div> -->



<!-- 显示从URL获取的数据 -->
<div class="file-info" id="app-copy-data-container">
    正在从URL加载数据...
</div>

<div class="section">
 
  <!-- 测试按钮 -->
  <button class="test-btn" id="app-copy-test-btn">测试一下</button>

  <!-- 复制按钮 -->
  <button id="app-copy-copy-btn">复制内容</button>
  
  <!-- 复制成功提示 -->
  <div class="copied-notice" id="app-copy-copied-notice">
      已复制到剪贴板！
  </div>
  
  <!-- 错误提示区域 -->
  <div class="error" id="app-copy-error-msg"></div>
</div>

<!-- <script defer src="/js/app-copy.js"></script> -->
{{< js "app-cdk.js" >}}


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
      /* 为id选择器添加前缀：app-copy- */
      #app-copy-data-container {
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
      /* 为id选择器添加前缀：app-copy- */
      #app-copy-error-msg {
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
      /* 为id选择器添加前缀：app-copy- */
      #app-copy-copied-notice {
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
